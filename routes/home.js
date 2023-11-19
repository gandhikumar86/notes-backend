const express = require("express");
const router = express.Router();
const { authorizeUser } = require("../controllers/login");
const {
  getNotes,
  getCategories,
  addNote,
  editNote,
  deleteNote,
  addCategory,
  deleteCategory,
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
      const categories = await getCategories(loginCredentials._id);
      //console.log(JSON.stringify(categories));
      res.status(200).json({
        loginCredentials: loginCredentials,
        notes: notes,
        categories: categories,
      });
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

router.post("/addCategory", async (req, res) => {
  try {
    const { categ, userId } = await req.body;
    const message = await addCategory(categ, userId);
    res.status(200).send(message);
  } catch (e) {
    console.log("Error in home router, addCategory!", e);
    res.status(400).send("Server Busy");
  }
});

router.post("/deleteCategory", async (req, res) => {
  try {
    const { deleteCategoryId } = await req.body;
    //console.log(deleteNoteId);
    const message = await deleteCategory(deleteCategoryId);
    res.status(200).send(message);
  } catch (e) {
    console.log("Error in home router, addNote!", e);
    res.status(400).send("Server Busy");
  }
});

module.exports = router;
