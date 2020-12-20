function generar(){
	op = document.forms['configuracion'];
	op.setAttribute("method", "post");
	op.setAttribute("action", "/calendar/generar/calendario.pdf");
	op.setAttribute("target", "_blank");
	op.submit();
	
}

function saveOptions(){
	op = document.forms['configuracion'];
	op.setAttribute("method", "post");
	op.setAttribute("action", "/calendar/generar/save");
	op.submit();
}

function eliminar(){
	op = document.forms['opciones'];
	op.setAttribute("method", "post");
	op.setAttribute("action", "/calendar/generar/eliminar");
	op.submit();
}
function login(event){
	var keyCode=('which' in event)?event.which:event.keyCode;
	if(keyCode==13){
		opSignIn();
	}
}
function regist(event){
	var keyCode=('which' in event)?event.which:event.keyCode;
	if(keyCode==13){
		opSignUp();
	}
}
