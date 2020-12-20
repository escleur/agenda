
function AJAXCrearObjeto() {
	var obj;
	if (window.XMLHttpRequest) { // no es IE 
		obj = new XMLHttpRequest();
	} else { // Es IE o no tiene el objeto 
		try {
			obj = new ActiveXObject("Microsoft.XMLHTTP");
		}
		catch (e) {
			alert('El navegador utilizado no está soportado');
		}
	}
	return obj;
}

function peticionAJAX(datos) {
	// Creamos la variable parametro
	var parametro = datos['parametro'] || alert("(peticionAJAX)No paso parametro");
	var recibe = datos['funcion'] || alert("(peticionAJAX)No paso funcion");
	var url = datos['url'] || alert("(peticionAJAX)No paso url");
	// Preparamos la petición con parametros
	try{
	oXML.open('POST', url, true);
	oXML.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	// Preparamos la recepción 
	oXML.onreadystatechange = recibe;
	// Realizamos la petición 
	oXML.send(parametro);
	}catch(e){
		alert('errrrror');
	}
}

// Creamos el objeto 
oXML = AJAXCrearObjeto();
