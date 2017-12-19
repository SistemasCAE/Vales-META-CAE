var fn = {
	deviceready: function(){
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
	},
	
	compruebaSesion: function(){
		if(window.localStorage.getItem("nombreUsuario") != null){
			$("#usuario").html(window.localStorage.getItem("nombreUsuario"));
			fn.cargaVale();
			fn.cargarValesDisponibles();
			fn.cargarRestaurantes();
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
					fn.cargarValesDisponibles();
					fn.cargarRestaurantes();
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
				method: "GET",
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
					$("#resultadoTabla").html("");
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
		var colaborador= window.localStorage.getItem("nombreUsuario");
		var url = "http://intranet.cae3076.com:50000/Vales_META-CAE/php/json.php?";
		$.getJSON(url, { 
			opcion: 2,
			colaborador: colaborador
		}).done (function(data){
			var tamano = Object.keys(data).length;
			$("#resultadoTabla").html("");
			var tablaGenerada="<table class='mi_tabla'><tr class='encabezado_tabla'><td>ID VALE</td></tr>";
			for(var x=0; x<tamano; x++)
			{
				tablaGenerada +="<tr class='cuerpo_tabla'><td align='center'>"+data[x]['ID_VALE']+"</td></tr>";
			}
			tablaGenerada += "</table>";
			$("#resultadoTabla").html(tablaGenerada);
		});
	},
	cargarRestaurantes : function(){
		var url = "http://intranet.cae3076.com:50000/Vales_META-CAE/php/json.php?";
		$.getJSON(url, { 
			opcion: 3
		}).done (function(data){
			var tamano = Object.keys(data).length;
			$("#resultadoRestaurantes").html("");
			var tablaGenerada = "";
			for(var x=0; x<tamano; x++)
			{
				tablaGenerada +="<div class='resultadoRestaurantes'><div class='A' id='map'></div><div class='B'><div>"+data[x]['NOMBRE']+"</div><div>"+data[x]['DIRECCION']+"</div><div>"+data[x]['TELEFONO']+"</div></div></div>";
			}
			$("#resultadoRestaurantes").html(tablaGenerada);
			
			var iconBase = 'http://200.33.128.118/CAEP/ControlSaldos/images/';
			var icons = {
			  parking: {
				icon: iconBase + 'marcador.png'
			  }
			};

	  		///////////////////////////////////// LOCALIZACION MAPA /////////////////////////////////////////////
			var uluru = {lat: 19.028786, lng: -98.214501};
			var map = new google.maps.Map(document.getElementById('map'), {
			  zoom: 15,
			  center: uluru
			});
			///////////////////////////////////// MARCAS /////////////////////////////////////////////
			var marker = new google.maps.Marker({
			   position: new google.maps.LatLng(19.028786,-98.214501),
			   map: map,
    		   icon: iconBase + 'marcador.png'
			});
			
			///////////////////////////////////// GEOLOCALIZACION /////////////////////////////////////////////
			var infoWindow = new google.maps.InfoWindow({map: map});
		  	
			if (navigator.geolocation) {
			  navigator.geolocation.getCurrentPosition(function(position) {
				var pos = {
				  lat: position.coords.latitude,
				  lng: position.coords.longitude
				};
				///////////////////////////////////// MARCA TU UBICACION /////////////////////////////////////////////
				var marker = new google.maps.Marker({
				   position: new google.maps.LatLng(position.coords.latitude,position.coords.longitude),
				   map: map
				});

				//infoWindow.setPosition(pos);
				//infoWindow.setContent('Tu estas aqui.');
				map.setCenter(pos);
			  }, function() {
				handleLocationError(true, infoWindow, map.getCenter());
			  });
			} else {
			  // Browser doesn't support Geolocation
			  handleLocationError(false, infoWindow, map.getCenter());
			}
		  
			
			/*for(var x=0; x<tamano; x++)
			{
				tablaGenerada +="<tr class='cuerpo_tabla'><td align='center'></td></tr>";
			}*/
			//tablaGenerada += "</table>";
			
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