const http = require('http');
const fs = require('fs');
const url = require('url');
let c_type = "";
const rute = "";

//-- Definir el puerto a utilizar
const PUERTO = 9000;

  //-- Imprimir informacion sobre el mensaje de solicitud
  function print_info_req(req) {

    console.log("");
    console.log("Mensaje de solicitud");
    console.log("====================");
    console.log("Método: " + req.method);
    console.log("Recurso: " + req.url);
    console.log("Ruta: "+ req.headers['host'])
  }
  
  // Función para obtener tipo de archivo
  function getExtension(filename) {
    return filename.split('.').pop();
}
function getFile(filename) {
  return filename.split('/').pop();
}

//-- Crear el servidor
const server = http.createServer((req, res) => {
    
  //-- Indicamos que se ha recibido una petición
  console.log("Petición recibida!");

  // Obtengo archivo
  var file = getFile(req.url);
  console.log(file);
  
  // Obtengo tipo de archivo
  var rute = getExtension(req.url);
  console.log(rute)
  print_info_req(req);

  if (file == "") {
    file = "main.html";
  }

  fs.readFile(file, function(err, data) {
    
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    }
    

    switch (rute){
      case "css":
        c_type = "text/css";
        break;
      default:
        c_type = "text/html"
  }

    //Tipo de imágenes
    if (rute == 'png' || rute == 'jpg' || rute == 'svg') {
      c_type = "image/" + rute;
    }

    //-- Generar el mensaje de respuesta
      res.writeHead(200, {'Content-Type': c_type});
      res.write(data);
      res.end();
    });

});

//-- Activar el servidor: ¡Que empiece la fiesta!
server.listen(PUERTO);
console.log("Ejemplo 2. Happy Server listo!. Escuchando en puerto: " + PUERTO);
