const { logAction } = require('../services/auditLogger');

/**
 * Middleware to log API actions
 */
const actionLoggerMiddleware = (entityType) => {
  // console.log('entityType:', entityType);
  
  return async (req, res, next) => {
    // Store the original send method
    const originalSend = res.send;
    
    // Override the send method to log after successful responses
    res.send = function(data) {
      // Only log successful responses (status 2xx)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const userId = req.user?.id;
        const username = req.user?.username;
        
        if (userId && username) {
          // Determine action type based on HTTP method
          let actionType;
          switch (req.method) {
            case 'POST': actionType = 'CREATE'; break;
            case 'PUT':
            case 'PATCH': actionType = 'UPDATE'; break;
            case 'DELETE': actionType = 'DELETE'; break;
            default: actionType = 'OTHER';
          }
          
          // Extract entity ID from params or body
          const entityId = req.params.id || 
                          (req.body.id ? req.body.id : null) ||
                          (req.body.employeeId ? req.body.employeeId : null);
          
          // Log the action
          logAction({
            userId,
            username,
            actionType,
            entityType,
            entityId,
            details: {
              method: req.method,
              path: req.path,
              body: req.method !== 'GET' ? req.body : undefined,
              query: Object.keys(req.query).length ? req.query : undefined
            },
            ipAddress: req.ip
          }).catch(err => console.error('Failed to log action:', err));
        }
      }
      
      // Call the original send method
      return originalSend.call(this, data);
    };
    
    next();
  };
};

module.exports = {
  actionLoggerMiddleware
}; 