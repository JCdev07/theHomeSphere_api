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

PropertySchema.virtual("ratingsAverage").get(function () {
   let average;
   if (this.reviews.length) {
      let reviewValues = this.reviews.map((review) => review.rating);
      let total = reviewValues.reduce((total, current) => total + current);
      average = total / reviewValues.length;
      return average;
   }
});

PropertySchema.virtual("ratingsQuantity").get(function () {
   if (this.reviews) {
      return this.reviews.length;
   }
});
// PropertySchema.virtual("ratingsQuantity");

module.exports = mongoose.model("Property", PropertySchema);
