const router = require("express").Router();
const multer = require("multer");
const Property = require("./../models/Property");
const passport = require("passport");

const calculateBookingDays = (startDate, endDate) => {
   startDate = new Date(startDate).getTime();
   endDate = new Date(endDate).getTime();
   return (endDate - startDate) / (1000 * 60 * 60 * 24);
};

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
   // passport.authenticate("jwt", { session: false }),
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
         });
   }
);

module.exports = router;
