#!/usr/bin/env node
// scripts/migrateToFirestore.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, serverTimestamp } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQNR6i2Ka4nZCC5LPe5hB9X7YY0xATSNU",
  authDomain: "wajeeha-courture.firebaseapp.com",
  databaseURL: "https://wajeeha-courture-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "wajeeha-courture",
  storageBucket: "wajeeha-courture.appspot.com",
  messagingSenderId: "519618015875",
  appId: "1:519618015875:web:5adbfa50b51a724224a1b6",
  measurementId: "G-K11ZY6FPXW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Path to data directory
const DATA_DIR = path.join(__dirname, '../src/data');

/**
 * Load JSON data from a file
 */
function loadJsonData(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
    return null;
  }
}

/**
 * Migrate products to Firestore
 */
async function migrateProducts() {
  console.log('Migrating products...');
  
  try {
    // Load products data
    const productsData = loadJsonData(path.join(DATA_DIR, 'productsData.json'));
    
    if (!productsData || !productsData.products) {
      console.error('Invalid products data');
      return;
    }
    
    // Flatten the product structure for Firestore
    const products = [];
    productsData.products.forEach(collection => {
      collection.items.forEach(product => {
        products.push({
          ...product,
          collection: collection.collection,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          available: product.available !== false, // Default to true if not specified
        });
      });
    });
    
    // Add products to Firestore
    let successCount = 0;
    for (const product of products) {
      try {
        // Use product ID as document ID
        await setDoc(doc(db, 'products', product.id), product);
        successCount++;
      } catch (error) {
        console.error(`Error adding product ${product.id}:`, error);
      }
    }
    
    console.log(`Successfully migrated ${successCount} of ${products.length} products`);
  } catch (error) {
    console.error('Error migrating products:', error);
  }
}

/**
 * Migrate collections to Firestore
 */
async function migrateCollections() {
  console.log('Migrating collections...');
  
  try {
    // Load collections data
    const collectionsData = loadJsonData(path.join(DATA_DIR, 'allCollectionsData.json'));
    
    if (!collectionsData || !collectionsData.collections) {
      console.error('Invalid collections data');
      return;
    }
    
    // Process collections
    const collections = collectionsData.collections.map(collection => ({
      id: collection.path, // Use path as ID
      title: collection.title,
      image: collection.image,
      description: collection.description || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }));
    
    // Add collections to Firestore
    let successCount = 0;
    for (const collectionData of collections) {
      try {
        const { id, ...data } = collectionData;
        await setDoc(doc(db, 'collections', id), data);
        successCount++;
      } catch (error) {
        console.error(`Error adding collection ${collectionData.id}:`, error);
      }
    }
    
    console.log(`Successfully migrated ${successCount} of ${collections.length} collections`);
  } catch (error) {
    console.error('Error migrating collections:', error);
  }
}

/**
 * Migrate static content to Firestore
 */
async function migrateStaticContent() {
  console.log('Migrating static content...');
  
  try {
    // Define static content files to migrate
    const staticContent = [
      { id: 'header', file: 'headerData.json' },
      { id: 'footer', file: 'footerData.json' },
      { id: 'faq', file: 'faqData.json' },
      { id: 'sizeGuide', file: 'sizeGuideData.json' },
      { id: 'privacyPolicy', file: 'privacyPolicyData.json' },
      { id: 'returnExchange', file: 'returnExchangeData.json' },
      { id: 'contact', file: 'contactData.json' },
      { id: 'journey', file: 'journeyData.json' },
    ];
    
    // Migrate each static content file
    let successCount = 0;
    for (const content of staticContent) {
      try {
        const data = loadJsonData(path.join(DATA_DIR, content.file));
        
        if (!data) {
          console.error(`Invalid data for ${content.id}`);
          continue;
        }
        
        // Add metadata
        const enrichedData = {
          ...data,
          updatedAt: serverTimestamp()
        };
        
        await setDoc(doc(db, 'staticContent', content.id), enrichedData);
        successCount++;
      } catch (error) {
        console.error(`Error adding static content ${content.id}:`, error);
      }
    }
    
    console.log(`Successfully migrated ${successCount} of ${staticContent.length} static content files`);
  } catch (error) {
    console.error('Error migrating static content:', error);
  }
}

/**
 * Run all migrations
 */
async function runAllMigrations() {
  console.log('Starting data migration to Firestore...');
  
  try {
    await migrateCollections();
    await migrateProducts();
    await migrateStaticContent();
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit(0);
  }
}

// Start migration
runAllMigrations(); 