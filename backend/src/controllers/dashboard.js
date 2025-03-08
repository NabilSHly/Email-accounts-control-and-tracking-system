// controllers/dashboardController.js
const prisma = require('../db'); // Import prisma client

// Get dashboard statistics
const getDashboardStats = async (req, res, next) => {
  try {
    // Get counts from database
    const [
      totalEmployees,
      activeEmployees,
      pendingRequests,
      totalDepartments,
      totalMunicipalities
    ] = await Promise.all([
      prisma.employees.count(),
      prisma.employees.count({ where: { status: 'ACTIVE' } }),
      prisma.employees.count({ where: { status: 'PENDING' } }),
      prisma.departments.count(),
      prisma.municipalities.count()
    ]);

    res.json({
      totalEmployees,
      activeEmployees,
      pendingRequests,
      totalDepartments,
      totalMunicipalities
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};
