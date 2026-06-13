const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Razorpay = require('razorpay');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded images statically
app.use('/uploads', express.static(uploadsDir));

// Multer Disk Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// JSON File Database Setup
const DB_PATH = path.join(__dirname, 'db.json');

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Poondu Podi (Garlic Podi)",
    tagline: "Authentic Tamil Nadu Recipe",
    price: 120,
    weight: "100g",
    category: "Podi",
    description: "Authentic Erode style Poondu Podi made with handpicked organic garlic, premium Guntur red chillies, and split urad dal. Traditionally dry-roasted over low fire for a rich aroma. No artificial colors, preservatives, or MSG.",
    ingredients: "Garlic, Red Chilli, Urad Dal, Cumin, Asafoetida, Salt",
    rating: 4.9,
    reviews: 124,
    directions: "Mix 1-2 tbsp with hot rice and ghee or sesame oil, or serve as a delicious side accompaniment for soft idlis, crispy dosas, and uttapams.",
    nutrition: {
      "Energy": "432 kcal",
      "Protein": "16.5g",
      "Carbohydrates": "59.8g",
      "Total Sugars": "2.1g",
      "Total Fat": "15.2g",
      "Saturated Fat": "2.6g",
      "Dietary Fibre": "8.6g",
      "Sodium": "620mg"
    },
    fssai: "22424573000315",
    inStock: true,
    imageType: 'garlic'
  },
  {
    id: 2,
    name: "Karuveppilai Podi (Curry Leaf Podi)",
    tagline: "Iron-Rich Daily Health Mix",
    price: 110,
    weight: "100g",
    category: "Podi",
    description: "A traditional healthy spice mix made from fresh organic curry leaves, black pepper, and split lentils. High in iron, fiber, and antioxidants. Helps promote digestion and hair health.",
    ingredients: "Organic Curry Leaves, Black Pepper, Urad Dal, Bengal Gram, Cumin, Salt",
    rating: 4.8,
    reviews: 86,
    directions: "Best enjoyed with warm sesame (gingelly) oil and hot idlis, or mixed with hot steamed rice and ghee.",
    nutrition: {
      "Energy": "385 kcal",
      "Protein": "12.4g",
      "Carbohydrates": "52.3g",
      "Total Sugars": "1.8g",
      "Total Fat": "8.6g",
      "Saturated Fat": "1.2g",
      "Dietary Fibre": "11.2g",
      "Sodium": "590mg"
    },
    fssai: "22424573000315",
    inStock: true,
    imageType: 'curry'
  },
  {
    id: 3,
    name: "Idli Milagai Podi (Gunpowder Masala)",
    tagline: "Coarse & Spicy Gunpowder",
    price: 115,
    weight: "100g",
    category: "Podi",
    description: "Coarsely ground traditional spicy gunpowder. Uses premium dry red chillies and toasted sesame seeds to deliver an authentic heat and crunch that pairs beautifully with hot fluffy idlis.",
    ingredients: "Premium Red Chilli, Urad Dal, Sesame Seeds, Bengal Gram, Asafoetida, Salt",
    rating: 4.7,
    reviews: 98,
    directions: "Mix with hot ghee or cold-pressed sesame oil. Smear generously on idlis or dosas for a flavorful coating.",
    nutrition: {
      "Energy": "410 kcal",
      "Protein": "14.2g",
      "Carbohydrates": "56.4g",
      "Total Sugars": "2.0g",
      "Total Fat": "12.1g",
      "Saturated Fat": "1.9g",
      "Dietary Fibre": "9.3g",
      "Sodium": "610mg"
    },
    fssai: "22424573000315",
    inStock: true,
    imageType: 'gunpowder'
  }
];

const DEFAULT_OFFERS = [
  {
    id: 1,
    code: "WELCOME10",
    discount: 10,
    description: "Get 10% off on your first order!",
    active: true
  },
  {
    id: 2,
    code: "THULASIA20",
    discount: 20,
    description: "Special 20% discount on order totals!",
    active: true
  }
];

const DEFAULT_RECIPES = [
  {
    id: 1,
    title: "Poondu Podi Ghee Rice",
    desc: "The ultimate South Indian comfort food. Simple, quick, and bursting with fresh garlic aroma.",
    prepTime: "5 mins",
    cookTime: "5 mins",
    serves: "1-2",
    difficulty: "Easy",
    productUsed: "Poondu Podi (Garlic Podi)",
    ingredients: [
      "2 cups Cooked Steaming Hot Ponni Rice",
      "2-3 tablespoons Thulasia Poondu Podi",
      "2 tablespoons Cow Ghee (or Gingelly Oil)",
      "A sprig of Fresh Curry Leaves",
      "Roasted Cashew Nuts (optional)"
    ],
    steps: [
      "Ensure your cooked rice is steaming hot and individual grains are separate.",
      "Transfer hot rice to a wide mixing bowl.",
      "Add 2 tablespoons of warm cow ghee (or raw sesame oil) over the rice.",
      "Sprinkle Thulasia Poondu Podi evenly over the ghee and rice.",
      "Gently fold and mix using a wooden spatula so the spice mix coats every grain without mashing the rice.",
      "Garnish with ghee-fried curry leaves and cashews. Serve warm with papad or potato fry."
    ]
  },
  {
    id: 2,
    title: "Crispy Gunpowder Podi Idli",
    desc: "Tavern-style mini idlis coated in toasted gunpowder and cold-pressed gingelly oil.",
    prepTime: "10 mins",
    cookTime: "8 mins",
    serves: "2-3",
    difficulty: "Easy",
    productUsed: "Idli Milagai Podi",
    ingredients: [
      "15 Mini Idlis (or 4 regular idlis cut into cubes)",
      "3 tablespoons Thulasia Idli Milagai Podi",
      "3 tablespoons Gingelly (Sesame) Oil",
      "1/2 teaspoon Mustard Seeds",
      "1/2 teaspoon Urad Dal",
      "1 sprig Curry Leaves"
    ],
    steps: [
      "Steam the idlis and let them cool down slightly so they don't break when tossed.",
      "Heat gingelly oil in a pan. Add mustard seeds and let them splutter.",
      "Add urad dal and fry till it turns golden brown. Toss in the curry leaves.",
      "Turn the flame to low. Add the mini idlis and saute for 2 minutes till they get a light outer crust.",
      "Sprinkle Thulasia Idli Milagai Podi (Gunpowder) over the idlis.",
      "Toss gently on low heat for 1 minute until the podi forms a nice crispy coat. Serve hot with coconut chutney."
    ]
  },
  {
    id: 3,
    title: "Traditional Erode Murungakkai Sambar",
    desc: "An aromatic lentil stew cooked with drumsticks and small onions, using our native spice blend.",
    prepTime: "15 mins",
    cookTime: "20 mins",
    serves: "4",
    difficulty: "Medium",
    productUsed: "Chettinad Sambar Masala",
    ingredients: [
      "1/2 cup Toor Dal (boiled and mashed)",
      "1 Drumstick (cut into 2-inch pieces)",
      "10 Pearl Onions (shallots, peeled)",
      "1 Tomato (chopped)",
      "Small gooseberry-sized Tamarind (soaked in warm water)",
      "2-3 tablespoons Thulasia Sambar Masala",
      "Salt to taste",
      "For tempering: 1 tsp oil, 1/2 tsp mustard seeds, 1/4 tsp fenugreek, 1 red chilli, asafoetida"
    ],
    steps: [
      "Extract tamarind juice from the soaked tamarind and set aside.",
      "In a pot, boil drumstick, shallots, and tomato in tamarind juice with salt and a pinch of turmeric until vegetables are soft.",
      "Add the mashed toor dal to the boiling vegetable broth.",
      "Stir in 2-3 tablespoons of Thulasia Sambar Masala. Add water to adjust consistency.",
      "Simmer on medium flame for 5-7 minutes until the raw masala aroma disappears and the sambar thickens.",
      "In a separate small pan, heat oil, add tempering ingredients, and pour it into the hot sambar. Cover immediately to lock in the aroma. Serve with hot rice or idli."
    ]
  },
  {
    id: 4,
    title: "Iron-Rich Curry Leaf Rice",
    desc: "A healthy, herbaceous lunchbox rice packed with the goodness of roasted curry leaves.",
    prepTime: "5 mins",
    cookTime: "10 mins",
    serves: "2",
    difficulty: "Easy",
    productUsed: "Karuveppilai Podi",
    ingredients: [
      "2 cups Cooked Basmati or Ponni Rice (cooled)",
      "3 tablespoons Thulasia Karuveppilai Podi",
      "1.5 tablespoons Gingelly Oil",
      "1 tablespoon Roasted Peanuts",
      "1/2 tsp Mustard Seeds",
      "1 Red Chilli"
    ],
    steps: [
      "Ensure the cooked rice is cool to prevent clumping.",
      "Heat gingelly oil in a pan, splutter mustard seeds and red chilli.",
      "Add roasted peanuts and saute for 1 minute until crunchy.",
      "Turn off the heat. Add the cooled rice to the pan.",
      "Sprinkle Thulasia Karuveppilai Podi over the rice.",
      "Gently mix the rice until the green spice mix is evenly distributed. Pack for lunch or serve with potato chips."
    ]
  }
];

const DEFAULT_SETTINGS = {
  shippingFee: 40,                // default standard shipping fee in ₹
  freeDeliveryEnabled: false,     // global free delivery campaign toggle
  freeDeliveryThreshold: 500,     // order subtotal above this gets free delivery (0 = disabled)
  address: "84, Pallakatuputhur, Nanjaiuthukuli,\nModakurichy Block, Erode,\nTamil Nadu - 638104, India",
  phone: "+91 12345 67890\n+91 98765 43210",
  email: "contact@thulasiafoods.com",
  fssai: "License No: 22424573000315\nCategory: Registration [Tamil Nadu]",
  fssaiNumber: "22424573000315"
};

function readDB() {
  const initData = { products: DEFAULT_PRODUCTS, orders: [], recipes: DEFAULT_RECIPES, offers: DEFAULT_OFFERS, settings: DEFAULT_SETTINGS };
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(initData, null, 2));
    return initData;
  }
  try {
    const raw = fs.readFileSync(DB_PATH);
    const db = JSON.parse(raw);
    let changed = false;
    if (!db.products) { db.products = DEFAULT_PRODUCTS; changed = true; }
    if (!db.orders) { db.orders = []; changed = true; }
    if (!db.recipes) { db.recipes = DEFAULT_RECIPES; changed = true; }
    if (!db.offers) { db.offers = DEFAULT_OFFERS; changed = true; }
    if (!db.settings) { 
      db.settings = DEFAULT_SETTINGS; 
      changed = true; 
    } else {
      for (const k in DEFAULT_SETTINGS) {
        if (db.settings[k] === undefined) {
          db.settings[k] = DEFAULT_SETTINGS[k];
          changed = true;
        }
      }
    }
    if (changed) {
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    }
    return db;
  } catch (err) {
    console.error("Error reading database file, resetting:", err);
    fs.writeFileSync(DB_PATH, JSON.stringify(initData, null, 2));
    return initData;
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Razorpay SDK setup
const rzpKeyId = process.env.RAZORPAY_KEY_ID;
const rzpKeySecret = process.env.RAZORPAY_KEY_SECRET;
let razorpay = null;

if (rzpKeyId && rzpKeySecret) {
  try {
    razorpay = new Razorpay({
      key_id: rzpKeyId,
      key_secret: rzpKeySecret
    });
    console.log("Razorpay SDK initialized successfully with credentials.");
  } catch (err) {
    console.error("Failed to initialize Razorpay SDK:", err);
  }
} else {
  console.log("No Razorpay credentials found in .env. Falling back to Simulated Payment Gateway.");
}

// --- AUTOMATED WHATSAPP & GMAIL ORDER NOTIFICATION SIMULATION ---
function sendTrackingNotification(order, actionType = 'CREATED') {
  console.log(`\n================================================================================`);
  console.log(`[AUTOMATED ORDER NOTIFICATION SYSTEM] - Action: ${actionType}`);
  console.log(`Order ID: ${order.orderId}`);
  console.log(`Customer: ${order.customerName}`);
  console.log(`WhatsApp Number: ${order.phone}`);
  console.log(`Gmail Address: ${order.email}`);
  console.log(`Current Status: ${order.status}`);
  console.log(`--------------------------------------------------------------------------------`);
  
  const trackingLink = `http://localhost:5173/?view=track&id=${order.orderId}`;
  
  if (actionType === 'CREATED') {
    console.log(`💬 AUTOMATED WHATSAPP SENT to +91 ${order.phone.replace(/[^0-9]/g, '')}:`);
    console.log(`   "Hello ${order.customerName}! 🌿 Your Thulasia Foods order ${order.orderId} of ₹${order.total}.00 has been successfully received. We are preparing to pan-roast your organic spices in our Erode unit! Track your order live here: ${trackingLink}"`);
    console.log(`\n📧 AUTOMATED GMAIL DISPATCHED to ${order.email}:`);
    console.log(`   Subject: Order Confirmed & Sourced! Thulasia Foods - ${order.orderId}`);
    console.log(`   Body:`);
    console.log(`   Hi ${order.customerName},`);
    console.log(`   Thank you for purchasing traditional Tamil Nadu spices from Thulasia Foods.`);
    console.log(`   We have registered your order ${order.orderId}.`);
    console.log(`   Delivery Address: ${order.address}`);
    console.log(`   Items: ${order.items.map(i => `${i.name} (${i.weight}) x${i.quantity}`).join(', ')}`);
    console.log(`   Total Paid: ₹${order.total}.00 via ${order.paymentMethod}`);
    console.log(`   \n   You can track your order's sourcing, roasting, and shipping progress in real-time:`);
    console.log(`   👉 ${trackingLink}`);
    console.log(`   \n   Best Regards,`);
    console.log(`   Thulasia Foods support (fssai: 22424573000315)`);
  } else {
    // Status update (Shipped / Delivered)
    const statusText = order.status === 'Shipped' 
      ? `has been pan-roasted, packed, and dispatched! 🚚 It is now in transit via our courier partner.`
      : `has been successfully delivered! 🎉 We hope you enjoy the authentic, fresh flavors of our Erode spices.`;
      
    console.log(`💬 AUTOMATED WHATSAPP SENT to +91 ${order.phone.replace(/[^0-9]/g, '')}:`);
    console.log(`   "Hello ${order.customerName}! 🌿 Update for order ${order.orderId}: Your spice mix ${statusText} Track status live here: ${trackingLink}"`);
    console.log(`\n📧 AUTOMATED GMAIL DISPATCHED to ${order.email}:`);
    console.log(`   Subject: Order Status Updated: ${order.status} - Thulasia Foods - ${order.orderId}`);
    console.log(`   Body:`);
    console.log(`   Hi ${order.customerName},`);
    console.log(`   We have an update regarding your Thulasia Foods order ${order.orderId}.`);
    console.log(`   Current Status: ${order.status}`);
    console.log(`   Update: Your order ${statusText}`);
    console.log(`   \n   Track progress live here:`);
    console.log(`   👉 ${trackingLink}`);
    console.log(`   \n   Thank you for choosing Thulasia Foods!`);
  }
  console.log(`================================================================================\n`);
}

// --- REST API ENDPOINTS ---

// 1. Image upload
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl: fileUrl });
});

// 2. Fetch all products
app.get('/api/products', (req, res) => {
  const db = readDB();
  res.json(db.products);
});

// 3. Add a new product
app.post('/api/products', (req, res) => {
  const db = readDB();
  const newProduct = {
    id: Date.now(),
    name: req.body.name,
    tagline: req.body.tagline || '',
    price: parseFloat(req.body.price),
    weight: req.body.weight || '100g',
    category: req.body.category || 'Podi',
    description: req.body.description || '',
    ingredients: req.body.ingredients || '',
    directions: req.body.directions || '',
    nutrition: req.body.nutrition || {
      "Energy": "410 kcal",
      "Protein": "14.0g",
      "Carbohydrates": "58.0g",
      "Total Sugars": "2.0g",
      "Total Fat": "12.0g",
      "Saturated Fat": "1.8g",
      "Dietary Fibre": "9.0g",
      "Sodium": "600mg"
    },
    fssai: "22424573000315",
    inStock: req.body.inStock !== undefined ? req.body.inStock : true,
    imageUrl: req.body.imageUrl || null,
    imageType: req.body.imageType || 'garlic'
  };

  db.products.push(newProduct);
  writeDB(db);
  res.status(201).json(newProduct);
});

// 4. Update a product
app.put('/api/products/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const index = db.products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  const updated = {
    ...db.products[index],
    name: req.body.name || db.products[index].name,
    tagline: req.body.tagline || db.products[index].tagline,
    price: req.body.price !== undefined ? parseFloat(req.body.price) : db.products[index].price,
    weight: req.body.weight || db.products[index].weight,
    category: req.body.category || db.products[index].category,
    description: req.body.description || db.products[index].description,
    ingredients: req.body.ingredients || db.products[index].ingredients,
    directions: req.body.directions || db.products[index].directions,
    imageUrl: req.body.imageUrl !== undefined ? req.body.imageUrl : db.products[index].imageUrl,
    inStock: req.body.inStock !== undefined ? req.body.inStock : db.products[index].inStock,
    imageType: req.body.imageType || db.products[index].imageType
  };

  db.products[index] = updated;
  writeDB(db);
  res.json(updated);
});

// 5. Delete a product
app.delete('/api/products/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  db.products = db.products.filter(p => p.id !== id);
  writeDB(db);
  res.json({ success: true });
});

// 6. Reset product catalog
app.post('/api/products/reset', (req, res) => {
  const db = readDB();
  db.products = DEFAULT_PRODUCTS;
  writeDB(db);
  res.json({ success: true, products: DEFAULT_PRODUCTS });
});

// 7. Fetch all orders
app.get('/api/orders', (req, res) => {
  const db = readDB();
  res.json(db.orders);
});

// 8. Log a completed order
app.post('/api/orders', (req, res) => {
  const db = readDB();
  const orderId = req.body.orderId;

  if (orderId) {
    const existingOrder = db.orders.find(o => o.orderId === orderId);
    if (existingOrder) {
      console.log(`Order ${orderId} already exists. Returning existing order.`);
      return res.json(existingOrder);
    }
  }

  const newOrder = {
    ...req.body,
    orderId: orderId || `ORD-${Date.now().toString().slice(-6)}`,
    date: req.body.date || new Date().toLocaleDateString('en-GB'),
    time: req.body.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    status: req.body.status || 'Pending'
  };

  db.orders.unshift(newOrder); // Add to beginning
  writeDB(db);
  sendTrackingNotification(newOrder, 'CREATED');
  res.status(201).json(newOrder);
});

// 9. Update order status
app.put('/api/orders/:id', (req, res) => {
  const db = readDB();
  const id = req.params.id;
  const index = db.orders.findIndex(o => o.orderId === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  db.orders[index].status = req.body.status;
  writeDB(db);
  sendTrackingNotification(db.orders[index], 'STATUS_UPDATE');
  res.json(db.orders[index]);
});

// 10. Delete an order
app.delete('/api/orders/:id', (req, res) => {
  const db = readDB();
  const id = req.params.id;
  db.orders = db.orders.filter(o => o.orderId !== id);
  writeDB(db);
  res.json({ success: true });
});

// --- Recipes CRUD ---
app.get('/api/recipes', (req, res) => {
  const db = readDB();
  res.json(db.recipes || []);
});

app.post('/api/recipes', (req, res) => {
  const db = readDB();
  const newRecipe = {
    id: Date.now(),
    title: req.body.title,
    desc: req.body.desc || '',
    prepTime: req.body.prepTime || '5 mins',
    cookTime: req.body.cookTime || '5 mins',
    serves: req.body.serves || '2',
    difficulty: req.body.difficulty || 'Easy',
    productUsed: req.body.productUsed || '',
    ingredients: Array.isArray(req.body.ingredients) ? req.body.ingredients : (req.body.ingredients || '').split('\n').filter(Boolean),
    steps: Array.isArray(req.body.steps) ? req.body.steps : (req.body.steps || '').split('\n').filter(Boolean)
  };
  db.recipes = db.recipes || [];
  db.recipes.push(newRecipe);
  writeDB(db);
  res.status(201).json(newRecipe);
});

app.put('/api/recipes/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const idx = (db.recipes || []).findIndex(r => r.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  const updated = {
    ...db.recipes[idx],
    title: req.body.title || db.recipes[idx].title,
    desc: req.body.desc !== undefined ? req.body.desc : db.recipes[idx].desc,
    prepTime: req.body.prepTime || db.recipes[idx].prepTime,
    cookTime: req.body.cookTime || db.recipes[idx].cookTime,
    serves: req.body.serves || db.recipes[idx].serves,
    difficulty: req.body.difficulty || db.recipes[idx].difficulty,
    productUsed: req.body.productUsed || db.recipes[idx].productUsed,
    ingredients: Array.isArray(req.body.ingredients) ? req.body.ingredients : (req.body.ingredients || '').split('\n').filter(Boolean),
    steps: Array.isArray(req.body.steps) ? req.body.steps : (req.body.steps || '').split('\n').filter(Boolean)
  };
  db.recipes[idx] = updated;
  writeDB(db);
  res.json(updated);
});

app.delete('/api/recipes/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  db.recipes = (db.recipes || []).filter(r => r.id !== id);
  writeDB(db);
  res.json({ success: true });
});

// --- Offers CRUD ---
app.get('/api/offers', (req, res) => {
  const db = readDB();
  res.json(db.offers || []);
});

app.post('/api/offers', (req, res) => {
  const db = readDB();
  const newOffer = {
    id: Date.now(),
    code: (req.body.code || '').toUpperCase().trim(),
    discount: parseInt(req.body.discount) || 0,
    description: req.body.description || '',
    active: req.body.active !== undefined ? req.body.active : true
  };
  db.offers = db.offers || [];
  db.offers.push(newOffer);
  writeDB(db);
  res.status(201).json(newOffer);
});

app.put('/api/offers/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const idx = (db.offers || []).findIndex(o => o.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Offer not found' });
  }
  const updated = {
    ...db.offers[idx],
    code: req.body.code !== undefined ? req.body.code.toUpperCase().trim() : db.offers[idx].code,
    discount: req.body.discount !== undefined ? parseInt(req.body.discount) : db.offers[idx].discount,
    description: req.body.description !== undefined ? req.body.description : db.offers[idx].description,
    active: req.body.active !== undefined ? req.body.active : db.offers[idx].active
  };
  db.offers[idx] = updated;
  writeDB(db);
  res.json(updated);
});

app.delete('/api/offers/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  db.offers = (db.offers || []).filter(o => o.id !== id);
  writeDB(db);
  res.json({ success: true });
});

// --- Delivery Settings ---
app.get('/api/settings', (req, res) => {
  const db = readDB();
  res.json(db.settings || DEFAULT_SETTINGS);
});

app.put('/api/settings', (req, res) => {
  const db = readDB();
  const prev = db.settings || DEFAULT_SETTINGS;
  db.settings = {
    shippingFee: req.body.shippingFee !== undefined ? parseInt(req.body.shippingFee) : prev.shippingFee,
    freeDeliveryEnabled: req.body.freeDeliveryEnabled !== undefined ? Boolean(req.body.freeDeliveryEnabled) : prev.freeDeliveryEnabled,
    freeDeliveryThreshold: req.body.freeDeliveryThreshold !== undefined ? parseInt(req.body.freeDeliveryThreshold) : prev.freeDeliveryThreshold,
    address: req.body.address !== undefined ? req.body.address : prev.address,
    phone: req.body.phone !== undefined ? req.body.phone : prev.phone,
    email: req.body.email !== undefined ? req.body.email : prev.email,
    fssai: req.body.fssai !== undefined ? req.body.fssai : prev.fssai,
    fssaiNumber: req.body.fssaiNumber !== undefined ? req.body.fssaiNumber : prev.fssaiNumber
  };
  writeDB(db);
  res.json(db.settings);
});

// 11. Razorpay Order Creation
app.post('/api/create-payment-order', async (req, res) => {
  const amount = parseInt(req.body.amount); // amount in paise (e.g. 100 Rs = 10000 paise)
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount.' });
  }

  // If Razorpay is not configured, reply to frontend that we will run in simulated mode
  if (!razorpay) {
    return res.json({
      simulated: true,
      amount: amount,
      currency: "INR",
      id: "mock_order_" + Math.random().toString(36).substring(2, 16)
    });
  }

  try {
    const options = {
      amount: amount, // in paise
      currency: "INR",
      receipt: "receipt_" + Date.now().toString().slice(-6)
    };
    
    const rzpOrder = await razorpay.orders.create(options);
    res.json({
      simulated: false,
      id: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: rzpKeyId  // Send publishable key to frontend
    });
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    res.status(500).json({ error: 'Failed to create payment order.' });
  }
});

// 12. Razorpay Signature Verification
app.post('/api/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing payment signature details.' });
  }

  if (!razorpay) {
    // If running in simulated mode, always verify as successful
    return res.json({ verified: true, message: 'Simulated payment verified.' });
  }

  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', rzpKeySecret);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generatedSignature = hmac.digest('hex');

  if (generatedSignature === razorpay_signature) {
    res.json({ verified: true, message: 'Payment signature verified successfully.' });
  } else {
    res.status(400).json({ verified: false, error: 'Payment verification failed. Invalid signature.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
  console.log(`Serving uploads from ${uploadsDir}`);
});
