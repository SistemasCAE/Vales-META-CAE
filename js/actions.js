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
		 $("#botonIniciarSesion").tap(fn.iniciarSesion);
		 $("#botonCerrarSesion").tap(fn.cerrarSesion);
		 $("#barcode1").tap(fn.mostrarPopUp);
		 fn.compruebaSesion();
		 fn.cargarValesDisponibles();
	},
	compruebaSesion: function(){
		if(window.localStorage.getItem("nombreUsuario") != null){
			$("#usuario").html(window.localStorage.getItem("nombreUsuario"));
			fn.cargaVale();
			window.location.href="#bienvenido";
		}else{
		window.location.href="#paginaInicio";
		}
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
		var colaborador= window.localStorage.getItem("nombreUsuario");
		window.location.href="#bienvenido";
		$.ajax({
				method: "POST",
				url: "http://intranet.cae3076.com:50000/Vales_META-CAE/php/json.php",
				data: { 
					opcion: 1,
					colaborador: colaborador
				}
			}).done(function(mensaje){
				if(mensaje != "0"){
					$("#texto").html('');
					JsBarcode("#barcode1", mensaje);
					JsBarcode("#barcode2", mensaje);
				}else{
					$("#texto").html('No tienes Vales disponibles');
				}

			}).fail(function(error){
				alert(error.status);
				alert(error.message);
				alert(error.responseText);
			});
	},
	cerrarSesion: function(){
		window.localStorage.removeItem("nombreUsuario");
		$("#usuarioSesion").val("");
		$("#passwordSesion").val(""); 
		window.location.href = "#inicioSesion";
	},
	mostrarPopUp : function()
	{
		$("#popup").popup("open");
	},
	cargarValesDisponibles : function(){
		//var colaborador= window.localStorage.getItem("nombreUsuario");
		console.log("llegue");
		var colaborador= 'mreyes';
		$.ajax({
			type: "POST",
			url:"http://intranet.cae3076.com:50000/Vales_META-CAE/php/json.php",
			data: { 
					opcion: 2,
					colaborador: colaborador
				},
			async: true,
			success: function(data){
				console.log("se envio");
				$("#resultadoTabla").html("");
				for (var i in data) {
					//$("#resultadoTabla").append(data[i]);
					$("#resultadoTabla").append("<li>"+data[i]+"</li>");
				}
			},
			error: function (obj, error, objError){
				alert('error');
			}

		});
	}
};
/*
 *Llamar al metodo Init en el navegador
 */
//fn.init();

/*
 *Llamar deviceready para compilar
 */
//
fn.deviceready();