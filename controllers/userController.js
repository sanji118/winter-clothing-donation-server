const { ObjectId } = require("mongodb");
const { getCollection } = require("../utils/connectDB");


const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  PARTNER: 'partner',
  VOLUNTEER: 'volunteer'
};

exports.getUsers = async (req, res) => {
  const collection = getCollection('users');
  const data = await collection.find().toArray();
  res.send(data);
};

exports.getUserById = async (req, res) => {
  const id = req.params.id;
  const collection = getCollection('users');
  const result = await collection.findOne({ _id: new ObjectId(id) });
  res.send(result);
};


exports.createUser = async (req, res) => {
  try {
    const user = req.body;
    const userCollection = await getCollection('users');

    const existingUser = await userCollection.findOne({ email: user.email });
    if (existingUser) {
      return res.json(existingUser);
    }

    const newUser = {
      name: user.name,
      email: user.email,
      photo: user.photoURL || 'https://i.postimg.cc/vmCTB2Yb/default-user.jpg',
      role: ROLES.USER,
      joined: new Date().toISOString(),
      phone: user.phone || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await userCollection.insertOne(newUser);
    res.status(201).json(result);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ success: false, message: 'Error creating user' });
  }
};


exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate request
    if (!id || !role) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID and role are required' 
      });
    }

    // Validate role
    if (!Object.values(ROLES).includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid role. Valid roles are: ${Object.values(ROLES).join(', ')}` 
      });
    }

    // Prevent self-demotion
    if (id === req.user.id && role !== ROLES.ADMIN) {
      return res.status(403).json({ 
        success: false, 
        message: 'Admins cannot remove their own admin privileges' 
      });
    }

    const userCollection = await getCollection('users');
    
    // Verify user exists
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Update role
    const result = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { role, updatedAt: new Date() } }
    );

    // Audit log (recommended)
    await createAuditLog({
      action: 'UPDATE_USER_ROLE',
      targetUserId: id,
      performedBy: req.user.id,
      oldValue: user.role,
      newValue: role,
      timestamp: new Date()
    });

    res.json({ 
      success: true, 
      message: 'Role updated successfully',
      data: {
        userId: id,
        newRole: role,
        modifiedCount: result.modifiedCount
      }
    });

  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating role',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};