import fetch from 'node-fetch';

// Function to convert image URL to base64
async function imageUrlToBase64(url) {
  const response = await fetch(url);
  const buffer = await response.buffer();
  const base64 = buffer.toString('base64');
  const contentType = response.headers.get('content-type');
  return `data:${contentType};base64,${base64}`;
}

// Function to poll prediction status
async function pollPrediction(predictionId, apiKey) {
  const maxAttempts = 30; // 5 minutes maximum (10 second intervals)
  let attempts = 0;

  while (attempts < maxAttempts) {
    console.log(`Polling attempt ${attempts + 1}/${maxAttempts}...`);
    
    const response = await fetch(`https://api.fashn.ai/v1/status/${predictionId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to poll prediction: ${await response.text()}`);
    }

    const result = await response.json();
    console.log('Poll status:', result.status);

    if (result.status === 'completed') {
      return result;
    } else if (result.status === 'failed') {
      throw new Error('Prediction failed: ' + JSON.stringify(result.error));
    }

    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
    attempts++;
  }

  throw new Error('Prediction timed out after 5 minutes');
}

export const handler = async (event) => {
  try {
    const API_KEY = process.env.FASHN_API_KEY;
    if (!API_KEY) {
      throw new Error('FASHN_API_KEY environment variable is not set');
    }

    // First, check available credits
    console.log('Checking credits...');
    const creditsResponse = await fetch('https://api.fashn.ai/v1/credits', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    if (!creditsResponse.ok) {
      throw new Error(`Failed to check credits: ${await creditsResponse.text()}`);
    }

    const credits = await creditsResponse.json();
    console.log('Available credits:', credits);

    // Use publicly accessible sample images
    const modelImageUrl = 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg';
    console.log('Converting model image to base64...');
    const modelImageBase64 = await imageUrlToBase64(modelImageUrl);

    const garmentImageUrl = 'https://images.pexels.com/photos/19090/pexels-photo.jpg';
    console.log('Converting garment image to base64...');
    const garmentImageBase64 = await imageUrlToBase64(garmentImageUrl);

    // Create prediction
    console.log('Creating prediction...');
    const predictionResponse = await fetch('https://api.fashn.ai/v1/run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model_name: 'tryon-v1.6',
        inputs: {
          model_image: modelImageBase64,
          garment_image: garmentImageBase64
        }
      })
    });

    if (!predictionResponse.ok) {
      const errorText = await predictionResponse.text();
      throw new Error(`Failed to create prediction: ${errorText}`);
    }

    const prediction = await predictionResponse.json();
    console.log('Prediction created:', prediction.id);

    // Poll for results
    console.log('Polling for results...');
    const result = await pollPrediction(prediction.id, API_KEY);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: 'Try-on completed successfully',
        result: result
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        success: false,
        error: 'Try-on test failed',
        details: error.message
      })
    };
  }
}; 