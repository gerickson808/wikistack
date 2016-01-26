var express = require('express');
var router = express.Router();
var models = require('../models/');
var Page = models.Page;
var User = models.User;


router.get('/',function(req, res, next){
	Page.find().exec()
	.then(function(pages){
		res.render('index', { pages:pages});
	})
	.then(null, next);
});

router.post('/', function(req, res, next){
	var msg = req.body;

	User.findOrCreate({email: msg.email}, msg)
	.then(function(user){
		var page = new Page({
			title: msg.title,
			content: msg.content,
			status: msg.status,
			tags: msg.tags.split(" "),
			author: user._id
		});
		return page.save();
	})
	.then(function(page){
		res.redirect(page.route);
	})
	.then(null, next);
});

router.get('/add', function(req, res){
	res.render('addpage');
});

router.get('/search', function(req, res, next){
	Page.findByTag(req.query.tag).exec()
	.then(function(pages){
		res.render('results',{pages:pages, query: 'matching the tag', queryLiteral: req.query.tag});
	})
	.then(null, next);
});

router.get('/:urlTitle/similar', function(req, res, next){
	var urlTitle = req.params.urlTitle;
	var title = "";
	Page.find({urlTitle: urlTitle}).exec()
	.then(function(page) {
		title = page[0].title;
		return page[0].findSimilar().exec();
	})
	.then(function(similarPages) {
		res.render('results', { pages:similarPages, query: "similar to", queryLiteral:title});
	})
	.then(null, next);
});

router.get('/:urlTitle', function(req, res, next){
	var thePage;
	Page.findOne({ 'urlTitle': req.params.urlTitle }).exec()
	.then(function(page){
		if (!page) throw new Error("404 Page not found");
		thePage = page;
		return User.findOne({_id: page.author}).exec();
	})
	.then(function(user) {
		res.render('wikipage',{page:thePage, user:user});
	})
	.then(null, next); 
});






module.exports = router;