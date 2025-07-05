const { getCollection } = require("../utils/connectDB");

exports.getFaqs = async (req, res) => {
  const collection = getCollection('faq');
  const data = await collection.find().toArray();
  res.send(data);
};

exports.getFaqById = async (req, res) => {
  const id = req.params.id;
  const collection = getCollection('faq');
  const result = await collection.findOne({ _id: new ObjectId(id) });
  res.send(result);
};