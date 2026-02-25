const express = require("express")
const cors = require("cors")
const { unknownEndpoint } = require('./middleware');

// create your express application
const app = express();

// enable json parsing
app.use(express.json());

// enable cors
app.use(cors());

// our 'database'. This is just a simple in-memory store for the images, and
// will be lost when the server is restarted. In a real application, you would
// use a database to store the images.
const images = [];

// test endpoint
app.get('/message/hello', (req, res) => {
    res.send(
        `Attention HCP Project Team! If you see this, your front end and
        back end are connected. Don't believe me? Upload and image and
        see for yourself!`
    )
})

app.post('/image/upload', (req, res) => {
    console.log(req.body);
    const base64ImgData = req.body.image;
    images.push(base64ImgData);
    res.status(201).send('Image uploaded');
})

app.get('/image/featured', (req, res) => {
    res.send(images);
})

// error handling
app.use(unknownEndpoint);

// set port to listen on
const PORT = 3001;

// start your server
app.listen(PORT, () => {
    console.log(`Server running on port test ${PORT}`);
});

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxvorfxtmshzzbdvprxt.supabase.co';
const supabaseKey = 'sb_publishable_VDInGf_WB3CUxRASkGqNIg_p_Kkjph8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  const { data, error } = await supabase
    .from('budgets') // testing if connection works by trying to select from the 'budgets' tabl
    .select('*')
    .limit(1);

  if (error) {
    console.error('❌ Connection failed:', error.message);
  } else {
    console.log('✅ Connection successful! Data found:', data);
  }
}

testConnection();