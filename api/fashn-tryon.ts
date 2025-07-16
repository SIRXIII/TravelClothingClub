import type { VercelRequest, VercelResponse } from '@vercel/node';
import formidable from 'formidable';
import fs from 'fs';

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

      if (!file) {
        return res.status(400).json({ error: 'No clothing image provided' });
      }

      if (!gender) {
        return res.status(400).json({ error: 'Gender not specified' });
      }

      try {
        // Read the uploaded file
        const buffer = fs.readFileSync(file.filepath);
        
        // Create FormData for Fashn.ai API
        const formData = new FormData();
        formData.append('clothing_image', new Blob([buffer]), file.originalFilename || 'clothing.jpg');
        formData.append('category', 'tops'); // Default category, can be made dynamic
        
        // Add model image based on gender
        const modelImageUrl = gender.toLowerCase() === 'male' 
          ? 'https://fashn-ai-models.s3.amazonaws.com/male-model-1.jpg'
          : 'https://fashn-ai-models.s3.amazonaws.com/female-model-1.jpg';
        
        formData.append('model_image', modelImageUrl);

        // Call Fashn.ai API with correct endpoint
        const response = await fetch('https://api.fashn.ai/v1/run', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.FASHN_API_KEY}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Fashn.ai API error:', response.status, errorText);
          return res.status(response.status).json({ 
            error: `Fashn.ai API error: ${response.status}` 
          });
        }

        const json = await response.json();
        
        if (!json.output) {
          return res.status(500).json({ error: 'No try-on image URL returned' });
        }

        res.status(200).json({ tryon_image_url: json.output });

      } catch (apiError) {
        console.error('API call error:', apiError);
        res.status(500).json({ error: 'Failed to generate AI try-on' });
      } finally {
        // Clean up temporary file
        try {
          fs.unlinkSync(file.filepath);
        } catch (cleanupError) {
          console.warn('Failed to clean up temp file:', cleanupError);
        }
      }
    });

  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}