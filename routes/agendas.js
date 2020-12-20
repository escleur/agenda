var express = require('express');
var router  = express.Router();
var mongoose = require('mongoose');
var modelo = mongoose.model('User');

router.get('/', function(req, res, next){
	var nick = req.session.nick;
	var seleccion = req.session.seleccion || false;
	modelo.find({nick: nick},{agenda:1},function(err, datos){
		res.render('agendas', {title:"Agendas", datos: datos[0],seleccion: seleccion});
		
	});
});


router.post('/nuevo', function(req, res, next){
	var nick = req.session.nick;
	var nombre = req.body.nombre;
	modelo.find({nick: nick,'agenda.nombre':nombre},{agenda:1},function(err, datos){
		if(!datos[0]){
			modelo.findOne({nick:nick}, function(err, doc){
//				console.dir(doc);
				doc.agenda.push({nombre:nombre, tipo: req.body.tipo, icono: req.body.icono});
				doc.save(function(err){
					res.redirect('/calendar/agendas');
				});
			});
		}else{
			res.redirect('/calendar/agendas');
		}
	});
});

router.post('/eliminar', function(req, res, next){
	var id = req.body.id;
	var nick = req.session.nick;
	modelo.findOne({nick:nick}, function(err, doc){
		doc.agenda.pull({_id:id});
		doc.save(function(err){
			if(err) return console.dir('err');
				res.redirect('/calendar/agendas');
		});
	});
});	

router.post('/seleccion', function(req, res, next){
	var agenda = req.body.agenda;
	req.session.seleccion = agenda;
	res.redirect('/calendar/edicion');
});	

module.exports = router;
