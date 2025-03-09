// auth.js
const prisma = require('./db');
const { generateToken } = require('./utils');
const createHttpError = require('http-errors');

// Register a new user
const register = async (req, res, next) => {
  try {
    const { username, password, permissions } = req.body;

    if (!username || !password) {
      throw createHttpError(400, 'Username and password are required');
    }

    if (password.length < 6) {
      throw createHttpError(400, 'Password must be at least 6 characters');
    }

    const existingUser = await prisma.users.findFirst({ where: { username } });
    if (existingUser) {
      throw createHttpError(409, 'Username already exists');
    }

    // Directly use the password without hashing
    const user = await prisma.users.create({
      data: {
        username,
        password, // Use the plain password
        permissions: permissions || ['BASIC_ACCESS'],
      },
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    });

    const token = generateToken({ id: user.id, username: user.username, permissions: user.permissions });
    res.status(201).json({ success: true, token, user });
  } catch (error) {
    next(error);
  }
};

// Login a user
const login = async (req, res, next) => {
  
  try {

    const { username, password } = req.body;

    if (!username || !password) {
      throw createHttpError(400, 'Username and password required');
    }

    const user = await prisma.users.findFirst({ where: { username } });
    if (!user || user.password !== password) { // Directly compare passwords
      throw createHttpError(401, 'Invalid credentials');
    }

    const token = generateToken({ id: user.id, username: user.username, permissions: user.permissions });
    
    res.json({ success: true, token, user: { id: user.id,name: user.name, username: user.username, permissions: user.permissions, departmentsId: user.departmentsId } });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };