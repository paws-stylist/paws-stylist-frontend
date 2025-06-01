'use client'
import React from 'react'
import SingleProductCard from './SingleProductCard'
import { useGet } from '../../hooks/useApi'

// Sample data for products - Pet focused
const sampleProducts = {
  'walking-gear': {
    'diamond-studded-collar': {
      productCode: 'LC001',
      productDetail: 'Exquisite handcrafted leather collar adorned with genuine Swarovski crystals. Premium Italian leather with gold-plated hardware, perfect for sophisticated pets who deserve the finest.',
      productType: 'walking-gear',
      barcode: '1234567890123',
      brand: 'PawsLux Couture',
      category: 'Pet Accessories',
      subCategory: 'Luxury Collars',
      unit: 'piece',
      pack: '1',
      costPrice: 180,
      salePrice: 349,
      promotion: true,
      promotionPrice: 279,
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      taxRate: 18,
      productImages: [
        'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop'
      ],
      productVariants: ['Small (10-12")', 'Medium (13-16")', 'Large (17-20")', 'Extra Large (21-24")'],
      message: 'Free personalized engraving included. Handcrafted by artisans. 30-day satisfaction guarantee.'
    }
  },
  'toys': {
    'luxury-plush-set': {
      productCode: 'PT001',
      productDetail: 'Premium organic cotton plush toy collection with natural filling. Each toy is carefully crafted with attention to detail, featuring safe, non-toxic materials perfect for discerning pet parents.',
      productType: 'toys',
      barcode: '9876543210987',
      brand: 'PawsPlay Elite',
      category: 'Pet Toys',
      subCategory: 'Plush Collection',
      unit: 'set',
      pack: '3 pieces',
      costPrice: 45,
      salePrice: 89,
      promotion: false,
      promotionPrice: null,
      startDate: null,
      endDate: null,
      taxRate: 12,
      productImages: [
        'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop'
      ],
      productVariants: ['Small Dogs', 'Medium Dogs', 'Large Dogs', 'Multi-Size Set'],
      message: 'Made with certified organic materials. Machine washable. Perfect for sensitive pets.'
    }
  }
}

// Sample data for services - Pet focused
const sampleServices = {
  'home-grooming': {
    'royal-spa-experience': {
      serviceType: 'grooming',
      serviceCode: 'GR001',
      serviceName: 'Royal Spa Experience',
      serviceDetail: 'The ultimate pampering experience for your beloved companion. Includes aromatherapy bath, premium conditioning treatment, nail care, ear cleaning, and professional styling by certified groomers.',
      servicePrice: 299,
      promotion: true,
      promotionPrice: 229,
      startDate: '2024-01-01',
      endDate: '2024-02-29',
      serviceImages: [
        'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=600&fit=crop'
      ]
    }
  },
  'veterinary': {
    'premium-wellness-package': {
      serviceType: 'veterinary',
      serviceCode: 'VET001',
      serviceName: 'Premium Wellness Package',
      serviceDetail: 'Comprehensive health assessment by board-certified veterinarians. Includes full examination, vaccinations, blood work, dental check, and personalized health plan with follow-up consultations.',
      servicePrice: 499,
      promotion: false,
      promotionPrice: null,
      startDate: null,
      endDate: null,
      serviceImages: [
        'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=600&fit=crop'
      ]
    }
  }
}

const Homepage = ({ params, type }) => {
  // Extract URL parameters
  const isProduct = type === 'product'
  const isService = type === 'service'
  
  // Fetch data from API
  const { data: products, loading: productsLoading, error: productsError } = useGet('/products');
  const { data: services, loading: servicesLoading, error: servicesError } = useGet('/services');

  let data = null
  let loading = false
  let error = null

  if (isProduct && params) {
    loading = productsLoading
    error = productsError
    const productType = params['product-type']
    const product = params['product']
    
    if (products) {
      // Find product by matching URL parameters with product data
      data = products.find(p => 
        p.productType.toLowerCase().replace(/\s+/g, '-') === productType &&
        p.productDetail.toLowerCase().replace(/\s+/g, '-').includes(product)
      ) || products.find(p => 
        p.productCode.toLowerCase() === product ||
        p.productDetail.toLowerCase().includes(product.replace(/-/g, ' '))
      )
    }
  } else if (isService && params) {
    loading = servicesLoading
    error = servicesError
    const serviceType = params['service-type']
    const service = params['service']
    
    if (services) {
      // Find service by matching URL parameters with service data
      data = services.find(s => 
        s.serviceType.toLowerCase().replace(/\s+/g, '-') === serviceType &&
        s.serviceName.toLowerCase().replace(/\s+/g, '-').includes(service)
      ) || services.find(s => 
        s.serviceCode?.toLowerCase() === service ||
        s.serviceName.toLowerCase().includes(service.replace(/-/g, ' '))
      )
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-20 sm:pt-24 md:pt-28 lg:pt-32 flex items-center justify-center bg-gradient-to-br from-cream-50 to-cream-100">
        <div className="text-center space-y-4 px-4">
          <div className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Loading...</div>
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
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen pt-20 sm:pt-24 md:pt-28 lg:pt-32 flex items-center justify-center bg-gradient-to-br from-cream-50 to-cream-100">
        <div className="text-center space-y-4 px-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Item Not Found</h1>
          <p className="text-gray-600 text-sm sm:text-base">The requested {type} could not be found.</p>
          
          <div className="mt-6 text-xs sm:text-sm text-gray-500">
            <p className="mb-2">Please check the URL or browse our collection:</p>
            <div className="space-y-1">
              <p><a href="/products/all" className="text-primary hover:underline">Browse All Products</a></p>
              <p><a href="/services/all" className="text-primary hover:underline">Browse All Services</a></p>
            </div>
          </div>
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