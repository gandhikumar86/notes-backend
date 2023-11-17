const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../controllers/login");

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    //console.log(JSON.stringify(req.body));
    const loginCredentials = await authenticateUser(email, password);
    //console.log(loginCredentials);
    if (loginCredentials === "Invalid username or password!") {
      res.status(200).send("Invalid username or password!");
    } else if (loginCredentials === "Verify your email") {
      res.status(200).send("Verify your email");
    } else {
      res.status(200).json({ token: loginCredentials.token });
    }
  } catch (e) {
    console.log("Error in login router!", e);
    res.status(400).send("Server Busy");
  }
});

module.exports = router;
