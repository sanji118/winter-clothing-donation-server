// controllers/campaignController.js
const { ObjectId } = require('mongodb');
const { getCollection } = require('../utils/connectDB');
const createCrudController = require('./crudController');

// Base CRUD
const base = createCrudController("campaigns");
exports.getAll = base.getAll;
exports.getById = base.getById;
exports.create = base.create;
exports.update = base.update;
exports.remove = base.remove;

// Custom: Get campaign by slug
exports.getCampaignBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const collection = await getCollection('campaigns');
    const result = await collection.findOne({ slug });
    if (!result) return res.status(404).json({ message: 'Campaign not found' });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch campaign', error });
  }
};

// Custom: Post comment
exports.postCommentToCampaign = async (req, res) => {
  try {
    const collection = await getCollection('campaigns');
    const id = req.params.id;
    const { comment, user } = req.body;
    const newComment = { text: comment, user, date: new Date(), likes: 0 };

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $push: { comments: newComment } }
    );

    if (result.modifiedCount > 0)
      res.json({ success: true, comment: newComment });
    else res.status(404).json({ success: false, message: "Campaign not found" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add comment", error });
  }
};
