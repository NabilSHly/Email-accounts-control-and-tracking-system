const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const createHttpError = require('http-errors');
const dotenv = require('dotenv');
const { register, login } = require('./auth');
const { verifyToken } = require('./utils');
const { rbac } = require('./middleware/rbac');
const usersController = require('./controllers/users');
const departmentsController = require('./controllers/departments');
const municipalitiesControler = require('./controllers/municipalities');
const employeesController = require('./controllers/employees');
const auditLogsController = require('./controllers/auditLogs');
const { actionLoggerMiddleware } = require('./middleware/actionLogger');

dotenv.config();
const app = express();

if (!process.env.JWT_SECRET) {
  console.error("❌ ERROR: JWT_SECRET is missing in .env file!");
  process.exit(1);
}

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing with size limit
app.use(bodyParser.json({ limit: '10kb' }));
app.use((req, res, next) => {
  const publicRoutes = ['/auth/register', '/auth/login'];
  if (publicRoutes.includes(req.path)) {
    return next(); // Skip authentication for public routes
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next(createHttpError(401, 'Unauthorized: No token provided'));

  try {
    req.user = verifyToken(token); // Verify and decode the token
    next();
  } catch (error) {
    console.error("❌ Invalid token:", error.message);
    return next(createHttpError(401, 'Unauthorized: Invalid or expired token'));
  }
});
app.use((err, req, res, next) => {
  console.error("❌ API Error:", err.message);
  if (err instanceof createHttpError.HttpError) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details,
    });
  }
  res.status(500).json({ error: 'Internal Server Error' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.get('/', (req, res) => {
  res.json({ status: 'API operational', timestamp: new Date() });
});
// Auth routes (public)
app.post('/auth/register', register);
app.post('/auth/login', login);


app.post('/users', rbac('ADMIN'), actionLoggerMiddleware('user'), usersController.createUser);
app.get('/users', rbac('ADMIN'), usersController.getAllUsers);
app.put('/users/:id', rbac('ADMIN'), actionLoggerMiddleware('user'), usersController.updateUser);
app.delete('/users/:id', rbac('ADMIN'), actionLoggerMiddleware('user'), usersController.deleteUser);

app.post('/departments', rbac('ADMIN'), actionLoggerMiddleware('department'), departmentsController.createDepartment);
app.get('/departments', rbac('ADMIN'), departmentsController.getAllDepartments);
app.put('/departments/:id', rbac('ADMIN'), actionLoggerMiddleware('department'), departmentsController.updateDepartments);
app.delete('/departments/:id', rbac('ADMIN'), actionLoggerMiddleware('department'), departmentsController.deleteDepartment);


app.get('/municipalities',rbac('ADMIN'),municipalitiesControler.getAllMunicipalities );
app.post('/municipalities',rbac('ADMIN'), actionLoggerMiddleware('municipality'), municipalitiesControler.createMunicipality);
app.put('/municipalities/:id',rbac('ADMIN'),actionLoggerMiddleware('municipality'),municipalitiesControler.updateMunicipality );
app.delete('/municipalities/:id',rbac('ADMIN'),actionLoggerMiddleware('municipality'),municipalitiesControler.deleteMunicipality );

// Employee routes - Admin operations
app.post('/employees/admin', rbac('ADMIN'), actionLoggerMiddleware('employee'), employeesController.adminCreateEmployeeWithEmail);
app.get('/employees', rbac('ADMIN'), employeesController.getAllEmployees);
app.get('/employees/pending', rbac('ADMIN'), employeesController.getPendingEmailRequests);
app.get('/employees/:id', rbac('ADMIN'), employeesController.getEmployeeById);
app.put('/employees/:id', rbac('ADMIN'), actionLoggerMiddleware('employee'), employeesController.updateEmployee);
app.delete('/employees/:id', rbac('ADMIN'), actionLoggerMiddleware('employee'), employeesController.deleteEmployee);
app.patch('/employees/:id/status', rbac('ADMIN'), actionLoggerMiddleware('employee'), employeesController.updateEmployeeStatus);
app.post('/employees/:id/approve', rbac('ADMIN'), actionLoggerMiddleware('employee'), employeesController.approveAndCreateEmail);
app.put('/employees/:id/report', rbac('ADMIN'), actionLoggerMiddleware('employee'), employeesController.reportEmployee);
  // Employee routes - Department and Municipality filtering
app.get('/employees/department/:departmentId', rbac('ADMIN'), employeesController.getEmployeesByDepartment);
app.get('/employees/municipality/:municipalityId', rbac('ADMIN'), employeesController.getEmployeesByMunicipality);

// Employee routes - User operations (request email creation)
app.post('/employees/request', employeesController.requestEmployeeEmail);


// Audit logs routes (admin only)
app.get('/audit-logs', rbac('ADMIN'), auditLogsController.getFilteredAuditLogs);

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error("❌ API Error:", err.message);
  if (err instanceof createHttpError.HttpError) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details,
    });
  }
  res.status(500).json({ error: 'Internal Server Error' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
