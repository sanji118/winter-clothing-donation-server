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

exports.deleteVolunteerData = async (req, res) => {
  try {
    const collection = await getCollection('volunteers');
    const { id } = req.params;
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if(!result.deletedCount) return res.status(404).json({message: 'volunteer not found'});
    res.json({success: true })
  } catch (error) {
    res.status(500).json({message: 'Failed to delete volunteer', error})
  }
}