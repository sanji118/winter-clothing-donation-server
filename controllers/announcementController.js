const { ObjectId } = require("mongodb");
const { getCollection } = require("../utils/connectDB")




exports.getAnnouncements = async (req, res) => {
    const collection = getCollection('announcements');
    const data = await collection.find().toArray();
    res.send(data);
}

exports.getAnnouncementById = async (req, res) => {
    const id = req.params.id;
    const collection = getCollection('announcements');
    const result = await collection.findOne({ _id: new ObjectId(id)});
    res.send(result);
}