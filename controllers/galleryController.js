const { getCollection } = require("../utils/connectDB");

exports.getGallery = async (req, res) => {
  const collection = getCollection('gallery');
  const data = await collection.find().toArray();
  res.send(data);
};

exports.getGalleryItemById = async (req, res) => {
  const id = req.params.id;
  const collection = getCollection('gallery');
  const result = await collection.findOne({ _id: new ObjectId(id) });
  res.send(result);
};


exports.getGalleryBySlug = async (req, res ) => {
  const {slug} = req.params;
  const collection = getCollection('gallery');
  const result = await collection.find({campaignSlug: slug}).toArray();
  if (!result) {
    return res.status(404).json({ message: 'Gallery not found' });
  }

  res.send(result);
}