"use client";

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";

// Product-related operations
export const getProducts = async (collectionName = "products", limitCount = 10) => {
  try {
    const productsRef = collection(db, collectionName);
    const q = query(productsRef, orderBy("createdAt", "desc"), limit(limitCount));
    const querySnapshot = await getDocs(q);
    
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    
    return products;
  } catch (error) {
    console.error(`Error getting ${collectionName}:`, error);
    throw error;
  }
};

export const getProductsByCollection = async (collectionId, limitCount = 20) => {
  try {
    const productsRef = collection(db, "products");
    const q = query(productsRef, where("collection", "==", collectionId), limit(limitCount));
    const querySnapshot = await getDocs(q);
    
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    
    return products;
  } catch (error) {
    console.error("Error getting products by collection:", error);
    throw error;
  }
};

export const getProductById = async (productId, collectionName = "products") => {
  try {
    const productRef = doc(db, collectionName, productId);
    const productSnap = await getDoc(productRef);
    
    if (productSnap.exists()) {
      return { id: productSnap.id, ...productSnap.data() };
    } else {
      console.log("No such product exists!");
      return null;
    }
  } catch (error) {
    console.error("Error getting product:", error);
    throw error;
  }
};

export const getNewArrivals = async (limitCount = 8) => {
  try {
    const productsRef = collection(db, "products");
    const q = query(productsRef, orderBy("createdAt", "desc"), limit(limitCount));
    const querySnapshot = await getDocs(q);
    
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    
    return products;
  } catch (error) {
    console.error("Error getting new arrivals:", error);
    throw error;
  }
};

export const getSaleItems = async (limitCount = 8) => {
  try {
    const productsRef = collection(db, "products");
    const q = query(productsRef, where("discount", ">", 0), limit(limitCount));
    const querySnapshot = await getDocs(q);
    
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    
    return products;
  } catch (error) {
    console.error("Error getting sale items:", error);
    throw error;
  }
};

// Collection-related operations
export const getCollections = async () => {
  try {
    const collectionsRef = collection(db, "collections");
    const querySnapshot = await getDocs(collectionsRef);
    
    const collections = [];
    querySnapshot.forEach((doc) => {
      collections.push({ id: doc.id, ...doc.data() });
    });
    
    return collections;
  } catch (error) {
    console.error("Error getting collections:", error);
    throw error;
  }
};

export const getCollectionById = async (collectionId) => {
  try {
    const collectionRef = doc(db, "collections", collectionId);
    const collectionSnap = await getDoc(collectionRef);
    
    if (collectionSnap.exists()) {
      return { id: collectionSnap.id, ...collectionSnap.data() };
    } else {
      console.log("No such collection exists!");
      return null;
    }
  } catch (error) {
    console.error("Error getting collection:", error);
    throw error;
  }
};

// Order-related operations
export const getUserOrders = async (userId, limitCount = 10) => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef, 
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    return orders;
  } catch (error) {
    console.error("Error getting user orders:", error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (orderSnap.exists()) {
      return { id: orderSnap.id, ...orderSnap.data() };
    } else {
      console.log("No such order exists!");
      return null;
    }
  } catch (error) {
    console.error("Error getting order:", error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const ordersRef = collection(db, "orders");
    const newOrder = {
      ...orderData,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(ordersRef, newOrder);
    return docRef.id;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Static content operations (for content that doesn't change often)
export const getStaticContent = async (contentType) => {
  try {
    const contentRef = doc(db, "staticContent", contentType);
    const contentSnap = await getDoc(contentRef);
    
    if (contentSnap.exists()) {
      return contentSnap.data();
    } else {
      console.log("No such content exists!");
      return null;
    }
  } catch (error) {
    console.error(`Error getting ${contentType} content:`, error);
    throw error;
  }
};

// Home page data
export const getHomeData = async () => {
  try {
    // Get collections for "Shop By Collection" section
    const collections = await getCollections();
    
    // Get new arrivals
    const newArrivals = await getNewArrivals(8);
    
    // Get sale items for spotlight selections
    const saleItems = await getSaleItems(8);
    
    // Format the data in the same structure as the static JSON
    const homeData = {
      sections: [
        {
          title: "New Arrivals",
          type: "newArrivals",
          items: newArrivals.map(item => ({
            id: item.id,
            title: item.title,
            image: item.image,
            collection: item.collection,
            unstichedPrice: item.unstichedPrice,
            stichedPrice: item.stichedPrice,
            discount: item.discount,
            available: item.available
          }))
        },
        {
          title: "Shop By Collection",
          type: "shopByCollection",
          items: collections.map(collection => ({
            title: collection.title,
            path: collection.id,
            image: collection.image
          }))
        },
        {
          title: "Spotlight Selections",
          type: "spotlightSelections",
          items: saleItems.map(item => ({
            id: item.id,
            title: item.title,
            image: item.image,
            collection: item.collection,
            unstichedPrice: item.unstichedPrice,
            stichedPrice: item.stichedPrice,
            discount: item.discount,
            available: item.available
          }))
        }
      ]
    };
    
    return homeData;
  } catch (error) {
    console.error("Error getting home data:", error);
    throw error;
  }
};

// Data migration utility - use this to populate Firestore from static JSON
export const migrateJsonToFirestore = async (jsonData, collectionName) => {
  try {
    const collectionRef = collection(db, collectionName);
    
    let count = 0;
    for (const item of jsonData) {
      // Add timestamp fields to each document
      const docData = {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await addDoc(collectionRef, docData);
      count++;
    }
    
    return { success: true, count };
  } catch (error) {
    console.error(`Error migrating data to ${collectionName}:`, error);
    return { success: false, error: error.message };
  }
}; 