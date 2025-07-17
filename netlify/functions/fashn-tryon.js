const fetch = require('node-fetch');
const FormData = require('form-data');

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

    // Parse multipart form data
    const contentType = event.headers['content-type'] || event.headers['Content-Type'];
    if (!contentType || !contentType.includes('multipart/form-data')) {
      throw new Error('Content-Type must be multipart/form-data');
    }

    // Extract boundary from content-type header
    const boundary = contentType.split('boundary=')[1];
    if (!boundary) {
      throw new Error('No boundary found in Content-Type header');
    }

    // Parse the multipart data manually (simplified for this use case)
    const body = event.body;
    const isBase64 = event.isBase64Encoded;
    
    let buffer;
    if (isBase64) {
      buffer = Buffer.from(body, 'base64');
    } else {
      buffer = Buffer.from(body);
    }

    // Extract gender from form data
    const bodyStr = buffer.toString();
    const genderMatch = bodyStr.match(/name="gender"[\s\S]*?\r?\n\r?\n([^\r\n]+)/);
    const gender = genderMatch ? genderMatch[1].trim() : 'Female';

    // Extract file data (simplified - in production you'd want more robust parsing)
    const fileStart = bodyStr.indexOf('\r\n\r\n') + 4;
    const fileEnd = bodyStr.lastIndexOf(`\r\n--${boundary}`);
    
    if (fileStart === -1 || fileEnd === -1) {
      throw new Error('Could not parse file from form data');
    }

    // Get the binary file data
    const fileBuffer = buffer.slice(fileStart, fileEnd);

    // Select model image based on gender
    const modelImageUrl = gender.toLowerCase() === 'male' 
      ? 'https://v3.fal.media/files/panda/jRavCEb1D4OpZBjZKxaH7_image_2024-12-08_18-37-27%20Large.jpeg'
      : 'https://v3.fal.media/files/panda/jRavCEb1D4OpZBjZKxaH7_image_2024-12-08_18-37-27%20Large.jpeg';

    // Create FormData for the API request
    const formData = new FormData();
    formData.append('clothing_image', fileBuffer, {
      filename: 'clothing.jpg',
      contentType: 'image/jpeg'
    });

    // First, upload the garment image to get a URL (if needed)
    // For now, we'll use the model image approach from the Python example

    // Step 1: Submit the prediction job
    const inputData = {
      model_name: "tryon-v1.6",
      inputs: {
        model_image: modelImageUrl,
        garment_image: fileBuffer.toString('base64') // Convert to base64 for API
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