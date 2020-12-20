var express  = require('express');
var router   = express.Router();
var sign     = require('./sign')
var calendar = require('./calendar');

/* GET home page. */
	router.get('/', function(req, res, next) {
		console.log(req.session);
		if(req.session.isLoggedIn == true){
			return res.redirect('/calendar');
		}else{
			res.redirect('/signin');
		}
	});
	
	sign(router);
	
	router.use('/calendar', require('./calendar'));
	
	router.get('/prueba', function(req, res, next) {
		user.findOne().exec(function(err, us){
			if(err) return next(err);
				res.render('login', { title: us.nick });
		});
	});


module.exports = router;
