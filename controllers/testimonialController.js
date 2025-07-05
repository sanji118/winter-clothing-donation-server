const { ObjectId } = require('mongodb');
const { getCollection } = require('../utils/connectDB');


exports.getTestimonials = async (req, res) => {
  const collection = getCollection('testimonials');
  const data = await collection.find().toArray();
  res.send(data);
};

exports.getTestimonialById = async (req, res) => {
  const collection = getCollection('testimonials');
  const id = req.params.id;
  const result = await collection.findOne({_id: ObjectId(id)});
  res.send(result);
};