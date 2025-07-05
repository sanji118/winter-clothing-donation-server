const { ObjectId } = require("mongodb");
const { getCollection } = require("../utils/connectDB")

exports.getBlogs = async (req, res) => {
    const collection = getCollection('blogs');
    const data = await collection.find().toArray();
    res.send(data);
}

exports.getBlogById = async (req, res) =>{
    const collection = getCollection('blogs');
    const id = req.params.id;
    const result = await collection.findOne({_id: new ObjectId(id) });
    res.send(result);
}