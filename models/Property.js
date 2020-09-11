const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PropertySchema = new Schema(
   {
      isRented: {
         type: Boolean,
         default: 0,
      },
      name: {
         type: String,
         required: [true, "Name Fiel Required"],
      },
      images: [String],
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
         type: mongoose.Schema.Types.ObjectId,
         ref: "Category",
         required: [true, "Category required"],
      },

      details: {
         bathroom: {
            type: Number,
            required: [true, "Number of bathroom Required"],
         },
         bedroom: {
            type: Number,
            required: [true, "Number of bedroom Required"],
         },
         carSlot: {
            type: Number,
            required: [true, "Number of carSlot Required"],
         },
         floorArea: {
            type: Number,
            required: [true, "floorArea Required"],
         },
         landArea: {
            type: Number,
            required: [true, "landArea Required"],
         },
      },
   },
   {
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   }
);

// Virtual Populate
PropertySchema.virtual("reviews", {
   ref: "Review",
   foreignField: "property",
   localField: "_id",
});

module.exports = mongoose.model("Property", PropertySchema);
