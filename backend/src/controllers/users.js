const prisma = require('../db');
const createHttpError = require('http-errors');

// Create a new user
const createUser = async (req, res, next) => {
  try {
    const { name, username, password, departmentsId, permissions } = req.body;

    if (!username || !password) {
      throw createHttpError(400, 'Username and password are required');
    }

    const existingUser = await prisma.users.findFirst({ where: { username } });
    if (existingUser) {
      throw createHttpError(409, 'Username already exists');
    }

    // Ensure departmentsId is an array
    const departments = Array.isArray(departmentsId) ? departmentsId : JSON.parse(departmentsId || '[]');

    const user = await prisma.users.create({
      data: {
        name,
        username,
        password, // Consider hashing the password before saving
        departmentsId: { set: departments }, // Update to use the array
        permissions: permissions || ['BASIC_ACCESS'],
      },
    });

    res.status(201).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// Get all users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.users.findMany();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// Update a user
const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { name, username, password, departmentsId, permissions } = req.body;

  // Ensure departmentsId is an array
  const departments = Array.isArray(departmentsId) ? departmentsId : [];

  try {
    const user = await prisma.users.update({
      where: { id: parseInt(id) },
      data: {
        name,
        username,
        password, // Consider hashing the password before saving
        departmentsId: { set: departments }, // Update to use the array
        permissions,
      },
    });

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// Delete a user
const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    await prisma.users.delete({
      where: { id: parseInt(id) },
    });

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
const getUserById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await prisma.users.findFirst({ where: { id: parseInt(id) } });
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    res.json(user);
  } catch (error) { 
    next(error);
  }

}
module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById
};
