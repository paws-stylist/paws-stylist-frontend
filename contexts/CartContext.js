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

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === product._id || item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += quantity;
        return {
          ...state,
          items: updatedItems
        };
      } else {
        // Add new item
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
          subCategory: product.subCategory
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
        items: state.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
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

  // Cart actions
  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product, quantity }
    });
    
    toast.success(`${product.productDetail || product.serviceName || product.name} added to cart!`, {
      duration: 2000,
      position: 'bottom-right',
      style: {
        background: '#059669',
        color: 'white',
      },
    });
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
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { id, quantity }
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
    toast.success('Cart cleared', {
      duration: 2000,
      position: 'bottom-right',
    });
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
    
    // Constants
    VAT_RATE: UAE_VAT_RATE
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext; 