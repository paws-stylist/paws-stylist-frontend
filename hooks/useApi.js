import { useState, useEffect, useCallback } from "react";
import { del, get, post, put, patch } from "../lib/api";
import { useError } from "../contexts/ErrorContext";

// for get requests with auto-refetch capability
export function useGet(url, options = {}) {
  const { 
    immediate = true, 
    showErrorToast = true,
    onSuccess,
    onError 
  } = options;
  
  const [state, setState] = useState({
    data: null,
    error: null,
    loading: immediate,
  });
  
  const { showError: showErrorToast_ } = useError();

  const fetchData = useCallback(async (showLoader = true) => {
    if (showLoader) {
      setState(prev => ({ ...prev, loading: true, error: null }));
    }
    
    try {
      const data = await get(url);
      setState({ data, error: null, loading: false });
      
      if (onSuccess) {
        onSuccess(data);
      }
      
      return data;
    } catch (error) {
      const errorMessage = error?.message || "An unknown error occurred";
      setState({
        data: null,
        error: errorMessage,
        loading: false,
      });
      
      if (showErrorToast) {
        showErrorToast_(error);
      }
      
      if (onError) {
        onError(error);
      }
      
      throw error;
    }
  }, [url, showErrorToast, showErrorToast_, onSuccess, onError]);

  // Auto-fetch on mount if immediate is true
  useEffect(() => {
    if (immediate && url) {
      fetchData();
    }
  }, [immediate, fetchData]);

  // Return state with refetch function
  return {
    ...state,
    refetch: fetchData,
    mutate: (newData) => setState(prev => ({ ...prev, data: newData }))
  };
}

// for post requests with enhanced error handling
export function usePost(url, options = {}) {
  const { 
    showErrorToast = true, 
    showSuccessToast = false,
    successMessage = "Operation completed successfully",
    onSuccess,
    onError 
  } = options;
  
  const [state, setState] = useState({
    data: null,
    error: null,
    loading: false,
  });
  
  const { showError, showSuccess } = useError();

  const triggerPostRequest = useCallback(async (body) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await post(url, body);
      setState({ data, error: null, loading: false });
      
      if (showSuccessToast) {
        showSuccess(successMessage);
      }
      
      if (onSuccess) {
        onSuccess(data);
      }
      
      return data;
    } catch (error) {
      const errorMessage = error?.message || "An unknown error occurred";
      setState({
        data: null,
        error: errorMessage,
        loading: false,
      });
      
      if (showErrorToast) {
        showError(error);
      }
      
      if (onError) {
        onError(error);
      }
      
      throw error;
    }
  }, [url, showErrorToast, showSuccessToast, successMessage, showError, showSuccess, onSuccess, onError]);

  return [state, triggerPostRequest];
}

// for put requests with enhanced error handling
export function usePut(url, options = {}) {
  const { 
    showErrorToast = true, 
    showSuccessToast = false,
    successMessage = "Updated successfully",
    onSuccess,
    onError 
  } = options;
  
  const [state, setState] = useState({
    data: null,
    error: null,
    loading: false,
  });
  
  const { showError, showSuccess } = useError();

  const triggerPutRequest = useCallback(async (body) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await put(url, body);
      setState({ data, error: null, loading: false });
      
      if (showSuccessToast) {
        showSuccess(successMessage);
      }
      
      if (onSuccess) {
        onSuccess(data);
      }
      
      return data;
    } catch (error) {
      const errorMessage = error?.message || "An unknown error occurred";
      setState({
        data: null,
        error: errorMessage,
        loading: false,
      });
      
      if (showErrorToast) {
        showError(error);
      }
      
      if (onError) {
        onError(error);
      }
      
      throw error;
    }
  }, [url, showErrorToast, showSuccessToast, successMessage, showError, showSuccess, onSuccess, onError]);

  return [state, triggerPutRequest];
}

// for patch requests with enhanced error handling
export function usePatch(url, options = {}) {
  const { 
    showErrorToast = true, 
    showSuccessToast = false,
    successMessage = "Updated successfully",
    onSuccess,
    onError 
  } = options;
  
  const [state, setState] = useState({
    data: null,
    error: null,
    loading: false,
  });
  
  const { showError, showSuccess } = useError();

  const triggerPatchRequest = useCallback(async (body) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await patch(url, body);
      setState({ data, error: null, loading: false });
      
      if (showSuccessToast) {
        showSuccess(successMessage);
      }
      
      if (onSuccess) {
        onSuccess(data);
      }
      
      return data;
    } catch (error) {
      const errorMessage = error?.message || "An unknown error occurred";
      setState({
        data: null,
        error: errorMessage,
        loading: false,
      });
      
      if (showErrorToast) {
        showError(error);
      }
      
      if (onError) {
        onError(error);
      }
      
      throw error;
    }
  }, [url, showErrorToast, showSuccessToast, successMessage, showError, showSuccess, onSuccess, onError]);

  return [state, triggerPatchRequest];
}

// for delete requests with enhanced error handling
export function useDelete(url, options = {}) {
  const { 
    showErrorToast = true, 
    showSuccessToast = false,
    successMessage = "Deleted successfully",
    onSuccess,
    onError 
  } = options;
  
  const [state, setState] = useState({
    data: null,
    error: null,
    loading: false,
  });
  
  const { showError, showSuccess } = useError();

  const triggerDeleteRequest = useCallback(async (id) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await del(`${url}/${id}`);
      setState({ data, error: null, loading: false });
      
      if (showSuccessToast) {
        showSuccess(successMessage);
      }
      
      if (onSuccess) {
        onSuccess(data, id);
      }
      
      return data;
    } catch (error) {
      const errorMessage = error?.message || "An unknown error occurred";
      setState({
        data: null,
        error: errorMessage,
        loading: false,
      });
      
      if (showErrorToast) {
        showError(error);
      }
      
      if (onError) {
        onError(error);
      }
      
      throw error;
    }
  }, [url, showErrorToast, showSuccessToast, successMessage, showError, showSuccess, onSuccess, onError]);

  return [state, triggerDeleteRequest];
}

// Generic API hook for custom operations
export function useApiCall(apiFunction, options = {}) {
  const { 
    showErrorToast = true, 
    showSuccessToast = false,
    successMessage = "Operation completed successfully",
    onSuccess,
    onError 
  } = options;
  
  const [state, setState] = useState({
    data: null,
    error: null,
    loading: false,
  });
  
  const { showError, showSuccess } = useError();

  const execute = useCallback(async (...args) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await apiFunction(...args);
      setState({ data, error: null, loading: false });
      
      if (showSuccessToast) {
        showSuccess(successMessage);
      }
      
      if (onSuccess) {
        onSuccess(data);
      }
      
      return data;
    } catch (error) {
      const errorMessage = error?.message || "An unknown error occurred";
      setState({
        data: null,
        error: errorMessage,
        loading: false,
      });
      
      if (showErrorToast) {
        showError(error);
      }
      
      if (onError) {
        onError(error);
      }
      
      throw error;
    }
  }, [apiFunction, showErrorToast, showSuccessToast, successMessage, showError, showSuccess, onSuccess, onError]);

  return [state, execute];
}
