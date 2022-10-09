const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const Contact = require("./model/model");
const Post = require("./model/PostModel");
const Categories = require("./model/Categories");
const multer = require("multer");
const port = process.env.PORT || 5000;
const fs = require("fs");

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

const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const uploads = multer({ storage: Storage });

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
      res.status(300).json({ Success: false, message: err });
    });
});

app.get("/getMessages", async (req, res) => {
  const messages = await Contact.find();
  res.status(200).send({ Success: true, messages });
});

app.post("/addBlog", uploads.single("image"), (req, res) => {
  const image = req.file;
  const { title, description, cat } = req.body;
  console.log(image);
  const post = new Post({
    title,
    category: cat,
    description,
    image: {
      data: fs.readFileSync("uploads/" + req.file.filename),
      contentType: image.mimetype,
    },
  });

  post
    .save()
    .then(() => {
      res.status(200).json({ Success: true, message: post });
    })
    .catch((err) => {
      res.status(300).json({ Success: false, message: err, message: post });
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
  const filteredPosts = await Post.find().sort({ date: -1 }).limit(limit);
  const objectOfImage = filteredPosts.map((post) => {
    console.log(Object.keys(post.image));
    return {
      title: post.title,
      description: post.description,
      date: post.date,
      _id: post._id,
      image: `data:${post.image.contentType};base64,${post.image.data?.toString(
        "base64"
      )}`,
      category: post.category,
    };
  });
  res.status(200).send({
    page,
    size,
    posts: objectOfImage,
    NoOfPosts: filteredPosts.length,
    totalNoPosts: totalPosts.length,
  });
});

app.put("/updateBlog", (req, res) => {
  const { title, description, id } = req.body;
  Post.updateOne(
    { _id: id },
    { title: title, description: description },
    (err, data) => {
      res.status(200).send({ Success: true, err, data });
    }
  );
});

app.delete("/deleteBlog", (req, res) => {
  const { id } = req.body;
  Post.deleteOne({ _id: id }, (err, data) => {
    res.status(200).send({ Success: true, err, data });
  });
});

app.get("/getCategories", async (req, res) => {
  const cat = await Categories.find();
  res.json({ categories: cat });
});
-app.post("/addCategory", (req, res) => {
  const category = new Categories({ name: req.body.cat });
  category
    .save()
    .then(() => {
      res.status(200).json({ Success: true, category: category });
    })
    .catch((err) => {
      res.status(300).json({ Success: false, err: err });
    });
});

app.delete("/deleteCategory", (req, res) => {
  const { id } = req.body;
  Categories.deleteOne({ _id: id }, (err, data) => {
    res.status(200).send({ Success: true, err, data });
  });
});

app.listen(port, () => {
  console.log(`Tuffle is running at port ${port}`);
});
