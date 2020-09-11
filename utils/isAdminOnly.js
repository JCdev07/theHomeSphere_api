const adminOnly = (req, res, next) => {
   if (req.user.isAdmin) {
      next();
   } else {
      res.status(403).send({
         request: "failed",
         error: "Forbidden",
      });
   }
};

module.exports = adminOnly;
