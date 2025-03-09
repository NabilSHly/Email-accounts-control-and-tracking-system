const rbac = (requiredPermission) => {
  
    return (req, res, next) => {
      try {
        // Ensure userPermissions is an array
        const userPermissions = Array.isArray(req.user.permissions) ? req.user.permissions : JSON.parse(req.user.permissions || '[]');
       
        if (!userPermissions.includes(requiredPermission)) {
          return res.status(403).json({ error: 'Access denied' }); // Deny access if permission is missing
        }
        next(); // Proceed to the next middleware or route handler
      } catch (error) {
        console.error("❌ Error in RBAC middleware:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    };
  };
  
module.exports = { rbac };