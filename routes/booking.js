const router = require("express").Router();
const multer = require("multer");
const Property = require("./../models/Property");
const passport = require("passport");
const calculateBookingDays = require("./../utils/calcBookingDays");
const normalUserOnly = require("./../utils/normalUserOnly");

/*
@ request
{
   "property": "123ihaskndl123"
   "startDate": "YYYY-mm-dd"
   "endDate": "YYYY-mm-dd"

}

@ output
{
   propertyId:
   startDate
   endDate
   bookingDays
   subtotal
}
*/

//! Create transaction Endpoint
router.post(
   "/",
   passport.authenticate("jwt", { session: false }),
   normalUserOnly,
   (req, res, next) => {
      let { startDate, endDate } = req.body;

      // if start date and end date exist calculate the booking days
      if (startDate && endDate) {
         bookingDays = calculateBookingDays(startDate, endDate);
      } else {
         bookingDays = 1;
      }

      Property.findById(req.body.property)
         .populate("category", ["name"])
         .populate("reviews")
         .then((property) => {
            return res.json({
               request: "success",
               bookingDetails: {
                  property,
                  startDate,
                  endDate,
                  bookingDays,
                  subtotal: bookingDays * property.price,
               },
            });
         })
         .catch(next);
   }
);

module.exports = router;
