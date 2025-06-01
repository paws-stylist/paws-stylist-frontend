'use client'
import React from 'react';
import { useParams } from 'next/navigation';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import { useGet } from '../../hooks/useApi';

const Homepage = () => {
  const params = useParams();
  const productType = params['product-type'];
  const serviceType = params['service-type'];
  
  // Fetch products and services from API
  const { data: products, loading: productsLoading, error: productsError } = useGet('/products');
  const { data: services, loading: servicesLoading, error: servicesError } = useGet('/services');
  console.log(services)
  // Determine what to show based on URL
  const isService = !!serviceType;
  const isProduct = !!productType;

  let itemsToShow = [];
  let loading = false;
  let error = null;

  if (isService) {
    loading = servicesLoading;
    error = servicesError;
    // Filter services by type if needed
    if (services) {
      itemsToShow = serviceType === 'all' ? services : services.filter(service => 
        service.serviceType.toLowerCase() === serviceType.toLowerCase()
      );
    }
  } else if (isProduct) {
    loading = productsLoading;
    error = productsError;
    // Filter products by type if needed
    if (products) {
      itemsToShow = productType === 'all' ? products : products.filter(product => 
        product.productType.toLowerCase() === productType.toLowerCase() ||
        product.category.toLowerCase().includes(productType.toLowerCase())
      );
    }
  }

  // Show loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-cream-50">
        <Hero type={productType || serviceType} />
        <section className="container py-16 md:py-24">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-brown mb-8 md:mb-12">BROWSE COLLECTION</h2>
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading...</div>
          </div>
        </section>
      </main>
    );
  }

  // Show error state
  if (error) {
    return (
      <main className="min-h-screen bg-cream-50">
        <Hero type={productType || serviceType} />
        <section className="container py-16 md:py-24">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-brown mb-8 md:mb-12">BROWSE COLLECTION</h2>
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-red-600">Error loading data: {error}</div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <Hero type={productType || serviceType} />
      
      {/* Products/Services Section */}
      <section className="container py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-semibold text-center text-brown mb-8 md:mb-12">BROWSE COLLECTION</h2>
        <ProductGrid products={itemsToShow} isService={isService} />
      </section>
    </main>
  );
};

export default Homepage;