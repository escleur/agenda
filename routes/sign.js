var crypto = require('crypto');
var mongoose = require('mongoose');
var User   = mongoose.model('User');


module.exports = function(router){
	router.get('/signin', function(req, res, next) {
		res.render('login', {});
	});
	
	router.post('/signin', tieneNick, tienePass, function(req, res, next){
		var nick = req.body.nick;
		User.find({nick: nick}, {nick:1, pass: 1, last:1, first:1},function(err, user){
			if(err) return next(err);
			var pass = req.body.pass;
			if(user[0]){
				pass = crypto.createHash('md5').update(pass).digest('hex');
				if(user[0].pass == pass){
					req.session.isLoggedIn = true;
					req.session.nick       = user[0].nick;
					req.session.apellido   = user[0].last;
					req.session.nombre     = user[0].first;
					req.session.save();
					res.json({redirect:'/'});
					//IMPORTANTE para que se guarden los datos de la secion necesita llegar al end.
					// Cuando se usa AJAX no se envia el end, y hay que usar el comando save.
				}else{
					loginFallure(res);
				}
			}else{
				loginFallure(res);
			}

		})
	});
	router.get('/signup', function(req, res, next) {
		res.render('signup', {});
			
	});
	router.post('/signup', tieneNick, tienePass, passComp, tieneLast, tieneFirst, function(req, res, next){
		var nick = req.body.nick;
		var pass = req.body.pass;
		var last = req.body.last;
		var first = req.body.first;
		User.find({nick: nick}, {nick:1}, function(err, user){
			if(err) return next(err);
			if(user[0]){
				return res.json({error:'El nick ya esta registrado', activar: {tag: 'error'}});
			}else{
				pass = crypto.createHash('md5').update(pass).digest('hex');
				User.create({nick: nick, pass: pass, last: last, first: first}, function(err, reg){
					if(err) return res.json({error: err.errors[Object.keys(err.errors)[0]].message, activar: {tag: 'error'}});
					res.json({redirect:'/signin'});
				});
			}

		})
	});
	router.get('/signout', function(req, res, next) {
		req.session.destroy();
		console.log(req.session)	
		res.redirect('/');
			
	});
	function tieneNick(req, res, next){
		var nick = req.body.nick;
		if(!nick){
			return res.json({error:'Debe ingresar un nick name', activar: {tag: 'error'}});
		}
		if(nick.length < 5 || nick.length > 20){
			return res.json({error:'El nickname debe ser de al menos 5 caracteres y no mas de 20', activar: {tag: 'error'}});
		}
		next();
	}
	function tienePass(req, res, next){
		var pass = req.body.pass;
		if(!pass){
			return res.json({error:'Debe ingresar su contraseña', activar: {tag: 'error'}});
		}
		next();
	}
	function loginFallure(res){
		return res.json({error:'Nick o contraseña incorrectos, intente nuevamente', activar: {tag: 'error'}});
		
	}
	function tieneLast(req, res, next){
		var last = req.body.last;
		/*if(!nick){
			return res.json({error:'Debe ingresar un nick name', activar: {tag: 'error'}});
		}*/
		if(last.length < 1 || last.length > 20){
			return res.json({error:'El apellido debe ser de al menos 1 caracter y no mas de 20', activar: {tag: 'error'}});
		}
		next();
	}
	function tieneFirst(req, res, next){
		var first = req.body.first;
		/*if(!nick){
			return res.json({error:'Debe ingresar un nick name', activar: {tag: 'error'}});
		}*/
		if(first.length < 1 || first.length > 20){
			return res.json({error:'El nombre debe ser de al menos 1 caracter y no mas de 20', activar: {tag: 'error'}});
		}
		next();
	}
	function passComp(req, res, next){
		var pass = req.body.pass;
		var comp = req.body.comp;
		/*if(!nick){
			return res.json({error:'Debe ingresar un nick name', activar: {tag: 'error'}});
		}*/
		if(pass != comp){
			return res.json({error:'La clave y su comprovacion deben ser identicos', activar: {tag: 'error'}});
		}
		next();
	}
}
