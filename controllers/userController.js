const { getCollection } = require("../utils/connectDB");


exports.createUser = async (req, res) => {
  const user = req.body;
  const collection = getCollection('user');

  const existingUser = await collection.findOne({email: user.email });
  if(existingUser) {
    return res.send(existingUser);
  }

  const newUser = {
    name: user.name,
    email: user.email,
    photo : user.photoURL || 'https://i.postimg.cc/vmCTB2Yb/default-user.jpg',
    role: 'user',
    joined: new Date().toISOString().split('T')[0],
    phone: user.phone || ''
  }

  const result = await collection.insertOne(newUser);
  res.send(result);
}


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
