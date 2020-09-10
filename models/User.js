const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
   {
      firstname: {
         type: String,
         required: [true, "fullname required"],
      },
      lastname: {
         type: String,
         required: [true, "fullname required"],
      },
      email: {
         type: String,
         required: [true, "email required"],
         unique: true,
      },
      password: {
         type: String,
         required: [true, "email required"],
      },
      isAdmin: {
         type: Boolean,
         default: 0,
      },
   },
   { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
