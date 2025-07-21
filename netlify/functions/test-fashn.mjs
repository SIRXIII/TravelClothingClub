import fetch from 'node-fetch';

export const handler = async (event) => {
  try {
    const API_KEY = process.env.FASHN_API_KEY;
    if (!API_KEY) {
      throw new Error('FASHN_API_KEY environment variable is not set');
    }

    // Test API key by checking credits
    console.log('Testing API key by checking credits...');
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
    console.log('API key is valid! Available credits:', credits);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: 'API key is valid',
        credits: credits
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
        error: 'API test failed',
        details: error.message
      })
    };
  }
}; 