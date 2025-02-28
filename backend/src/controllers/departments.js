const prisma = require('../db');
const createHttpError = require('http-errors');

// Create a new user
const createDepartment = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (name === undefined) {
      throw createHttpError(400, 'Department name is required');
    }

    const existingDepartment = await prisma.departments.findFirst({ where: { department: name } });
    if (existingDepartment) {
      throw createHttpError(409, 'Department already exists');
    }

    const department = await prisma.departments.create({
      data: {
        department: name,
      },
    });

    res.status(201).json({ success: true, department });
  } catch (error) {
    next(error);
  }
};

// Get all departments
const getAllDepartments = async (req, res, next) => {
  try {
    const departments = await prisma.departments.findMany();
    res.json(departments);
  } catch (error) {
    next(error);
  }
};

// Update a user
const updateDepartments = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;


  try {
    const department = await prisma.departments.update({
      where: { departmentId: parseInt(id) },
      data: {
        department:name,
      },
    });

    res.json({ success: true, department });
  } catch (error) {
    next(error);
  }
};

// Delete a department
const deleteDepartment = async (req, res, next) => {
  const { id } = req.params;

  try {
    await prisma.departments.delete({
      where: { departmentId: parseInt(id) },
    });

    res.json({ success: true, message: 'department deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
  updateDepartments,
  deleteDepartment,
};
