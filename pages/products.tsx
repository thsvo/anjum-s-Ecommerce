import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: {
    name: string;
  };
  averageRating: number;
  reviewCount: number;
}

const Products: React.FC = () => {
  const { user } = useAuth();
  const { addToCart, fetchCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [filterCategory, setFilterCategory] = useState('all');
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  // Sample products for demonstration
  const sampleProducts: Product[] = [
    {
      id: '1',
      name: 'iPhone 15 Pro Max',
      price: 1199,
      image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=300&fit=crop',
      category: { name: 'Electronics' },
      averageRating: 4.8,
      reviewCount: 2847
    },
    {
      id: '2',
      name: 'Samsung Galaxy S24 Ultra',
      price: 1099,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
      category: { name: 'Electronics' },
      averageRating: 4.7,
      reviewCount: 1923
    },
    {
      id: '3',
      name: 'Nike Air Jordan 1',
      price: 169,
      image: 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=400&h=300&fit=crop',
      category: { name: 'Fashion' },
      averageRating: 4.5,
      reviewCount: 654
    },
    {
      id: '4',
      name: 'MacBook Pro 16"',
      price: 2399,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
      category: { name: 'Electronics' },
      averageRating: 4.9,
      reviewCount: 1456
    },
    {
      id: '5',
      name: 'Adidas Ultraboost 22',
      price: 189,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
      category: { name: 'Sports' },
      averageRating: 4.6,
      reviewCount: 892
    },
    {
      id: '6',
      name: 'Sony WH-1000XM5',
      price: 399,
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop',
      category: { name: 'Electronics' },
      averageRating: 4.8,
      reviewCount: 2341
    },
    {
      id: '7',
      name: 'Levi\'s 501 Original Jeans',
      price: 89,
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop',
      category: { name: 'Fashion' },
      averageRating: 4.4,
      reviewCount: 567
    },
    {
      id: '8',
      name: 'Apple Watch Series 9',
      price: 429,
      image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=300&fit=crop',
      category: { name: 'Electronics' },
      averageRating: 4.7,
      reviewCount: 1834
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(sampleProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    setAddingToCart(productId);
    try {
      await addToCart(productId, 1);
      alert('Product added to cart successfully!');
    } catch (error: any) {
      alert(error.message || 'Failed to add product to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  const handleAddToWishlist = (productId: string) => {
    console.log('Adding to wishlist:', productId);
    // Implement add to wishlist logic
  };

  const filteredProducts = products.filter(product => 
    filterCategory === 'all' || product.category.name.toLowerCase() === filterCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.averageRating - a.averageRating;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Products - ShopHub</title>
        <meta name="description" content="Browse our amazing collection of products" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Our Products</h1>
            <p className="text-xl opacity-90">Discover amazing products at great prices</p>
          </div>
        </section>

        {/* Filters and Sort */}
        <section className="py-6 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-700">Filter by:</span>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Categories</option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="sports">Sports</option>
                  <option value="home">Home & Garden</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-700">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  isAddingToCart={addingToCart === product.id}
                />
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Products;
