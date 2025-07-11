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
  const result = await collection.findOne({slug});
  if (!result) {
    return res.status(404).json({ message: 'Donation not found' });
  }

  res.send(result);
}