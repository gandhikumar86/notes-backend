const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.nodemailer_user,
    pass: process.env.nodemailer_password,
  },
  from: process.env.nodemailer_user,
});

function sendMail(toEmail, subject, content, text) {
  const mailOption = {
    from: process.env.nodemailer_user,
    to: toEmail,
    subject: subject,
    text: text,
    html: content,
  };

  transporter.sendMail(mailOption, (error, info) => {
    if (error) {
      console.log("error occurred", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
}

module.exports = { sendMail };
