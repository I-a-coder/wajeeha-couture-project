import { NextResponse } from "next/server";
import { db } from "@/firebase";
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  where, 
  limit 
} from "firebase/firestore";

export const runtime = "edge";

export default async function HomeApi() {
  try {
    // Function to get collections
    const getCollections = async () => {
      const collectionsRef = collection(db, "collections");
      const collectionsSnap = await getDocs(collectionsRef);
      
      const collections = [];
      collectionsSnap.forEach((doc) => {
        collections.push({ id: doc.id, ...doc.data() });
      });
      
      return collections;
    };

    // Function to get new arrivals
    const getNewArrivals = async () => {
      const productsRef = collection(db, "products");
      const newArrivalsQuery = query(
        productsRef, 
        orderBy("createdAt", "desc"), 
        limit(8)
      );
      const newArrivalsSnap = await getDocs(newArrivalsQuery);
      
      const newArrivals = [];
      newArrivalsSnap.forEach((doc) => {
        newArrivals.push({ id: doc.id, ...doc.data() });
      });
      
      return newArrivals;
    };

    // Function to get sale items
    const getSaleItems = async () => {
      const productsRef = collection(db, "products");
      const saleItemsQuery = query(
        productsRef,
        where("discount", ">", 0),
        limit(8)
      );
      const saleItemsSnap = await getDocs(saleItemsQuery);
      
      const saleItems = [];
      saleItemsSnap.forEach((doc) => {
        saleItems.push({ id: doc.id, ...doc.data() });
      });
      
      return saleItems;
    };

    // Get all the data we need
    const [collections, newArrivals, saleItems] = await Promise.all([
      getCollections(),
      getNewArrivals(),
      getSaleItems()
    ]);

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
            available: item.available !== false // default to true if not specified
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
            available: item.available !== false // default to true if not specified
          }))
        }
      ]
    };

    return NextResponse.json(homeData, { status: 200 });
  } catch (error) {
    console.error("Error loading home data:", error);
    return NextResponse.json(
      { error: "Failed to load home data" },
      { status: 500 }
    );
  }
}
