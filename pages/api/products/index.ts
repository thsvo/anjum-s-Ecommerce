import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const { page = 1, limit = 10, search, categoryId: queryCategoryId } = req.query;
        
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);
        
        const where: any = {};
        
        if (search) {
          where.OR = [
            { name: { contains: search as string, mode: 'insensitive' } },
            { description: { contains: search as string, mode: 'insensitive' } }
          ];
        }
        
        if (queryCategoryId) {
          where.categoryId = queryCategoryId as string;
        }
        
        const [products, total] = await Promise.all([
          prisma.product.findMany({
            where,
            skip,
            take,
            include: {
              category: true,
              reviews: {
                select: {
                  rating: true
                }
              },
              images: true
            },
            orderBy: { createdAt: 'desc' }
          }),
          prisma.product.count({ where })
        ]);
        
        // Calculate average rating for each product
        const productsWithRating = products.map(product => ({
          ...product,
          averageRating: product.reviews.length > 0 
            ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
            : 0,
          reviewCount: product.reviews.length
        }));
        
        res.status(200).json({
          products: productsWithRating,
          pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(total / take),
            totalItems: total,
            hasNext: skip + take < total,
            hasPrev: Number(page) > 1
          }
        });
        break;
        
      case 'POST':
        const { name, description, price, categoryId, image, stock, featured, tempImages } = req.body;
        
        if (!name || !price || !categoryId) {
          return res.status(400).json({ error: 'Name, price, and category are required' });
        }
        
        const newProduct = await prisma.product.create({
          data: {
            name,
            description,
            price: parseFloat(price),
            categoryId,
            image: image || '',
            stock: parseInt(stock) || 0,
            featured: Boolean(featured) || false
          },
          include: {
            category: true
          }
        });
        
        // If there are temporary images, create them in the database
        if (tempImages && Array.isArray(tempImages) && tempImages.length > 0) {
          await Promise.all(
            tempImages.map(async (tempImage: { url: string, isMain: boolean }) => {
              await prisma.productImage.create({
                data: {
                  url: tempImage.url,
                  productId: newProduct.id,
                  isMain: tempImage.isMain,
                }
              });
            })
          );
        }
        
        res.status(201).json(newProduct);
        break;
        
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Products API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
