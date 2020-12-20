
var PDFDocument = require('pdfkit');
var blobStream = require('blob-stream');

var mongoose = require('mongoose');
var modelo = mongoose.model('User');

var info = {};
var coleccion = [];

var year;
var nick;
var listado;
var confRes;

module.exports = function(req, res){
// create a document and pipe to a blob
coleccion = [];
year = req.body.year;
nick = req.session.nick;
listado = req.body.agendas || [];
confRes = req.body.resaltar || false;

crearColeccion(year, nick, listado,res, function(res){  



var doc = new PDFDocument({layout:'landscape', margin: 10});
doc.pipe(res);

doc.registerFont('FreeSerif', 'font/FreeSerif.ttf');

var meses = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];
var dias = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];

var first = new Date();

for(var m=0; m<12; m++){
	doc.addPage();
	
	first.setFullYear(year, m, 1);
	var wFirst = first.getDay();
	var desplazamiento = -wFirst;
	var feriado = false;
	
	for(var y=0;y<6;y++){
		for(var x=0;x<7;x++){
			desplazamiento++;          //desplazamiento es el dia
			var dmax= new Date(year, m+1, 0);    //m+1 es el mes
			dmax = dmax.getDate();

			if(desplazamiento > 0 && desplazamiento <= dmax){
				diax = x*100+50;
				diay = y*80+115;
				feriado = x == 0;    //x es el dia de la semana 0 es domingo
				
				var res = ((coleccion[m][desplazamiento-1].resaltado && confRes) || feriado)

				if(res){
					doc.font('Times-Bold',25)
						.text(desplazamiento, diax+2, diay+2);
				}else{
					doc.font('Times-Roman',25)
						.text(desplazamiento, diax+2, diay+2);
				}
				var altura = 20;
				for(i in coleccion[m][desplazamiento-1].msg){
					var txt = coleccion[m][desplazamiento-1].msg[i];
					doc.font('FreeSerif',10)
						.text(txt, diax+2, diay+altura);
					altura+= 10;
				}
				
				doc.roundedRect(diax, diay, 90, 70, 10)
					.stroke();
			}
		}
	}
	//marco interno
	doc.roundedRect(40, 80, 710, 510, 10)
		.stroke();
	//marco externo
	doc.roundedRect(38, 30, 714, 562, 10)
		.stroke();
	//marco dias semana
	doc.roundedRect(45, 85, 700, 25, 10)
		.stroke();

	for(var x=0;x<7;x++){
		doc.font('Times-Roman', 15)
			.text(dias[x], x*100+60, 90);
	}
	//estampa año
	doc.fontSize(60)
		.text(year, 335, 35);

	//estampa mes
	doc.font('Times-Roman', 40)
		.text(meses[m], 60, 45);

}	
/*
doc.addPage();
var lorem = "Hola esto es un gran texto bla bla bla...";
// draw some text
doc.fontSize(25)
   .text('Here is some vector graphics...', 100, 80);
   
// some vector graphics
doc.save()
   .moveTo(100, 150)
   .lineTo(100, 250)
   .lineTo(200, 250)
   .fill("#FF3300");
   
doc.circle(280, 200, 50)
   .fill("#6600FF");
   
// an SVG path
doc.scale(0.6)
   .translate(470, 130)
   .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
   .fill('red', 'even-odd')
   .restore();
   
// and some justified text wrapped into columns
doc.text('And here is some wrapped text...', 100, 300)
   .font('Times-Roman', 13)
   .moveDown()
   .text(lorem, {
     width: 412,
     align: 'justify',
     indent: 30,
     columns: 2,
     height: 300,
     ellipsis: true
   });
  */ 
// end and display the document in the iframe to the right
doc.end();
});
}




function crearColeccion(yearDone, nick, listado,res, callback){
	info.year = yearDone;
//	info.resaltar = resaltar;
	for(i=0;i<12;i++){
		coleccion.push([]);
		for(j=0;j<31;j++){
			coleccion[i].push({resaltado:false,msg:[]});
		}
	}

//	console.dir(listado);
	modelo.find({nick: nick},{agenda:1},function(err, datos){

//		res.render('agendas', {title:"Agendas", datos: datos[0],seleccion: seleccion});
		
		for(var i in datos[0].agenda){
			var item = datos[0].agenda[i];
//			console.dir('item ' +item);
//console.dir(listado.indexOf(item.nombre));
			if(listado.indexOf(item.nombre) != -1){
//				console.dir('entro'+item.nombre);
				var tipo = item.tipo;
				var icono = item.icono;
				var resalt = (tipo>>1)%2 == 1;
				for(var e in item.eventos){
					var evento = item.eventos[e];
//					console.dir('ev'+evento);
					if(typeof evento.day != 'undefined'){
						if(evento.year == info.year || ((tipo%2) == 1)){
							var mes = evento.month - 1;
							var dia = evento.day - 1;
							var texto = icono+' '+evento.msg;
//							console.dir('mes'+mes+'dia'+dia);
							coleccion[mes][dia].resaltado = coleccion[mes][dia].resaltado || resalt;
							coleccion[mes][dia].msg.push([texto]);
//							console.dir(	coleccion[mes][dia].msg);
						}
					}
//					console.dir(coleccion[mes][dia]);
				}
				
			}
		}

//	console.dir(coleccion);	
		callback(res);
	});

	
}
