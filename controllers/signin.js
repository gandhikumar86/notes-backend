const user = require("../models/user");
const { sendMail } = require("./sendMail");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const verifyUser = require("../models/verifyUser");
dotenv.config();

async function insertVerifyUser(name, email, password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const token = generateToken(email);

    const newUser = new verifyUser({
      name: name,
      email: email,
      password: hashedPassword,
      token: token,
    });

    const activationLink = `https://auth-backend-6p89.onrender.com/signin/${token}`;
    const content = `<h4>Hi, there!</h4>
    <h5>Welcome to the app!</h5>
    <p>Thank you for signing up!</p>
    <a href="${activationLink}">Click here</a>
    <p>Regards,</p>
    <p>Team</p>`;

    await newUser.save();
    //console.log(newUser);
    sendMail(email, "Verify User", content);
  } catch (e) {
    console.log("Error in signin controller!", e);
  }
}

function generateToken(email) {
  const token = jwt.sign(email, process.env.signup_secret_token);
  return token;
}

async function insertSignupUser(token) {
  try {
    const userVerify = await verifyUser.findOne({ token: token });
    if (userVerify) {
      const newUser = new user({
        name: userVerify.name,
        email: userVerify.email,
        password: userVerify.password,
        forgotPassword: {},
      });
      await newUser.save();
      await userVerify.deleteOne({ token: token });
      const content = `<h4>Registration successful!</h4>
    <h5>Welcome to the app!</h5>
    <p>You are successfully registered!</p>   
    <p>Regards,</p>
    <p>Team</p>`;
      sendMail(newUser.email, "Registration successful!", content);
      return content;
    }
    return `<h4>Registration failed!</h4>
  <p>Link expired!</p>
  <p>Regards,</p>
  <p>Team</p>`;
  } catch (e) {
    console.log("Error in signin controller!", e);
    return `<html>   <body>
    <h4>Registration failed!</h4>
  <p>Unexpected error!</p>
  <p>Regards,</p>
  <p>Team</p>
  </body>
  </html>`;
  }
}

module.exports = { insertVerifyUser, insertSignupUser };