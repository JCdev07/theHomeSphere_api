const normalUserOnly = (req, res, next) => {
   if (req.user.isAdmin) {
      res.status(403).json({
         request: "failed",
         error: "Forbidden",
      });
   } else {
      next();
   }
};

module.exports = normalUserOnly;
