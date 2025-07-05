const { getCollection } = require("../utils/connectDB");

exports.getTeam = async (req, res) => {
  const collection = getCollection('team');
  const data = await collection.find().toArray();
  res.send(data);
};

exports.getTeamMemberById = async (req, res) => {
  const id = req.params.id;
  const collection = getCollection('team');
  const result = await collection.findOne({ _id: new ObjectId(id) });
  res.send(result);
};