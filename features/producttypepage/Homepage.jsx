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
  let url=typeof window !== 'undefined' ? window.location.href : '';
  
  // Fetch products and services from API
  const { data: products, loading: productsLoading, error: productsError } = useGet('/products');
  const { data: services, loading: servicesLoading, error: servicesError } = useGet('/services');
  // Determine what to show based on URL
  const isService = !!serviceType || url.includes('services');
  const isProduct = !!productType || url.includes('products');

  let itemsToShow = [];
  let loading = false;
  let error = null;

  if (isService) {
    loading = servicesLoading;
    error = servicesError;
    if (services) {
      itemsToShow = serviceType !== undefined ? services.filter(service => 
        service.serviceType.toLowerCase() === serviceType.toLowerCase()
      ) : services;
    }
  } else if (isProduct) {
    loading = productsLoading;
    error = productsError;
    if (products) {
      itemsToShow = productType !== undefined ? products.filter(product => 
        product.productType.toLowerCase() === productType.toLowerCase() ||
        product.category.title.toLowerCase().includes(productType.toLowerCase())
      ) : products;
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-cream-50">
        <Hero type={productType || serviceType} isService={isService} />
        <section className="container py-16 md:py-24">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-brown mb-8 md:mb-12">BROWSE COLLECTION</h2>
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading...</div>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-cream-50">
        <Hero type={productType || serviceType} isService={isService} />
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
      <Hero type={productType || serviceType} isService={isService} />
      
      {/* Products/Services Section */}
      <section className="container py-16 md:py-24" id="collection">
        <h2 className="text-3xl md:text-4xl font-semibold text-center text-brown mb-8 md:mb-12">BROWSE COLLECTION</h2>
        <ProductGrid products={itemsToShow} isService={isService} />
      </section>
    </main>
  );
};

export default Homepage;