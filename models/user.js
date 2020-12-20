
var mongoose = require('mongoose');

//agenda evento
//000001 se repite todos los años
//000010 es feriado
var schema = mongoose.Schema({
	nick: {type: String },
	pass: {type: String, validate: [validaClave, 'La clave {VALUE} debe tener longitud entre 20 y 40 caracteres.']},
	last: {type: String },
	first: {type: String },
	agenda: [{
		nombre: {type: String},
		tipo: {type: Number},
		icono: {type: String},
		eventos: [{
			year: {type: Number},
			day: {type: Number},
			month: {type: Number},
			msg: {type: String}
		}]
	}],
	config: [{
		nombre: {type: String},
		agendaSel: [{
			nombre: {type: String}
		}],
		yearSel: {type: Number},
		resaltaFer: {type: Boolean}
	}]
	
});



function validaClave(clave){
	return clave.length > 20 && clave.length <40;
	
}



module.exports = mongoose.model('User', schema);
