var Spotify = (function () {
	
	var api = "https://api.spotify.com/v1/";
	var claveLocalStorage = "artistasFavoritos";
	var favoritos = [];
	
	//Dibuja una cancion (track es la cancion, ulCanciones el contenedor de canciones)
	//var dibujarCancion = function(track, ulCanciones){}
	
	var getFormattedMs = function (ms) {
 	 	
 	 	var duration = moment.duration(ms);
  		
  		return moment.utc(duration.asMilliseconds()).format("mm:ss");
	}

	var dibujarCancion = function(contenedor, track){

		//track_number, name, duration_ms y preview_url

		ac = $("<a/>");

		//liCancion = track.track_number + ' ' + track.name + ' ' + '(' + moment().format(track.duration_ms) + ')';
		aCancion = track.track_number + ' ' + track.name;
		aPreview = track.preview_url;

		//moment(track.duration_ms, "hmm").format("HH:mm") === "01:23"
		aDuration = ' ' + '(' + getFormattedMs(track.duration_ms)  + ')';

		ac.html(aCancion).append(aDuration);
		ac.attr("href", aPreview);

		contenedor.append(ac).append($("<br>"));

	}

	var dibujarCanciones = function(contenedor, albumId, tracks){


		$("#" + albumId).find("ul").remove();

		var ult = $("<ul />")

		$("#" + albumId).append(ult);

		contenedor.append(ult);

		for (var i = 0; i < tracks.length; i++){

			dibujarCancion(contenedor, tracks[i]);

		}

	}

	//Dibuja un album
	var dibujarNombreAlbum = function(contenedor, album){

		al = $("<a />");
		al.attr("id", album.id);
		al.html(album.name).append($("<br>"));

		contenedor.append(al);

		//


		al.on("click", function(){

			
			
			
			$("#dialogDetalleAlbum").modal('show');

			$("#resultadoAlbum").empty();
			$("#modal-title").empty();

			lic = $("<li/>");

			lic.addClass("list-group-item");
			lic.attr("id", album.id);

			image = $("<img/>");
			nombre = $("<h4/>");

			image.attr("src", album.images[0].url);
			image.attr("width", 300);
			image.attr("height", 300);

			nombreAlbumTitle = album.name //+ ' ' + album.release_date;

			nombre.html(nombreAlbumTitle);

			resAlbum = $("#resultadoAlbum")
			resAlbumTitle = $("#modal-title")

			
			resAlbumTitle.append(nombre);

			resAlbum.append(image);

			obtenerAlbum(resAlbum, album.id);


		});

	}
	
	//Obtiene de Spotify el album a dibujar (eventObject contiene data.albumId, el id del album a obtener)
	var obtenerAlbum = function(contenedor, albumId){

		//https://api.spotify.com/v1/albums/3hIwt5XJuGCaTgSO6DqL7N


		var api = "https://api.spotify.com/v1/";

		$.ajax({

				//url: api + artista,
				url: api + "albums/" + albumId,
				dataType: "json"


			}).done(function(respuesta){

				
				dibujarCanciones(contenedor, albumId ,respuesta.tracks.items);
				//console.log(respuesta.tracks.items);
			
			}).fail(function(xHR, estado){

				alert(estado);

			});
	}
	
	//Dibuja el listado de albumes del artista con id artistaId
	var dibujarNombreAlbumes = function (artistaId, albumes){

		$("#" + artistaId).find("ul").remove();

		var ul = $("<ul/>");
		$("#" + artistaId).append(ul);

		for(var i = 0; i < albumes.length; i++){

			dibujarNombreAlbum(ul, albumes[i]);
		}

	}
	
	//Obtiene de Spotify los albumes del artista (eventObject contiene data.artistaId, el id del artista)
	var obtenerAlbumes = function(artista_ID){

		var api = "https://api.spotify.com/v1/";

		$.ajax({

				//url: api + artista,
				url: api + "artists/" + artista_ID + "/albums?album_type=album&market=AR",
				dataType: "json"


			}).done(function(respuesta){

				
				dibujarNombreAlbumes(artista_ID, respuesta.items);
				//console.log(respuesta.items);
			
			}).fail(function(xHR, estado){

				alert(estado);

			});

	}
	
//	Dibuja el label "Ver albumes" con su funcionalidad, contenedor es el LI del artista
	
	var dibujarLeyendaAlbumes = function (contenedor, idArtista){

		a = $("<a />");
		a.html("Ver Albumes");

		contenedor.append(a);

		a.on("click", function(){

			//$(this).addClass()
			//console.log("A");
			obtenerAlbumes(idArtista);

		});

	}
	
	//Verifica si la solapa activa es la de favoritos
	var verificarModoFavoritos = function(){

		
		linkFavoritos = $("#linkFavoritos");

		if(linkFavoritos.hasClass("active")){

			return true;
		}

	}
	
	//Borra de la pagina de favoritos un artista (eventObject contiene data.artistaId, el id del artista)
	var quitarFavorito = function(eventObject) {}
	
	//Obtiene de Spotify los artistas marcados como favoritos
	var obtenerFavoritos = function() {

		cargarFavoritos();
		buscarArtistasPorId(favoritos);


	}
	
	//Carga del almacenamiento local los artistas favoritos
	var cargarFavoritos = function() {}
		
		var data = localStorage.getItem("favoritos");
		var object = JSON.parse(data);

		if (object != null) {

			favoritos = object;

		}


	//Guarda en el almacenamiento local los artistas favoritos
	var guardarFavoritos = function() {

		var data = JSON.stringify(favoritos);
		localStorage.setItem("favoritos", data);

	}
	
	//Agrega un artista a los favoritos
	var agregarFavorito = function(artistId){

		var artistDuplicated = false;

		for (var i = 0; i < favoritos.length; i++){

			if(favoritos[i]== artistId){
				artistDuplicated = true;
				break;
			}
		}

		if(!artistDuplicated){
			favoritos.push(artistId);
			guardarFavoritos();

		}

	}
	
	//Elimina un artista de los favoritos
	var eliminarFavorito = function(artistId){

		for(var i = 0; i < favoritos.length; i++){

			if(favoritos[i] == artistId){
				favoritos.splice(i, 1);
				guardarFavoritos();
				break;
			}
		}



	}
	

	//Crea el icono de favoritos a mostrar (dependiendo del contexto) con su funcionalidad, para el artista con id artistaId
	var obtenerIconoFavoritos = function(artistaId){

		var clase = "glyphicon glyphicon-star-empty";
		for(var i = 0; i < favoritos.length; i++){

			if(favoritos[i] == artistaId){
							
				clase = "glyphicon glyphicon-star";
				break;

			}
		}

		return clase;

		//<span class="glyphicon glyphicon-star"></span>
        //<span class="glyphicon glyphicon-star-empty"></span>
	}
	
	//Dibuja un artista (indice es el indice del artista en el array, artista el objeto a dibujar)
	var dibujarArtista = function(indice, artista){

		
		li = $("<li/>");

		li.addClass("list-group-item");
		li.attr("id", artista.id);

		image = $("<img/>");
		nombre = $("<h4/>");

		spanStar = $("<span/>");
		//spanStar.addClass("glyphicon glyphicon-star-empty");

		spanStar.addClass(obtenerIconoFavoritos(artista.id));

		spanStar.on("click", function () {

		 	if($(this).hasClass("glyphicon glyphicon-star-empty")){ //Agrego a favoritos
		 		//$(this).toggleClass("glyphicon glyphicon-star");
		 		$(this).addClass("glyphicon-star");
		 		$(this).removeClass("glyphicon-star-empty");
		 		agregarFavorito(artista.id);
		 	} else {
		 		$(this).toggleClass("glyphicon glyphicon-star-empty"); //Saco de favoritos
		 		eliminarFavorito(artista.id);

		 	}

		});


		image.attr("src", artista.images[0].url);
		image.attr("width", "300px");
		image.addClass("img-responsive center-block");

		nombre.html(artista.name);

		li.append(nombre);
		li.append(image);
		li.append(spanStar);


		if (indice == "resultadoArtistas"){

		$("#resultadoArtistas").append(li);

		} else {

		$("#resultadoFavoritos").append(li);

		dibujarLeyendaAlbumes(li, artista.id); //recibe como parametro el LI del artista
		

		}
	
	}
	



	//Dibuja un array de artistas
	var dibujarArtistas = function(indice, artistas){

		for(var i = 0; i < artistas.length; i++){

			dibujarArtista(indice, artistas[i]);
		}

	}
	

	var buscarArtistasPorId = function(artistasId){


		$.ajax({

			url: api + "artists?ids=" + artistasId,
			dataType : "json"
			


		}).done(function(respuesta){

			dibujarArtistas("resultadoFavoritos",respuesta.artists);

		}).fail(function(xHR, estado){

			alert(estado);
		});



	}



	//Obtiene de Spotify los artistas cuyo nombre coinciden con el buscado
	var buscarArtistas = function(artista){
		//var api = "https://api.spotify.com/v1/";
		$.ajax({

			//url: api + artista,
	
			url: api + "search?type=artist&q=" + artista,
			dataType: "json"


		}).done(function(respuesta){

			dibujarArtistas("resultadoArtistas", respuesta.artists.items);
			//console.log(respuesta);
		
		}).fail(function(xHR, estado){

			alert(estado);

		});

	}
	
	//Vincula los eventos de los elementos de la pagina con la funcionalidad correspondiente
	var vincularEventos = function(){


		$("#buscarArtistas").on("click", function(){
			$("#resultadoArtistas").empty();
			inputArtistas = $("#buscadorArtistas").val();
			buscarArtistas(inputArtistas);

		});


		$("#linkFavoritos").on("click", function(){
			
			$("#resultadoFavoritos").empty();

			$("#linkBuscador").removeClass('active');
			$(this).addClass('active');

			$("#pestaniaFavoritos").removeClass("hidden");
			$("#pestaniaBuscador").addClass("hidden");	

			buscarArtistasPorId(favoritos);


		});

		$("#linkBuscador").on("click", function(){

			$("#linkFavoritos").removeClass('active');
			$(this).addClass('active');


			$("#pestaniaBuscador").removeClass("hidden");	
			$("#pestaniaFavoritos").addClass("hidden");

		});


		//$("#dialogDetalleAlbum")




	}


	
	//Da inicio a la funcionalidad del modulo
	var iniciar = function(){

		vincularEventos();

	}
	
	return {
		iniciar: iniciar
	}
})();

$(document).ready(Spotify.iniciar);