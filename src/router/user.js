const express = require("express");
const router = express.Router();
const User = require("../Model/User");
const Email = require("../Model/Email");
const { verifyMail } = require("../utils/send_mail");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const { excelParser } = require("../services/parser");
const upload = require("../middleware/excelUpload");
const queue = require("../services/queue");
const dequeue = require("../services/dequeue");

router.get("/", ensureAuth, async (req, res) => {
  const emailTemplates = await Email.find().lean();
  res.render("index", {
    username: req.user.username,
    emailTemplates,
  });
});

router.get("/email/:id", ensureAuth, (req, res) => {
  res.render("upload", {
    username: req.user.username,
  });
});

router.post(
  "/email/:id",
  ensureAuth,
  upload.single("excel"),
  async (req, res) => {
    try {
      const emails = excelParser(req.file.path);
      console.log(emails);
      queue(emails);
      dequeue(req.params.id);
      res.render("upload");
    } catch (error) {
      res.render("errors/500");
    }
  },
  (err, req, res, next) =>
    res.render("upload", {
      error: err.message,
    })
);

router.get("/login", ensureGuest, (req, res) => {
  res.render("login", {
    layout: "login",
  });
});

router.get("/register", ensureGuest, (req, res) => {
  res.render("register", {
    layout: "login",
  });
});

router.post("/register", ensureGuest, async (req, res) => {
  try {
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
      throw new Error("email already taken");
    }
    const user = await User.create(req.body);
    if (user) {
      const code = require("crypto").randomBytes(3).toString("hex");
      console.log(code);
      verifyMail(req.body.email, code);
      const token = jwt.sign({ _id: user._id, code }, process.env.JWT_SECRET);
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 12),
        httpOnly: true,
        secure: true,
      });
      res.redirect("/login");
    }
  } catch (error) {
    res.render("register", { layout: "login", error });
  }
});

router.get("/verify", ensureGuest, async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!req.query.code && !req.query.mail) {
      return res.redirect("/login");
    }
    const emailExistInDb = await User.findOne({ email: req.query.mail });
    if (!emailExistInDb) {
      return res.redirect("/login");
    }
    if (!token) {
      await User.findOneAndDelete({ email: req.query.mail });
      return res.render("register", {
        layout: "login",
        error: "Time limit exceeded! Please register again.",
      });
    }
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    if (verify.code !== req.query.code) {
      return res.redirect("/register");
    }
    await User.findOneAndUpdate(
      { email: req.query.mail },
      { valid: true },
      { new: true, runValidators: true }
    );
    res.clearCookie("jwt");
    res.redirect("/");
  } catch (error) {
    res.render("errors/404");
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/logout", ensureAuth, (req, res) => {
  req.logOut();
  res.redirect("/login");
});

module.exports = router;
