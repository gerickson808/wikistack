var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var router = express.Router();
var wiki = require('./wiki.js');
var users = require('./users.js');

router.use(morgan('dev'));


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended:false }));

router.use('/wiki', wiki);
router.use('/users', users);

router.get('/',function(req, res){
	res.redirect('/wiki');
});

router.get('/search', function(req, res){
	res.render('tagsearch');
});

router.use(function(err, req, res, next){
	console.log(err);
	res.render('error', {error:err});
});

module.exports = router;