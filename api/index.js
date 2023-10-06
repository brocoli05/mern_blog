const express = require("express");
const cors = require("cors");
const User = require("./models/User");
const bcrypt = require("bcryptjs"); //npm install bcryptjs
const app = express();
const jwt = require("jsonwebtoken"); //npm install jsonwebtoken
const cookieParser = require("cookie-parser"); //npm install cookie-parser

const salt = bcrypt.genSaltSync(10);
const secret = "ajkjaskskelelkj";

app.use(cors({ credentials: true, origin: "http://localhost:3000" })); // network error handler
app.use(express.json());
app.use(cookieParser());

// connect mongoDB
mongoose.connect(
  "mongodb+srv://blog:hn011tExTDj9JUrJ@cluster0.8mjwkle.mongodb.net/?retryWrites=true&w=majority"
);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  //create an user
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
    // Database > Browse Collection: after register, Id and password are stored in the database
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post("/login", async (res, req) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username: username });
  // check a password
  const passOk = bcrypt.compareSync(password, userDoc.password);

  if (passOk) {
    //logged in
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      }); // save token as Set-cookie in Headers
    });
  } else {
    res.status(400).json("wrong credentials");
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
  res.cookie("token", "").json("ok");
});

app.listen(4000);
