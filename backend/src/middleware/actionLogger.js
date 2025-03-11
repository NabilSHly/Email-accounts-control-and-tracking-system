const { logAction } = require('../services/auditLogger');

/**
 * Middleware to log API actions
 */
const actionLoggerMiddleware = (entityType) => {
  return async (req, res, next) => {
    const userId = req.user?.id;
    const username = req.user?.username;
console.log(req.user);

    // Only log if user is authenticated
    if (userId ) {
      // Determine action type based on HTTP method
      let actionType;
      switch (req.method) {
        case 'POST': actionType = 'CREATE'; break;
        case 'PUT': actionType = 'UPDATE'; break;
        case 'PATCH': actionType = 'UPDATE'; break;
        case 'DELETE': actionType = 'DELETE'; break;
        default: actionType = 'OTHER';
      }

      // Extract entity ID from params or body
      const entityId = req.params.id || req.body.id || req.body.employeeId;
      const details = {
        method: req.method,
        path: req.path,
        body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
        query: Object.keys(req.query).length ? req.query : undefined,
        headers: req.headers, // Log request headers
        ipAddress: req.ip // Capture the IP address of the client
      };


      res.on('finish', async () => {
        try {
          await logAction({
            userId,
            username,
            actionType,
            entityType,
            entityId,
            details,
          });
        } catch (err) {
          console.error('Failed to log action:', err);
        }
      });
    }

    next();
  };
};

module.exports = {
  actionLoggerMiddleware
};
