var express = require("express");
var bcrypt = require("bcryptjs");
let User = require("../models/user");
var jwt = require("jsonwebtoken");

var router = express.Router();

/* GET users listing. */
router.post("/register", async (req, res) => {
  let { username, password } = req.body;
  let encryptedPassword = await bcrypt.hash(password, 10);
  User.findOne({ username }, (err, oldUser) => {
    if (oldUser) {
      return res.status(400).send("user already exist !!!");
    }
    const user = new User({
      username,
      password: encryptedPassword,
    });

    user
      .save()
      .then((data) => {
        const token = jwt.sign(
          { username },
          "817f8507643c3252fbe23b1582e699fb3cf3901757b8f1cf954982761963353b7d788282aa9e4af8d3141f5b76770c19a2578da18d2e1453a673bac982e41ea8"
        );
        let userWithToken = { ...data._doc, token };
        return res.status(201).json(userWithToken);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the user.",
        });
      });
  });
});

router.post("/login", async (req, res) => {
  let { username, password } = req.body;

  User.findOne({ username }, (err, user) => {
    if (err) {
      return res.status(500).send("something is wrong");
    }

    if (!user) return res.status(400).json({ msg: "User not exist" });

    bcrypt.compare(password, user.password, (err, data) => {
      if (data) {
        const token = jwt.sign(
          { username },
          "817f8507643c3252fbe23b1582e699fb3cf3901757b8f1cf954982761963353b7d788282aa9e4af8d3141f5b76770c19a2578da18d2e1453a673bac982e41ea8"
        );
        let userWithToken = { ...user._doc, token };
        return res.status(201).json(userWithToken);
      } else {
        return res.status(400).json("Wrong credentials");
      }
    });
  });
});

module.exports = router;
