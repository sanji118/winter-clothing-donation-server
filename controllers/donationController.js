const { ObjectId } = require('mongodb');
const { getCollection } = require('../utils/connectDB');

exports.getDonations = async (req, res) => {
  const collection = getCollection('donations');
  const data = await collection.find().toArray();
  res.send(data);
};

exports.getDonationById = async (req, res) => {
  const id = req.params.id;
  const collection = getCollection('donations');
  const result = await collection.findOne({ _id: new ObjectId(id) });
  res.send(result);
};


exports.getDonationBySlug = async (req, res ) => {
  const {slug} = req.params;
  const collection = getCollection('donations');
  const result = await collection.find({campaignSlug: slug}).toArray();
  if (!result) {
    return res.status(404).json({ message: 'Donation not found' });
  }

  res.send(result);
}

exports.postDonationData = async (req, res) => {
  const {campaignSlug, name, userId, amount, date, method, transactionId} = req.body;

  if(!campaignSlug || !name || !userId || !amount || !date || !method || !transactionId) {
    return res.status(400).json({ message: 'Missing required fields.'})
  }

  const donationData = {
    campaignSlug,
    name,
    userId,
    amount : Number(amount),
    date : new Date(),
    method,
    transactionId,
    paymentStatus: 'success'
  };


  try {
    const collection = getCollection('donations');
    const result = await collection.insertOne(donationData);

    res.status(201).json({
      message: 'Donation Successfull',
      insertedId: result.insertedId,
    })
  } catch (error) {
    console.error('Donation insertion failed:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}