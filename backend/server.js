const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/commentsDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Schema
const CommentSchema = new mongoose.Schema({
  text: String,
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  replies: [
    {
      text: String
    }
  ]
});

const Comment = mongoose.model("Comment", CommentSchema);

// GET comments
app.get("/comments", async (req, res) => {
  const comments = await Comment.find();
  res.json(comments);
});

// ADD comment
app.post("/comments", async (req, res) => {
  const newComment = new Comment({
    text: req.body.text
  });
  await newComment.save();
  res.json(newComment);
});

// ADD reply
app.post("/comments/:id/reply", async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  comment.replies.push({ text: req.body.text });
  await comment.save();
  res.json(comment);
});

// DELETE comment
app.delete("/comments/:id", async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// LIKE
app.post("/comments/:id/like", async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  comment.likes += 1;
  await comment.save();
  res.json(comment);
});

// DISLIKE
app.post("/comments/:id/dislike", async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  comment.dislikes += 1;
  await comment.save();
  res.json(comment);
});

app.listen(5000, () => console.log("Server running on port 5000"));