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
      const { data: plaidItem, error: itemError } = await supabase
        .from('plaid_items')
        .select('*')
        .eq('user_id', '4daed9c1-65c8-4348-9951-7d0df4852110')
        .single();

        if (itemError) {
          console.error('Error fetching plaid item from Supabase:', itemError);
          return res.status(500).json({ error: 'Failed to fetch plaid item' });
        }

        let cursor = plaidItem.cursor || null;
        let added = [];
        let hasMore = true;

        while(hasMore) {
          const syncRequest = await plaidClient.transactionsSync({
            access_token: plaidItem.access_token,
            cursor: cursor,
          });

          added = added.concat(syncRequest.data.added);
          cursor = syncRequest.data.next_cursor;  
          hasMore = syncRequest.data.has_more;
        }

        if (added.length > 0) {
          await supabase .from('transactions')
          .upsert(
            added.map(t => ({
              user_id: '4daed9c1-65c8-4348-9951-7d0df4852110',
              plaid_item_id: plaidItem.plaid_item_id,
              plaid_transaction_id: t.transaction_id,
              amount: t.amount,
              date: t.date,
              merchant_name: t.merchant_name,
              category: t.personal_finance_category?.primary || 'Other',
              pending: t.pending
            })),
            { onConflict: 'plaid_transaction_id' }
          )
        }
                await supabase
          .from('plaid_items')
          .update({ cursor: cursor })
          .eq('user_id', '4daed9c1-65c8-4348-9951-7d0df4852110');

        console.log(`✅ Synced ${added.length} transactions`);
        res.json({ synced: added.length });

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