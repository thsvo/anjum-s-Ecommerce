import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

// Disable the default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

// ImgBB API configuration
const IMGBB_API_KEY = '1bc43ebd0cb93474188f1d032f718b87';
const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload';

// Function to upload image to ImgBB
const uploadToImgBB = async (filePath: string, fileName: string): Promise<string> => {
  try {
    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString('base64');
    
    const formData = new FormData();
    formData.append('key', IMGBB_API_KEY);
    formData.append('image', base64Image);
    formData.append('name', fileName);

    const response = await fetch(IMGBB_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json() as any;
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to upload to ImgBB');
    }

    return result.data.url;
  } catch (error) {
    console.error('ImgBB upload error:', error);
    throw new Error('Failed to upload to ImgBB');
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const form = formidable({
      keepExtensions: true,
      maxFiles: 10,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Upload error:', err);
          res.status(500).json({ error: 'Upload failed' });
          return resolve(true);
        }

        try {
          const productId = Array.isArray(fields.productId) ? fields.productId[0] : fields.productId;
          const isMain = Array.isArray(fields.isMain) ? fields.isMain[0] : fields.isMain;
          const isNew = Array.isArray(fields.isNew) ? fields.isNew[0] : fields.isNew;
          
          // Check if files is an array
          const uploadedFiles = Array.isArray(files.files) 
            ? files.files 
            : files.files ? [files.files] : [];
          
          if (uploadedFiles.length === 0) {
            res.status(400).json({ error: 'No files uploaded' });
            return resolve(true);
          }

          const imageResults = [];

          for (let i = 0; i < uploadedFiles.length; i++) {
            const file = uploadedFiles[i];
            
            try {
              // Generate a unique filename
              const uniqueId = uuidv4();
              const originalName = file.originalFilename || `image-${uniqueId}`;
              
              // Upload to ImgBB
              const imgbbUrl = await uploadToImgBB(file.filepath, originalName);
              
              // Clean up temporary file
              fs.unlinkSync(file.filepath);

              // Handle a new product that doesn't have an ID yet
              if (isNew === 'true') {
                // For new products, we'll just return temporary IDs
                imageResults.push({
                  id: `temp_${uniqueId}`,
                  url: imgbbUrl,
                  isMain: isMain === 'true' && i === 0,
                });
              } else {
                // For existing products, save to database
                if (!productId) {
                  throw new Error('Product ID is required for existing products');
                }
                
                const image = await prisma.productImage.create({
                  data: {
                    url: imgbbUrl,
                    productId: productId,
                    isMain: isMain === 'true' && i === 0, // Only make the first image main if isMain is true
                  },
                });

                imageResults.push({
                  id: image.id,
                  url: image.url,
                  isMain: image.isMain,
                });
              }
            } catch (uploadError) {
              console.error('Error uploading file:', uploadError);
              // Clean up temporary file if it still exists
              try {
                fs.unlinkSync(file.filepath);
              } catch (cleanupError) {
                // Ignore cleanup errors
              }
              // Continue with other files but log the error
              continue;
            }
          }

          if (imageResults.length === 0) {
            res.status(500).json({ error: 'Failed to upload any images' });
            return resolve(true);
          }

          res.status(200).json({ images: imageResults });
          return resolve(true);
        } catch (error) {
          console.error('Server error:', error);
          res.status(500).json({ error: 'Server error' });
          return resolve(true);
        }
      });
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Upload failed' });
  }
}
