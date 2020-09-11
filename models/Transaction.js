const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
   {
      property: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Property",
         required: [true, "Property required"],
      },
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: [true, "Review required"],
      },
      bookingDays: {
         type: Number,
         required: [true, "Booking Days Required"],
      },
      startDate: {
         type: String,
         required: [true, "Start Date Required"],
      },
      endDate: {
         type: String,
         required: [true, "End Date Required"],
      },
      total: {
         type: Number,
         required: [true, "Total Required"],
      },
      status: {
         type: String,
         required: [true, "Status Required"],
         default: "Pending",
      },
      paymentMode: {
         type: String,
         required: [true, "Status Required"],
      },
   },
   {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   }
);

TransactionSchema.virtual("transactionId").get(function () {
   return `THS${this._id}`;
});

module.exports = mongoose.model("Transaction", TransactionSchema);
