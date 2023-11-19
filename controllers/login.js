const user = require("../models/user");
const verifyUser = require("../models/verifyUser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const client = require("../redis");
const dotenv = require("dotenv");
dotenv.config();

async function checkUser(email) {
  try {
    const user1 = await user.findOne({ email: email });
    if (user1) {
      return "user";
    } else {
      const verifyUser1 = await verifyUser.findOne({ email: email });
      if (verifyUser1) {
        return "verifyUser";
      }
    }
    return "none";
  } catch (e) {
    return "Server busy";
  }
}

async function authenticateUser(email, password) {
  try {
    //console.log(email, password);
    const userCheck = await user.findOne({ email: email });
    if (userCheck) {
      //console.log(userCheck);
      const validPassword = await bcrypt.compare(password, userCheck.password);
      //console.log(validPassword);
      if (validPassword) {
        const token = jwt.sign({ email }, process.env.login_secret_token);
        const response = {
          _id: userCheck._id,
          name: userCheck.name,
          email: userCheck.email,
          token: token,
          status: true,
        };

        //console.log(response);
        if (!client.isOpen) {
          await client.connect();
        }
        await client.set(`key-${email}`, JSON.stringify(response));

        await user.findOneAndUpdate(
          { email: userCheck.email },
          { $set: { token: token } },
          { new: true }
        );
        return response;
      }
    } else {
      const verifyUserCheck = await verifyUser.findOne({ email: email });
      if (verifyUserCheck) {
        return "Verify your email";
      }
    }
    return "Invalid username or password!";
  } catch (e) {
    console.log("Error in login controller!", e);
    return "Server Busy";
  }
}

async function authorizeUser(token) {
  try {
    const decodedToken = jwt.verify(token, process.env.login_secret_token);
    //console.log(decodedToken);
    if (decodedToken) {
      const email = await decodedToken.email;

      if (!client.isOpen) {
        await client.connect();
      }
      const auth = await client.get(`key-${email}`);

      if (auth) {
        const data = JSON.parse(auth);
        return data;
      } else {
        const data = await user.findOne({ email: email });
        return data;
      }
    }
    return false;
  } catch (e) {
    console.log("Error in login controller!", e);
  }
}

async function logoutUser(email) {
  try {
    if (!client.isOpen) {
      await client.connect();
    }
    await client.del(`key-${email}`);
    return "deleted";
  } catch (e) {
    console.log("Error in login controller, logout!", e);
    return "not deleted";
  }
}

module.exports = { checkUser, authenticateUser, authorizeUser, logoutUser };
