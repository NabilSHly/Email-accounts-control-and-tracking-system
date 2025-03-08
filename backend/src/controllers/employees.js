const prisma = require('../db');
const createHttpError = require('http-errors');

// Create a new employee
const createEmployee = async (req, res, next) => {
  try {
    const { 
      engname, 
      arname, 
      departments, 
      municipalityId, 
      email, 
      phoneNumber, 
      password, 
      reported, 
      status, 
      notes 
    } = req.body;

    if (!engname || !arname || !municipalityId || !password) {
      throw createHttpError(400, 'English name, Arabic name, municipality ID, and password are required');
    }

    // Ensure departments is an array
    const deptArray = Array.isArray(departments) ? departments : JSON.parse(departments || '[]');

    const employee = await prisma.employees.create({
      data: {
        engname,
        arname,
        departments: { set: deptArray },
        municipalityId: parseInt(municipalityId),
        email: email || 'Unknown',
        phoneNumber: phoneNumber || 'Unknown',
        password, // Consider hashing the password before saving
        reported: reported || false,
        status: status || 'PENDING',
        notes,
      },
    });

    res.status(201).json({ success: true, employee });
  } catch (error) {
    next(error);
  }
};

// Admin creates an employee with email directly
const adminCreateEmployeeWithEmail = async (req, res, next) => {
  try {
    const { 
      engname, 
      arname, 
      departments, 
      municipalityId, 
      email, 
      phoneNumber, 
      password, 
      reported, 
      notes 
    } = req.body;

    if (!engname || !arname || !municipalityId || !password || !email) {
      throw createHttpError(400, 'English name, Arabic name, municipality ID, password, and email are required');
    }

    // Ensure departments is an array
    const deptArray = Array.isArray(departments) ? departments : JSON.parse(departments || '[]');

    const employee = await prisma.employees.create({
      data: {
        engname,
        arname,
        departments: { set: deptArray },
        municipalityId: parseInt(municipalityId),
        email,
        phoneNumber: phoneNumber || 'Unknown',
        password, // Consider hashing the password before saving
        reported: reported || false,
        status: 'ACTIVE', // Admin-created accounts are active by default
        notes,
      },
    });

    res.status(201).json({ success: true, employee });
  } catch (error) {
    next(error);
  }
};

// User submits a request for employee email creation
const requestEmployeeEmail = async (req, res, next) => {
  try {
    const { 
      engname, 
      arname, 
      departments, 
      municipalityId, 
      phoneNumber, 
      notes 
    } = req.body;
console.log(engname, 
  arname, 
  departments, 
  municipalityId, 
  phoneNumber, 
  notes );

    if (!engname || !arname || !municipalityId) {
      throw createHttpError(400, 'English name, Arabic name, and municipality ID are required');
    }

    // Ensure departments is an array
    const deptArray = Array.isArray(departments) ? departments : JSON.parse(departments || '[]');

    // Generate a temporary password (in a real app, you might want to use a more secure method)
    const tempPassword = Math.random().toString(36).slice(-8);

    const employee = await prisma.employees.create({
      data: {
        engname,
        arname,
        departments: { set: deptArray },
        municipalityId: parseInt(municipalityId),
        email: 'Unknown', // Email is unknown until admin creates it
        phoneNumber: phoneNumber || 'Unknown',
        password: tempPassword, // Temporary password
        reported: false,
        status: 'PENDING', // Request starts as pending
        notes,
      },
    });

    res.status(201).json({ 
      success: true, 
      message: 'Email request submitted successfully and is pending admin approval',
      employee 
    });
  } catch (error) {
    next(error);
  }
};

// Admin approves and creates email for pending request
const approveAndCreateEmail = async (req, res, next) => {
  const { id } = req.params;
  const { email, password } = req.body;

  if (!email) {
    return next(createHttpError(400, 'Email address is required'));
  }

  try {
    const employee = await prisma.employees.update({
      where: { employeeId: parseInt(id) },
      data: {
        email,
        password: password || undefined, // Update password if provided
        status: 'ACTIVE',
      },
    });

    res.json({ 
      success: true, 
      message: 'Employee email created and account activated',
      employee 
    });
  } catch (error) {
    next(error);
  }
};

// Get all employees
const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await prisma.employees.findMany({
      include: {
        municipality: true,
        departmentsRel: true
      }
    });
    res.json(employees);
  } catch (error) {
    next(error);
  }
};

// Get pending email requests
const getPendingEmailRequests = async (req, res, next) => {
  try {
    const pendingEmployees = await prisma.employees.findMany({
      where: {
        status: 'PENDING',
        email: 'Unknown'
      },
      include: {
        municipality: true,
        departmentsRel: true
      }
    });
    res.json(pendingEmployees);
  } catch (error) {
    next(error);
  }
};

// Get employee by ID
const getEmployeeById = async (req, res, next) => {
  const { id } = req.params;
  
  try {
    const employee = await prisma.employees.findUnique({
      where: { employeeId: parseInt(id) },
      include: {
        municipality: true,
        departmentsRel: true
      }
    });
    
    if (!employee) {
      throw createHttpError(404, 'Employee not found');
    }
    
    res.json(employee);
  } catch (error) {
    next(error);
  }
};

// Update an employee
const updateEmployee = async (req, res, next) => {
  const { id } = req.params;
  const { 
    engname, 
    arname, 
    departments, 
    municipalityId, 
    email, 
    phoneNumber, 
    password, 
    reported, 
    status, 
    notes 
  } = req.body;

  try {
    // Ensure departments is an array
    const deptArray = Array.isArray(departments) ? departments : JSON.parse(departments || '[]');

    // Convert reported to a boolean
    const isReported = reported === "true"; // Convert "true" to true and "false" to false

    const employee = await prisma.employees.update({
      where: { employeeId: parseInt(id) },
      data: {
        engname,
        arname,
        departments: { set: deptArray },
        municipalityId: municipalityId ? parseInt(municipalityId) : undefined,
        email,
        phoneNumber,
        password, // Consider hashing the password before saving
        reported: isReported, // Use the boolean value
        status,
        notes,
      },
    });

    res.json({ success: true, employee });
  } catch (error) {
    next(error);
  }
};
const reportEmployee = async (req, res, next) => {
  const { id } = req.params;
  
  try {
    // Ensure departments is an array
    
    const employee = await prisma.employees.update({
      where: { employeeId: parseInt(id) },
      data: {
        reported: true,
      },
    });

    res.json({ success: true, employee });
  } catch (error) {
    next(error);
  }
};
// Delete an employee
const deleteEmployee = async (req, res, next) => {
  const { id } = req.params;

  try {
    await prisma.employees.delete({
      where: { employeeId: parseInt(id) },
    });

    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Update employee status
const updateEmployeeStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['ACTIVE', 'INACTIVE', 'PENDING'].includes(status)) {
    return next(createHttpError(400, 'Valid status (ACTIVE, INACTIVE, or PENDING) is required'));
  }

  try {
    const employee = await prisma.employees.update({
      where: { employeeId: parseInt(id) },
      data: { status },
    });

    res.json({ success: true, employee });
  } catch (error) {
    next(error);
  }
};

// Get employees by department
const getEmployeesByDepartment = async (req, res, next) => {
  const { departmentId } = req.params;
  
  try {
    const employees = await prisma.employees.findMany({
      where: {
        departmentsRel: {
          some: {
            departmentId: parseInt(departmentId)
          }
        }
      },
      include: {
        municipality: true,
        departmentsRel: true
      }
    });
    
    res.json(employees);
  } catch (error) {
    next(error);
  }
};

// Get employees by municipality
const getEmployeesByMunicipality = async (req, res, next) => {
  const { municipalityId } = req.params;
  
  try {
    const employees = await prisma.employees.findMany({
      where: {
        municipalityId: parseInt(municipalityId)
      },
      include: {
        municipality: true,
        departmentsRel: true
      }
    });
    
    res.json(employees);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEmployee,
  adminCreateEmployeeWithEmail,
  requestEmployeeEmail,
  approveAndCreateEmail,
  getAllEmployees,
  getPendingEmailRequests,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  updateEmployeeStatus,
  getEmployeesByDepartment,
  getEmployeesByMunicipality,
  reportEmployee
};
