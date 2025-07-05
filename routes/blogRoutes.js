const express = require('express');
const { getBlogs, getBlogById } = require('../controllers/blogController');
const blogRoutes = express.Router();

blogRoutes.get('/', getBlogs);
blogRoutes.get('/:id', getBlogById);

module.exports = blogRoutes;