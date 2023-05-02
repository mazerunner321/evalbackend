require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) res.status(200).json({ msg: "Please Login" });

  jwt.verify(token, process.env.key, (err, decoded) => {
    if (err) {
      console.log(err);
      res.json({ msg: err });
    }
    // console.log(decoded);
    req.body.userID = decoded.id;
    req.body.user = decoded.name;

    next();
  });
};

module.exports = auth;
