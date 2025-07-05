const { ObjectId } = require('mongodb');
const { getCollection } = require('../utils/connectDB');

exports.getVolunteers = async (req, res) => {
  const collection = getCollection('volunteers');
  const data = await collection.find().toArray();
  res.send(data);
};

exports.getVolunteerById = async (req, res) => {
  const id = req.params.id;
  const collection = getCollection('volunteers');
  const result = await collection.findOne({ _id: new ObjectId(id) });
  res.send(result);
};
