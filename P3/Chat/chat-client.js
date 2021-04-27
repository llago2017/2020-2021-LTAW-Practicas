//-- Cargar las dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');

const PUERTO = 8080;

//-- Crear una nueva aplciacion web
const app = express();

//-- Crear un servidor, asosiaco a la App de express
const server = http.Server(app);

//-- Crear el servidor de websockets, asociado al servidor http
const io = socket(server);

//-------- PUNTOS DE ENTRADA DE LA APLICACION WEB
//-- Definir el punto de entrada principal de mi aplicación web
app.get('/', (req, res) => {
  res.send('Bienvenido a mi aplicación Web!!!' + '<p><a href="/Ej-09.html">Test</a></p>');
});

//-- Esto es necesario para que el servidor le envíe al cliente la
//-- biblioteca socket.io para el cliente
app.use('/', express.static(__dirname +'/'));

//-- El directorio publico contiene ficheros estáticos
app.use(express.static('public'));

//------------------- GESTION SOCKETS IO
//-- Evento: Nueva conexion recibida
io.on('connect', (socket) => {
  
  console.log('** NUEVA CONEXIÓN **'.yellow);

  //-- Evento de desconexión
  socket.on('disconnect', function(){
    console.log('** CONEXIÓN TERMINADA **'.yellow);
  });  

  //-- Mensaje recibido: Reenviarlo a todos los clientes conectados
  socket.on("message", (msg)=> {
    console.log("Mensaje Recibido!: " + msg.blue);
    var socketId = socket.id;
    console.log("socket id: " + socketId.green);

    if (msg=='/help') {
        console.log("Mensaje de ayuda".red)
        msg = '/help: Devuelve la lista con todos los comandos' + "<br>" +
        '/list : Devvuelve el numero de usuarios conectados' + "<br" +
        '/hello : Devuelve el saludo del servidor' + "<br>" +
        '/date : Devulve la fecha'

        io.to(socketId).emit('message', msg);
    } else if (msg == '/hello'){
        console.log("Mensaje de saludo".red)
        msg = '¡HOLI!';
        console.log(socketId);
        io.to(socketId).emit('message', msg);
    }  else if (msg == '/date'){
        var d = new Date();
        var yy = d.getFullYear();
        var mm = d.getMonth();
        var dd = d.getDate();
        msg = 'Fecha: ' + dd + '/' + mm + '/' + yy;
        io.to(socketId).emit('message', msg);
    } else {
      //-- Reenviarlo a todos los clientes conectados
      io.send(msg);

    }

    
  });

});

//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);