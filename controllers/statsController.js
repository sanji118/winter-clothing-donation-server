const { getCollection } = require("../utils/connectDB")

exports.getAdminStats = async (req, res) => {
    try {
        const [
            campaignCollection,
            volunteerCollection,
            blogCollection,
            testimonialCollection,
            donationCollection,
            announcementCollection,
            teamCollection,
            galleryCollection,
            faqCollection,
            userCollection
        ] = await Promise.all([
            getCollection('campaigns'),
            getCollection('volunteers'),
            getCollection('blogs'),
            getCollection('testimonials'),
            getCollection('donations'),
            getCollection('announcements'),
            getCollection('team'),
            getCollection('gallery'),
            getCollection('faqs'),
            getCollection('users')
        ]);

        const [
            totalCampaigns,
            totalVolunteers,
            totalBlogs,
            totalTestimonials,
            totalDonations,
            totalAnnouncements,
            totalTeamMembers,
            totalGalleryItems,
            totalFAQs,
            totalUsers,
            totalDonationAmount
        ] = await Promise.all([
            campaignCollection.countDocuments(),
            volunteerCollection.countDocuments(),
            blogCollection.countDocuments(),
            testimonialCollection.countDocuments(),
            donationCollection.countDocuments(),
            announcementCollection.countDocuments(),
            teamCollection.countDocuments(),
            galleryCollection.countDocuments(),
            faqCollection.countDocuments(),
            userCollection.countDocuments(),
            donationCollection.aggregate([
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]).toArray()
        ])

        res.json({
            success: true,
            stats: {
                totalCampaigns,
                totalVolunteers,
                totalBlogs,
                totalTestimonials,
                totalDonations,
                totalDonationAmount: totalDonationAmount[0]?.total || 0,
                totalAnnouncements,
                totalTeamMembers,
                totalGalleryItems,
                totalFAQs,
                totalUsers
            }
        });
    } catch(error) {
        console.log('Stats Error: ', error);
        res.status(500).json({ success: false, message: 'Failed to fetch admin statistics', error});
    }
}