const { getAuditLogs } = require('../services/auditLogger');
const createHttpError = require('http-errors');

// Get audit logs with filtering
const getFilteredAuditLogs = async (req, res, next) => {
  
  try {
    // Extract filter parameters from query
    const { 
      userId, 
      actionType, 
      entityType, 
      entityId, 
      startDate, 
      endDate,
      page = 1,
      limit = 50
    } = req.query;

    // Build filters object
    const filters = {
      userId,
      actionType,
      entityType,
      entityId,
      startDate,
      endDate
    };
console.log(req.body);

    // Clean up filters (remove undefined values)
    Object.keys(filters).forEach(key => {
      if (filters[key] === undefined) delete filters[key];
    });

    // Get logs with pagination
    const result = await getAuditLogs(filters, { 
      page: parseInt(page), 
      limit: parseInt(limit) 
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFilteredAuditLogs
}; 