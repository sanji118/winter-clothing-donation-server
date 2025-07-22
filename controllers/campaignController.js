const { ObjectId } = require('mongodb');
const { getCollection } = require('../utils/connectDB');

exports.getCampaigns = async (req, res) => {
  const collection = getCollection('campaigns');
  const data = await collection.find().toArray();
  res.send(data);
};

exports.getCampaignById = async (req, res) => {
  const id = req.params.id;
  const collection = getCollection('campaigns');
  const result = await collection.findOne({ _id: new ObjectId(id) });
  res.send(result);
};


exports.getCampaignBySlug = async (req, res) => {
  const {slug} = req.params;
  const collection = getCollection('campaigns');
  const result = await collection.findOne({slug : slug});
  if (!result) {
    return res.status(404).json({ message: 'Campaign not found' });
  }

  res.send(result);
}


exports.postCommentToCampaign = async (req, res) => {
    try {
        const collection = getCollection('campaigns');
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


exports.createCampaign = async (req, res) => {
  try {
    const newCampaign = req.body;
    const collection = await getCollection("campaigns");
    const result = await collection.insertOne(newCampaign);
    res.status(201).json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    res.status(500).json({ message: "Failed to create campaign", error });
  }
};

exports.updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const collection = await getCollection("campaigns");
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    if (!result.matchedCount) return res.status(404).json({ message: "Campaign not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to update campaign", error });
  }
};


exports.deleteCampaignData = async (req, res) => {
  try {
    const collection = await getCollection('campaigns');
    const { id } = req.params;
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if(!result.deletedCount) return res.status(404).json({message: 'Campaign not found'});
    res.json({success: true })
  } catch (error) {
    res.status(500).json({message: 'Failed to delete campaign', error})
  }
}