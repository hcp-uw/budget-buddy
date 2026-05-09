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
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('🔍 Environment Variables Check:');
console.log('  SUPABASE_URL exists:', !!supabaseUrl);
console.log('  SUPABASE_ANON_KEY exists:', !!supabaseKey);
console.log('  VITE_SUPABASE_URL exists:', !!process.env.VITE_SUPABASE_URL);
console.log('  VITE_SUPABASE_ANON_KEY exists:', !!process.env.VITE_SUPABASE_ANON_KEY);

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ CRITICAL: Supabase credentials not found!');
  console.error('   Make sure .env has SUPABASE_URL and SUPABASE_ANON_KEY (without VITE_ prefix)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// --- HELPER ---
const prettyPrintResponse = (response) => {
  console.log(util.inspect(response.data, { colors: true, depth: 4 }));
};

// --- 3. ROUTES ---

// ✅ CREATE LINK TOKEN - Called by frontend to initialize Plaid Link
app.post('/api/create_link_token', async (req, res) => {
  try {
    console.log('🔗 Creating link token...');
    const tokenResponse = await plaidClient.linkTokenCreate({
      user: { client_user_id: 'user_' + Date.now() },
      client_name: 'Budget Buddy',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
    });
    console.log('✅ Link token created successfully');
    res.json(tokenResponse.data);
  } catch (error) {
    console.error("❌ Plaid create_link_token error:", error.message);
    console.error("Details:", error.response?.data || error);
    res.status(500).json({ 
      error: error.message || 'Failed to create link token',
      details: error.response?.data 
    });
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
      
      console.log('🔍 DEBUG: ACCESS_TOKEN type:', typeof ACCESS_TOKEN);
      console.log('🔍 DEBUG: ACCESS_TOKEN value:', ACCESS_TOKEN);
      console.log('🔍 DEBUG: ACCESS_TOKEN length:', ACCESS_TOKEN?.length);

      if (!userId) {
        console.warn('⚠️ No user_id provided');
        return response.json({ access_token: ACCESS_TOKEN, item_id: ITEM_ID, error: 'No user_id' });
      }

      const { data, error } = await supabase
        .from('plaid_items')
        .insert({
          user_id: userId,
          plaid_item_id: ITEM_ID,
          access_token: String(ACCESS_TOKEN),
          institution_name: institutionName,
          status: 'connected'
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase Insert Error:', error);
      } else {
        console.log('✅ Plaid item saved to Supabase for user:', userId);
        console.log('📝 Saved access token to DB');
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
  const userId = request.query.user_id;
  console.log('📊 Fetching transactions for user:', userId);
  
  if (!userId) {
    return response.status(400).json({ error: 'user_id is required' });
  }

  Promise.resolve()
    .then(async function () {
      // Get the access token from Supabase for this user
      const { data: plaidItem, error: fetchError } = await supabase
        .from('plaid_items')
        .select('access_token, plaid_item_id')
        .eq('user_id', userId)
        .single();

      if (fetchError || !plaidItem) {
        console.error('❌ No Plaid item found for user:', fetchError);
        return response.status(400).json({ error: 'No Plaid connection found. Please connect your bank first.' });
      }

      const accessToken = plaidItem.access_token;
      console.log('🔍 DEBUG: Retrieved accessToken type:', typeof accessToken);
      console.log('🔍 DEBUG: Retrieved accessToken value:', accessToken);
      console.log('🔍 DEBUG: Retrieved accessToken length:', accessToken?.length);
      
      // If the token is hex-encoded (from bytea column), decode it
      let decodedToken = accessToken;
      if (typeof accessToken === 'string' && accessToken.startsWith('\\x')) {
        console.log('🔄 Decoding hex-encoded token...');
        try {
          decodedToken = Buffer.from(accessToken.slice(2), 'hex').toString('utf8');
          console.log('✅ Decoded token:', decodedToken);
        } catch (e) {
          console.error('❌ Failed to decode token:', e);
          decodedToken = accessToken;
        }
      }
      
      if (!decodedToken) {
        return response.status(400).json({ error: 'No access token available' });
      }

      let cursor = null;
      let added = [];
      let modified = [];
      let removed = [];
      let hasMore = true;

      console.log('🔗 Starting transaction sync with Plaid...');
      console.log('   Using access token:', decodedToken.substring(0, 20) + '...');

      while (hasMore) {
        const syncRequest = {
          access_token: decodedToken,
          cursor: cursor,
        };
        console.log('📡 Calling transactionsSync, cursor:', cursor || 'null (initial)');
        const syncResponse = await plaidClient.transactionsSync(syncRequest);
        const data = syncResponse.data;

        console.log('   Response: has_more=', data.has_more, 'added=', data.added?.length, 'modified=', data.modified?.length);

        // Handle Plaid API quirk: empty cursor means retry
        cursor = data.next_cursor;
        if (cursor === "") {
          console.log('⏳ Empty cursor returned, waiting 2 seconds before retry...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }

        added = added.concat(data.added);
        modified = modified.concat(data.modified);
        removed = removed.concat(data.removed);
        hasMore = data.has_more;

        if (data.has_more === false) break;
      }

      console.log(`✅ Found ${added.length} transactions total`);

      // Also sync to Supabase if you want to persist
      if (added.length > 0) {
        const transactionsToInsert = added.map(tx => ({
          user_id: userId,
          plaid_transaction_id: tx.transaction_id,
          plaid_item_id: plaidItem.plaid_item_id || tx.account_id,
          amount: tx.amount,
          merchant_name: tx.merchant_name || tx.name,
          date: tx.date,
          category: tx.personal_finance_category?.primary || 'other',
          pending: tx.pending || false,
        }));

        const { error: insertError } = await supabase
          .from('transactions')
          .insert(transactionsToInsert)
          .select();

        if (insertError) {
          console.warn('⚠️ Supabase transaction insert warning:', insertError.message);
        } else {
          console.log('✅ Transactions saved to Supabase');
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

    console.log('📝 Signup attempt for username:', username.trim());

    const { data: existing, error: checkError } = await supabase
      .from('users_login')
      .select('username')
      .eq('username', username.trim())
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Error checking existing user:', checkError);
      return res.status(500).json({ error: 'Database error: ' + checkError.message });
    }

    if (existing) return res.status(409).json({ error: 'Username already taken' });

    const userId = usernameToUUID(username.trim());
    const budget = parseInt(monthlyBudget) || 2000;

    console.log('  Creating user in users_login table...');
    const { error: loginError } = await supabase.from('users_login').insert([{
      username: username.trim(),
      password,
      monthly_budget_goal: budget
    }]);
    
    if (loginError) {
      console.error('❌ Signup error (users_login insert):', loginError);
      return res.status(500).json({ error: 'Signup failed: ' + loginError.message });
    }

    // Ensure user row exists for FK tables (points, streaks, etc.)
    console.log('  Creating user in users table...');
    const { error: userError } = await supabase.from('users').upsert([{
      id: userId,
      email: `${username.trim().toLowerCase()}@local`
    }], { onConflict: 'id' });

    if (userError) {
      console.error('❌ Signup error (users insert):', userError);
      return res.status(500).json({ error: 'User creation failed: ' + userError.message });
    }

    console.log('✅ Signed up:', username.trim(), userId);
    res.json({ userId, username: username.trim(), monthlyBudget: budget });
  } catch (err) {
    console.error('❌ Signup error (exception):', err);
    res.status(500).json({ error: 'Signup failed: ' + err.message });
  }
});

// ✅ LOGIN
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username?.trim() || !password?.trim()) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    console.log('🔐 Login attempt for username:', username.trim());

    const { data, error } = await supabase
      .from('users_login')
      .select('*')
      .eq('username', username.trim())
      .eq('password', password)
      .single();

    if (error) {
      console.error('❌ Login error:', error);
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    if (!data) {
      console.warn('⚠️ No user found for username:', username.trim());
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const userId = usernameToUUID(username.trim());

    await supabase.from('users').upsert([{
      id: userId,
      email: `${username.trim().toLowerCase()}@local`
    }], { onConflict: 'id' });

    console.log('✅ Logged in:', username.trim(), userId);
    res.json({ userId, username: data.username, monthlyBudget: data.monthly_budget_goal || 2000 });
  } catch (err) {
    console.error('❌ Login error (exception):', err);
    res.status(500).json({ error: 'Login failed: ' + err.message });
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

// ✅ SANDBOX TEST - Verify Plaid configuration
app.get('/api/sandbox-test', (req, res) => {
  res.json({
    status: 'ok',
    plaid: {
      environment: process.env.PLAID_ENV || 'sandbox',
      hasClientId: !!process.env.PLAID_CLIENT_ID,
      hasSecret: !!process.env.PLAID_SECRET,
      sandboxTestCredentials: {
        bank: 'Plaid Sandbox Bank',
        institution_id: 'ins_127537',
        username: 'user_good',
        password: 'pass_good',
        mfa: '1111',
        note: 'Use these exact credentials (lowercase) in the Plaid Link flow'
      }
    },
    supabase: {
      connected: !!supabaseUrl,
    }
  });
});

// ✅ START SERVER
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log('🚀 Backend server running on http://localhost:' + PORT);
  console.log('📱 Plaid Environment:', process.env.PLAID_ENV || 'sandbox');
  console.log('🗄️  Supabase URL:', supabaseUrl ? '✅ configured' : '❌ NOT configured');
});
