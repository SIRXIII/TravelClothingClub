import { corsHeaders } from '../_shared/cors.ts';

interface RequestBody {
  image_url: string;
  category: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { image_url, category }: RequestBody = await req.json();

    const API_KEY = Deno.env.get('FASHN_API_KEY');
    if (!API_KEY) {
      throw new Error('FASHN_API_KEY is not set');
    }

    const response = await fetch('https://api.fashn.ai/v1/run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model_image: 'https://example.com/default-model.jpg', // Your default model image
        garment_image: image_url,
        category: category
      })
    });

    if (!response.ok) {
      throw new Error('Fashn.ai API call failed');
    }

    const result = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        generated_url: result.output_url || result.output[0], // Adjust based on actual response structure
        message: 'AI model generation completed successfully'
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to generate AI model',
        message: error.message
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});