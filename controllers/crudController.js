// controllers/crudController.js
const { ObjectId } = require('mongodb');
const { getCollection } = require('../utils/connectDB');

const createCrudController = (collectionName) => {
  return {
    getAll: async (req, res) => {
      try {
        const collection = await getCollection(collectionName);
        const data = await collection.find().toArray();
        res.json(data);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch data", error });
      }
    },

    getById: async (req, res) => {
      try {
        const collection = await getCollection(collectionName);
        const item = await collection.findOne({ _id: new ObjectId(req.params.id) });
        if (!item) return res.status(404).json({ message: "Not found" });
        res.json(item);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch item", error });
      }
    },

    create: async (req, res) => {
      try {
        const collection = await getCollection(collectionName);
        const result = await collection.insertOne(req.body);
        res.status(201).json({ success: true, insertedId: result.insertedId });
      } catch (error) {
        res.status(500).json({ message: "Failed to create item", error });
      }
    },

    update: async (req, res) => {
      try {
        const collection = await getCollection(collectionName);
        const result = await collection.updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: req.body }
        );
        if (!result.matchedCount) return res.status(404).json({ message: "Not found" });
        res.json({ success: true });
      } catch (error) {
        res.status(500).json({ message: "Failed to update item", error });
      }
    },

    remove: async (req, res) => {
      try {
        const collection = await getCollection(collectionName);
        const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
        if (!result.deletedCount) return res.status(404).json({ message: "Not found" });
        res.json({ success: true });
      } catch (error) {
        res.status(500).json({ message: "Failed to delete item", error });
      }
    },
  };
};

module.exports = createCrudController;
