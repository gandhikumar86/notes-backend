const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    collection: "category",
  }
);

module.exports = mongoose.model("category", categorySchema);
