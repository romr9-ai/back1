const authorization = (role) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ status: "error", message: "Unauthorized" });
      }
  
      if (req.user.role !== role) {
        return res.status(403).json({ status: "error", message: "Forbidden: Insufficient permissions" });
      }
  
      next();
    };
  };
  
  const authorizeUser = authorization('user');
  const authorizeAdmin = authorization('admin');
  
  module.exports = {
    authorizeUser,
    authorizeAdmin,
  };