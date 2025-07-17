import type { VercelRequest, VercelResponse } from '@vercel/node';
import formidable from 'formidable';
import fs from 'fs';
import { Blob } from 'formdata-node';

export const config = { api: { bodyParser: false } };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = new formidable.IncomingForm();
    
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parsing error:', err);
        return res.status(500).json({ error: 'Upload error' });
      }

      const gender = fields.gender as string;
      const file = files.clothing_image as formidable.File;

      if (!file || !file.filepath) {
        return res.status(400).json({ error: 'No clothing image provided' });
      }

      try {
        const buffer = fs.readFileSync(file.filepath);
        const clothingImageBlob = new Blob([buffer], { type: file.mimetype || 'image/jpeg' });

        const modelImageUrl = gender?.toLowerCase() === 'male' 
          ? 'https://fashn-ai-models.s3.amazonaws.com/male-model-1.jpg'
          : 'https://fashn-ai-models.s3.amazonaws.com/female-model-1.jpg';

        const apiRequestBody = {
          model_name: "tryon-v1.6", // Using the latest model version
          inputs: {
            model_image: modelImageUrl,
            garment_image: clothingImageBlob
          }
        };

        const fashnResponse = await fetch('https://api.fashn.ai/v1/run', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.FASHN_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(apiRequestBody)
        });

        if (!fashnResponse.ok) {
          const errorText = await fashnResponse.text();
          console.error('Fashn.ai API error:', fashnResponse.status, errorText);
          return res.status(fashnResponse.status).json({ 
            error: `Fashn.ai API Error: ${fashnResponse.statusText}`,
            details: errorText
          });
        }

        const json = await fashnResponse.json();

        if (!json.output) {
          return res.status(500).json({ error: 'No try-on image URL returned from Fashn.ai' });
        }

        res.status(200).json({ tryon_image_url: json.output });

      } catch (apiError: any) {
        console.error('API call error:', apiError);
        res.status(500).json({ error: 'Failed to generate AI try-on', details: apiError.message });
      } finally {
        fs.unlinkSync(file.filepath);
      }
    });

  } catch (error: any) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}