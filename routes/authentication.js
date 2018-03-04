const express = require('express');
const passport = require("passport");
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');
const router  = express.Router();

// User Model
const User = require("../models/user");
const UserGame = require("../models/user-game");

// Get Signup
router.get('/signup', ensureLoggedOut(), (req, res) => {
  res.render('authentication/signup');
});

// Get login
router.get('/login', ensureLoggedOut(), (req, res) => {
  res.render('authentication/login');
});

// Post Signup
router.post('/signup', ensureLoggedOut(), passport.authenticate('local-signup', {
  successRedirect : '/',
  failureRedirect : '/signup'
}));

// Post login
router.post('/login', ensureLoggedOut(), passport.authenticate('local-login', {
  successRedirect : '/',
  failureRedirect : '/login'
}));

// Gets Secure page for each User
router.get("/user-page",  ensureLoggedIn('/login'), (req, res) => {
  res.render("authentication/user-page", { user: req.user });
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Grabs a Game a User Post
router.post("/infoGame", (req, res, next) => {
  console.log("im the creating")
  const info = {
    title: req.body.title,
    link: req.body.link,
    summary: req.body.summary,
    _creator: req.user._id,
    author: req.body.author,
    platform: req.body.platform
  }

  // Adds it to Schema
  const newUserGame = new UserGame(info);

  // Saves the Game User Post
  newUserGame.save( (err) => {

    if (err) { return next(err) }

    // For now
    return res.redirect("/list");
  });
});

// List of All Games User Post
router.get('/list', (req, res, next) => {
  UserGame.find({}, (err, game) => {
    if (err) {return next(err) }

    return res.render('user-games/index', { game });
  });
});

// Show Individual User Game Info
router.get('/:id', (req, res, next) => {
  const gameId = req.params.id;

  UserGame.findById(gameId, (err, info) => {
    if (err) { return next(err); }
    res.render('user-games/show', { info, user: req.user });
  });
});

// Show Form to Update User Game
router.get('/:id/edit', ensureLoggedIn(), (req, res, next) => {
  const gameId = req.params.id;

  UserGame.findById(gameId, (err, info) => {
    if (err) { return next(err); }
    res.render('user-games/edit', { info });
  });
});

// Show Updated User Game
router.post('/:id', ensureLoggedIn(), (req, res, next) => {
  console.log("im the updating")

  const gameId = req.params.id;

  const updates = {
    title: req.body.title,
    link: req.body.link,
    summary: req.body.summary,
    author: req.body.author,
    platform: req.body.platform
  }

  UserGame.findByIdAndUpdate(gameId, updates, (err, userGame) => {
    if (err) { return next(err); }
    res.redirect('/list');
  });
});

// Delete User game from Database
router.post('/:id/delete', ensureLoggedIn(), (req, res, next) => {
  const id = req.params.id;

  UserGame.findByIdAndRemove(id, (err, info) => {
    if (err){ return next(err); }
    return res.redirect('/list');
  });
});

module.exports = router;