import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid category ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const category = await prisma.category.findUnique({
          where: { id },
          include: {
            products: true
          }
        });

        if (!category) {
          return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json(category);
        break;

      case 'PUT':
        const { name, description, image } = req.body;

        const updatedCategory = await prisma.category.update({
          where: { id },
          data: {
            ...(name && { name }),
            ...(description && { description }),
            ...(image && { image })
          }
        });

        res.status(200).json(updatedCategory);
        break;

      case 'DELETE':
        // Check if category has products
        const productsCount = await prisma.product.count({
          where: { categoryId: id }
        });

        if (productsCount > 0) {
          return res.status(400).json({ 
            error: 'Cannot delete category with existing products' 
          });
        }

        await prisma.category.delete({
          where: { id }
        });

        res.status(200).json({ message: 'Category deleted successfully' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Category API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
