const prisma = require('../db');

/**
 * Log an action in the system audit trail
 * 
 * @param {Object} logData - The data to log
 * @param {number} logData.userId - ID of the user performing the action
 * @param {string} logData.username - Username of the user performing the action
 * @param {string} logData.actionType - Type of action (CREATE, UPDATE, DELETE, etc.)
 * @param {string} logData.entityType - Type of entity affected (employee, department, etc.)
 * @param {string|number} logData.entityId - ID of the entity affected (optional)
 * @param {Object} logData.details - Additional details about the action
 * @param {string} logData.ipAddress - IP address of the user (optional)
 * @returns {Promise<Object>} The created audit log entry
 */
const logAction = async (logData) => {
  try {
    const { 
      userId, 
      username, 
      actionType, 
      entityType, 
      entityId = null, 
      details = {}, 
      ipAddress = null 
    } = logData;

    // Validate required fields
    if (!userId || !username || !actionType || !entityType) {
      console.error('Missing required fields for audit logging');
      return null;
    }

    // Create the audit log entry
    const auditLog = await prisma.auditLogs.create({
      data: {
        userId,
        username,
        actionType,
        entityType,
        entityId: entityId ? String(entityId) : null,
        details: JSON.stringify(details),
        ipAddress,
      },
    });

    return auditLog;
  } catch (error) {
    console.error('Error creating audit log:', error);
    // Don't throw - logging should never break the main application flow
    return null;
  }
};

/**
 * Get audit logs with filtering options
 */
const getAuditLogs = async (filters = {}, pagination = { page: 1, limit: 50 }) => {
  const { 
    userId, 
    actionType, 
    entityType, 
    entityId, 
    startDate, 
    endDate 
  } = filters;
  
  const { page, limit } = pagination;
  const skip = (page - 1) * limit;

  // Build where clause based on filters
  const where = {};
  
  if (userId) where.userId = parseInt(userId);
  if (actionType) where.actionType = actionType;
  if (entityType) where.entityType = entityType;
  if (entityId) where.entityId = String(entityId);
  
  // Date range filter
  if (startDate || endDate) {
    where.timestamp = {};
    if (startDate) where.timestamp.gte = new Date(startDate);
    if (endDate) where.timestamp.lte = new Date(endDate);
  }

  try {
    // Get total count for pagination
    const totalCount = await prisma.auditLogs.count({ where });
    
    // Get paginated results
    const logs = await prisma.auditLogs.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            username: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      skip,
      take: limit
    });

    return {
      logs,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
};

module.exports = {
  logAction,
  getAuditLogs
}; 