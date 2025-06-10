'use client'
import React from 'react'
import SingleProductCard from './SingleProductCard'
import { useGet } from '../../hooks/useApi'

const Homepage = ({ params, type }) => {  
  // Extract URL parameters
  const isProduct = type === 'product'
  const isService = type === 'service'
  
  // Get the slug from params
  const slug = isProduct ? params?.product : params?.service;
  const categoryType = isProduct ? params?.['product-type'] : params?.['service-type'];
    
  // Fetch data from API - get all items then filter by slug
  const { data: allProducts, loading: productsLoading, error: productsError } = useGet('/products', {
    immediate: isProduct,
    showErrorToast: false
  });
  
  const { data: allServices, loading: servicesLoading, error: servicesError } = useGet('/services', {
    immediate: isService,
    showErrorToast: false
  });

  let data = null
  let loading = false
  let error = null

  if (isProduct) {
    loading = productsLoading
    error = productsError
        
    if (allProducts && Array.isArray(allProducts) && slug) {
      // Find product by matching slug first
      data = allProducts.find(p => p.slug === slug);
      
      // Fallback: try to find by name or other fields if slug doesn't match
      if (!data) {
        data = allProducts.find(p => 
          (p.name && p.name.toLowerCase().replace(/\s+/g, '-') === slug) ||
          (p.title && p.title.toLowerCase().replace(/\s+/g, '-') === slug) ||
          (p.productDetail && p.productDetail.toLowerCase().replace(/\s+/g, '-') === slug)
        );
      }
    }
    
    // Ensure we have a valid product object, not a category
    if (data && !data.productDetail && !data.name && !data.salePrice) {
      data = null; // Reset if it's not a product object
    }
  } else if (isService) {
    loading = servicesLoading
    error = servicesError
    
    if (allServices && Array.isArray(allServices) && slug) {
      // Find service by matching slug first
      data = allServices.find(s => s.slug === slug);
      
      // Fallback: try to find by name or other fields if slug doesn't match
      if (!data) {
        data = allServices.find(s => 
          (s.name && s.name.toLowerCase().replace(/\s+/g, '-') === slug) ||
          (s.title && s.title.toLowerCase().replace(/\s+/g, '-') === slug) ||
          (s.serviceName && s.serviceName.toLowerCase().replace(/\s+/g, '-') === slug)
        );
      }
    }
    
    // Ensure we have a valid service object, not a category
    if (data && !data.serviceName && !data.serviceDetail && !data.servicePrice) {
      console.error('Found object is not a valid service:', data);
      data = null; // Reset if it's not a service object
    }
  }


  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-20 sm:pt-24 md:pt-28 lg:pt-32 flex items-center justify-center bg-gradient-to-br from-cream-50 to-cream-100">
        <div className="text-center space-y-4 px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <div className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Loading {type}...</div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen pt-20 sm:pt-24 md:pt-28 lg:pt-32 flex items-center justify-center bg-gradient-to-br from-cream-50 to-cream-100">
        <div className="text-center space-y-4 px-4">
          <h1 className="text-xl sm:text-2xl font-bold text-red-600 mb-4">Error Loading Data</h1>
          <p className="text-gray-600 text-sm sm:text-base">{error}</p>
          <div className="mt-6">
            <a 
              href={isProduct ? '/products' : '/services'} 
              className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Back to {isProduct ? 'Products' : 'Services'}
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen pt-20 sm:pt-24 md:pt-28 lg:pt-32 flex items-center justify-center bg-gradient-to-br from-cream-50 to-cream-100">
        <div className="text-center space-y-4 px-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
            {isProduct ? 'Product' : 'Service'} Not Found
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            The requested {type} with slug "{slug}" could not be found.
          </p>
          
          <div className="mt-6 space-y-4">
            <div className="text-xs sm:text-sm text-gray-500">
              <p className="mb-2">Please check the URL or browse our collection:</p>
              <div className="space-y-2">
                <p>
                  <a 
                    href={`/${isProduct ? 'products' : 'services'}/${categoryType}`} 
                    className="text-primary hover:underline"
                  >
                    Browse {categoryType} {isProduct ? 'Products' : 'Services'}
                  </a>
                </p>
                <p>
                  <a 
                    href={isProduct ? '/products' : '/services'} 
                    className="text-primary hover:underline"
                  >
                    Browse All {isProduct ? 'Products' : 'Services'}
                  </a>
                </p>
                <p>
                  <a 
                    href="/" 
                    className="text-primary hover:underline"
                  >
                    Go to Homepage
                  </a>
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <a 
                href={isProduct ? '/products' : '/services'} 
                className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Back to {isProduct ? 'Products' : 'Services'}
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Ensure data is a valid product/service object before passing to SingleProductCard
  if (typeof data !== 'object' || data === null) {
    console.error('Invalid data type for SingleProductCard:', typeof data, data);
    return (
      <div className="min-h-screen pt-20 sm:pt-24 md:pt-28 lg:pt-32 flex items-center justify-center bg-gradient-to-br from-cream-50 to-cream-100">
        <div className="text-center space-y-4 px-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Invalid Data</h1>
          <p className="text-gray-600 text-sm sm:text-base">The data format is not valid for display.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-300 via-cream-100 to-primary-50">
      <SingleProductCard data={data} type={type} params={params} />
    </div>
  )
}

export default Homepage