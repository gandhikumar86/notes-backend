const express = require("express");
const { checkUser } = require("../controllers/login");
const { insertVerifyUser, insertSignupUser } = require("../controllers/signin");
const router = express.Router();

router.get("/:token", async (req, res) => {
  try {
    const response = await insertSignupUser(req.params.token);
    res.status(200).send(response);
  } catch (e) {
    console.log("Error in signin router!", e);
    res.status(500).send(
      `<html>
         <body>
          <p>Link expired!</p>
          <p>Regards,</p>
          <p>Team</p>
         </body>
       </html>`
    );
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { name, email, password } = await req.body;
    //console.log(name, email, password);
    const registerCredentials = await checkUser(email);
    if (registerCredentials === "none") {
      await insertVerifyUser(name, email, password);
      res.status(200).send("none");
    } else if (registerCredentials === "user") {
      res.status(200).send("user");
    } else if (registerCredentials === "verifyUser") {
      res.status(200).send("verifyUser");
    } else if (registerCredentials === "Server busy") {
      res.status(500).send("Server busy");
    }
  } catch (e) {
    console.log("Error in signin router!", e);
    res.status(400).send("Server Busy");
  }
});

module.exports = router;
