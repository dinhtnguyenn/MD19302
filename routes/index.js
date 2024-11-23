var express = require('express');
var router = express.Router();

//http://localhost:3000/
/* GET home page. */
router.get('/hello', function(req, res, next) {
  res.render('index', { title: 'Express 02' });
});

module.exports = router;