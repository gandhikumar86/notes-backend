const express = require("express");
const router = express.Router();
const { authorizeUser } = require("../controllers/login");
const {
  getNotes,
  addNote,
  editNote,
  deleteNote,
} = require("../controllers/home");

router.get("/", async (req, res) => {
  try {
    const auth_token = req.headers.authorization;
    //console.log("auth_token", auth_token);
    const loginCredentials = await authorizeUser(auth_token); //If no await, Promise<pending> occurs
    //console.log(loginCredentials);
    if (loginCredentials === false) {
      res.status(200).send("Invalid Token");
    } else {
      //console.log(loginCredentials._id);
      const notes = await getNotes(loginCredentials._id);
      res
        .status(200)
        .json({ loginCredentials: loginCredentials, notes: notes });
    }
  } catch (e) {
    console.log("Error in home router!", e);
    res.status(400).send("Server Busy");
  }
});

router.post("/addNote", async (req, res) => {
  try {
    const newNote = await req.body;
    const message = await addNote(newNote);
    res.status(200).send(message);
  } catch (e) {
    console.log("Error in home router, addNote!", e);
    res.status(400).send("Server Busy");
  }
});

router.post("/editNote", async (req, res) => {
  try {
    const updateNote = await req.body;
    const message = await editNote(updateNote);
    res.status(200).send(message);
  } catch (e) {
    console.log("Error in home router, addNote!", e);
    res.status(400).send("Server Busy");
  }
});

router.post("/deleteNote", async (req, res) => {
  try {
    const { deleteNoteId } = await req.body;
    //console.log(deleteNoteId);
    const message = await deleteNote(deleteNoteId);
    res.status(200).send(message);
  } catch (e) {
    console.log("Error in home router, addNote!", e);
    res.status(400).send("Server Busy");
  }
});

module.exports = router;
