const router = require("express").Router();
const Property = require("./../models/Property");
const Review = require("./../models/Review");
const multer = require("multer");
const passport = require("passport");
const AppError = require("./../utils/appError");
const sharp = require("sharp");
const adminOnly = require("./../utils/isAdminOnly");
const catchAsync = require("./../utils/catchAsync");

// const fileResize = (req, res, next) => {
//    console.log(req.files);
//    if (!req.file) return next();

//    req.file.filename = `property-${
//       Date.now() + "-" + Math.round(Math.random() * 1e9)
//    }.jpeg`;

//    sharp(req.file.buffer)
//       .toFormat("jpeg")
//       .jpeg({ quality: 80 })
//       .toFile(`assets/images/${req.file.filename}`);

//    next();
// };

const storage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
   if (file.mimetype.startsWith("image")) {
      cb(null, true);
   } else {
      cb(new AppError("Not an image! Please upload only images", 400), false);
   }
};

const upload = multer({ storage: storage, fileFilter: multerFilter });

const multipleImages = upload.fields([
   { name: "coverImage", maxCount: 1 },
   { name: "images", maxCount: 3 },
]);

const fileResize = catchAsync(async (req, res, next) => {
   console.log(req.files);
   if (!req.files.coverImage || !req.files.images) return next();

   const coveImageFileName = `property-${
      req.body.category
   }-${Date.now()}-cover.jpeg`;

   // 1) process coverImage
   await sharp(req.files.coverImage[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 80 })
      .toFile(`assets/img/property/${coveImageFileName}`);
   req.body.coverImage = `public/${coveImageFileName}`;

   // 2) loop images
   req.body.images = [];
   await Promise.all(
      req.files.images.map(async (file, i) => {
         const filename = `property-${req.body.category}-${Date.now()}-${
            i + 1
         }.jpeg`;

         await sharp(file.buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({ quality: 80 })
            .toFile(`assets/img/property/${filename}`);
         req.body.images.push(`public/${filename}`);
      })
   );
   console.log(req.body);
   next();
});

//! Property Index Endpoint
router.get("/", (req, res, next) => {
   Property.find()
      .populate({
         path: "category",
         select: "name",
      })
      .populate("reviews")
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
   passport.authenticate("jwt", { session: false }),
   adminOnly,
   multipleImages,
   fileResize,
   (req, res, next) => {
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
