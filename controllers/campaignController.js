const { ObjectId } = require('mongodb');
const { getCollection } = require('../utils/connectDB');

exports.getCampaigns = async (req, res) => {
  const collection = getCollection('campaigns');
  const data = await collection.find().toArray();
  res.send(data);
};

exports.getCampaignById = async (req, res) => {
  const id = req.params.id;
  const collection = getCollection('campaigns');
  const result = await collection.findOne({ _id: new ObjectId(id) });
  res.send(result);
};
