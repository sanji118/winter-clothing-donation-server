const express = require('express');
const blogController = require('../controllers/blogController');
const blogRoutes = express.Router();

blogRoutes.get("/", blogController.getAll);
blogRoutes.get("/:id", blogController.getById);
blogRoutes.post("/", blogController.create);
blogRoutes.patch("/:id", blogController.update);
blogRoutes.delete("/:id", blogController.remove);
blogRoutes.post('/:id/comments', blogController.postCommentToBlog);

module.exports = blogRoutes;

