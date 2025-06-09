import React from 'react';
import { BsArrowRight } from 'react-icons/bs';
import Shop from './Shop';
import { useGet } from '../../hooks/useApi';

const FeedingCollection = () => {
  // Fetch products from API
  const { data: allProducts, loading, error } = useGet('/products');

  // Filter products by food category and get 5 newest ones
  const products = allProducts 
    ? allProducts
        .filter(product => product.category.title.toLowerCase())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(product => ({
          id: product._id,
          name: product.productDetail,
          description: product.productDetail,
          image: product.images?.[0] || "/ceramic-bowl.webp",
          featured: false,
          category: product.category,
          slug: product.slug
        }))
    : [];

  // Set first product as featured if available
  if (products.length > 0) {
    products[0].featured = true;
  }

  // Show loading state
  if (loading) {
    return (
      <>
        <section className="py-8 md:py-16 px-4 md:px-8">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-brown mb-8 md:mb-12">FEEDING COLLECTION</h2>
            <div className="flex items-center justify-center h-96">
              <div className="text-lg text-gray-600">Loading products...</div>
            </div>
          </div>
        </section>
        <Shop />
      </>
    );
  }

  // Show error state
  if (error) {
    return (
      <>
        <section className="py-8 md:py-16 px-4 md:px-8">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-brown mb-8 md:mb-12">FEEDING COLLECTION</h2>
            <div className="flex items-center justify-center h-96">
              <div className="text-lg text-red-600">Error loading products: {error}</div>
            </div>
          </div>
        </section>
        <Shop />
      </>
    );
  }

  // Show no products state
  if (!products || products.length === 0) {
    return (
      <>
        <section className="py-8 md:py-16 px-4 md:px-8">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-brown mb-8 md:mb-12">FEEDING COLLECTION</h2>
            <div className="flex items-center justify-center h-96">
              <div className="text-lg text-gray-600">No food products available</div>
            </div>
          </div>
        </section>
        <Shop />
      </>
    );
  }

  const featuredProduct = products.find(p => p.featured) || products[0];
  const regularProducts = products.filter(p => !p.featured) || products.slice(1, 5);
  console.log({featuredProduct});

  return (
    <>
      <section className="py-8 md:py-16 px-4 md:px-8">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-brown mb-8 md:mb-12">FEEDING COLLECTION</h2>
          
          <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
            {/* Featured Product - Left side */}
            <div className="lg:w-[58%] group relative overflow-hidden rounded-xl cursor-pointer h-[400px] md:h-[600px]">
              <div className="relative w-full h-full">
                <img
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-105"
                />
                {/* Always visible title */}
                <div className="absolute bottom-0 left-0 right-0 group-hover:opacity-0 transition-opacity duration-300">
                  <div className="bg-gradient-to-t from-black/80 to-transparent p-4 -m-4 rounded-b-xl">
                    <h3 className="text-xl md:text-2xl font-medium text-white mb-2 md:mb-3 p-6 md:p-8">{featuredProduct.name}</h3>
                  </div>
                </div>
                {/* Hover overlay with description and button */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h3 className="text-xl md:text-2xl font-medium text-white mb-2 md:mb-3">{featuredProduct.name}</h3>
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-base md:text-lg text-white/90 mb-3 md:mb-4 max-w-xl line-clamp-3">{featuredProduct.description}</p>
                      <a href={`/products/${featuredProduct.category.slug}/${featuredProduct.slug}`}>
                      <button className="inline-flex items-center text-white hover:text-primary-500 transition-colors text-base md:text-lg group">
                        Discover More <BsArrowRight className="ml-2 text-xl transition-transform group-hover:translate-x-1" />
                      </button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Regular Products Grid - Right side */}
            <div className="lg:w-[42%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {regularProducts.map((product) => (
                <div key={product.id} className="group relative overflow-hidden rounded-xl cursor-pointer h-[280px] md:h-[290px]">
                  <div className="relative w-full h-full">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Always visible title */}
                    <div className="absolute bottom-0 left-0 right-0 group-hover:opacity-0 transition-opacity duration-300">
                      <div className="bg-gradient-to-t from-black/80 to-transparent p-3 -m-3 rounded-b-xl">
                        <h3 className="text-lg md:text-xl font-medium text-white mb-1 md:mb-2 p-4 md:p-6">{product.name}</h3>
                      </div>
                    </div>
                    {/* Hover overlay with description and button */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                        <h3 className="text-lg md:text-xl font-medium text-white mb-1 md:mb-2">{product.name}</h3>
                        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <p className="text-sm text-white/90 line-clamp-2 mb-2 md:mb-3">{product.description}</p>
                          <a href={`/products/${product.category.slug}/${product.slug}`}>
                          <button className="inline-flex items-center text-white hover:text-primary-500 transition-colors group">
                            Shop Now <BsArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                          </button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Shop />
    </>
  );
};

export default FeedingCollection;