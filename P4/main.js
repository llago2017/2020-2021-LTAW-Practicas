//-- Cargar el módulo de electron
const electron = require('electron');

console.log("Arrancando electron...");

//-- Variable para acceder a la ventana principal
//-- Se pone aquí para que sea global al módulo principal
let win = null;

//-- Punto de entrada. En cuanto electron está listo,
//-- ejecuta esta función
electron.app.on('ready', () => {
    console.log("Evento Ready!");
    console.log("Enviando IP y puerto");
    

    //-- Crear la ventana principal de nuestra aplicación
    win = new electron.BrowserWindow({
        width: 600,   //-- Anchura 
        height: 600,  //-- Altura

        //-- Permitir que la ventana tenga ACCESO AL SISTEMA
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
    });
  // Quito menú por defecto
  win.setMenuBarVisibility(false)

  win.webContents.send('ip', ip_send);
  win.webContents.send('qr', path_qr);

  //-- Cargar interfaz gráfica en HTML
  win.loadFile("index.html");

  win.webContents.send('print', "MENSAJE ENVIADO DESDE PROCESO MAIN");
  
  

});

// TODO CHAT
//-- Cargar las dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');
const ip = require('ip');

// Control de número de usuarios
var users = 0;
var dict = [];

const PUERTO = 8080;

//-- Obtengo la direccion IP
let ip_address = ip.address()

//-- Creo la variable con la direccion IP y el puerto
let ip_send = "http://" + ip_address + ":" + PUERTO + "/";

const qrcode = require("qrcode");
var path_qr = 'qr.png';
qrcode.toFile(path_qr, ip_send);


//-- Crear una nueva aplciacion web
const app = express();

//-- Crear un servidor, asosiaco a la App de express
const server = http.Server(app);

//-- Crear el servidor de websockets, asociado al servidor http
const io = socket(server);

//-------- PUNTOS DE ENTRADA DE LA APLICACION WEB
//-- Definir el punto de entrada principal de mi aplicación web
app.get('/', (req, res) => {
  res.redirect('/client.html');
});

//-- Esto es necesario para que el servidor le envíe al cliente la
//-- biblioteca socket.io para el cliente
app.use('/', express.static(__dirname +'/'));

//-- El directorio publico contiene ficheros estáticos
app.use(express.static('public'));

  // Mensaje test
  electron.ipcMain.handle('test', async (event, msg) => {
    console.log("Mensaje desde render: " + msg);
    io.send(msg);
  });

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
    win.webContents.send('users', users);
  });

  //-- Evento de desconexión
  socket.on('disconnect', function(){
    console.log('** CONEXIÓN TERMINADA **'.yellow);
    users -= 1;
    win.webContents.send('users', users);
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
        '/list : Devvuelve el numero de usuarios conectados' + "<br" +
        '/hello : Devuelve el saludo del servidor' + "<br>" +
        '/date : Devulve la fecha' + "<br>" +
        '/"nombre_usuario": manda un mensaje privado'

        io.to(socketId).emit('message', msg);
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
      io.to(socketId).emit('message', msg);
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
          win.webContents.send('print', socket.username + ": " + msg);
    }
  });

});

//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);