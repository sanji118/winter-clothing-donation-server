const { getCollection } = require('../utils/connectDB');

exports.getTestimonials = async (req, res) => {
  const collection = getCollection('testimonials');
  const data = await collection.find().toArray();
  res.send(data);
};
