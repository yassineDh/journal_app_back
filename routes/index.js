var express = require("express");
var router = express.Router();
let Blog = require("../models/blog");

/* GET home page. */
router.get("/blogs", function (req, res) {
  Blog.find({ author: req.query.userId })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving notes.",
      });
    });
});

router.post("/blogs", function (req, res) {
  if (!req.body.title) {
    return res.status(400).send({
      message: "no blog , empty json",
    });
  }

  const blog = new Blog({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
  });

  blog
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Note.",
      });
    });
});

router.get("/blogs/:blogId", function (req, res) {
  Blog.findById(req.params.blogId)
    .then((blog) => {
      if (!blog) {
        return res.status(404).send({
          message: "Blog not found with id " + req.params.blogId,
        });
      }
      res.send(blog);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Blog not found with id " + req.params.blogId,
        });
      }
      return res.status(500).send({
        message: "Error retrieving blog with id " + req.params.blogId,
      });
    });
});

router.put("/blogs/:blogId", function (req, res) {
  if (!req.body.title) {
    return res.status(400).send({
      message: "Blog content can not be empty",
    });
  }

  Blog.findByIdAndUpdate(
    req.params.blogId,
    {
      title: req.body.title || "Untitled Note",
      content: req.body.content,
    },
    { new: true }
  )
    .then((blog) => {
      if (!blog) {
        return res.status(404).send({
          message: "Blog not found with id " + req.params.blogId,
        });
      }
      res.send(blog);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Blog not found with id " + req.params.blogId,
        });
      }
      return res.status(500).send({
        message: "Error updating blog with id " + req.params.blogId,
      });
    });
});

router.delete("/blogs/:blogId", function (req, res) {
  Blog.findByIdAndRemove(req.params.blogId)
    .then((blog) => {
      if (!blog) {
        return res.status(404).send({
          message: "Blog not found with id " + req.params.blogId,
        });
      }
      res.send({ message: "Blog deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Blog not found with id " + req.params.blogId,
        });
      }
      return res.status(500).send({
        message: "Could not delete blog with id " + req.params.blogId,
      });
    });
});

module.exports = router;
