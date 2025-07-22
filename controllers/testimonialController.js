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

exports.deleteTestimonialData = async (req, res) => {
  try {
    const collection = await getCollection('testimonials');
    const { id } = req.params;
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if(!result.deletedCount) return res.status(404).json({message: 'testimonial not found'});
    res.json({success: true })
  } catch (error) {
    res.status(500).json({message: 'Failed to delete testimonial', error})
  }
}