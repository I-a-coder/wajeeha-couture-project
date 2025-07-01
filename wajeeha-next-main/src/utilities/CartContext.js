"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [initialized, setInitialized] = useState(false);

  // Load cart from localStorage or Firestore on component mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        console.log("Loading cart data...");
        setLoading(true);
        
        if (currentUser) {
          console.log("User is logged in, fetching cart from Firestore");
          // If user is logged in, fetch cart from Firestore
          const cartRef = doc(db, "carts", currentUser.uid);
          const cartSnap = await getDoc(cartRef);
          
          if (cartSnap.exists()) {
            console.log("Cart found in Firestore");
            setCart(cartSnap.data().items || []);
          } else {
            // If no cart exists in Firestore but exists in localStorage, sync it
            const localCart = localStorage.getItem("cart");
            if (localCart) {
              console.log("No cart in Firestore, but found in localStorage");
              const parsedCart = JSON.parse(localCart);
              setCart(parsedCart);
              await setDoc(cartRef, { items: parsedCart });
            } else {
              console.log("No cart found anywhere");
              setCart([]);
            }
          }
        } else {
          // If user is not logged in, get cart from localStorage
          console.log("User not logged in, getting cart from localStorage");
          const localCart = localStorage.getItem("cart");
          if (localCart) {
            setCart(JSON.parse(localCart));
          } else {
            setCart([]);
          }
        }
      } catch (error) {
        console.error("Error loading cart:", error);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    loadCart();
  }, [currentUser]);

  // Save cart to localStorage and Firestore if user is logged in
  useEffect(() => {
    if (!loading && initialized) {
      console.log("Saving cart:", cart.length, "items");
      
      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(cart));
      
      // Save to Firestore if user is logged in
      if (currentUser) {
        const saveToFirestore = async () => {
          try {
            const cartRef = doc(db, "carts", currentUser.uid);
            await setDoc(cartRef, { items: cart }, { merge: true });
            console.log("Cart saved to Firestore");
          } catch (error) {
            console.error("Error saving cart to Firestore:", error);
          }
        };
        
        saveToFirestore();
      }
    }
  }, [cart, currentUser, loading, initialized]);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    console.log("Adding to cart:", product.title, "quantity:", quantity);
    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex(item => 
        item.id === product.id && item.collection === product.collection
      );
      
      if (existingItemIndex !== -1) {
        // If item exists, update its quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...prevCart[existingItemIndex],
          quantity: prevCart[existingItemIndex].quantity + quantity
        };
        return updatedCart;
      } else {
        // Add new item if it doesn't exist
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  // Update item quantity
  const updateQuantity = (productId, collection, newQuantity) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === productId && item.collection === collection) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  // Remove item from cart
  const removeFromCart = (productId, collection) => {
    setCart(prevCart => {
      return prevCart.filter(item => !(item.id === productId && item.collection === collection));
    });
  };

  // Clear cart
  const clearCart = () => {
    console.log("Clearing cart");
    setCart([]);
  };

  // Calculate total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      // Calculate price based on discount if present
      let price;
      if (item.discount) {
        price = item.unstichedPrice ? 
          Math.round(item.unstichedPrice - (item.unstichedPrice * item.discount) / 100) :
          Math.round(item.stichedPrice - (item.stichedPrice * item.discount) / 100);
      } else {
        price = item.unstichedPrice || item.stichedPrice;
      }
      
      return total + (price * item.quantity);
    }, 0);
  };

  // Get cart item count
  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    calculateTotal,
    getCartItemCount,
    loading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
} 