const router = require("express").Router();
const Property = require("./../models/Property");
const Review = require("./../models/Review");
const multer = require("multer");
const passport = require("passport");
const AppError = require("./../utils/appError");
const sharp = require("sharp");
require("./../auth/isAdmin");

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

// Multer
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, "assets/images");
   },
   filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
   },
});

const multerFilter = (req, file, cb) => {
   if (file.mimetype.startsWith("image")) {
      cb(null, true);
   } else {
      cb(new AppError("Not an image! Please upload only images", 400), false);
   }
};

// const fileResize = (req, res, next) => {
//    if (!req.file) return next();
// };

const upload = multer({ storage: storage, fileFilter: multerFilter });

//! Property Index Endpoint
router.get("/", (req, res, next) => {
   Property.find()
      .populate({
         path: "category",
         select: "name",
      })
      .then((properties) => {
         res.json({
            request: "success",
            properties,
         });
      })
      .catch(next);
});

//! Create Property Endpoint
router.post(
   "/",
   upload.single("image"),
   passport.authenticate("jwt", { session: false }),
   adminOnly,
   (req, res, next) => {
      req.body.image = "public/" + req.file.filename;
      Property.create(req.body)
         .then((property) => {
            res.json({
               request: "success",
               property,
            });
         })
         .catch(next);
   }
);

//! Property Single Endpoint
router.get("/:propertyId", (req, res, next) => {
   Property.findById(req.params.propertyId)
      .populate({
         path: "category",
         select: "name",
      })
      .populate("reviews")
      .then((property) => {
         res.json({
            request: "success",
            property,
         });
      })
      .catch(next);
});

//! Property Update Endpoint
router.put(
   "/:propertyId",
   upload.single("image"),
   passport.authenticate("jwt", { session: false }),
   adminOnly,
   (req, res, next) => {
      if (req.file) {
         req.body.image = "public/" + req.file.filename;
      }
      Property.findByIdAndUpdate(req.params.propertyId, req.body, { new: true })
         .then((property) => {
            res.send({
               request: "success",
               message: "property edited",
               property,
            });
         })
         .catch(next);
   }
);

//! Property Delete Endpoint
router.delete(
   "/:propertyId",
   passport.authenticate("jwt", { session: false }),
   adminOnly,
   (req, res, next) => {
      Property.findByIdAndDelete(req.params.propertyId)
         .then((property) =>
            res.json({
               request: "success",
               message: "property has been deleted",
            })
         )
         .catch(next);
   }
);

//! Create Reviews Endpoint
router.post(
   "/:propertyId/reviews",
   passport.authenticate("jwt", { session: false }),
   // calcAverageRating,
   (req, res, next) => {
      Review.create({
         review: req.body.review,
         rating: req.body.rating,
         user: req.user.id,
         property: req.params.propertyId,
      })
         .then((review) => {
            res.json({
               request: "success",
               review,
            });
         })
         .catch(next);
   }
);

module.exports = router;
