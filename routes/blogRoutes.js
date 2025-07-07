const express = require('express');
const { getBlogs, getBlogById, postCommentToBlog } = require('../controllers/blogController');
const blogRoutes = express.Router();

blogRoutes.get('/', getBlogs);
blogRoutes.get('/:id', getBlogById);
blogRoutes.post('/:id/comments', postCommentToBlog);

module.exports = blogRoutes;