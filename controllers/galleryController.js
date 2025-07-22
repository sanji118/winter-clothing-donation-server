const { getCollection } = require("../utils/connectDB");
const createCrudController = require('./crudController');
const base = createCrudController("gallery");

module.exports = {
  ...base,

  getGalleryBySlug : async (req, res ) => {
  const {slug} = req.params;
  const collection = getCollection('gallery');
  const result = await collection.find({campaignSlug: slug}).toArray();
  if (!result) {
    return res.status(404).json({ message: 'gallerys not found' });
  }

  res.send(result);
}
};