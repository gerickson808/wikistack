var express = require('express');
var router = express.Router();


router.get('/',function(req, res){
	res.redirect('/');
});
router.post('/', function(req, res){});
router.get('/add', function(req, res){
	res.render('addpage');
});


module.exports = router;