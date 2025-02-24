// auth.js
const prisma = require('./db');
const { generateToken } = require('./utils');
const createHttpError = require('http-errors');

// Register a new user (Without password hashing)
const register = async (req, res, next) => {
  try {
    const {  username, password, permissions } = req.body;

    // Validation
    if ( !username || !password) {
      throw createHttpError(400, 'Domain name, username and password are required');
    }

    if (password.length < 6) {
      throw createHttpError(400, 'Password must be at least 6 characters');
    }

    return await prisma.$transaction(async (tx) => {
    

      // Check for existing username 
      const existingUser = await tx.users.findFirst({
        where: {
          username,
        }
      });

      if (existingUser) {
        throw createHttpError(409, 'Username already exists');
      }

      // Create user with plain text password (NOT RECOMMENDED)
      const user = await tx.users.create({
        data: {
          username,
          password: password, // Storing plain text password
          permissions: permissions || ['BASIC_ACCESS'],
        },
        select: {
          id: true,
          username: true,
          createdAt: true
        }
      });

      // Generate token
      const token = generateToken({
        id: user.id,
        permissions: user.permissions
      });

      res.status(201).json({
        success: true,
        token,
        user: {
          ...user,
        }
      });
    });

  } catch (error) {
    next(error);
  }
};

// Login a user (Without password hashing)
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw createHttpError(400, 'Username and password required');
    }

    // Extract domain and username
    if ( !username) {
      throw createHttpError(400, 'Use format "domain:username"');
    }

    const user = await prisma.users.findFirst({
      where: {
        username: username,
      }
    });

    if (!user) {
      throw createHttpError(401, 'Invalid credentials');
    }

    // Direct password comparison (NOT SECURE)
    if (password !== user.password) {
      throw createHttpError(401, 'Invalid credentials');
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      permissions: user.permissions
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        permissions: user.permissions
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };