const router = require("express").Router();
// const Product = require("./../models/Product");
const multer = require("multer");
const passport = require("passport");

// Multer
// const storage = multer.diskStorage({
//    destination: function (req, file, cb) {
//       cb(null, "assets/images");
//    },
//    filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//       cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
//    },
// });

// const upload = multer({ storage: storage });

// const adminOnly = (req, res, next) => {
//    if (req.user.isAdmin) {
//       next();
//    } else {
//       res.status(403).send({
//          error: "Forbidden",
//       });
//    }
// };

//! User Index Endpoint
router.get("/", (req, res, next) => {
   res.send("User Index Endpoint");
});

//! Create User Endpoint
router.post("/", (req, res, next) => {
   res.send("Create User Endpoint");
});

//! User Single Endpoint
router.get("/:UserId", (req, res, next) => {
   res.send("User Single Endpoint");
});

//! User Update Endpoint
router.put("/:UserId", (req, res, next) => {
   res.send("User Update Endpoint");
});

//! User Delete Endpoint
router.delete("/:UserId", (req, res, next) => {
   res.send("User Delete Endpoint");
});

module.exports = router;
