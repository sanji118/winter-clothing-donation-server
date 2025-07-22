
const createCrudController = require('./crudController');
const base = createCrudController("blogs");

module.exports = {
  ...base,
  postCommentToBlog : async (req, res) => {
    try {
        const collection = getCollection('blogs');
        const id = req.params.id;
        const {comment, user} = req.body;

        const newComment = {
            text: comment,
            user,
            date: new Date(),
            likes: 0
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
};


