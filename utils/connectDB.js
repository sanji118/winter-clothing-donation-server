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

async function connectDB(callback) {
    try {
        await client.connect();
        db = client.db('cozyKindness');
        const collections = [
            {name: 'campaigns', data: campaigns},
            {name: 'volunteers', data: volunteers},
            {name: 'testimonials', data: testimonials},
            {name: 'blogs', data: blogs},
            {name: 'donations', data: donations},
            {name: 'announcements', data: announcements},
            {name: 'team', data: team},
            {name: 'gallery', data: gallery},
            {name: 'user', data: user},
            {name: 'faq', data: faq},

        ];

        for (const {name, data} of collections) {
            const collection = db.collection(name);
            const count = await collection.estimatedDocumentCount();
            if(count === 0){
                await collection.insertMany(data);
                console.log(`${name} seeded.`);
            }
        }


        callback();
    } catch (error) {
        console.log(error);
    }
}

function getCollection(name){
    return db.collection(name);
}


module.exports = {connectDB, getCollection};