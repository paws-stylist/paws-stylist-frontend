'use client'
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

// Cart action types
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// UAE VAT rate (5%)
const UAE_VAT_RATE = 0.05;

// Maximum quantity limits
const MAX_QUANTITY_LIMIT = 5;

// Helper function to get maximum allowed quantity for a product
const getMaxAllowedQuantity = (product) => {
  const stockQuantity = product.stockQuantity || product.quantity || 999;
  return Math.min(MAX_QUANTITY_LIMIT, stockQuantity);
};

// Helper function to validate quantity limits
const validateQuantityLimit = (product, requestedQuantity, currentQuantity = 0) => {
  const maxAllowed = getMaxAllowedQuantity(product);
  const totalQuantity = currentQuantity + requestedQuantity;
  
  if (totalQuantity > maxAllowed) {
    const availableToAdd = maxAllowed - currentQuantity;
    return {
      isValid: false,
      maxAllowed,
      availableToAdd,
      reason: availableToAdd <= 0 
        ? 'maximum_reached' 
        : maxAllowed === MAX_QUANTITY_LIMIT 
          ? 'max_limit' 
          : 'stock_limit'
    };
  }
  
  return { isValid: true, maxAllowed };
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === product._id || item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        const updatedItems = [...state.items];
        const currentQuantity = updatedItems[existingItemIndex].quantity;
        
        // Validate quantity limits
        const validation = validateQuantityLimit(product, quantity, currentQuantity);
        if (!validation.isValid) {
          // Return current state without changes - error handling in addToCart
          return state;
        }
        
        updatedItems[existingItemIndex].quantity += quantity;
        updatedItems[existingItemIndex].maxAllowed = validation.maxAllowed;
        return {
          ...state,
          items: updatedItems
        };
      } else {
        // Add new item
        const validation = validateQuantityLimit(product, quantity);
        if (!validation.isValid) {
          // Return current state without changes - error handling in addToCart
          return state;
        }
        
        const newItem = {
          id: product._id || product.id,
          name: product.productDetail || product.serviceName || product.name,
          price: product.salePrice || product.servicePrice || product.price,
          originalPrice: product.salePrice || product.servicePrice || product.price,
          promotionPrice: product.promotion?.price || null,
          hasPromotion: !!product.promotion,
          image: product.images?.[0] || product.serviceImages?.[0] || product.image,
          productCode: product.productCode || product.serviceCode,
          type: product.type || 'product',
          quantity: quantity,
          unit: product.unit || 'piece',
          category: product.category,
          subCategory: product.subCategory,
          stockQuantity: product.stockQuantity || product.quantity,
          maxAllowed: validation.maxAllowed
        };
        
        return {
          ...state,
          items: [...state.items, newItem]
        };
      }
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id)
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== id)
        };
      }
      
      return {
        ...state,
        items: state.items.map(item => {
          if (item.id === id) {
            // Validate quantity limits for updates
            const maxAllowed = item.maxAllowed || MAX_QUANTITY_LIMIT;
            const finalQuantity = Math.min(quantity, maxAllowed);
            return { ...item, quantity: finalQuantity };
          }
          return item;
        })
      };
    }

    case CART_ACTIONS.CLEAR_CART: {
      return {
        ...state,
        items: []
      };
    }

    case CART_ACTIONS.LOAD_CART: {
      return {
        ...state,
        items: action.payload.items || []
      };
    }

    default:
      return state;
  }
};

// Initial state
const initialState = {
  items: [],
  isOpen: false
};

// Cart provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('pawsCart');
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        dispatch({
          type: CART_ACTIONS.LOAD_CART,
          payload: cartData
        });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem('pawsCart', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state]);

  // Cart actions with quantity validation
  const addToCart = (product, quantity = 1) => {
    const existingItem = state.items.find(item => item.id === (product._id || product.id));
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    
    // Validate quantity limits
    const validation = validateQuantityLimit(product, quantity, currentQuantity);
    
    if (!validation.isValid) {
      // Show appropriate error message
      const productName = product.productDetail || product.serviceName || product.name;
      
      switch (validation.reason) {
        case 'maximum_reached':
          toast.error(`Maximum quantity reached for ${productName}. You already have ${currentQuantity} in your cart.`, {
            duration: 3000,
            position: 'bottom-right',
          });
          break;
        case 'max_limit':
          toast.error(`Maximum ${validation.maxAllowed} items allowed per product. You can add ${validation.availableToAdd} more.`, {
            duration: 3000,
            position: 'bottom-right',
          });
          break;
        case 'stock_limit':
          toast.error(`Only ${validation.maxAllowed} items available in stock. You can add ${validation.availableToAdd} more.`, {
            duration: 3000,
            position: 'bottom-right',
          });
          break;
        default:
          toast.error(`Cannot add more items to cart.`, {
            duration: 3000,
            position: 'bottom-right',
          });
      }
      return false; // Indicate failure
    }
    
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product, quantity }
    });
    
    const productName = product.productDetail || product.serviceName || product.name;
    toast.success(`${productName} added to cart! (${currentQuantity + quantity}/${validation.maxAllowed})`, {
      duration: 2000,
      position: 'bottom-right',
      style: {
        background: '#059669',
        color: 'white',
      },
    });
    
    return true; // Indicate success
  };

  const removeFromCart = (id) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { id }
    });
    
    toast.success('Item removed from cart', {
      duration: 2000,
      position: 'bottom-right',
    });
  };

  const updateQuantity = (id, quantity) => {
    const item = state.items.find(item => item.id === id);
    if (item) {
      const maxAllowed = item.maxAllowed || MAX_QUANTITY_LIMIT;
      
      if (quantity > maxAllowed) {
        toast.error(`Maximum ${maxAllowed} items allowed for this product.`, {
          duration: 3000,
          position: 'bottom-right',
        });
        return false;
      }
    }
    
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { id, quantity }
    });
    
    return true;
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
    toast.success('Cart cleared', {
      duration: 2000,
      position: 'bottom-right',
    });
  };

  // Helper function to get maximum quantity for a product
  const getMaxQuantityForProduct = (productId) => {
    const item = state.items.find(item => item.id === productId);
    return item ? item.maxAllowed || MAX_QUANTITY_LIMIT : MAX_QUANTITY_LIMIT;
  };

  // Helper function to check if user can add more of a product
  const canAddMoreOfProduct = (productId) => {
    const item = state.items.find(item => item.id === productId);
    if (!item) return true;
    
    const maxAllowed = item.maxAllowed || MAX_QUANTITY_LIMIT;
    return item.quantity < maxAllowed;
  };

  // Cart calculations
  const getItemCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return state.items.reduce((total, item) => {
      const price = item.hasPromotion && item.promotionPrice ? item.promotionPrice : item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getOriginalTotal = () => {
    return state.items.reduce((total, item) => {
      return total + (item.originalPrice * item.quantity);
    }, 0);
  };

  const getTotalSavings = () => {
    return getOriginalTotal() - getSubtotal();
  };

  const getVATAmount = () => {
    return getSubtotal() * UAE_VAT_RATE;
  };

  const getTotal = () => {
    return getSubtotal() + getVATAmount();
  };

  const isItemInCart = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Context value
  const value = {
    // State
    items: state.items,
    isOpen: state.isOpen,
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    
    // Calculations
    getItemCount,
    getSubtotal,
    getOriginalTotal,
    getTotalSavings,
    getVATAmount,
    getTotal,
    isItemInCart,
    getItemQuantity,
    
    // Quantity limits helpers
    getMaxQuantityForProduct,
    canAddMoreOfProduct,
    
    // Constants
    VAT_RATE: UAE_VAT_RATE,
    MAX_QUANTITY_LIMIT
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext; 