const express = require("express");
const router = express.Router();
const { authorizeUser } = require("../controllers/login");

router.get("/", async (req, res) => {
  try {
    const auth_token = req.headers.authorization;
    //console.log("auth_token", auth_token);
    const loginCredentials = await authorizeUser(auth_token); //If no await, Promise<pending> occurs
    //console.log(loginCredentials);
    if (loginCredentials === false) {
      res.status(200).send("Invalid Token");
    } else {
      res.status(200).json(loginCredentials);
    }
  } catch (e) {
    console.log("Error in home router!", e);
    res.status(400).send("Server Busy");
  }
});

module.exports = router;
