const router = require("express").Router();
const Email = require("./../models/Email");
const multer = require("multer");
const passport = require("passport");
const nodemailer = require("nodemailer");

//! Reviews Index Endpoint
router.get("/", (req, res, next) => {
   res.json({
      reequest: "success",
   });
});

//! Mail Endpoint
router.post("/", (req, res, next) => {
   const output = `
      <h2>New Message</h2>
      <h3>Contact Details</h3>
      <ul>
         <li>Name: ${req.body.name}</li>
         <li>Email: ${req.body.email}</li>
         <li>Contact Number: ${req.body.contactNumber}</li>
         
      </ul>
      <h3>Title: ${req.body.title}</h3>
      <p>Message: ${req.body.message}</p>
   `;

   async function main() {
      const transporter = nodemailer.createTransport({
         service: "gmail",
         auth: {
            user: "jjcbga@gmail.com",
            pass: "pols19st235gfg8",
         },
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
         from: req.body.email, // sender address
         to: "jjcbga@gmail.com", // list of receivers
         subject: "New Message From The HomeSphe", // Subject line
         text: "New Message From The HomeSphe", // plain text body
         html: output, // html body
      });

      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
   }

   main().catch(console.error);

   Email.create(req.body).then((email) => {
      res.json({
         reequest: "contact",
         email,
      });
   });
});

module.exports = router;
