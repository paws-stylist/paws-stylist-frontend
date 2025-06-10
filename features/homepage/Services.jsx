import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Select from '../../components/ui/Select';
import ImageSlider from '../../components/ui/ImageSlider';
import Button from '../../components/ui/Button';
import BookingForm from '../../components/ui/BookingForm';
import { useGet } from '../../hooks/useApi';

const serviceTypes = [
  { value: "grooming", label: "Grooming" },
  { value: "medical", label: "Medical" },
  { value: "daycare", label: "Day Care" },
  { value: "consultation", label: "Consultation" },
  { value: "wellness", label: "Wellness" }
];

const Services = () => {
  const [selectedTypeValue, setSelectedTypeValue] = useState(serviceTypes[0].value);
  const [selectedService, setSelectedService] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  
  // Fetch services from API
  const { data: services, loading, error } = useGet('/services');
  
  // Filter services by type
  const servicesOfType = services ? services.filter(
    service => service.serviceType.toLowerCase() === selectedTypeValue.toLowerCase()
  ) : [];

  // Update selected service when type changes or services load
  useEffect(() => {
    if (servicesOfType.length > 0 && !selectedService) {
      setSelectedService(servicesOfType[0]);
    }
  }, [servicesOfType, selectedService]);

  const handleTypeChange = (newValue) => {
    setSelectedTypeValue(newValue);
    const filteredServices = services ? services.filter(service => service.serviceType.toLowerCase() === newValue.toLowerCase()) : [];
    setSelectedService(filteredServices[0] || null);
  };

  const handleBookingSuccess = (bookingData) => {
    setShowBookingForm(false);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="my-12 mx-4 md:mx-16 lg:mx-32 xl:mx-64 bg-cream-100 rounded-xl">
        <div className="flex items-center justify-center h-96">
          <div className="text-lg text-gray-600">Loading services...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="my-12 mx-4 md:mx-16 lg:mx-32 xl:mx-64 bg-cream-100 rounded-xl">
        <div className="flex items-center justify-center h-96">
          <div className="text-lg text-red-600">Error loading services: {error}</div>
        </div>
      </div>
    );
  }

  // Show no services state
  if (!services || services.length === 0) {
    return (
      <div className="my-12 mx-4 md:mx-16 lg:mx-32 xl:mx-64 bg-cream-100 rounded-xl">
        <div className="flex items-center justify-center h-96">
          <div className="text-lg text-gray-600">No services available</div>
        </div>
      </div>
    );
  }

  // Show no services for selected type
  if (servicesOfType.length === 0) {
    return (
      <div className="my-12 mx-4 md:mx-16 lg:mx-32 xl:mx-64 bg-cream-100 rounded-xl">
        <div className="flex items-center justify-center h-96">
          <div className="text-lg text-gray-600">No services available for {selectedTypeValue}</div>
        </div>
      </div>
    );
  }

  if (!selectedService) {
    return null;
  }

  // Calculate current price based on promotion - updated for new structure
  const hasPromotion = selectedService.promotion?.isActive;
  const currentPrice = selectedService.servicePrice;
  const displayPrice = currentPrice; // Since there's no promotionPrice in the new structure
  const savings = 0; // No savings calculation without promotionPrice

  return (
    <>
      <div className="my-12 mx-4 md:mx-16 lg:mx-32 xl:mx-64 bg-cream-100 rounded-xl" id="services">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left side - Image Gallery */}
          <div className="relative w-full h-full lg:w-[55%]">
            <ImageSlider
              images={selectedService.serviceImages && selectedService.serviceImages.length > 0 ? selectedService.serviceImages : ['/shop-beds.webp']}
              containerClassName="rounded-lg"
              mainImageClassName="rounded-l-xl"
            />
          </div>

          {/* Right side - Service Details */}
          <div className="relative w-full lg:w-[45%] h-full">
            <div className="space-y-6 p-6">
              <Select
                options={serviceTypes.map(type => ({
                  value: type.value,
                  label: type.label
                }))}
                value={selectedTypeValue}
                onChange={handleTypeChange}
                containerClassName="w-full"
                className="!bg-white/70 shadow-sm"
              />

              <div className="space-y-1">
                <div className="flex items-baseline gap-4 flex-wrap">
                  <span className="text-4xl font-bold text-primary tracking-tight">
                    Dhs. {displayPrice}
                  </span>
                  {hasPromotion && (
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      SPECIAL OFFER
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-700">SELECT SERVICE</h3>
                <div className="flex flex-wrap gap-2.5">
                  {servicesOfType.map((service) => (
                    <div
                      key={service._id}
                      className={`px-4 py-2.5 rounded-xl border-2 transition-all duration-300 cursor-pointer text-sm
                        ${selectedService._id === service._id
                          ? 'border-primary bg-primary/5 text-primary font-medium' 
                          : 'border-cream-200 hover:border-primary/30 text-gray-600 hover:bg-cream-50'
                        }`}
                      onClick={() => setSelectedService(service)}
                    >
                      {service.serviceName}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="primary"
                  className="flex-1 !py-3 text-sm font-medium"
                  onClick={() => setShowBookingForm(true)}
                >
                  <FaShoppingCart className="w-4 h-4" />
                  BOOK NOW
                </Button>
                <Link href={`/services/${selectedService.serviceType.toLowerCase()}/${selectedService.serviceName.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Button 
                    variant="outline"
                    className="flex-1 !py-3 text-sm font-medium"
                  >
                    VIEW DETAILS
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      <AnimatePresence>
        {showBookingForm && (
          <BookingForm
            service={selectedService}
            onClose={() => setShowBookingForm(false)}
            onSuccess={handleBookingSuccess}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Services;