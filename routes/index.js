var express = require('express');
var router = express.Router();

/* GET register page */
router.get('/register.html', function(req, res, next) {
  res.render('register');
});

/* GET login page */
router.get('/login.html', function(req, res, next) {
  res.render('login');
});

module.exports = router;
