const express = require('express');
const campaignRoutes = require('./campaignRoutes');
const volunteerRoutes = require('./volunteerRoutes');
const blogRoutes = require('./blogRoutes');
const testimonialRoutes = require('./testimonialRoutes');
const donationRoutes = require('./donationRoutes');
const announcementRoutes = require('./announcementRoutes');
const teamRoutes = require('./teamRoutes');
const galleryRoutes = require('./galleryRoutes');
const faqRoutes = require('./faqRoutes');
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const paymentRoutes = require('./paymentRoutes');



const router = express.Router();


router.use(authRoutes)
router.use('/campaigns', campaignRoutes);
router.use('/volunteers', volunteerRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/blogs', blogRoutes);
router.use('/donations', donationRoutes);
router.use('/announcements', announcementRoutes);
router.use('/team', teamRoutes);
router.use('/gallery', galleryRoutes);
router.use('/users', userRoutes);
router.use('/faq', faqRoutes);
router.use('/payment', paymentRoutes);


module.exports = router;