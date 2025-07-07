const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { connectDB } = require('./utils/connectDB');
const allRoutes = require('./routes/allRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


app.use(allRoutes); 


app.get('/', (req, res) => {
  res.send('Welcome to Cozy Kindness Server!');
});


connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Cozy Kindness running on port ${port}`);
  });
}).catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
});
