//-- Elementos del interfaz
const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");
const login_msg = document.getElementById("user");
const login_backgr = document.getElementsByClassName("chat");
var elmnt = document.getElementById("msg_recibidos");
var typing_msg = document.getElementsByClassName("typing");
var user = "";
var typing = false;
var nickname = false;

function main() {
  // Cada 100ms se actualiza el scroll para estar actualizado
  setInterval(function(){  
    elmnt.scrollTop = elmnt.scrollHeight;
  }, 100);

    document.onkeydown = function(ev) {
      if (nickname && ev.key != 'Enter') {
        onKeyDown();
      }
    }
  
    document.onkeyup = function(ev) {
      setTimeout(typingstopped, 700);
    }    
  
}

//-- Crear un websocket. Se establece la conexión con el servidor
const socket = io();



function typingstopped(){
  typing = false;
  socket.emit('notTyping');
}

function onKeyDown(){
  if(typing == false) {
    typing = true
    console.log(user)
    socket.emit('typing', user );
  } 
}

socket.on('display', (data) => {
  if (data != user && nickname) {
    typing_msg[0].innerHTML = data + " is typing";
  }
  
});

socket.on('hide', (data) => {
  setTimeout(function(){ 
    typing_msg[0].innerHTML = ""; }, 1500);
  
});

socket.on("message", (msg)=>{
  if (nickname) {
    display.innerHTML += '<p style="color:blue">' + msg + '</p>';  
  }
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
    user = msg_entry.value;
    msg_entry.value = "";
    login_msg.style.display = 'none'
    // El fondo pasa a blanco
    login_backgr[0].style.animationName = 'static'
    login_backgr[0].style.textAlign = "left"
    nickname = true;
  }

  
}