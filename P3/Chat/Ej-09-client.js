//-- Elementos del interfaz
const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");
const login_msg = document.getElementById("user");
var nickname = false;
//-- Crear un websocket. Se establece la conexión con el servidor
const socket = io();


socket.on("message", (msg)=>{
  display.innerHTML += '<p style="color:blue">' + msg + '</p>';
});

//-- Al apretar el botón se envía un mensaje al servidor
msg_entry.onchange = () => {
  
  if (nickname) {
    if (msg_entry.value)
    socket.send(msg_entry.value);
  
    //-- Borrar el mensaje actual
    msg_entry.value = "";
  } else {
    socket.emit('nickname',msg_entry.value);
    msg_entry.value = "";
    login_msg.style.display = 'none'
    nickname = true;
  }

  
}