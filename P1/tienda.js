const http = require('http');
const fs = require('fs');

//-- Definir el puerto a utilizar
const PUERTO = 9000;

//-- Crear el servidor
const server = http.createServer((req, res) => {
    
  //-- Indicamos que se ha recibido una petición
  console.log("Petición recibida!");

  fs.readFile('main.html', function(err, data) {

      let mime = "text/html"
  
    //-- Generar el mensaje de respuesta
      res.writeHead(200, {'Content-Type': mime});
      res.write(data);
      res.end();
    });

});

//-- Activar el servidor: ¡Que empiece la fiesta!
server.listen(PUERTO);
