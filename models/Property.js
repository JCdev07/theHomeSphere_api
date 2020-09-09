const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PropertySchema = new Schema(
   {
      name: {
         type: String,
         required: [true, "Name Fiel Required"],
      },
      images: {
         type: Array,
      },
      image: {
         type: String,
         required: [true, "Cover Image required"],
      },
      ratingsAverage: {
         type: Number,
         required: [true, "Cover Image required"],
         default: 0,
      },
      ratingsQuantity: {
         type: Number,
         required: [true, "Cover Image required"],
         default: 0,
      },
      price: {
         type: Number,
         required: [true, "Price required"],
      },
      category: {
         type: String,
         required: [true, "Category Required"],
      },
   },
   { timestamps: true }
);

module.exports = mongoose.model("Property", PropertySchema);
