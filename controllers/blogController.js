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

exports.postCommentToBlog = async (req, res) => {
    try {
        const collection = getCollection('blogs');
        const id = req.params.id;
        const {comment, user} = req.body;

        const newComment = {
            text: comment,
            user,
            date: new Date()
        };

        const result = await collection.updateOne(
            {_id: new ObjectId(id)},
            {$push: { comments : newComment }}
        )

        if (result.modifiedCount > 0) {
            res.status(200).send({ success: true, message: "Comment added", comment: newComment });
            } else {
            res.status(404).send({ success: false, message: "Blog not found" });
        }
    } catch (error) {
        res.status(500).send({ success: false, message: "Failed to add comment", error });
    }
}