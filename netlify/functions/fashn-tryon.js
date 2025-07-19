import fetch from 'node-fetch';

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
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

    // Parse request body
    const { image, gender } = JSON.parse(event.body);
    if (!image) {
      throw new Error('No image provided');
    }

    // Extract base64 data from data URL
    const base64Image = image.split(',')[1];

    // First, submit the prediction job
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
            ? 'https://v3.fal.media/files/panda/jRavCEb1D4OpZBjZKxaH7_image_2024-12-08_18-37-27%20Large.jpeg'
            : 'https://v3.fal.media/files/panda/jRavCEb1D4OpZBjZKxaH7_image_2024-12-08_18-37-27%20Large.jpeg',
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
      throw new Error('No prediction ID returned');
    }

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
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            output: statusData.output[0]
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