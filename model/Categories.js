const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  posts: Array,
});

const Categories = mongoose.model("category", categoriesSchema);
module.exports = Categories;
