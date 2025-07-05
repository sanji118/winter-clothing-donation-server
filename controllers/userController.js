const { getCollection } = require("../utils/connectDB");

exports.getUsers = async (req, res) => {
  const collection = getCollection('user');
  const data = await collection.find().toArray();
  res.send(data);
};

exports.getUserById = async (req, res) => {
  const id = req.params.id;
  const collection = getCollection('user');
  const result = await collection.findOne({ _id: new ObjectId(id) });
  res.send(result);
};
