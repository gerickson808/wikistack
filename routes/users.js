var express = require('express');
var router = express.Router();
var models = require('../models/');
var Page = models.Page;
var User = models.User;

router.get('/', function(req, res, next){
	User.find().exec()
	.then(function(users){
		res.render('users', {users:users});
	}).then(null,next);
});

router.get('/:id', function(req,res,next){
	var userId = req.params.id;
	var userObj;
	User.findOne({_id: userId}).exec()
	.then(function(user){
		if (!user) throw new Error("User does not exist");
		userObj = user;
		return Page.find({author: userId}).exec();
	})
	.then(function(pages){
		res.render('results', {pages:pages, query:'written by', queryLiteral:userObj.name + " (" + userObj.email + ")"});
	})
	.then(null,next);
});

module.exports = router;