const createCrudController = require('./crudController');
const { ObjectId } = require('mongodb');
const { getCollection } = require('../utils/connectDB');

// Base CRUD
const base = createCrudController("donations");

// Exporting all with custom overrides
module.exports = {
  ...base,

  // Custom create (replaces default base.create)
  create: async (req, res) => {
    const { campaignSlug, name, userId, amount, date, method, transactionId } = req.body;

    if (!campaignSlug || !name || !userId || !amount || !date || !method || !transactionId) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const donationData = {
      campaignSlug,
      name,
      userId,
      amount: Number(amount),
      date: new Date(),
      method,
      transactionId,
      paymentStatus: 'success'
    };

    try {
      const collection = await getCollection('donations');
      const result = await collection.insertOne(donationData);

      res.status(201).json({
        message: 'Donation Successful',
        insertedId: result.insertedId,
      });
    } catch (error) {
      console.error('Donation insertion failed:', error);
      res.status(500).json({ message: 'Internal server error', error });
    }
  },

  // Custom endpoint to get donations by campaignSlug
  getDonationBySlug: async (req, res) => {
    try {
      const { slug } = req.params;
      const collection = await getCollection('donations');
      const result = await collection.find({ campaignSlug: slug }).toArray();

      if (!result || result.length === 0) {
        return res.status(404).json({ message: 'No donations found for this campaign' });
      }

      res.json(result);
    } catch (error) {
      console.error('Error fetching donations by slug:', error);
      res.status(500).json({ message: 'Failed to fetch donations', error });
    }
  },
};
