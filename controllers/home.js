const note = require("../models/note");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const client = require("../redis");
const dotenv = require("dotenv");
dotenv.config();

async function getNotes(userId) {
  try {
    //console.log(userId);
    const data = await note.find({ userId: userId });
    return data;
  } catch (e) {
    console.log("Error in home controller: getNotes!", e);
  }
}

async function addNote(noteArg) {
  try {
    //console.log(userId);

    const newNote = new note({
      title: noteArg.title,
      content: noteArg.content,
      userId: noteArg.userId,
    });
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

module.exports = { getNotes, addNote, editNote, deleteNote };
