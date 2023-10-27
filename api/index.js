const express = require("express");
const cors = require("cors"); // For access to fetch from origin
const mongoose = require("mongoose"); //npm install mongoose
const User = require("./models/User");
const Post = require("./models/Post");
const bcrypt = require("bcryptjs"); //npm install bcryptjs
const jwt = require("jsonwebtoken"); //npm install jsonwebtoken
const cookieParser = require("cookie-parser"); //npm install cookie-parser
const app = express();
const multer = require("multer"); //npm install multer; upload middleware
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");

const salt = bcrypt.genSaltSync(10);
const secret = "ajkj1515askskelelkj";

app.use(cors({ credentials: true, origin: "http://localhost:3000" })); // network error handler - LoginPage.js
app.use(express.json());
app.use(cookieParser());

// connect mongoDB
mongoose.connect(
  "mongodb+srv://blog:KeD7pS82E2uFVgMW@cluster0.8mjwkle.mongodb.net/?retryWrites=true&w=majority"
);
//TEST ==> http://localhost:4000/test
// app.get("/test", (req, res) => {
//   res.json("test ok");
// });
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // create an user
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    // const userDoc = await User.create({ username, password });
    res.json(userDoc);
    // Database > Browse Collection: after register, Id and password are stored in the database
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    // res.json(userDoc);

    // check a password
    const passOk = bcrypt.compareSync(password, userDoc.password);
    // res.json(passOk);

    if (passOk) {
      //logged in
      jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
        if (err) throw err;
        // res.json(token);
        res.cookie("token", token).json({
          id: userDoc._id,
          username,
        }); // save token as Set-cookie in Headers
      });
    } else {
      res.status(400).json("Wrong credentials");
    }
  } catch (e) {
    console.log(e);
    res.status(400).json("Wrong credentials");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json("Logout success");
});

// app.get("/post", (req, res) => {
//   // Your route logic here
// });

// 'file' property from createPost.js
app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  //save the file into upload directory with the original filename
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  // res.json({ files: req.file });
  // res.json({ ext });
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  //bring the username information
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    //create a post
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title: title,
      summary: summary,
      content: content,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });
});

app.get("/post", async (req, res) => {
  res.json(await Post.find().populate("author", ["username"]));
});

app.listen(4000);
