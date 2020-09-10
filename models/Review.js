const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Property = require("./Property");
const User = require("./User");

const ReviewSchema = new Schema(
   {
      review: {
         type: String,
         required: [true, "Review required"],
      },
      property: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Property",
         required: [true, "Review required"],
      },
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: [true, "Review required"],
      },
      rating: {
         type: Number,
         min: 1,
         max: 5,
      },
   },
   {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   }
);

module.exports = mongoose.model("Review", ReviewSchema);
