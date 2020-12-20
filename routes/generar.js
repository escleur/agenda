var express = require('express');
var router  = express.Router();
var mongoose = require('mongoose');
var modelo = mongoose.model('User');

router.get('/', function(req, res, next){
	var nick = req.session.nick;
	req.session.config = req.session.config || 'default';
	var config = req.session.config;
	modelo.find({nick: nick},function(err, datos){
		res.render('generar', {title:"Configuraciones de calendario", datos: datos[0], config: config});	
	});
});
router.post('/seleccion', function(req, res, next){
	var config = req.body.config;
	if(config == 'nuevo'){
		if(req.body.nuevo == ''){
			req.session.config = 'default';
		}else{
			req.session.config = req.body.nuevo;
		}
	}else{
		req.session.config = config.substr(2, config.length-2);
	}
	res.redirect('/calendar/generar');
});	

router.post('/save', function(req, res, next){
	var nick = req.session.nick;
	var config = req.session.config;
	var resaltaFer = req.body.resaltar || false;
	var yearSel = req.body.year;
	var listado = req.body.agendas || [];
	modelo.find({nick: nick},{'config':1},function(err, datos){
		var configId = false;
		var c = datos[0].config.pop();
		while(c){
			if(c.nombre == config){
				configId = c._id;
			}
			c = datos[0].config.pop();
		}
		var lista = [];
		for(var item in listado){
			lista.push({nombre:listado[item]}); 
		}
//		console.dir(lista);
		modelo.findOne({nick:nick}, function(err, doc){
			if(configId){
//				console.dir(config);
//				console.dir(configId);
				doc.config.pull({_id:configId});
			}

			console.dir(doc);
			doc.config.push({nombre:config, agendaSel: lista, yearSel: yearSel, resaltaFer: resaltaFer});
//			console.dir(doc);
			doc.save(function(err){
				res.redirect('/calendar/generar');
			});
		});
	});
});

router.post('/eliminar', function(req, res, next){
	var nick = req.session.nick;
	var config = req.session.config;
//	var resaltaFer = req.body.resaltar || false;
//	var yearSel = req.body.year;
//	var listado = req.body.agendas || [];
	modelo.find({nick: nick},{'config':1},function(err, datos){
		var configId = false;
		var c = datos[0].config.pop();
		while(c){
			if(c.nombre == config){
				configId = c._id;
			}
			c = datos[0].config.pop();
		}
//		var lista = [];
//		for(var item in listado){
//			lista.push({nombre:listado[item]}); 
//		}
//		console.dir(lista);
		modelo.findOne({nick:nick}, function(err, doc){
			if(configId){
//				console.dir(config);
//				console.dir(configId);
				doc.config.pull({_id:configId});
			}

			console.dir(doc);
//			doc.config.push({nombre:config, agendaSel: lista, yearSel: yearSel, resaltaFer: resaltaFer});
//			console.dir(doc);
			doc.save(function(err){
				if(req.session.config == config){
					req.session.config = 'default';
				}
				res.redirect('/calendar/generar');
				
			});
//			res.redirect('/calendar/generar');
		});
	});
});


router.post('/delete', function(req, res, next){
	var nick = req.session.nick;
	var config = req.body.config;
	if(config == 'nuevo'){
		config = req.body.nuevo;
	}

	modelo.findOne({nick:nick},{'config':1}, function(err, datos){
		var configId = false;
		var c = datos[0].config.pop();
		while(c){
			if(c.nombre == config){
				configId = c._id;
			}
			c = datos[0].config.pop();
		}

		modelo.findOne({nick:nick}, function(err, doc){
			doc.config.pull({_id:configId});
			doc.save();
			if(req.session.config == config){
				req.session.config = 'default';
			}
			res.redirect('/calendar/generar');
		});
	});
});

router.post('/calendario.pdf', function(req, res, next){
	require('./armapdf')(req, res);
});
	

module.exports = router;
