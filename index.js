const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Contact = require("./model/model");
const Post = require("./model/PostModel");
const port = process.env.PORT || 5000;
const cors = require("cors");

app.use(cors());
mongoose
  .connect("mongodb+srv://blog:blog1234@cluster0.uv0j1qr.mongodb.net/BlogApp")
  .then(() => {
    console.log("Connection successful...");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;

  const contact = new Contact({ name, email, message });
  contact
    .save()
    .then(() => {
      res.status(200).json({ Success: true, message: contact });
    })
    .catch((err) => {
      res.status(204).json({ Success: false, message: err });
    });
});

app.post("/addBlog", (req, res) => {
  const { title, description, image } = req.body;

  const post = new Post({ title, description, image });
  post
    .save()
    .then(() => {
      res.status(200).json({ Success: true, message: msg });
    })
    .catch((err) => {
      res.status(204).json({ Success: false, message: err });
    });
});

app.get("/getBlog", async (req, res) => {
  var { page, size } = req.query;

  if (!page) {
    page = 1;
  }
  if (!size) {
    size = 10;
  }

  const limit = parseInt(size);

  const totalPosts = await Post.find();
  const filteredPosts = await Post.find().limit(limit);
  res.send({
    page,
    size,
    posts: filteredPosts,
    NoOfPosts: filteredPosts.length,
    totalNoPosts: totalPosts.length,
  });
});

app.listen(port, () => {
  console.log(`Tuffle is running at port ${port}`);
});
