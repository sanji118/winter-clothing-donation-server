const { ObjectId } = require("mongodb");
const { getCollection } = require("../utils/connectDB");

const ROLES = {
  USER: "user",
  ADMIN: "admin",
  PARTNER: "partner",
  VOLUNTEER: "volunteer",
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const collection = await getCollection("users");
    const data = await collection.find().toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users", error });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await getCollection("users");
    const result = await collection.findOne({ _id: new ObjectId(id) });
    if (!result) return res.status(404).json({ success: false, message: "User not found" });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching user", error });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const user = req.body;
    const collection = await getCollection("users");

    // Check if user exists
    const existingUser = await collection.findOne({ email: user.email });
    if (existingUser) return res.json(existingUser);

    const newUser = {
      name: user.name,
      email: user.email,
      photo: user.photoURL || "https://i.postimg.cc/vmCTB2Yb/default-user.jpg",
      role: ROLES.USER,
      joined: new Date().toISOString(),
      phone: user.phone || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newUser);
    res.status(201).json(result);
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ success: false, message: "Error creating user" });
  }
};

// Update user (except role)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const collection = await getCollection("users");

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } }
    );

    if (!result.modifiedCount) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ success: false, message: "Error updating user" });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await getCollection("users");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (!result.deletedCount) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ success: false, message: "Error deleting user" });
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!id || !role) return res.status(400).json({ success: false, message: "User ID and role are required" });

    if (!Object.values(ROLES).includes(role)) {
      return res.status(400).json({ success: false, message: `Invalid role. Valid roles: ${Object.values(ROLES).join(", ")}` });
    }

    const collection = await getCollection("users");
    const user = await collection.findOne({ _id: new ObjectId(id) });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { role, updatedAt: new Date() } }
    );

    res.json({ success: true, message: "Role updated successfully", modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error("Update role error:", error);
    res.status(500).json({ success: false, message: "Error updating role" });
  }
};
