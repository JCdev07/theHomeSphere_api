const router = require("express").Router();
const Transaction = require("./../models/Transaction");
const Property = require("../models/Property");
const passport = require("passport");
const calculateBookingDays = require("./../utils/calcBookingDays");
const adminOnly = require("./../utils/isAdminOnly");

//! transaction Index Endpoint
router.get(
   "/",
   passport.authenticate("jwt", { session: false }),
   adminOnly,
   (req, res, next) => {
      Transaction.find()
         .then((transactions) => {
            res.json({
               request: "succes",
               transactions,
            });
         })
         .catch(next);
   }
);

//! Create transaction Endpoint
router.post(
   "/",
   passport.authenticate("jwt", { session: false }),
   (req, res, next) => {
      let { startDate, endDate } = req.body;

      Property.findById(req.body.property)
         .then((property) => {
            req.body.bookingDays = calculateBookingDays(startDate, endDate);
            req.body.user = req.user._id;

            Transaction.create({
               ...req.body,
               total: req.body.bookingDays * property.price,
               startDate: new Date(startDate),
               endDate: new Date(endDate),
            })

               .then((transaction) => {
                  res.json({
                     request: "success",
                     transaction,
                  });
               })

               .catch(next);
         })
         .catch(next);
   }
);

//! transaction Single Endpoint
router.get(
   "/:transactionId",
   passport.authenticate("jwt", { session: false }),
   (req, res, next) => {
      Transaction.findById(req.params.transactionId)
         .then((transaction) => {
            if (
               req.user.isAdmin === true ||
               req.user._id === transaction.user
            ) {
               res.json({
                  request: "success",
                  transaction,
               });
            } else {
               res.status(401).json({
                  request: "failed",
                  message: "forbidden",
               });
            }
         })
         .catch(next);
   }
);

//! transaction Update Endpoint
router.put(
   "/:transactionId",
   passport.authenticate("jwt", { session: false }),
   adminOnly,
   (req, res, next) => {
      Transaction.findByIdAndUpdate(
         req.params.transactionId,
         { status: req.body.status },
         {
            new: true,
         }
      )
         .then((transaction) => res.send(transaction))
         .catch(next);
   }
);

module.exports = router;
