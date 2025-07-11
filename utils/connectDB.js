const campaigns = require('../data/campaigns.json');
const volunteers = require('../data/volunteers.json');
const testimonials = require('../data/testimonials.json');
const team = require('../data/team.json');
const blogs = require('../data/blogs.json');
const user = require('../data/user.json');
const announcements = require('../data/announcements.json');
const donations = require('../data/donations.json');
const faq = require('../data/faq.json');
const gallery = require('../data/gallery.json');

const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.95qfhdq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri);
let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db('cozyKindness');
        console.log('MongoDB connected');

        const collections = [
            { name: 'campaigns', data: campaigns },
            { name: 'volunteers', data: volunteers },
            { name: 'testimonials', data: testimonials },
            { name: 'blogs', data: blogs },
            { name: 'donations', data: donations },
            { name: 'announcements', data: announcements },
            { name: 'team', data: team },
            { name: 'gallery', data: gallery },
            { name: 'user', data: user },
            { name: 'faq', data: faq },
        ];

        for (const { name, data } of collections) {
            const collection = db.collection(name);

            for (const item of data) {
                const filter = { _id: item._id }; // Match by _id (assumes _id is unique and present in JSON)
                const update = { $set: item };
                const options = { upsert: true }; // Insert if not found, update if exists

                await collection.updateOne(filter, update, options);
            }

            console.log(`${name} synced with MongoDB.`);
        }
    } catch (error) {
        console.error('DB connection failed:', error);
    }
}

function getCollection(name) {
    if (!db) {
        throw new Error('Call connectDB() first');
    }
    return db.collection(name);
}

module.exports = { connectDB, getCollection };
