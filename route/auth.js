const express = require("express");
const router = express.Router();


const {
  register,
  login
} = require("../controlleur/auth");

router.route("/register").post(register);
router.route("/login").post(login);

router.get("/public", (req, res, next) => {
  res.status(200).json({ message: "here is your public resource" });
});

// will match any other path
router.use("/", (req, res, next) => {
  res.status(404).json({ error: "page not found" });
});
module.exports = router;