//SignIn
function rcvSignIn(){
	if(oXML.readyState == 4){
		var jsonObj = JSON.parse(oXML.responseText);
		for(var k in jsonObj){
			try{
				if(k=="redirect"){
					location.href=jsonObj[k];
				}
				if(k=="activar"){
					var tag = jsonObj[k].tag;
					
					var error = document.getElementById(tag);
					if(error.setActive){
						error.setActive();
					}
					if(error.focus){
						error.focus();
					}
					document.activeElement.blur();
				}else{
					document.getElementById(k).innerHTML = jsonObj[k];	
				}
			}catch(e){
				console.log('Clave no encontrada ' + k);
			}
		}
	}
}

function opSignIn(){
	var nick = document.forms['in'].elements['nick'].value;
	var pass = document.forms['in'].elements['pass'].value;
	var param = "nick="+nick+"&pass="+pass;
	var data = {parametro:param , funcion:rcvSignIn, url:'/signin'} 
	peticionAJAX(data);
}
//SignUp
/*function rcvSignIn(){
	if(oXML.readyState == 4){
		var jsonObj = JSON.parse(oXML.responseText);
		for(var k in jsonObj){
			try{
				if(k=="activar"){
					var tag = jsonObj[k].tag;
					
					var error = document.getElementById(tag);
					if(error.setActive){
						error.setActive();
					}
					if(error.focus){
						error.focus();
					}
					document.activeElement.blur();
				}else{
					document.getElementById(k).innerHTML = jsonObj[k];	
				}
			}catch(e){
				console.log('Clave no encontrada ' + k);
			}
		}
	}
}*/

function opSignUp(){
	var nick = document.forms['in'].elements['nick'].value;
	var pass = document.forms['in'].elements['pass'].value;
	var comp = document.forms['in'].elements['comp'].value;
	var last = document.forms['in'].elements['last'].value;
	var first = document.forms['in'].elements['first'].value;
	var param = "nick="+nick+"&pass="+pass+"&comp="+comp+"&last="+last+"&first="+first;
	var data = {parametro:param , funcion:rcvSignIn, url:'/signup'} 
	peticionAJAX(data);
}
