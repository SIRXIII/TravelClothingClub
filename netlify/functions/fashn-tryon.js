import formidable from 'formidable';
import { Readable } from 'stream';
import fs from 'fs';
import { lazy } from 'react';
const PartnerOnboardingLazy = lazy(() => import('@/features/partnerOnboarding'));

// Helper function to parse multipart form data in Netlify functions
const parseMultipartForm = (event) => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    
    // Create a readable stream from the event body
    const stream = new Readable();
    stream.push(Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8'));
    stream.push(null);
    
    // Set the content type header for formidable
    stream.headers = {
      'content-type': event.headers['content-type'] || event.headers['Content-Type']
    };
    
    form.parse(stream, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
};

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json'
      }
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  let clothingImage;
  try {
    const API_KEY = process.env.FASHN_API_KEY;
    if (!API_KEY) {
      throw new Error('FASHN_API_KEY environment variable is not set');
    }

    // Parse multipart form data
    const { fields, files } = await parseMultipartForm(event);
    
    const gender = Array.isArray(fields.gender) ? fields.gender[0] : fields.gender;
    clothingImage = Array.isArray(files.clothing_image) ? files.clothing_image[0] : files.clothing_image;
    
    if (!clothingImage) {
      throw new Error('No clothing image provided');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(clothingImage.mimetype)) {
      throw new Error('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (clothingImage.size > maxSize) {
      throw new Error('File size too large. Please upload an image smaller than 10MB.');
    }

    // Read the uploaded file and convert to base64
    const imageBuffer = fs.readFileSync(clothingImage.filepath);
    const base64Image = imageBuffer.toString('base64');

    // First verify the API key by checking credits
    const creditsResponse = await fetch('https://api.fashn.ai/v1/credits', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    if (!creditsResponse.ok) {
      console.error('Failed to verify API key:', await creditsResponse.text());
      throw new Error('Invalid API key or API key has expired');
    }

    const credits = await creditsResponse.json();
    console.log('Available credits:', credits);

    if (credits.credits.total <= 0) {
      throw new Error('No credits available');
    }

    // Submit the prediction job
    const runResponse = await fetch('https://api.fashn.ai/v1/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model_name: 'tryon-v1.6',
        inputs: {
          model_image: gender === 'Male' 
            ? (process.env.MALE_MODEL_URL || 'https://v3.fal.media/files/panda/jRavCEb1D4OpZBjZKxaH7_image_2024-12-08_18-37-27%20Large.jpeg')
            : (process.env.FEMALE_MODEL_URL || 'https://v3.fal.media/files/panda/jRavCEb1D4OpZBjZKxaH7_image_2024-12-08_18-37-27%20Large.jpeg'),
          garment_image: `data:image/jpeg;base64,${base64Image}`
        }
      })
    });

    if (!runResponse.ok) {
      const errorText = await runResponse.text();
      console.error('Fashn.ai run API error:', runResponse.status, errorText);
      throw new Error(`Failed to start prediction: ${runResponse.status}`);
    }

    const runData = await runResponse.json();
    const predictionId = runData.id;

    if (!predictionId) {
      throw new Error('No prediction ID returned from Fashn.ai API');
    }

    console.log('Prediction started with ID:', predictionId);

    // Poll for the result
    let attempts = 0;
    const maxAttempts = 30; // 90 seconds max wait time
    
    while (attempts < maxAttempts) {
      const statusResponse = await fetch(`https://api.fashn.ai/v1/status/${predictionId}`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });

      if (!statusResponse.ok) {
        throw new Error(`Status check failed: ${statusResponse.status}`);
      }

      const statusData = await statusResponse.json();
      console.log('Status:', statusData.status);

      if (statusData.status === 'completed') {
        // Clean up temporary file
        try {
          fs.unlinkSync(clothingImage.filepath);
        } catch (cleanupError) {
          console.warn('Failed to clean up temporary file:', cleanupError);
        }

        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            tryon_image_url: statusData.output[0],
            output: statusData.output[0] // For backward compatibility
          })
        };
      }

      if (statusData.status === 'failed') {
        // Clean up temporary file
        try {
          fs.unlinkSync(clothingImage.filepath);
        } catch (cleanupError) {
          console.warn('Failed to clean up temporary file:', cleanupError);
        }
        throw new Error(statusData.error || 'Prediction failed');
      }

      if (['starting', 'in_queue', 'processing'].includes(statusData.status)) {
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
        attempts++;
        continue;
      }

      throw new Error(`Unknown status: ${statusData.status}`);
    }

    // Clean up temporary file on timeout
    try {
      fs.unlinkSync(clothingImage.filepath);
    } catch (cleanupError) {
      console.warn('Failed to clean up temporary file:', cleanupError);
    }

    throw new Error('Prediction timed out after 90 seconds');

  } catch (error) {
    console.error('Error:', error);
    
    // Clean up temporary file if it exists
    if (clothingImage && clothingImage.filepath) {
      try {
        fs.unlinkSync(clothingImage.filepath);
      } catch (cleanupError) {
        console.warn('Failed to clean up temporary file:', cleanupError);
      }
    }
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Failed to generate AI try-on',
        details: error.message
      })
    };
  }
}; 