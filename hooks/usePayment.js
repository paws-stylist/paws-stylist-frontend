import { useState, useCallback } from 'react';
import { usePost, useGet } from './useApi';
import { put, get } from '../lib/api';
import { 
  createOrderData, 
  formatCustomerInfoForStripe, 
  formatBillingAddressForStripe,
  getPaymentErrorMessage 
} from '../utils/payment';
import toast from 'react-hot-toast';

// Hook for creating payment intent
export const useCreatePaymentIntent = () => {
  const [createPaymentState, triggerCreatePayment] = usePost('/payments/create-payment-intent', {
    showErrorToast: false,
    showSuccessToast: false
  });

  const createPaymentIntent = useCallback(async (orderId, customerInfo, billingAddress) => {
    try {
      const stripeCustomerInfo = formatCustomerInfoForStripe(customerInfo, billingAddress);
      const stripeBillingAddress = formatBillingAddressForStripe(billingAddress);

      const response = await triggerCreatePayment({
        orderId,
        customerInfo: stripeCustomerInfo,
        billingAddress: stripeBillingAddress
      });

      return response;
    } catch (error) {
      const errorMessage = getPaymentErrorMessage(error);
      toast.error(errorMessage);
      throw error;
    }
  }, [triggerCreatePayment]);

  return {
    ...createPaymentState,
    createPaymentIntent
  };
};

// Hook for confirming payment
export const useConfirmPayment = () => {
  const [confirmPaymentState, triggerConfirmPayment] = usePost('/payments/confirm-payment', {
    showErrorToast: false,
    showSuccessToast: false
  });

  const confirmPayment = useCallback(async (paymentIntentId, paymentMethodId) => {
    try {
      const response = await triggerConfirmPayment({
        paymentIntentId,
        paymentMethodId
      });

      return response;
    } catch (error) {
      const errorMessage = getPaymentErrorMessage(error);
      toast.error(errorMessage);
      throw error;
    }
  }, [triggerConfirmPayment]);

  return {
    ...confirmPaymentState,
    confirmPayment
  };
};

// Hook for getting payment status
export const usePaymentStatus = (paymentIntentId) => {
  const paymentStatusState = useGet(
    paymentIntentId ? `/payments/status/${paymentIntentId}` : null,
    {
      immediate: !!paymentIntentId,
      showErrorToast: false
    }
  );

  return paymentStatusState;
};

// Hook for getting payment configuration
export const usePaymentConfig = () => {
  const configState = useGet('/payments/config', {
    immediate: true,
    showErrorToast: false
  });

  return configState;
};

// Hook for creating orders
export const useCreateOrder = () => {
  const [createOrderState, triggerCreateOrder] = usePost('/orders', {
    showErrorToast: false,
    showSuccessToast: false
  });

  const createOrder = useCallback(async (cartItems, customerInfo, billingAddress) => {
    try {
      const orderData = createOrderData(cartItems, customerInfo, billingAddress);
      const response = await triggerCreateOrder(orderData);
      return response;
    } catch (error) {
      toast.error('Failed to create order. Please try again.');
      throw error;
    }
  }, [triggerCreateOrder]);

  return {
    ...createOrderState,
    createOrder
  };
};

// Hook for processing refunds
export const useProcessRefund = () => {
  const [refundState, triggerRefund] = usePost('/payments/refund', {
    showErrorToast: false,
    showSuccessToast: false
  });

  const processRefund = useCallback(async (paymentId, amount = null, reason = 'requested_by_customer') => {
    try {
      const response = await triggerRefund({
        paymentId,
        amount,
        reason
      });

      toast.success('Refund processed successfully');
      return response;
    } catch (error) {
      const errorMessage = getPaymentErrorMessage(error);
      toast.error(errorMessage);
      throw error;
    }
  }, [triggerRefund]);

  return {
    ...refundState,
    processRefund
  };
};

// Hook for getting order payments
export const useOrderPayments = (orderId) => {
  const orderPaymentsState = useGet(
    orderId ? `/payments/order/${orderId}` : null,
    {
      immediate: !!orderId,
      showErrorToast: false
    }
  );

  return orderPaymentsState;
};

// Hook for getting payment statistics
export const usePaymentStatistics = (startDate, endDate) => {
  const queryParams = new URLSearchParams();
  if (startDate) queryParams.append('startDate', startDate);
  if (endDate) queryParams.append('endDate', endDate);
  
  const url = `/payments/statistics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const statisticsState = useGet(url, {
    immediate: !!(startDate && endDate),
    showErrorToast: false
  });

  return statisticsState;
};

// Hook for updating order status
export const useUpdateOrderStatus = () => {
  const updateOrderStatus = useCallback(async (orderId, status, remarks = '') => {
    try {
      // Use the correct API endpoint structure: PUT /orders/:id/status
      const response = await put(`/orders/${orderId}/status`, {
        status,
        remarks
      });

      return response;
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
    }
  }, []);

  return {
    updateOrderStatus
  };
};

// Hook for creating cash on delivery orders
export const useCreateCashOnDeliveryOrder = () => {
  const [createOrderState, triggerCreateOrder] = usePost('/orders', {
    showErrorToast: false,
    showSuccessToast: false
  });

  const createCashOnDeliveryOrder = useCallback(async (cartItems, customerInfo, billingAddress) => {
    // Add debug logging to identify duplicate calls
    console.log('🛒 Creating cash on delivery order...', {
      timestamp: new Date().toISOString(),
      customerName: customerInfo.name,
      itemCount: cartItems.length
    });

    try {
      const orderData = createOrderData(cartItems, customerInfo, billingAddress);
      // Override payment method and status for cash on delivery
      orderData.paymentMethod = 'cash_on_delivery';
      orderData.paymentStatus = 'pending';
      
      console.log('📦 Order data prepared:', {
        orderData: {
          ...orderData,
          // Don't log sensitive info, just structure
          customerName: orderData.customerName,
          email: orderData.email,
          paymentMethod: orderData.paymentMethod,
          totalAmount: orderData.totalAmount,
          productCount: orderData.products.length
        }
      });
      
      const response = await triggerCreateOrder(orderData);
      
      console.log('✅ Cash on delivery order created successfully:', {
        orderId: response.data?._id || response.data?.id,
        timestamp: new Date().toISOString()
      });
      
      return response;
    } catch (error) {
      console.error('❌ Cash on delivery order creation failed:', {
        error: error.message,
        timestamp: new Date().toISOString(),
        customerName: customerInfo.name
      });
      
      toast.error('Failed to create order. Please try again.');
      throw error;
    }
  }, [triggerCreateOrder]);

  return {
    ...createOrderState,
    createCashOnDeliveryOrder
  };
};

// Complete payment flow hook
export const useCompletePaymentFlow = () => {
  const [state, setState] = useState({
    currentStep: 'order', // 'order', 'payment', 'confirmation'
    orderId: null,
    paymentIntentId: null,
    clientSecret: null,
    error: null,
    loading: false
  });

  const { createOrder } = useCreateOrder();
  const { createPaymentIntent } = useCreatePaymentIntent();
  const { confirmPayment } = useConfirmPayment();
  const { updateOrderStatus } = useUpdateOrderStatus();

  const startPaymentFlow = useCallback(async (cartItems, customerInfo, billingAddress) => {
    setState(prev => ({ ...prev, loading: true, error: null, currentStep: 'order' }));

    try {
      // Step 1: Create order first to get the MongoDB orderId
      const orderResponse = await createOrder(cartItems, customerInfo, billingAddress);
      console.log('Order response:', orderResponse);
      
      // Extract orderId - try different possible response structures
      const orderId = orderResponse.data?._id || 
                     orderResponse.data?.id || 
                     orderResponse._id || 
                     orderResponse.order._id;

      if (!orderId) {
        console.error('Order creation response:', orderResponse);
        throw new Error('Failed to get order ID from order creation response');
      }

      setState(prev => ({ 
        ...prev, 
        orderId, 
        currentStep: 'payment' 
      }));

      // Step 2: Create payment intent using the orderId
      const paymentResponse = await createPaymentIntent(orderId, customerInfo, billingAddress);
      
      const paymentIntentId = paymentResponse.data?.paymentIntentId || paymentResponse.paymentIntentId;
      const clientSecret = paymentResponse.data?.clientSecret || paymentResponse.clientSecret;

      if (!clientSecret) {
        console.error('Payment intent response:', paymentResponse);
        throw new Error('Failed to get client secret from payment intent response');
      }

      setState(prev => ({ 
        ...prev, 
        paymentIntentId,
        clientSecret,
        loading: false
      }));

      return {
        orderId,
        paymentIntentId,
        clientSecret
      };

    } catch (error) {
      console.error('Payment flow error:', error);
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'Payment initialization failed',
        loading: false
      }));
      throw error;
    }
  }, [createOrder, createPaymentIntent]);

  // New method to confirm payment after Stripe confirmation
  const confirmPaymentSuccess = useCallback(async (paymentData) => {
    if (!state.paymentIntentId) {
      throw new Error('No payment intent ID available for confirmation');
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Call the confirm-payment API to update the order status
      // paymentData should have { id: paymentIntentId, payment_method: paymentMethodId }
      const confirmResponse = await confirmPayment(
        paymentData.id || state.paymentIntentId, 
        paymentData.payment_method
      );

      setState(prev => ({ 
        ...prev, 
        currentStep: 'confirmation',
        loading: false
      }));

      return confirmResponse;

    } catch (error) {
      console.error('Payment confirmation error:', error);
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'Payment confirmation failed',
        loading: false
      }));
      throw error;
    }
  }, [state.paymentIntentId, confirmPayment]);

  // Method to handle payment failures and update order status
  const handlePaymentFailure = useCallback(async (error, paymentIntent = null) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.error('Payment failed for order:', state.orderId, 'Error:', error);
      
      // Update order status to 'cancelled' when payment fails
      if (state.orderId) {
        try {
          await updateOrderStatus(state.orderId, 'cancelled', `Payment failed: ${error.message}`);
          console.log('Order status updated to cancelled due to payment failure');
        } catch (statusUpdateError) {
          console.error('Failed to update order status to cancelled:', statusUpdateError);
          // Don't throw here, as the main error is the payment failure
        }
      }
      
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'Payment failed',
        loading: false
      }));
      
      return { success: false, error: error.message };

    } catch (updateError) {
      console.error('Error handling payment failure:', updateError);
      setState(prev => ({ 
        ...prev, 
        error: 'Payment failed and could not update order status',
        loading: false
      }));
      throw updateError;
    }
  }, [state.orderId, updateOrderStatus]);

  // Method to check and sync payment status (useful for network recovery)
  const checkPaymentStatus = useCallback(async () => {
    if (!state.paymentIntentId) {
      throw new Error('No payment intent ID available');
    }

    try {
      // Use the API directly to check payment status
      const response = await get(`/payments/status/${state.paymentIntentId}`);
      return response;
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw error;
    }
  }, [state.paymentIntentId]);

  const resetPaymentFlow = useCallback(() => {
    setState({
      currentStep: 'order',
      orderId: null,
      paymentIntentId: null,
      clientSecret: null,
      error: null,
      loading: false
    });
  }, []);

  return {
    ...state,
    startPaymentFlow,
    confirmPaymentSuccess,
    handlePaymentFailure,
    checkPaymentStatus,
    resetPaymentFlow
  };
};

export default {
  useCreatePaymentIntent,
  useConfirmPayment,
  usePaymentStatus,
  usePaymentConfig,
  useCreateOrder,
  useProcessRefund,
  useOrderPayments,
  usePaymentStatistics,
  useCompletePaymentFlow,
  useUpdateOrderStatus,
  useCreateCashOnDeliveryOrder
}; 