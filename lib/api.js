const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function getAuthToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("authToken");
  }
  return null;
}

// Custom error class to match backend AppError format
class ApiError extends Error {
  constructor(message, statusCode, response = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.response = response;
    this.isOperational = true;
  }
}

// Extract meaningful error message from backend response
function extractErrorMessage(response, defaultMessage = "Something went wrong!") {
  try {
    // Check if response has JSON data
    if (response && typeof response === 'object') {
      // Handle AppError format from backend
      if (response.message) {
        return response.message;
      }
      
      // Handle validation errors
      if (response.errors && Array.isArray(response.errors)) {
        return response.errors.map(err => 
          err.message || err.msg || `${err.field || err.param}: ${err.message || err.msg}`
        ).join(', ');
      }
      
      // Handle other error formats
      if (response.error && typeof response.error === 'string') {
        return response.error;
      }
      
      if (response.detail) {
        return response.detail;
      }
    }
    
    return defaultMessage;
  } catch (e) {
    return defaultMessage;
  }
}

async function fetchRequest(url, options) {
  try {
    const response = await fetch(`${BASE_API_URL}${url}`, options);
    
    // Handle unauthorized responses
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem("authToken");
        window.location.href = '/login';
      }
      throw new ApiError("Session expired. Please login again.", 401, response);
    }
    
    // Handle other non-ok responses
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // If JSON parsing fails, create a generic error
        errorData = { 
          message: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status >= 400 && response.status < 500 ? 'fail' : 'error'
        };
      }
      
      const errorMessage = extractErrorMessage(errorData, `Request failed with status ${response.status}`);
      throw new ApiError(errorMessage, response.status, response);
    }
    
    // Handle successful responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    // For non-JSON responses, return text or status
    const text = await response.text();
    return text || { success: true, status: response.status };
    
  } catch (error) {
    // Re-throw ApiError instances as-is
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Handle network errors and other exceptions
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new ApiError("Network error - please check your internet connection", 0);
    }
    
    // Handle other unexpected errors
    throw new ApiError(
      error.message || "An unexpected error occurred", 
      error.statusCode || 500
    );
  }
}

// for get request
export async function get(url) {
  const authToken = getAuthToken();

  return fetchRequest(url, {
    method: "GET",
    headers: {
      "Authorization": authToken ? `Bearer ${authToken}` : "",
      "Content-Type": "application/json"
    },
  });
}

// for post request
export async function post(url, body) {
  const authToken = getAuthToken();

  return fetchRequest(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": authToken ? `Bearer ${authToken}` : "",
    },
    body: JSON.stringify(body),
  });
}

// for put request
export async function put(url, body) {
  const authToken = getAuthToken();

  return fetchRequest(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": authToken ? `Bearer ${authToken}` : "",
    },
    body: JSON.stringify(body),
  });
}

// for patch request
export async function patch(url, body) {
  const authToken = getAuthToken();

  return fetchRequest(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": authToken ? `Bearer ${authToken}` : "",
    },
    body: JSON.stringify(body),
  });
}

// for delete request
export async function del(url) {
  const authToken = getAuthToken();

  return fetchRequest(url, { 
    method: "DELETE",
    headers: {
      "Authorization": authToken ? `Bearer ${authToken}` : "",
      "Content-Type": "application/json"
    }
  });
}

// Export the custom error class for use in other modules
export { ApiError };
