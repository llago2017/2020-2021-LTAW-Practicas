const http = require('http');
const fs = require('fs');
const url = require('url');
var rute = "";

//-- Definir el puerto a utilizar
const PUERTO = 9000;

//-- Imprimir informacion sobre el mensaje de solicitud
function print_info_req(req) {
  console.log("");
  console.log("Mensaje de solicitud");
  console.log("====================");
  console.log("Método: " + req.method);
  console.log("Recurso: " + req.url);
  console.log("Version: " + req.httpVersion)
}

// Función para obtener tipo de archivo
function getExtension(filename) {
  return filename.split('.').pop();
}

//-- Crear el servidor
const server = http.createServer((req, res) => {
  // Obtengo URL
  let dir = url.parse(req.url);

  //-- Indicamos que se ha recibido una petición
  console.log("Petición recibida!");

  // Obtengo tipo de archivo
  rute = getExtension(req.url);
  print_info_req(req);

  function dir_document() {
    // Dirección para cargar
    if (dir.pathname == "/") {
    file = "main.html";
    } else {
      var direccion = dir.pathname;
      var len = direccion.length;
      var r_slice = direccion.slice(1,len);
      file = r_slice;
    }
  }

  dir_document();

  // Compruebo si existe la dirección si es una página
  if (rute == 'html') {
    if(fs.existsSync(dir.pathname)){
      // Si existe se manda a esa dirección
      dir_document(); 
   } 
  }

  fs.readFile(file, function(err, data) {
    
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found", 'utf-8');
    }
    
    let c_type = "text/html"

    //Tipos de archivo y c_type
    if (rute == 'png' || rute == 'jpg') {
      c_type = "image/" + rute;
    } else if (rute == "css") {
      c_type = "text/css";
    } else if (rute == "svg"){
      c_type = "image/svg+xml"
    }

    //-- Generar el mensaje de respuesta
      res.writeHead(200, {'Content-Type': c_type});
      res.write(data);
      res.end();
    });
});

//-- Activar el servidor: ¡Que empiece la fiesta!
server.listen(PUERTO);
console.log("Server listo!. Escuchando en puerto: " + PUERTO);