// Regex for validation
const REGEX_PATTERNS = {
  NAME: /^[a-zA-Z\s]+$/,
  LOCATION_NAME: /^[a-zA-Z\s\-']+$/,
  UAE_PHONE: /^(\+971|0)?(?:50|51|52|54|55|56|58)\d{7}$/,
  EMAIL: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
};

// Validation functions
export const validateContactName = (value) => {
  if (!value || value.trim().length === 0) {
    return 'Contact name is required';
  }
  if (value.trim().length < 2) {
    return 'Contact name must be at least 2 characters long';
  }
  if (value.trim().length > 50) {
    return 'Contact name cannot exceed 50 characters';
  }
  if (!REGEX_PATTERNS.NAME.test(value.trim())) {
    return 'Contact name can only contain letters and spaces';
  }
  return null;
};

export const validateGender = (value) => {
  if (!value) {
    return 'Gender is required';
  }
  if (!['male', 'female', 'other'].includes(value)) {
    return 'Gender must be male, female, or other';
  }
  return null;
};

export const validateStreetAddress = (value) => {
  if (!value || value.trim().length === 0) {
    return 'Street address is required';
  }
  if (value.trim().length < 5) {
    return 'Street address must be at least 5 characters long';
  }
  if (value.trim().length > 100) {
    return 'Street address cannot exceed 100 characters';
  }
  return null;
};

export const validateCity = (value) => {
  if (!value || value.trim().length === 0) {
    return 'City is required';
  }
  if (value.trim().length < 2) {
    return 'City must be at least 2 characters long';
  }
  if (value.trim().length > 50) {
    return 'City cannot exceed 50 characters';
  }
  if (!REGEX_PATTERNS.LOCATION_NAME.test(value.trim())) {
    return 'City can only contain letters, spaces, hyphens, and apostrophes';
  }
  return null;
};

export const validateState = (value) => {
  if (!value || value.trim().length === 0) {
    return 'State is required';
  }
  if (value.trim().length < 2) {
    return 'State must be at least 2 characters long';
  }
  if (value.trim().length > 50) {
    return 'State cannot exceed 50 characters';
  }
  if (!REGEX_PATTERNS.LOCATION_NAME.test(value.trim())) {
    return 'State can only contain letters, spaces, hyphens, and apostrophes';
  }
  return null;
};

export const validateCountry = (value) => {
  if (!value || value.trim().length === 0) {
    return 'Country is required';
  }
  if (!REGEX_PATTERNS.LOCATION_NAME.test(value.trim())) {
    return 'Country can only contain letters, spaces, hyphens, and apostrophes';
  }
  return null;
};

export const validateContactNumber = (value) => {
  if (!value || value.trim().length === 0) {
    return 'Contact number is required';
  }
  if (!REGEX_PATTERNS.UAE_PHONE.test(value.trim())) {
    return 'Please enter a valid UAE phone number (e.g., 0501234567)';
  }
  return null;
};

export const validateEmail = (value) => {
  if (!value || value.trim().length === 0) {
    return 'Email is required';
  }
  if (!REGEX_PATTERNS.EMAIL.test(value.trim())) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validatePetType = (value) => {
  if (!value || value.trim().length === 0) {
    return 'Pet type is required';
  }
  if (value.trim().length < 2) {
    return 'Pet type must be at least 2 characters long';
  }
  if (value.trim().length > 30) {
    return 'Pet type cannot exceed 30 characters';
  }
  if (!REGEX_PATTERNS.LOCATION_NAME.test(value.trim())) {
    return 'Pet type can only contain letters, spaces, hyphens, and apostrophes';
  }
  return null;
};

export const validatePetBreed = (value) => {
  if (!value || value.trim().length === 0) {
    return 'Pet breed is required';
  }
  if (value.trim().length < 2) {
    return 'Pet breed must be at least 2 characters long';
  }
  if (value.trim().length > 50) {
    return 'Pet breed cannot exceed 50 characters';
  }
  if (!REGEX_PATTERNS.LOCATION_NAME.test(value.trim())) {
    return 'Pet breed can only contain letters, spaces, hyphens, and apostrophes';
  }
  return null;
};

export const validateSlotId = (value) => {
  if (!value) {
    return 'Please select an appointment slot';
  }
  
  // Basic ObjectId format validation (24 character hex string)
  if (typeof value !== 'string' || !/^[0-9a-fA-F]{24}$/.test(value)) {
    return 'Invalid slot selection';
  }
  
  return null;
};

export const validateDetail = (value) => {
  if (value && value.trim().length > 500) {
    return 'Detail cannot exceed 500 characters';
  }
  return null;
};

export const validateAfterServiceRemarks = (value) => {
  if (value && value.trim().length > 500) {
    return 'After service remarks cannot exceed 500 characters';
  }
  return null;
};

export const validateAppointmentType = (value) => {
  if (!value) {
    return 'Appointment type is required';
  }
  if (!['urgent', 'normal'].includes(value)) {
    return 'Appointment type must be either urgent or normal';
  }
  return null;
};

// Comprehensive validation function for appointment form
export const validateAppointmentForm = (formData) => {
  const errors = {};

  // Validate each field
  const appointmentTypeError = validateAppointmentType(formData.appointmentType);
  if (appointmentTypeError) errors.appointmentType = appointmentTypeError;

  const contactNameError = validateContactName(formData.contactName);
  if (contactNameError) errors.contactName = contactNameError;

  const genderError = validateGender(formData.gender);
  if (genderError) errors.gender = genderError;

  const streetError = validateStreetAddress(formData.locationDetail?.street);
  if (streetError) errors.street = streetError;

  const cityError = validateCity(formData.locationDetail?.city);
  if (cityError) errors.city = cityError;

  const stateError = validateState(formData.locationDetail?.state);
  if (stateError) errors.state = stateError;

  const countryError = validateCountry(formData.locationDetail?.country);
  if (countryError) errors.country = countryError;

  const contactNumberError = validateContactNumber(formData.contactNumber);
  if (contactNumberError) errors.contactNumber = contactNumberError;

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const petTypeError = validatePetType(formData.petType);
  if (petTypeError) errors.petType = petTypeError;

  const petBreedError = validatePetBreed(formData.petBreed);
  if (petBreedError) errors.petBreed = petBreedError;

  const slotIdError = validateSlotId(formData.slotId);
  if (slotIdError) errors.slotId = slotIdError;

  const detailError = validateDetail(formData.detail);
  if (detailError) errors.detail = detailError;

  const afterServiceRemarksError = validateAfterServiceRemarks(formData.afterServiceRemarks);
  if (afterServiceRemarksError) errors.afterServiceRemarks = afterServiceRemarksError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validation functions for buying form
export const validateCustomerName = (value) => {
  if (!value || value.trim().length === 0) {
    return 'Customer name is required';
  }
  if (value.trim().length < 2) {
    return 'Customer name must be at least 2 characters long';
  }
  if (value.trim().length > 50) {
    return 'Customer name cannot exceed 50 characters';
  }
  if (!REGEX_PATTERNS.NAME.test(value.trim())) {
    return 'Customer name can only contain letters and spaces';
  }
  return null;
};

export const validateOrderType = (value) => {
  if (!value) {
    return 'Order type is required';
  }
  if (!['urgent', 'normal'].includes(value)) {
    return 'Order type must be either urgent or normal';
  }
  return null;
};

export const validateOrderNotes = (value) => {
  if (value && value.trim().length > 500) {
    return 'Order notes cannot exceed 500 characters';
  }
  return null;
};

// Comprehensive validation function for buying form
export const validateBuyingForm = (formData) => {
  const errors = {};

  // Validate each field
  const orderTypeError = validateOrderType(formData.orderType);
  if (orderTypeError) errors.orderType = orderTypeError;

  const customerNameError = validateCustomerName(formData.customerName);
  if (customerNameError) errors.customerName = customerNameError;

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const contactNumberError = validateContactNumber(formData.contactNumber);
  if (contactNumberError) errors.contactNumber = contactNumberError;

  // Delivery address validation
  const streetError = validateStreetAddress(formData.deliveryAddress?.street);
  if (streetError) errors.street = streetError;

  const cityError = validateCity(formData.deliveryAddress?.city);
  if (cityError) errors.city = cityError;

  const stateError = validateState(formData.deliveryAddress?.state);
  if (stateError) errors.state = stateError;

  const countryError = validateCountry(formData.deliveryAddress?.country);
  if (countryError) errors.country = countryError;

  const orderNotesError = validateOrderNotes(formData.orderNotes);
  if (orderNotesError) errors.orderNotes = orderNotesError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}; 