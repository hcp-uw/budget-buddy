require('dotenv').config({ path: './.env' });
const util = require('util');
const moment = require('moment');
const crypto = require('crypto');
const express = require("express");
const cors = require("cors");
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const { createClient } = require('@supabase/supabase-js');

// Deterministic UUID from username — same user always gets same ID
function usernameToUUID(username) {
  const hash = crypto.createHash('sha256').update(username.toLowerCase()).digest('hex');
  return [hash.slice(0,8), hash.slice(8,12), hash.slice(12,16), hash.slice(16,20), hash.slice(20,32)].join('-');
}

const app = express();
app.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// --- VARIABLES ---
let ACCESS_TOKEN = null;
let PUBLIC_TOKEN = null;
let ITEM_ID = null;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- HELPER ---
const prettyPrintResponse = (response) => {
  console.log(util.inspect(response.data, { colors: true, depth: 4 }));
};

// --- 3. ROUTES ---

// ✅ CREATE LINK TOKEN - Called by frontend to initialize Plaid Link
app.post('/api/create_link_token', async (req, res) => {
  try {
    const tokenResponse = await plaidClient.linkTokenCreate({
      user: { client_user_id: 'user_' + Date.now() },
      client_name: 'Budget Buddy',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
    });
    console.log('✅ Link token created');
    res.json(tokenResponse.data);
  } catch (error) {
    console.error("❌ Plaid create_link_token error:", JSON.stringify(error.response?.data, null, 2));
    res.status(500).json(error.response?.data || error.message);
  }
});

// ✅ CREATE OR GET USER - Called after Plaid connection
app.post('/api/create_user', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    console.log('📧 Creating/getting user:', email);

    // Check if user exists
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      console.log('✅ User already exists:', email);
      return res.json(existingUser);
    }

    // Create new user
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([{ email }])
      .select()
      .single();

    if (createError) {
      throw createError;
    }

    console.log('✅ New user created:', email);
    res.json(newUser);
  } catch (error) {
    console.error('❌ Error creating user:', error);
    res.status(500).json({ error: error.message || 'Failed to create user' });
  }
});

// ✅ SET ACCESS TOKEN - Exchange public token for access token
app.post('/api/set_access_token', function (request, response, next) {
  console.log('🔑 Setting access token, user_id:', request.body.user_id);
  
  PUBLIC_TOKEN = request.body.public_token;
  const userId = request.body.user_id;
  const institutionName = request.body.institution_name || 'unknown';
  
  Promise.resolve()
    .then(async function () {
      const tokenResponse = await plaidClient.itemPublicTokenExchange({
        public_token: PUBLIC_TOKEN,
      });
      ACCESS_TOKEN = tokenResponse.data.access_token;
      ITEM_ID = tokenResponse.data.item_id;

      if (!userId) {
        console.warn('⚠️ No user_id provided');
        return response.json({ access_token: ACCESS_TOKEN, item_id: ITEM_ID, error: 'No user_id' });
      }

      const { data, error } = await supabase
        .from('plaid_items')
        .insert({
          user_id: userId,
          plaid_access_token: ACCESS_TOKEN,
          plaid_item_id: ITEM_ID,
          institution_name: institutionName,
          status: 'connected'
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase Insert Error:', error);
      } else {
        console.log('✅ Plaid item saved to Supabase');
      }

      response.json({ access_token: ACCESS_TOKEN, item_id: ITEM_ID, error: null });
    })
    .catch((err) => {
      console.error("❌ Plaid set_access_token error:", JSON.stringify(err.response?.data, null, 2));
      next(err);
    });
});

// ✅ GET TRANSACTIONS - Fetch and sync transactions
app.get('/api/transactions', function (request, response, next) {
  console.log('📊 Fetching transactions...');
  
  Promise.resolve()
    .then(async function () {
      if (!ACCESS_TOKEN) {
        return response.status(400).json({ error: 'No access token available' });
      }

      let cursor = null;
      let added = [];
      let modified = [];
      let removed = [];
      let hasMore = true;

      while (hasMore) {
        const syncRequest = {
          access_token: ACCESS_TOKEN,
          cursor: cursor,
        };
        const syncResponse = await plaidClient.transactionsSync(syncRequest);
        const data = syncResponse.data;

        cursor = data.next_cursor;
        added = added.concat(data.added);
        modified = modified.concat(data.modified);
        removed = removed.concat(data.removed);
        hasMore = data.has_more;

        if (data.has_more === false) break;
      }

      console.log(`✅ Found ${added.length} transactions`);

      // Also sync to Supabase if you want to persist
      if (added.length > 0) {
        const transactionsToInsert = added.map(tx => ({
          plaid_transaction_id: tx.transaction_id,
          amount: tx.amount,
          description: tx.description,
          date: tx.date,
          category: tx.personal_finance_category?.primary || 'other',
        }));

        const { error: insertError } = await supabase
          .from('transactions')
          .insert(transactionsToInsert)
          .select();

        if (insertError) {
          console.warn('⚠️ Supabase transaction insert warning:', insertError.message);
        }
      }

      response.json({
        transactions: added,
        added: added,
        modified: modified,
        removed: removed,
      });
    })
    .catch((err) => {
      console.error("❌ Error fetching transactions:", err);
      next(err);
    });
});

// ✅ SIGNUP
app.post('/api/signup', async (req, res) => {
  try {
    const { username, password, monthlyBudget } = req.body;
    if (!username?.trim() || !password?.trim()) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const { data: existing } = await supabase
      .from('users_login')
      .select('username')
      .eq('username', username.trim())
      .single();

    if (existing) return res.status(409).json({ error: 'Username already taken' });

    const userId = usernameToUUID(username.trim());
    const budget = parseInt(monthlyBudget) || 2000;

    const { error: loginError } = await supabase.from('users_login').insert([{
      username: username.trim(),
      password,
      monthly_budget_goal: budget
    }]);
    if (loginError) return res.status(500).json({ error: loginError.message });

    // Ensure user row exists for FK tables (points, streaks, etc.)
    await supabase.from('users').upsert([{
      id: userId,
      email: `${username.trim().toLowerCase()}@local`
    }], { onConflict: 'id' });

    console.log('✅ Signed up:', username.trim(), userId);
    res.json({ userId, username: username.trim(), monthlyBudget: budget });
  } catch (err) {
    console.error('❌ Signup error:', err);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// ✅ LOGIN
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username?.trim() || !password?.trim()) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const { data, error } = await supabase
      .from('users_login')
      .select('*')
      .eq('username', username.trim())
      .eq('password', password)
      .single();

    if (error || !data) return res.status(401).json({ error: 'Invalid username or password' });

    const userId = usernameToUUID(username.trim());

    await supabase.from('users').upsert([{
      id: userId,
      email: `${username.trim().toLowerCase()}@local`
    }], { onConflict: 'id' });

    console.log('✅ Logged in:', username.trim(), userId);
    res.json({ userId, username: data.username, monthlyBudget: data.monthly_budget_goal || 2000 });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ✅ CHANGE PASSWORD
app.post('/api/change-password', async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;
    if (!username || !oldPassword || !newPassword) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const { data, error } = await supabase
      .from('users_login')
      .select('*')
      .eq('username', username)
      .eq('password', oldPassword)
      .single();

    if (error || !data) return res.status(401).json({ error: 'Current password is incorrect' });

    // PK is (username, password), so must delete + reinsert to change password
    await supabase.from('users_login').delete().eq('username', username).eq('password', oldPassword);
    const { error: insertError } = await supabase.from('users_login').insert([{
      username,
      password: newPassword,
      monthly_budget_goal: data.monthly_budget_goal
    }]);

    if (insertError) return res.status(500).json({ error: insertError.message });
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Change password error:', err);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// ✅ UPDATE BUDGET
app.put('/api/update-budget', async (req, res) => {
  try {
    const { username, newBudget } = req.body;
    if (!username || !newBudget) return res.status(400).json({ error: 'Username and budget required' });

    const { error } = await supabase
      .from('users_login')
      .update({ monthly_budget_goal: parseInt(newBudget) })
      .eq('username', username);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Update budget error:', err);
    res.status(500).json({ error: 'Failed to update budget' });
  }
});

// ✅ HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ✅ START SERVER
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log('🚀 Backend server running on http://localhost:' + PORT);
  console.log('📱 Plaid Environment:', process.env.PLAID_ENV || 'sandbox');
  console.log('🗄️  Supabase URL:', supabaseUrl ? '✅ configured' : '❌ NOT configured');
});
