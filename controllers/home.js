const note = require("../models/note");
const category = require("../models/category");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const client = require("../redis");
const dotenv = require("dotenv");
dotenv.config();

async function getNotes(userId) {
  try {
    //console.log(userId);
    const notes = await note.find({ userId: userId });
    return notes;
  } catch (e) {
    console.log("Error in home controller: getNotes!", e);
  }
}

async function getCategories(userId) {
  try {
    //console.log(userId);
    const categories = await category.find({ userId: userId });

    return categories;
  } catch (e) {
    console.log("Error in home controller: getCategories!", e);
  }
}

async function addNote(noteArg) {
  try {
    //console.log(userId);

    const newNote = new note({
      title: noteArg.title,
      content: noteArg.content,
      userId: noteArg.userId,
      categoryId: noteArg.categoryId,
    });
    //console.log(JSON.stringify(newNote));
    var newInsertNoteId = "";
    await newNote
      .save()
      .then((insertNote) => (newInsertNoteId = insertNote._id));
    newNote._id = newInsertNoteId;
    return newNote;
  } catch (e) {
    console.log("Error in home controller: AddNote!", e);
  }
}

async function editNote(noteArg) {
  try {
    const query = { _id: noteArg._id };
    const update = { $set: { title: noteArg.title, content: noteArg.content } };
    const options = { upsert: true };
    var updateNote = null;
    await note
      .findOneAndUpdate(query, update, options, { returnOriginal: false })
      .then((upsertNote) => (updateNote = upsertNote));
    //console.log(updateNote);
    return updateNote;
  } catch (e) {
    console.log("Error in home controller: UpdateNote!", e);
  }
}

async function deleteNote(deleteNoteId) {
  try {
    var deleteNote = null;
    deleteNote = await note.findByIdAndDelete(deleteNoteId);
    //console.log(deleteNote);
    return deleteNote;
  } catch (e) {
    console.log("Error in home controller: DeleteNote!", e);
  }
}

async function addCategory(categ, userId) {
  try {
    const newCategory = new category({
      name: categ,
      userId: userId,
    });
    var newInsertedCategoryId = "";

    await newCategory
      .save()
      .then((insertCategory) => (newInsertedCategoryId = insertCategory._id));
    newCategory._id = newInsertedCategoryId;

    return newCategory;
  } catch (e) {
    console.log("Error in home controller: addCategory!", e);
  }
}

async function deleteCategory(deleteCategoryId) {
  try {
    var deleted = false;
    await note
      .deleteMany({ categoryId: deleteCategoryId })
      .then(
        await category
          .findByIdAndDelete(deleteCategoryId)
          .then((deleted = true))
      );
    //console.log(deleteNote);
    return deleted;
  } catch (e) {
    console.log("Error in home controller: DeleteNote!", e);
  }
}

module.exports = {
  getNotes,
  getCategories,
  addNote,
  editNote,
  deleteNote,
  addCategory,
  deleteCategory,
};
