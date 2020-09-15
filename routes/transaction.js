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
   (req, res, next) => {
      let filter = {};

      if (!req.user.isAdmin) {
         filter = {
            user: req.user._id,
         };

         Transaction.find(filter)
            .populate("user")
            .populate("property")
            .then((transactions) => {
               res.json({
                  request: "succes",
                  transactions,
                  transactionCount: transactions.length,
               });
            })
            .catch(next);
      } else {
         Transaction.find()
            .populate("user")
            .populate("property")
            .then((transactions) => {
               res.json({
                  request: "succes",
                  transactions,
                  transactionCount: transactions.length,
               });
            })
            .catch(next);
      }

      // Transaction.find()
      //    .then((transactions) => {
      //       res.json({
      //          request: "succes",
      //          transactions,
      //       });
      //    })
      //    .catch(next);
   }
);

//! Create transaction Endpoint
router.post(
   "/",
   passport.authenticate("jwt", { session: false }),
   (req, res, next) => {
      let { startDate, endDate } = req.body;

      Property.findByIdAndUpdate(
         req.body.property,
         { isRented: true },
         { new: true }
      )
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
         .populate("user")
         .populate("property")
         .then((transaction) => {
            console.log(transaction.user._id === req.user._id);
            if (
               req.user.isAdmin === true ||
               transaction.user._id !== req.user._id
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
         { isComplete: req.body.isComplete, status: req.body.status },
         {
            new: true,
         }
      )
         .then((transaction) =>
            res.json({
               request: "succes",
               transaction,
            })
         )
         .catch(next);
   }
);

module.exports = router;
