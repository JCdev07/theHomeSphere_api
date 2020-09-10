const router = require("express").Router();
const Category = require("./../models/Category");
const multer = require("multer");
const passport = require("passport");

//! Property Index Endpoint
router.get("/", (req, res, next) => {
   Category.find()
      .then((categories) => {
         res.json({
            request: "success",
            categories,
         });
      })
      .catch(next);
});

//! Create Property Endpoint
router.post("/", (req, res, next) => {
   Category.create(req.body)
      .then((category) => {
         res.json({
            request: "success",
            category,
         });
      })
      .catch(next);
});

//! Property Single Endpoint
router.get("/:categoryId", (req, res, next) => {
   Category.findById(req.params.categoryId)
      .then((category) => {
         res.json({
            request: "success",
            category,
         });
      })
      .catch(next);
});

//! Property Update Endpoint
router.put("/:categoryId", (req, res, next) => {
   Category.findByIdAndUpdate(req.params.categoryId, req.body, { new: true })
      .then((category) => {
         res.send({
            request: "success",
            message: "property edited",
            category,
         });
      })
      .catch(next);
});

module.exports = router;
