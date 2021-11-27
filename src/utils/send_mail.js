const nodemailer = require("nodemailer");
const Email = require("../Model/Email");
require("dotenv").config({ path: "./.env" });

const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

// send email
const verifyMail = (mail, code) => {
  transporter.sendMail(
    {
      from: "mail2drazzdeo@gmail.com",
      to: mail,
      subject: "Verify",
      html: `<p>click on the link to activate your account.</p> <br> <a href="http://localhost:3000/verify?mail=${mail}&code=${code}">LINK</a>`,
    },
    (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
    }
  );
};

//sending email template
const sendEmail = async (mail, id) => {
  const template = await Email.findById(id);
  if (!template) {
    throw new Error("something went wrong! template not found!");
  }
  transporter.sendMail(
    {
      from: "mail2drazzdeo@gmail.com",
      to: mail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    },
    (error, info) => {
      if (error) {
        return console.log(error);
      }
      //   console.log("Message sent: %s", info.messageId);
      console.log("mail", info.accepted[0]);
      console.log("log", new Date().toLocaleString());
      return "fuck";
      //   return {
      //     mail: info.accepted[0],
      //     time: new Date().toLocaleString(),
      //   };
    }
  );
};

module.exports = {
  verifyMail,
  sendEmail,
};
