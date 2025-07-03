const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const donations = require('./donation.json');
const volunteers = require('./volunteers.json');
const testimonials = require('./testimonials.json');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.95qfhdq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const port = 5000;


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());


const logger = (req, res, next)=>{
  console.log('inside the logger.');
  next();
}

const verifyJWT = (req, res, next) =>{
  const token = req.cookies?.token;
  console.log("token recieved", token);
  if(!token){
    return res.json({message: 'Unauthorized No token'});
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.json({message : 'Invalid token'})
  }
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    await client.connect();
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    const donationCollection = client.db('cozyKindness').collection('donations');
    const volunteerCollection = client.db('cozyKindness').collection('volunteers');
    const testimonialCollection = client.db('cozyKindness').collection('testimonials');



    const donationCount = await donationCollection.estimatedDocumentCount();
    if(donationCount === 0){
        await donationCollection.insertMany(donations);
        console.log('donation seeded.')
    }
    const volunteerCount = await volunteerCollection.estimatedDocumentCount();
    if(volunteerCount === 0){
      await volunteerCollection.insertMany(volunteers);
      console.log('volunteers seeded')
    }
    const testimonialCount = await testimonialCollection.estimatedDocumentCount();
    if(testimonialCount === 0){
      await testimonialCollection.insertMany(testimonials);
      console.log('Testimonials seeded.')
    }



    //auth related APIs
    app.post('/jwt', async(req, res) =>{
      const {email} = req.body;
      if(!email) return res.send({success: false, message: 'Email is required.'});

      const token = jwt.sign({userEmail: email}, process.env.JWT_SECRET, {expiresIn : '2d'})

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 2 * 1000,
        path: '/',
      }).send({success : true, token});
    });

    app.post('/logout', (req, res) =>{
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
      }).send({success: true})
    })
    // Donation related API
    app.get('/donations', async(req, res)=>{
        try {
            const result = await donationCollection.find().toArray();
            res.send(result);
        } catch (error) {
            res.status(500).send({error});
        }
    })
    app.get('/donations/:id', async (req, res) =>{
      try {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await donationCollection.findOne(query);
        res.json(result);
      } catch (error) {
        res.send({error});
      }
    })


    // Volunteers related API
    app.get('/volunteers', async(req, res)=>{
      try{
        const result = await volunteerCollection.find().toArray();
        res.send(result);
      }catch (error){
        res.status(500).send({error});
      }
    })
    app.get('/volunteers/:id', async (req, res) =>{
      try {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await volunteerCollection.findOne(query);
        res.json(result);
      } catch (error) {
        res.send({error});
      }
    })

    // Testimonial related APIs
    app.get('/testimonals', async(req, res) =>{
      const result = await testimonialCollection.find().toArray();
      res.send(result);
    })
    
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('welcome to cozy kindness server')
})



app.listen(port, ()=>{
    console.log(`My Cozy Kindness is running on port: ${port}`)
})