import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const { page = 1, limit = 10, search } = req.query;
        
        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);
        
        const where: any = {};
        
        if (search) {
          where.OR = [
            { name: { contains: search as string, mode: 'insensitive' } },
            { description: { contains: search as string, mode: 'insensitive' } }
          ];
        }
        
        const [categories, total] = await Promise.all([
          prisma.category.findMany({
            where,
            skip,
            take,
            include: {
              products: {
                select: {
                  id: true
                }
              }
            },
            orderBy: { createdAt: 'desc' }
          }),
          prisma.category.count({ where })
        ]);
        
        const categoriesWithProductCount = categories.map(category => ({
          ...category,
          productCount: category.products.length
        }));
        
        res.status(200).json({
          categories: categoriesWithProductCount,
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
        const { name, description, image } = req.body;
        
        if (!name) {
          return res.status(400).json({ error: 'Name is required' });
        }
        
        const newCategory = await prisma.category.create({
          data: {
            name,
            description,
            image
          }
        });
        
        res.status(201).json(newCategory);
        break;
        
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Categories API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
