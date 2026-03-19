require('dotenv').config({ path: './.env' });
const util = require('util');
const moment = require('moment');
const express = require("express");
const cors = require("cors");
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const { createClient } = require('@supabase/supabase-js');
const { unknownEndpoint } = require('../../starter-backend/middleware');

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
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- HELPER ---
const prettyPrintResponse = (response) => {
  console.log(util.inspect(response.data, { colors: true, depth: 4 }));
};

// --- 3. ROUTES ---
app.post('/api/create_link_token', async (req, res) => {
  try {
    const tokenResponse = await plaidClient.linkTokenCreate({
      user: { client_user_id: 'user_good' },
      client_name: 'Budget Buddy',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
    });
    res.json(tokenResponse.data);
  } catch (error) {
    console.error("Plaid create_link_token error:", JSON.stringify(error.response?.data, null, 2));
    res.status(500).json(error.response?.data || error.message);
  }
});

app.post('/api/info', (req, res) => {
  res.json({
    item_id: ITEM_ID,
    access_token: ACCESS_TOKEN,
    products: ['transactions']
  });
});

app.get('/api/debug/plaid-items', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('plaid_items')
      .select('*');
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ 
      count: data.length,
      items: data 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/set_access_token', function (request, response, next) {
  console.log('Full request body:', request.body)  
  PUBLIC_TOKEN = request.body.public_token;
  Promise.resolve()
    .then(async function () {
      const tokenResponse = await plaidClient.itemPublicTokenExchange({
        public_token: PUBLIC_TOKEN,
      });
      ACCESS_TOKEN = tokenResponse.data.access_token;
      ITEM_ID = tokenResponse.data.item_id;

      const { data, error } = await supabase
        .from('plaid_items')
        .insert({
          user_id: '4daed9c1-65c8-4348-9951-7d0df4852110',
          access_token: ACCESS_TOKEN,
          plaid_item_id: ITEM_ID,
          institution_name: 'unknown',
          status: 'connected'
        })
        .select()
        .single();

      if (error) console.error('Supabase Insert Error:', error);
      else console.log('✅ Supabase Insert Success:', data);

      response.json({ access_token: ACCESS_TOKEN, item_id: ITEM_ID, error: null });
    })
    .catch((err) => {
      console.error("Plaid set_access_token error:", JSON.stringify(err.response?.data, null, 2));
      next(err);
    });
});

app.get('/api/transactions', function (request, response, next) {
  Promise.resolve()
    .then(async function () {
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
        if (cursor === "") {
          await sleep(2000);
          continue;
        }

        added = added.concat(data.added);
        modified = modified.concat(data.modified);
        removed = removed.concat(data.removed);
        hasMore = data.has_more;
        prettyPrintResponse(syncResponse);
      }

      // Also sync to Supabase
      if (added.length > 0) {
        try {
          const { error: upsertError } = await supabase
            .from('transactions')
            .insert(
              added.map(t => ({
                user_id: '4daed9c1-65c8-4348-9951-7d0df4852110',
                plaid_item_id: ITEM_ID,
                plaid_transaction_id: t.transaction_id,
                amount: t.amount,
                date: t.date,
                merchant_name: t.merchant_name || t.name,
                category: t.personal_finance_category?.primary || 'Other',
                pending: t.pending
              }))
            );
          
          if (!upsertError) {
            console.log(`✅ Inserted ${added.length} transactions to Supabase with item_id: ${ITEM_ID}`);
          } else {
            console.error('⚠️ Supabase insert error:', upsertError);
          }
        } catch (supabaseError) {
          console.error('⚠️ Supabase sync failed:', supabaseError);
        }
      }

      const compareTxnsByDateAscending = (a, b) =>
        (a.date > b.date) - (a.date < b.date);
      const recently_added = [...added]
        .sort(compareTxnsByDateAscending)
        .slice(-8);
      response.json({ latest_transactions: recently_added });
    })
    .catch(next);
});

app.get('/api/accounts', function (request, response, next) {
  Promise.resolve()
    .then(async function () {
      const accountsResponse = await plaidClient.accountsGet({
        access_token: ACCESS_TOKEN,
      });
      prettyPrintResponse(accountsResponse);
      response.json(accountsResponse.data);
    })
    .catch(next);
});

// --- YOUR EXISTING ROUTES ---
const images = [];
app.get('/message/hello', (req, res) => {
  res.send(`Attention HCP Project Team! Front and back ends are connected.`);
});

app.post('/image/upload', (req, res) => {
  images.push(req.body.image);
  res.status(201).send('Image uploaded');
});


app.post('/api/transactions/sync', async (req, res) => {
    try {
      console.log('🔍 Sync request received...');
      const { data: plaidItems, error: itemError } = await supabase
        .from('plaid_items')
        .select('*')
        .eq('user_id', '4daed9c1-65c8-4348-9951-7d0df4852110')
        .order('created_at', { ascending: false })
        .limit(1);

        console.log('📦 Supabase query result:', { data: plaidItems, error: itemError });
        
        if (itemError) {
          console.error('❌ Error fetching plaid item from Supabase:', itemError);
          return res.status(500).json({ error: 'Failed to fetch plaid item', details: itemError });
        }
        
        if (!plaidItems || plaidItems.length === 0) {
          return res.status(404).json({ error: 'No plaid items found for this user' });
        }
        
        const plaidItem = plaidItems[0];
        console.log('✅ Found plaid item:', plaidItem.plaid_item_id);

        // Decode the hex-encoded access token if needed
        let accessToken = plaidItem.access_token;
        if (accessToken.startsWith('\\x')) {
          // It's hex-encoded, convert it back to string
          accessToken = Buffer.from(accessToken.slice(2), 'hex').toString('utf8');
          console.log('Decoded access token:', accessToken);
        }

        let cursor = plaidItem.cursor || null;
        let added = [];
        let modified = [];
        let removed = [];
        let hasMore = true;

        // Sync all transactions from Plaid
        while(hasMore) {
          const syncRequest = await plaidClient.transactionsSync({
            access_token: accessToken,
            cursor: cursor,
          });

          added = added.concat(syncRequest.data.added);
          modified = modified.concat(syncRequest.data.modified);
          removed = removed.concat(syncRequest.data.removed);
          cursor = syncRequest.data.next_cursor;  
          hasMore = syncRequest.data.has_more;
        }

        // Upsert added transactions
        if (added.length > 0) {
          const { error: upsertError } = await supabase
            .from('transactions')
            .insert(
              added.map(t => ({
                user_id: '4daed9c1-65c8-4348-9951-7d0df4852110',
                plaid_item_id: plaidItem.plaid_item_id,
                plaid_transaction_id: t.transaction_id,
                amount: t.amount,
                date: t.date,
                merchant_name: t.merchant_name || t.name,
                category: t.personal_finance_category?.primary || 'Other',
                pending: t.pending
              }))
            );
          
          if (upsertError) {
            console.error('❌ Error inserting transactions:', upsertError);
          } else {
            console.log(`✅ Inserted ${added.length} transactions`);
          }
        }

        // Handle modified transactions
        if (modified.length > 0) {
          const { error: updateError } = await supabase
            .from('transactions')
            .upsert(
              modified.map(t => ({
                user_id: '4daed9c1-65c8-4348-9951-7d0df4852110',
                plaid_transaction_id: t.transaction_id,
                amount: t.amount,
                date: t.date,
                merchant_name: t.merchant_name || t.name,
                category: t.personal_finance_category?.primary || 'Other',
                pending: t.pending
              })),
              { onConflict: 'plaid_transaction_id' }
            );
          
          if (updateError) {
            console.error('❌ Error updating transactions:', updateError);
          } else {
            console.log(`✅ Updated ${modified.length} transactions`);
          }
        }

        // Handle removed transactions
        if (removed.length > 0) {
          const removedIds = removed.map(t => t.transaction_id);
          const { error: deleteError } = await supabase
            .from('transactions')
            .delete()
            .in('plaid_transaction_id', removedIds)
            .eq('user_id', '4daed9c1-65c8-4348-9951-7d0df4852110');
          
          if (deleteError) {
            console.error('Error deleting transactions:', deleteError);
          } else {
            console.log(`✅ Deleted ${removed.length} transactions`);
          }
        }

        // Update cursor in Supabase
        await supabase
          .from('plaid_items')
          .update({ cursor: cursor })
          .eq('user_id', '4daed9c1-65c8-4348-9951-7d0df4852110');

        res.json({ added: added.length, modified: modified.length, removed: removed.length });

  } catch (error) {
    console.error('Sync error:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

// --- STARTUP ---
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