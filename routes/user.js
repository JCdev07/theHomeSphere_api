const router = require("express").Router();
const User = require("./../models/User");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const bcrypt = require("bcrypt");
const passport = require("passport");
const adminOnly = require("./../utils/isAdminOnly");
require("./../passport/passportSetup");

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

//! User Index Endpoint
router.get(
   "/users",
   passport.authenticate("jwt", { session: false }),
   adminOnly,
   (req, res, next) => {
      User.find()
         .then((users) => {
            res.json({
               request: "success",
               users,
            });
         })
         .catch(next);
   }
);

//! Register User Endpoint
router.post("/register", (req, res, next) => {
   let { password, confirmPassword } = req.body;
   const saltRounds = 10;

   if (password.length < 8) {
      res.status(400).json({
         request: "fail",
         error: "Password must be atleast 8 characters",
      });
   }

   bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
         req.body.password = hash;
         User.create(req.body)
            .then((user) => {
               res.json({
                  request: "success",
                  user,
               });
            })
            .catch(next);
      });
   });
});

//! User Login Endpoint
router.post("/login", (req, res, next) => {
   let { email, password } = req.body;

   if (!email || !password) {
      return res.status(400).json({
         request: "failed",
         error: "Email and Password required",
      });
   }

   User.findOne({ email }).then((user) => {
      if (!user) {
         res.status(400).json({
            request: "failed",
            error: "Invalid email or password",
         });
      } else {
         bcrypt
            .compare(password, user.password)
            .then((result) => {
               if (result) {
                  let { _id, firstname, lastname, email, isAdmin } = user;
                  let token = jwt.sign({ _id }, "secret_key");
                  console.log(token);

                  res.json({
                     request: "success",
                     message: "login successful",
                     user: { _id, firstname, lastname, email, isAdmin },
                     token,
                  });
               } else {
                  res.status(400).send({
                     error: "check credentials",
                  });
               }
            })
            .catch(next);
      }
   });
});

//! User Update Endpoint
router.put("/:UserId", (req, res, next) => {
   res.send("User Update Endpoint");
});

//! User Delete Endpoint
router.get(
   "/profile",
   passport.authenticate("jwt", { session: false }),
   (req, res, next) => {
      res.json({
         request: "success",
         user: req.user,
      });
   }
);

module.exports = router;
