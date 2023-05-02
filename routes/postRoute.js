const express = require("express");
const { PostModel } = require("../models/postModel");

const postRouter = express.Router();

//Getting posts with filters:
postRouter.get("/", async (req, res) => {
  const dev = req.query.device;

  if (dev) {
    try {
      const posts = await PostModel.find({
        device: dev,
        userID: req.body.userId,
      });
      res.status(200).json(posts);
    } catch (error) {
      console.log(error);
      res.json({ msg: "Error in get Post route" });
    }
  } else {
    try {
      const posts = await PostModel.find();
      res.send(posts);
    } catch (error) {
      console.log("Error in get post route", error);
      res.send("Error in get Post route");
    }
  }
});

//Adding new post:
postRouter.post("/create", async (req, res) => {
  try {
    const post = new PostModel(req.body);
    await post.save();
    res.status(201).json({ msg: "New post created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error in post note" });
  }
});

//Updating a post:
postRouter.patch("/update/:id", async (req, res) => {
  const ID = req.params.id;
  const payload = req.body;
  const post = await PostModel.findOne({ _id: ID });

  try {
    if (req.body.userID == post.userID) {
      await PostModel.findByIdAndUpdate({ _id: ID }, payload);
      res.json({ msg: `note with id:${ID} has been updated` });
    } else {
      res.status(401).json({
        msg: `${req.body.user} is not authorised to update ${post.user}'s note`,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ msg: "Error in note patch route" });
  }
});

//Deleting a post:
postRouter.delete("/delete/:id", async (req, res) => {
  const ID = req.params.id;
  const post = await PostModel.findOne({ _id: ID });
  try {
    if (req.body.userID == post.userID) {
      await PostModel.findByIdAndDelete({ _id: ID });
      res.json({ msg: `Note ${ID} has been deleted` });
    } else {
      res.status(401).json({
        msg: `${req.body.user} is not authorised to delete ${post.user}'s note`,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ msg: "Error in deleting note" });
  }
});

module.exports = { postRouter };
