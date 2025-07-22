const { getCollection } = require("../utils/connectDB");
const createCrudController = require('./crudController');
const base = createCrudController("faq");

module.exports = {
  ...base,

  getFaqBySlug : async (req, res ) => {
  const {slug} = req.params;
  const collection = getCollection('faq');
  const result = await collection.find({campaignSlug: slug}).toArray();
  if (!result) {
    return res.status(404).json({ message: 'FAQs not found' });
  }

  res.send(result);
}
};


