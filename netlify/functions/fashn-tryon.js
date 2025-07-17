const fetch = require('node-fetch');
const formidable = require('formidable');
const fs = require('fs');

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const API_KEY = process.env.FASHN_API_KEY;
    if (!API_KEY) {
      throw new Error('FASHN_API_KEY environment variable is not set');
    }

    const BASE_URL = "https://api.fashn.ai/v1";

    // Parse multipart form data using formidable
    const parseForm = () => {
      return new Promise((resolve, reject) => {
        const form = formidable({
          maxFileSize: 10 * 1024 * 1024, // 10MB limit
          keepExtensions: true,
        });

        // Convert event body to buffer for formidable
        let buffer;
        if (event.isBase64Encoded) {
          buffer = Buffer.from(event.body, 'base64');
        } else {
          buffer = Buffer.from(event.body);
        }

        // Create a mock request object for formidable
        const mockReq = {
          headers: event.headers,
          method: 'POST',
          url: '/',
          body: buffer,
        };

        // Parse the form data
        form.parse(mockReq, (err, fields, files) => {
          if (err) {
            reject(err);
            return;
          }
          resolve({ fields, files });
        });

        // Simulate data events for formidable
        process.nextTick(() => {
          mockReq.emit = mockReq.emit || (() => {});
          if (buffer) {
            form._writeRaw(buffer);
            form._parser.end();
          }
        });
      });
    };

    const { fields, files } = await parseForm();

    // Extract gender and clothing image
    const gender = fields.gender?.[0] || fields.gender || 'Female';
    const clothingFile = files.clothing_image?.[0] || files.clothing_image;

    if (!clothingFile) {
      throw new Error('No clothing image provided');
    }

    // Read the uploaded file
    const clothingImageBuffer = fs.readFileSync(clothingFile.filepath);
    const clothingImageBase64 = clothingImageBuffer.toString('base64');

    // Select model image based on gender
    const modelImageUrl = gender.toLowerCase() === 'male' 
      ? 'https://v3.fal.media/files/panda/jRavCEb1D4OpZBjZKxaH7_image_2024-12-08_18-37-27%20Large.jpeg'
      : 'https://v3.fal.media/files/panda/jRavCEb1D4OpZBjZKxaH7_image_2024-12-08_18-37-27%20Large.jpeg';

    // Step 1: Submit the prediction job
    const inputData = {
      model_name: "tryon-v1.6",
      inputs: {
        model_image: modelImageUrl,
        garment_image: `data:image/jpeg;base64,${clothingImageBase64}`
      }
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    };

    console.log('Submitting prediction job...');
    const runResponse = await fetch(`${BASE_URL}/run`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(inputData)
    });

    if (!runResponse.ok) {
      const errorText = await runResponse.text();
      console.error('Run API error:', runResponse.status, errorText);
      throw new Error(`Fashn.ai run API error: ${runResponse.status} - ${errorText}`);
    }

    const runData = await runResponse.json();
    const predictionId = runData.id;
    
    if (!predictionId) {
      throw new Error('No prediction ID returned from Fashn.ai API');
    }

    console.log('Prediction started, ID:', predictionId);

    // Step 2: Poll for completion
    let attempts = 0;
    const maxAttempts = 30; // 90 seconds max wait time
    
    while (attempts < maxAttempts) {
      console.log(`Polling attempt ${attempts + 1}/${maxAttempts}`);
      
      const statusResponse = await fetch(`${BASE_URL}/status/${predictionId}`, {
        headers: { 'Authorization': `Bearer ${API_KEY}` }
      });

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text();
        console.error('Status API error:', statusResponse.status, errorText);
        throw new Error(`Status check failed: ${statusResponse.status}`);
      }

      const statusData = await statusResponse.json();
      console.log('Status:', statusData.status);

      if (statusData.status === 'completed') {
        console.log('Prediction completed successfully');
        
        // Clean up temporary file
        try {
          fs.unlinkSync(clothingFile.filepath);
        } catch (cleanupError) {
          console.warn('Failed to cleanup temp file:', cleanupError);
        }

        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            tryon_image_url: statusData.output,
            prediction_id: predictionId 
          }),
        };
      } else if (statusData.status === 'failed') {
        console.error('Prediction failed:', statusData.error);
        throw new Error(`Prediction failed: ${statusData.error || 'Unknown error'}`);
      } else if (['starting', 'in_queue', 'processing'].includes(statusData.status)) {
        // Continue polling
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
        attempts++;
      } else {
        throw new Error(`Unknown status: ${statusData.status}`);
      }
    }

    // If we get here, we timed out
    throw new Error('Prediction timed out after 90 seconds');

  } catch (error) {
    console.error('Fashn.ai API error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to generate AI try-on',
        details: error.message 
      }),
    };
  }
};