const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    lastModified: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    collection: "note",
  }
);

module.exports = mongoose.model("note", noteSchema);
