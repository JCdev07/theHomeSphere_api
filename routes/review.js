const router = require("express").Router();
const Review = require("./../models/Review");
const multer = require("multer");
const passport = require("passport");

const adminOnly = (req, res, next) => {
   if (req.user.isAdmin) {
      next();
   } else {
      res.status(403).json({
         request: "failed",
         error: "Forbidden",
      });
   }
};

//! Reviews Index Endpoint
router.get("/", (req, res, next) => {
   Review.find()
      .populate({
         path: "property",
         select: "name",
      })
      .populate({
         path: "user",
         select: "firstname lastname",
      })
      .then((reviews) => {
         res.json({
            request: "success",
            quantity: reviews.length,
            reviews,
         });
      })
      .then(next);
});

//! Create Reviews Endpoint
router.post(
   "/",
   passport.authenticate("jwt", { session: false }),
   (req, res, next) => {
      Review.create(req.body)
         .then((review) => {
            res.json({
               request: "success",
               review,
            });
         })
         .then(next);
   }
);

//! Delete Review
router.delete(
   "/:ReviewsId",
   passport.authenticate("jwt", { session: false }),
   adminOnly,
   (req, res, next) => {
      res.send("Reviews Single Endpoint");
   }
);

module.exports = router;
