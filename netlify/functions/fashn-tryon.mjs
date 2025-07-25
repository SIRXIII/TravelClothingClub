// Using .mjs extension to ensure ES modules are used
import fetch from 'node-fetch';
import { Buffer } from 'buffer';

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

  try {
    const API_KEY = process.env.FASHN_API_KEY;
    if (!API_KEY) {
      throw new Error('FASHN_API_KEY environment variable is not set');
    }

    // Parse request body
    let requestData;
    try {
      requestData = JSON.parse(event.body);
    } catch (e) {
      throw new Error('Invalid request body. Expected JSON.');
    }

    const { imageBase64, gender } = requestData;
    
    if (!imageBase64) {
      throw new Error('No image data provided');
    }

    if (!gender) {
      throw new Error('No gender specified');
    }

    // Validate base64 data
    if (!imageBase64.startsWith('data:image/')) {
      throw new Error('Invalid image format. Expected base64 data URL.');
    }

    // First verify the API key by checking credits
    console.log('Verifying API key and checking credits...');
    const creditsResponse = await fetch('https://api.fashn.ai/v1/credits', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    if (!creditsResponse.ok) {
      const errorText = await creditsResponse.text();
      console.error('Failed to verify API key:', errorText);
      throw new Error('Invalid API key or API key has expired');
    }

    const credits = await creditsResponse.json();
    console.log('Available credits:', credits);

    if (credits.credits.total <= 0) {
      throw new Error('No credits available');
    }

    // Submit the prediction job
    console.log('Submitting prediction job...');
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
          garment_image: imageBase64
        }
      })
    });

    if (!runResponse.ok) {
      const errorText = await runResponse.text();
      console.error('Fashn.ai run API error:', runResponse.status, errorText);
      throw new Error(`Failed to start prediction: ${errorText}`);
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
        throw new Error(`Status check failed: ${await statusResponse.text()}`);
      }

      const statusData = await statusResponse.json();
      console.log('Status:', statusData.status);

      if (statusData.status === 'completed') {
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
        throw new Error(statusData.error || 'Prediction failed');
      }

      if (['starting', 'in_queue', 'processing'].includes(statusData.status)) {
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
        attempts++;
        continue;
      }

      throw new Error(`Unknown status: ${statusData.status}`);
    }

    throw new Error('Prediction timed out after 90 seconds');

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: error.message.includes('Invalid request') ? 400 : 500,
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