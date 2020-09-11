const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmailSchema = new Schema(
   {
      name: {
         type: String,
         required: [true, "sender required"],
      },
      email: {
         type: String,
         required: [true, "sender required"],
      },
      contactNumber: {
         type: String,
         required: [true, "contactNumber required"],
      },
      title: {
         type: String,
         required: [true, "title required"],
      },
      message: {
         type: String,
         required: [true, "message required"],
      },
   },
   {
      timestamps: true,
   }
);

module.exports = mongoose.model("Email", EmailSchema);
