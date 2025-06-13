import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaEnvelope, FaPhone, FaPaw, FaStickyNote, FaMapMarkerAlt, FaVenusMars, FaCog } from 'react-icons/fa';
import Button from './Button';
import SlotSelector from './SlotSelector';
import { usePost } from '../../hooks/useApi';
import { validateAppointmentForm } from '../../utils/validation';

const BookingForm = ({ service, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    appointmentType: 'normal',
    contactName: '',
    gender: '',
    locationDetail: {
      street: '',
      city: '',
      state: '',
      country: 'UAE'
    },
    contactNumber: '',
    email: '',
    petType: '',
    petBreed: '',
    slotId: '', // Replace appointmentDate with slotId
    detail: '',
    afterServiceRemarks: ''
  });

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [bookingState, triggerBooking] = usePost('/appointments', {
    showSuccessToast: true,
    successMessage: 'Appointment booked successfully! You will receive a confirmation email.',
    onSuccess: (data) => {
      if (onSuccess) onSuccess(data);
      if (onClose) onClose();
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error for this field when user starts typing
    if (formErrors[name] || (name.startsWith('locationDetail.') && formErrors[name.split('.')[1]])) {
      const newErrors = { ...formErrors };
      if (name.startsWith('locationDetail.')) {
        delete newErrors[name.split('.')[1]];
      } else {
        delete newErrors[name];
      }
      setFormErrors(newErrors);
    }

    if (name.startsWith('locationDetail.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        locationDetail: {
          ...prev.locationDetail,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle slot selection
  const handleSlotSelect = (slot) => {
    console.log('Slot selected in BookingForm:', slot);
    setSelectedSlot(slot);
    setFormData(prev => ({
      ...prev,
      slotId: slot._id
    }));
    
    // Clear slot selection error if exists
    if (formErrors.slotId) {
      const newErrors = { ...formErrors };
      delete newErrors.slotId;
      setFormErrors(newErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Validate form data (now includes slotId validation)
    const validation = validateAppointmentForm(formData);
    
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    // Clear any previous errors
    setFormErrors({});

    try {
      await triggerBooking({
        ...formData,
        services: [service._id], // Auto-populate with current service
        // Note: Don't send appointmentDate when using slotId
      });
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const renderFieldError = (fieldName) => {
    if (formErrors[fieldName]) {
      return (
        <p className="text-red-500 text-xs mt-1">{formErrors[fieldName]}</p>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Book Appointment</h2>
              <p className="text-gray-600 mt-1">{service?.serviceName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Appointment Type */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaCog className="inline w-4 h-4 mr-2 text-primary-600" />
              Appointment Type
            </label>
            <select
              name="appointmentType"
              value={formData.appointmentType}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                formErrors.appointmentType ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
            </select>
            {renderFieldError('appointmentType')}
          </motion.div>

          {/* Contact Name and Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUser className="inline w-4 h-4 mr-2 text-primary-600" />
                Contact Name *
              </label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                  formErrors.contactName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
                required
              />
              {renderFieldError('contactName')}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaVenusMars className="inline w-4 h-4 mr-2 text-primary-600" />
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                  formErrors.gender ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {renderFieldError('gender')}
            </motion.div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaEnvelope className="inline w-4 h-4 mr-2 text-primary-600" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                  formErrors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email address"
                required
              />
              {renderFieldError('email')}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaPhone className="inline w-4 h-4 mr-2 text-primary-600" />
                Contact Number *
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                  formErrors.contactNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+971 50 123 4567"
                required
              />
              {renderFieldError('contactNumber')}
            </motion.div>
          </div>

          {/* Location Details */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <FaMapMarkerAlt className="inline w-4 h-4 mr-2 text-primary-600" />
              Location Details *
            </label>
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  name="locationDetail.street"
                  value={formData.locationDetail.street}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                    formErrors.street ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Street Address *"
                  required
                />
                {renderFieldError('street')}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    name="locationDetail.city"
                    value={formData.locationDetail.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                      formErrors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="City *"
                    required
                  />
                  {renderFieldError('city')}
                </div>
                <div>
                  <input
                    type="text"
                    name="locationDetail.state"
                    value={formData.locationDetail.state}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                      formErrors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="State/Emirate *"
                    required
                  />
                  {renderFieldError('state')}
                </div>
              </div>
              <div>
                <input
                  type="text"
                  name="locationDetail.country"
                  value={formData.locationDetail.country}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                    formErrors.country ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Country"
                />
                {renderFieldError('country')}
              </div>
            </div>
          </motion.div>

          {/* Pet Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaPaw className="inline w-4 h-4 mr-2 text-primary-600" />
                Pet Type *
              </label>
              <select
                name="petType"
                value={formData.petType}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                  formErrors.petType ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Select Pet Type</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="rabbit">Rabbit</option>
                <option value="other">Other</option>
              </select>
              {renderFieldError('petType')}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaPaw className="inline w-4 h-4 mr-2 text-primary-600" />
                Pet Breed *
              </label>
              <input
                type="text"
                name="petBreed"
                value={formData.petBreed}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                  formErrors.petBreed ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter pet breed"
                required
              />
              {renderFieldError('petBreed')}
            </motion.div>
          </div>

          {/* Appointment Slot Selection - Replace datetime input */}
          <motion.div variants={itemVariants}>
            <SlotSelector
              selectedSlotId={formData.slotId}
              onSlotSelect={handleSlotSelect}
              className={formErrors.slotId ? 'border border-red-500 rounded-lg p-4' : ''}
            />
            {renderFieldError('slotId')}
          </motion.div>

          {/* Additional Details */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaStickyNote className="inline w-4 h-4 mr-2 text-primary-600" />
              Additional Details
            </label>
            <textarea
              name="detail"
              value={formData.detail}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none ${
                formErrors.detail ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Any special requirements or notes..."
            />
            {renderFieldError('detail')}
          </motion.div>

          {/* Service Summary */}
          <motion.div variants={itemVariants} className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Service Summary</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Service:</span> {service?.serviceName}</p>
              <p><span className="font-medium">Type:</span> {service?.serviceType}</p>
              <p><span className="font-medium">Price:</span> AED {service?.servicePrice}</p>
              {service?.promotion?.isActive && (
                <p className="text-primary-600 font-medium">
                  Special Offer Available!
                </p>
              )}
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants} className="pt-4">
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 text-base font-semibold"
              disabled={bookingState.loading || isSubmitting}
            >
              {bookingState.loading || isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Booking...
                </div>
              ) : (
                'Book Appointment'
              )}
            </Button>
          </motion.div>

          {/* Error Display */}
          {bookingState.error && (
            <motion.div 
              variants={itemVariants}
              className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
            >
              {bookingState.error}
            </motion.div>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
};

export default BookingForm; 