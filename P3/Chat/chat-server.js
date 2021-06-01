//-- Cargar las dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');
const fs = require('fs');

const FICHERO_HTML = 'client.html';
const HTML = fs.readFileSync(FICHERO_HTML, 'utf-8');

// Control de número de usuarios
var users = 0;
var dict = [];

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
  res.redirect('/client.html')
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

  // Obtengo el nombre de usuario
  socket.on("nickname", (nickname) => {
    console.log('Nombre de usuario: ' + nickname.red)
    welcome_msg = nickname + ' se ha unido al chat!'
    socket.username = nickname;
    dict.push({ name: socket.username, id: socket.id });
    io.emit('server_msg', welcome_msg);
    users += 1;
  });

  //-- Evento de desconexión
  socket.on('disconnect', function(){
    console.log('** CONEXIÓN TERMINADA **'.yellow);
    users -= 1;
  });  

  //-- Evento de escribiendo
  socket.on('typing', (data) => {
      io.emit('display', data)
  });  

  //-- Quitar escribiendo
  socket.on('notTyping', (data) => {
    io.emit('hide', data)
  });  
  


  //-- Mensaje recibido: Reenviarlo a todos los clientes conectados
  socket.on("message", (msg)=> {
    console.log("Mensaje Recibido!: " + msg.blue);
    var socketId = socket.id;
    console.log("socket id: " + socketId.green + " " +socket.username);

    if (msg=='/help') {
        console.log("Mensaje de ayuda".red)
        msg = '/help: Devuelve la lista con todos los comandos' + "<br>" +
        '/list : Devuelve el numero de usuarios conectados' + "<br" +
        '/hello : Devuelve el saludo del servidor' + "<br>" +
        '/date : Devuelve la fecha' + "<br>" +
        '/"nombre": envía un mensaje privado al usuario'

        io.to(socketId).emit('server_msg', msg);
    } else if (msg == '/hello'){
        console.log("Mensaje de saludo".red)
        msg = '¡HOLI!';
        console.log(socketId);
        io.to(socketId).emit('server_msg', msg);
    }  else if (msg == '/date'){
        var d = new Date();
        var yy = d.getFullYear();
        var mm = d.getMonth();
        var dd = d.getDate();
        msg = 'Fecha: ' + dd + '/' + mm + '/' + yy;
        io.to(socketId).emit('server_msg', msg);
    } else if (msg == '/list') {
      msg = 'Actualmente hay ' + users + " usuarios conectados. <br>"
      console.log(dict)
      // Recorro el diccionario de usuarios
      for (i=0; i< dict.length; i++){
        msg += "> " + (dict[i].name) + "<br>"
      }
      io.to(socketId).emit('server_msg', msg);
    } else if (msg.split("/")[0] == "") {
      // msg.split("/")[0] --> " "
      // msgsplit("/")[1] --> "username + mensaje"
      console.log("Es un mensaje privado")

      // separo el usuario del mensaje
      var index = msg.split("/")[1].indexOf(" ")
      var new_msg = msg.slice(index + 1)
      var user2priv = msg.split("/")[1].slice(0,index)

      for (i=0; i< dict.length; i++){
        if (dict[i].name == user2priv) {
          var priv_id = dict[i].id;
          break;
        }
      }
        console.log("MENSAJE A: " + user2priv.red + " con id: " + priv_id.green)
       // Me quedo solo con el mensaje haciendo un split [0] --> /username
       // [1] --> mensaje 
        io.to(priv_id).emit('priv', socket.username + ": " + new_msg);
        io.to(socketId).emit('priv', socket.username + ": " + new_msg);
    } else {
      //-- Reenviarlo a todos los clientes conectados
          io.send(socket.username + ": " + msg);
    }
  });

});

//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);