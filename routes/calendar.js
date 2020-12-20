var express = require('express');
var router  = express.Router();


router.use('/agendas', estaLog, require('./agendas'));
router.use('/edicion', estaLog, require('./edicion'));
router.use('/generar', estaLog, require('./generar'));

router.get('/', estaLog,　function(req, res, next){
	res.render('resumen', {title:"Resumen"});
});


function estaLog(req, res, next ){
	if(req.session.isLoggedIn == true){
		next()
	}else{
		res.redirect('/');
		
	}
}	

module.exports = router;
