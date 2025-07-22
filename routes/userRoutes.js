const express = require("express");
const { getUsers, getUserById, createUser, updateUser, deleteUser, updateUserRole } = require("../controllers/userController");

const userRoutes = express.Router();

// CRUD
userRoutes.get("/", getUsers);
userRoutes.get("/:id", getUserById);
userRoutes.post("/", createUser);
userRoutes.patch("/:id", updateUser);
userRoutes.delete("/:id", deleteUser);

// Role update
userRoutes.patch("/:id/role", updateUserRole);

module.exports = userRoutes;
