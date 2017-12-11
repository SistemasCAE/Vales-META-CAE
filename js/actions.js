var fn = {
	deviceready: function(){
		//alert();
		document.addEventListener("deviceready", fn.init/*this.init*/, false);
	},
	init: function(){
		/*
		 * En esta sección vamos a asociar
		 * todos los eventos del "Click" al HTML
		 */
		 
		 //var colaborador= window.localStorage.setItem("nombreUsuario");
		 $("#botonIniciarSesion").tap(fn.iniciarSesion);
		 
	
	},
	compruebaSesion: function(){
		if(window.localStorage.getItem("nombreUsuario") != null){
			$("#usuario").html(window.localStorage.getItem("nombreUsuario"));
			
			window.location.href="#bienvenido";
		}
		fn.quitarClases();
	},
	iniciarSesion: function(){
		var usuario = $("#usuarioSesion").val();
		var password = $("#passwordSesion").val();
		try{
			if(usuario == ""){
				throw new Error("Especifique su usuario");
			}
			if(password == ""){
				throw new Error("Especifique su contraseña");
			}
			fn.enviarSesion(usuario, password);
		}catch(error){
			window.plugins.toast.show(error, 'short', 'center');
		}
	},
	enviarSesion: function(usuario, password){
		if(networkState.estaConectado() == false){
			window.plugins.toast.show("No existe conexión a internet, revisela e intente de nuevo", 'long', 'center');
			
		}else{
			$.ajax({
				method: "POST",
				url: "http://intranet.cae3076.com:50000/Vales_META-CAE/Recibe/compruebaSesion.php",
				data: { 
					usu: usuario,
					pass: password
				}
			}).done(function(mensaje){
				if(mensaje != "0"){
					window.localStorage.setItem("nombreUsuario", usuario);
					fn.cargaVale();
					
					
				}else{
					window.plugins.toast.show("Usuario/Contraseña invalido(s)", 'long', 'center');
				}

			}).fail(function(error){
				alert(error.status);
				alert(error.message);
				alert(error.responseText);
			});
		}
	},
	cargaVale: function(){
		alert("llegue a carga vale");
		//JsBarcode("#barcode1", "CAE7000008");
		var colaborador= window.localStorage.setItem("nombreUsuario");
		$.ajax({
				method: "POST",
				url: "http://intranet.cae3076.com:50000/Vales_META-CAE/Recibe/compruebaSesion.php",
				data: { 
					usu: usuario,
					pass: password
				}
			}).done(function(mensaje){
				if(mensaje != "0"){
					window.localStorage.setItem("nombreUsuario", usuario);
					alert(mensaje);
					JsBarcode("#barcode1", mensaje);
					
				}else{
					window.plugins.toast.show("Usuario/Contraseña invalido(s)", 'long', 'center');
				}

			}).fail(function(error){
				alert(error.status);
				alert(error.message);
				alert(error.responseText);
			});
		window.location.href="#bienvenido";
	}
};
/*
 *Llamar al metodo Init en el navegador
 */
fn.init();

/*
 *Llamar deviceready para compilar
 */
//
//fn.deviceready();