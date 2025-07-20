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

  try {
    const API_KEY = process.env.FASHN_API_KEY;
    if (!API_KEY) {
      throw new Error('FASHN_API_KEY environment variable is not set');
    }

    // Test the API key by checking credits
    const creditsResponse = await fetch('https://api.fashn.ai/v1/credits', {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    if (!creditsResponse.ok) {
      throw new Error(`API key verification failed: ${creditsResponse.status}`);
    }

    const credits = await creditsResponse.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'API connection successful',
        credits: credits.credits.total
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
        error: 'Test failed',
        details: error.message
      })
    };
  }
};