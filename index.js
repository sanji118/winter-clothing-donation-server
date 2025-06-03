const express = require('express')
const cors = require('cors');
const donations = require('./donation.json')
const app = express();
const port = 3100


app.use(cors());

app.get('/', (req, res)=>{
    res.send('welcome to cozy kindness server')
})

app.get('/donations', (req, res)=>{
    res.send(donations)
})

app.listen(port, ()=>{
    console.log(`My Cozy Kindness is running on port: ${port}`)
})