const express = require('express')
const cors = require('cors');
require('dotenv').config();
const donations = require('./donation.json');
const volunteers = require('./volunteers.json');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const { JsonWebTokenError } = require('jsonwebtoken');
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
    return res.send({message: 'Unauthorized No token'});
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) =>{

    })
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


    // Donation related API
    app.get('/donations', async(req, res)=>{
        try {
            const result = await donationCollection.find().toArray();
            res.send(result);
        } catch (error) {
            res.status(500).send({error});
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