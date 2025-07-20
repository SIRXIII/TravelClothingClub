const fetch = require('node-fetch');
import formidable from 'formidable';
import { Readable } from 'stream';
import fs from 'fs';

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

exports.handler = async (event) => {
  console.log('=== FASHN DEBUG START ===');
  console.log('HTTP Method:', event.httpMethod);
  console.log('Headers:', JSON.stringify(event.headers, null, 2));
  console.log('Has API Key:', !!process.env.FASHN_API_KEY);
  
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    console.log('Handling CORS preflight');
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
      }
    };
  }

  if (event.httpMethod !== 'POST') {
    console.log('Invalid method:', event.httpMethod);
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const API_KEY = process.env.FASHN_API_KEY;
    if (!API_KEY) {
      console.log('ERROR: FASHN_API_KEY not set');
      throw new Error('FASHN_API_KEY environment variable is not set');
    }
    console.log('API Key found, length:', API_KEY.length);

    // Parse multipart form data
    console.log('Parsing form data...');
    const { fields, files } = await parseMultipartForm(event);
    console.log('Fields:', Object.keys(fields));
    console.log('Files:', Object.keys(files));
    
    const gender = Array.isArray(fields.gender) ? fields.gender[0] : fields.gender;
    const clothingImage = Array.isArray(files.clothing_image) ? files.clothing_image[0] : files.clothing_image;
    const modelImage = Array.isArray(files.model_image) ? files.model_image[0] : files.model_image;
    
    console.log('Gender:', gender);
    console.log('Has clothing image:', !!clothingImage);
    console.log('Has model image:', !!modelImage);
    
    if (!clothingImage) {
      console.log('ERROR: No clothing image provided');
      throw new Error('No clothing image provided');
    }

    // Read the uploaded file and convert to base64
    console.log('Reading clothing image file...');
    const imageBuffer = fs.readFileSync(clothingImage.filepath);
    const base64Image = imageBuffer.toString('base64');
    console.log('Clothing image size:', imageBuffer.length, 'bytes');

    let model_image_url;
    if (modelImage) {
      console.log('Reading model image file...');
      const modelBuffer = fs.readFileSync(modelImage.filepath);
      const modelBase64 = modelBuffer.toString('base64');
      model_image_url = `data:image/jpeg;base64,${modelBase64}`;
      console.log('Model image size:', modelBuffer.length, 'bytes');
    } else if (gender) {
      model_image_url = gender === 'Male' 
        ? 'https://v3.fal.media/files/panda/jRavCEb1D4OpZBjZKxaH7_image_2024-12-08_18-37-27%20Large.jpeg'
        : 'https://v3.fal.media/files/panda/jRavCEb1D4OpZBjZKxaH7_image_2024-12-08_18-37-27%20Large.jpeg';
      console.log('Using default model for gender:', gender);
    } else {
      console.log('ERROR: Neither model_image nor gender provided');
      throw new Error('Either model_image or gender must be provided');
    }

    // First verify the API key by checking credits
    console.log('Checking API credits...');
    const creditsResponse = await fetch('https://api.fashn.ai/v1/credits', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    console.log('Credits response status:', creditsResponse.status);
    if (!creditsResponse.ok) {
      const errorText = await creditsResponse.text();
      console.error('Credits check failed:', errorText);
      throw new Error('Invalid API key or API key has expired');
    }

    const credits = await creditsResponse.json();
    console.log('Available credits:', credits);

    if (credits.credits && credits.credits.total <= 0) {
      console.log('ERROR: No credits available');
      throw new Error('No credits available');
    }

    // Submit the prediction job
    console.log('Submitting prediction job...');
    const requestBody = {
      model_name: 'tryon-v1.6',
      inputs: {
        model_image: model_image_url,
        garment_image: `data:image/jpeg;base64,${base64Image}`
      }
    };
    console.log('Request body structure:', {
      model_name: requestBody.model_name,
      inputs: {
        model_image: typeof requestBody.inputs.model_image,
        garment_image: `base64 string (${base64Image.length} chars)`
      }
    });

    const runResponse = await fetch('https://api.fashn.ai/v1/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Run response status:', runResponse.status);
    if (!runResponse.ok) {
      const errorText = await runResponse.text();
      console.error('Fashn.ai run API error:', runResponse.status, errorText);
      throw new Error(`Failed to start prediction: ${runResponse.status} - ${errorText}`);
    }

    const runData = await runResponse.json();
    console.log('Run response data:', runData);
    const predictionId = runData.id;

    if (!predictionId) {
      console.log('ERROR: No prediction ID returned');
      throw new Error('No prediction ID returned');
    }

    console.log('Prediction ID:', predictionId);
    console.log('Starting polling...');

    // Poll for the result
    let attempts = 0;
    const maxAttempts = 30; // 90 seconds max wait time
    
    while (attempts < maxAttempts) {
      console.log(`Polling attempt ${attempts + 1}/${maxAttempts}`);
      
      const statusResponse = await fetch(`https://api.fashn.ai/v1/status/${predictionId}`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });

      console.log('Status response status:', statusResponse.status);
      if (!statusResponse.ok) {
        const errorText = await statusResponse.text();
        console.error('Status check failed:', statusResponse.status, errorText);
        throw new Error(`Status check failed: ${statusResponse.status} - ${errorText}`);
      }

      const statusData = await statusResponse.json();
      console.log('Status data:', statusData);

      if (statusData.status === 'completed') {
        console.log('SUCCESS: Prediction completed');
        // Clean up temporary files
        try {
          fs.unlinkSync(clothingImage.filepath);
          if (modelImage) fs.unlinkSync(modelImage.filepath);
          console.log('Temporary files cleaned up');
        } catch (cleanupError) {
          console.warn('Failed to clean up temporary file:', cleanupError);
        }

        const result = {
          tryon_image_url: statusData.output[0]
        };
        console.log('Final result:', result);
        console.log('=== FASHN DEBUG END (SUCCESS) ===');

        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify(result)
        };
      }

      if (statusData.status === 'failed') {
        console.log('ERROR: Prediction failed');
        // Clean up temporary files
        try {
          fs.unlinkSync(clothingImage.filepath);
          if (modelImage) fs.unlinkSync(modelImage.filepath);
        } catch (cleanupError) {
          console.warn('Failed to clean up temporary file:', cleanupError);
        }
        throw new Error(statusData.error || 'Prediction failed');
      }

      if (['starting', 'in_queue', 'processing'].includes(statusData.status)) {
        console.log(`Status: ${statusData.status}, waiting 3 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        attempts++;
        continue;
      }

      console.log('ERROR: Unknown status:', statusData.status);
      throw new Error(`Unknown status: ${statusData.status}`);
    }

    // Clean up temporary files on timeout
    try {
      fs.unlinkSync(clothingImage.filepath);
      if (modelImage) fs.unlinkSync(modelImage.filepath);
    } catch (cleanupError) {
      console.warn('Failed to clean up temporary file:', cleanupError);
    }

    console.log('ERROR: Prediction timed out');
    throw new Error('Prediction timed out after 90 seconds');

  } catch (error) {
    console.error('=== FASHN DEBUG ERROR ===');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    console.log('=== FASHN DEBUG END (ERROR) ===');
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Failed to generate AI try-on',
        details: error.message,
        debug: true
      })
    };
  }
};