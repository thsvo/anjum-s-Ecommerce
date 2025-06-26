const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSampleData() {
  try {
    console.log('Creating sample categories...');

    // Create categories
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { name: 'Electronics' },
        update: {},
        create: {
          name: 'Electronics',
          description: 'Latest electronic devices and gadgets',
          image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500'
        }
      }),
      prisma.category.upsert({
        where: { name: 'Clothing' },
        update: {},
        create: {
          name: 'Clothing',
          description: 'Fashion and apparel for all occasions',
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500'
        }
      }),
      prisma.category.upsert({
        where: { name: 'Books' },
        update: {},
        create: {
          name: 'Books',
          description: 'Books for learning and entertainment',
          image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500'
        }
      }),
      prisma.category.upsert({
        where: { name: 'Home & Garden' },
        update: {},
        create: {
          name: 'Home & Garden',
          description: 'Everything for your home and garden',
          image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500'
        }
      })
    ]);

    console.log('Created categories:', categories.map(c => c.name));

    console.log('Creating sample products...');

    // Create products
    const products = await Promise.all([
      prisma.product.upsert({
        where: { id: 'sample-product-1' },
        update: {},
        create: {
          id: 'sample-product-1',
          name: 'MacBook Pro 16"',
          description: 'Apple MacBook Pro 16-inch with M3 Pro chip. Perfect for professionals and creatives.',
          price: 2499.99,
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
          stock: 15,
          featured: true,
          categoryId: categories[0].id
        }
      }),
      prisma.product.upsert({
        where: { id: 'sample-product-2' },
        update: {},
        create: {
          id: 'sample-product-2',
          name: 'iPhone 15 Pro',
          description: 'Latest iPhone with titanium design and advanced camera system.',
          price: 999.99,
          image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
          stock: 25,
          featured: true,
          categoryId: categories[0].id
        }
      }),
      prisma.product.upsert({
        where: { id: 'sample-product-3' },
        update: {},
        create: {
          id: 'sample-product-3',
          name: 'Premium T-Shirt',
          description: 'High-quality cotton t-shirt with modern fit and comfortable feel.',
          price: 29.99,
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
          stock: 100,
          featured: false,
          categoryId: categories[1].id
        }
      }),
      prisma.product.upsert({
        where: { id: 'sample-product-4' },
        update: {},
        create: {
          id: 'sample-product-4',
          name: 'JavaScript: The Definitive Guide',
          description: 'Comprehensive guide to JavaScript programming for beginners and experts.',
          price: 45.99,
          image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
          stock: 50,
          featured: false,
          categoryId: categories[2].id
        }
      }),
      prisma.product.upsert({
        where: { id: 'sample-product-5' },
        update: {},
        create: {
          id: 'sample-product-5',
          name: 'Smart Plant Pot',
          description: 'Self-watering smart plant pot with app connectivity and growth monitoring.',
          price: 79.99,
          image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500',
          stock: 30,
          featured: true,
          categoryId: categories[3].id
        }
      })
    ]);

    console.log('Created products:', products.map(p => p.name));

    console.log('Sample data created successfully!');
    console.log('\nYou can now:');
    console.log('1. Visit http://localhost:3001/admin to access the admin panel');
    console.log('2. Login with: admin@ecommerce.com / admin123');
    console.log('3. Manage products, categories, and users');

  } catch (error) {
    console.error('Error creating sample data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleData();
