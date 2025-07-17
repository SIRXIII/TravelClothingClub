import type { VercelRequest, VercelResponse } from '@vercel/node';
import formidable from 'formidable';
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

export const config = { 
  api: { 
    bodyParser: false 
  } 
};

const parseForm = (req: VercelRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm({
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check for API key
    if (!process.env.FASHN_API_KEY) {
      throw new Error('FASHN_API_KEY environment variable is not set');
    }

    // Parse the multipart form data
    const { fields, files } = await parseForm(req);

    // Extract gender field (handle both array and single value)
    const gender = Array.isArray(fields.gender) ? fields.gender[0] : fields.gender || 'Female';
    
    // Extract clothing image file (handle both array and single value)
    const clothingFile = Array.isArray(files.clothing_image) 
      ? files.clothing_image[0] 
      : files.clothing_image;

    if (!clothingFile || !clothingFile.filepath) {
      return res.status(400).json({ error: 'No clothing image provided' });
    }

    // Validate gender
    if (!['Male', 'Female'].includes(gender as string)) {
      return res.status(400).json({ error: 'Gender must be "Male" or "Female"' });
    }

    // Create form data for Fashn.ai API
    const apiForm = new FormData();
    const fileStream = fs.createReadStream(clothingFile.filepath);
    
    apiForm.append('clothing_image', fileStream, {
      filename: clothingFile.originalFilename || 'clothing.jpg',
      contentType: clothingFile.mimetype || 'image/jpeg',
    });
    apiForm.append('gender', gender as string);

    // Call Fashn.ai API
    const apiResponse = await fetch('https://api.fashn.ai/v1/tryon', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FASHN_API_KEY}`,
        ...apiForm.getHeaders(),
      },
      body: apiForm,
    });

    // Clean up temporary file
    try {
      fs.unlinkSync(clothingFile.filepath);
    } catch (cleanupError) {
      console.warn('Failed to cleanup temp file:', cleanupError);
    }

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('Fashn.ai API error:', apiResponse.status, errorText);
      throw new Error(`Fashn.ai API error: ${apiResponse.status} - ${errorText}`);
    }

    const data = await apiResponse.json();

    // Return the try-on image URL
    return res.status(200).json({ 
      tryon_image_url: data.tryon_image_url || data.url || data.output_url 
    });

  } catch (error: any) {
    console.error('Try-on API error:', error);
    return res.status(500).json({ 
      error: 'Server error', 
      details: error.message 
    });
  }
}