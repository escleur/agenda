var express = require('express');
var router  = express.Router();
var mongoose = require('mongoose');
var modelo = mongoose.model('User');

router.get('/', function(req, res, next){
	var nick = req.session.nick;
	var seleccion = req.session.seleccion || false;
	modelo.find({nick: nick},{agenda:1},function(err, datos){
		res.render('edicion', {title:"Edicion de Agenda", datos: datos[0],seleccion: seleccion});	
	});
});

router.post('/nuevo', function(req, res, next){
	var nick = req.session.nick;
	var seleccion = req.session.seleccion;
	var day = req.body.day;
	var month = req.body.month;
	var year = 0;
	var msg = req.body.msg;
	modelo.find({nick: nick},{'agenda':1},function(err, datos){
		if((datos[0].agenda.id(seleccion).tipo%2)==0){
			year = req.body.year;
//			console.dir('entra año' + year);
		}
		var existe = false;
//		console.dir(datos);
		
		var evento = datos[0].agenda.id(seleccion).eventos.pop()
		while(evento){
			if((evento.year == year) && (evento.month == month) && (evento.day == day)){
				existe = true;
//				console.dir(' existe ');
			}
		console.dir(evento);
			evento = datos[0].agenda.id(seleccion).eventos.pop()
		}
//		for(var item in datos[0].agenda[0]){
//			for(var item2 in item.eventos){
//				console.dir(item);
//				console.dir('----------------');
//			}
//			if((item.year == year) && (item.month == month) && (item.day == day)){
//				existe = true;
//				console.dir(' existe ');
//			}
//		} 
		if(!existe){
//			console.dir('entro existencia');
			modelo.findOne({nick:nick}, function(err, doc){
//				console.dir(doc);
				doc.agenda.id(seleccion).eventos.push({year:year, day: day, month: month, msg: msg});
//				console.dir(doc);
				doc.save(function(err){
					res.redirect('/calendar/edicion');
				});
			});
		}else{
			res.redirect('/calendar/edicion');
		}
	});
});

router.post('/eliminar', function(req, res, next){
	var idEvento = req.body.id;
	var idAgenda = req.session.seleccion;
	var nick = req.session.nick;
	modelo.findOne({nick:nick}, function(err, doc){
		doc.agenda.id(idAgenda).eventos.pull({_id:idEvento});
		doc.save(function(err){
			if(err) return console.dir('err');
				res.redirect('/calendar/edicion');
		});
	});
});	

/*router.post('/calendario.pdf', function(req, res, next){
	require('./armapdf')(req, res);
});
	*/

module.exports = router;
