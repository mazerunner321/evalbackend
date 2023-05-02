require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { connection } = require("./db");
const auth = require("./middleware/auth");
const { userRouter } = require("./routes/userRoutes");
const { postRouter } = require("./routes/postRoute");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to social media app");
});

//User routes:
app.use("/users", userRouter);

//Post route:
app.use(auth);
app.use("/posts", postRouter);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (error) {
    console.log({ msg: "Not able to connect to DB", error: error });
  }
  console.log(`Server running on port ${process.env.port}`);
});
