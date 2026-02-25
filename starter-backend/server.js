require('dotenv').config({ path: './.env' });
const express = require("express");
const cors = require("cors");
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid'); // Added Plaid
const { createClient } = require('@supabase/supabase-js');
const { unknownEndpoint } = require('./middleware');

const app = express();
app.use(express.json());
app.use(cors());

// --- 1. PLAID CONFIGURATION ---
const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});
const plaidClient = new PlaidApi(configuration);

// --- 2. SUPABASE CONFIGURATION ---
const supabaseUrl = 'https://rxvorfxtmshzzbdvprxt.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'sb_publishable_VDInGf_WB3CUxRASkGqNIg_p_Kkjph8';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- 3. PLAID API ROUTES (The missing piece) ---
app.post('/api/create_link_token', async (req, res) => {
  try {
    const tokenResponse = await plaidClient.linkTokenCreate({
      user: { client_user_id: 'user_good' },
      client_name: 'Budget Buddy',
      products: ['auth', 'transactions'],
      country_codes: ['US'],
      language: 'en',
    });
    res.json(tokenResponse.data);
  } catch (error) {
    console.error("Plaid Error:", error.response?.data || error.message);
    res.status(500).json(error.response?.data || error.message);
  }
});

// Used by your App.tsx to check which products are enabled
app.post('/api/info', (req, res) => {
  res.json({ products: ['auth', 'transactions'] });
});

// --- 4. YOUR EXISTING IMAGE LOGIC ---
const images = [];
app.get('/message/hello', (req, res) => {
    res.send(`Attention HCP Project Team! Front and back ends are connected.`);
});

app.post('/image/upload', (req, res) => {
    images.push(req.body.image);
    res.status(201).send('Image uploaded');
});

// --- 5. STARTUP & DEBUGGING ---
const PORT = 8000;

async function testConnection() {
  const { data, error } = await supabase.from('budgets').select('*').limit(1);
  if (error) console.error('❌ Supabase failed:', error.message);
  else console.log('✅ Supabase connected!');
}

console.log("--- BACKEND ENV CHECK ---");
console.log("PLAID_CLIENT_ID:", process.env.PLAID_CLIENT_ID ? "LOADED" : "MISSING");
console.log("PLAID_SECRET:", process.env.PLAID_SECRET ? "LOADED" : "MISSING");
console.log("--------------------------");

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    testConnection();
});

app.use(unknownEndpoint);