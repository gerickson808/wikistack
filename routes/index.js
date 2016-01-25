var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var router = express.Router();

router.use(morgan('dev'));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended:false }));

router.get('/',function(req, res){
	res.render('index');
});


module.exports = router;