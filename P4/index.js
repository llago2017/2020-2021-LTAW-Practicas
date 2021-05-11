console.log("Hola desde el proceso de la web...");

//-- Obtener elementos de la interfaz
const btn_test = document.getElementById("btn_test");
const info1 = document.getElementById("info1");
const info2 = document.getElementById("info2");
const info3 = document.getElementById("info3");
const info4 = document.getElementById("info4");

//-- Acceder a la API de node para obtener la info
//-- Sólo es posible si nos han dado permisos desde
//-- el proceso princpal
info1.textContent = process.version;
info2.textContent = process.versions["electron"]
info3.textContent = process.versions["chrome"]
info4.textContent = "https://127.0.0.1.8080/Ej-09.html"

console.log(process.versions)
btn_test.onclick = () => {
    display.innerHTML += "TEST! ";
    console.log("Botón apretado!");
}

// CHAT

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

//-- Crear un websocket. Se establece la conexión con el servidor
const socket = io();


function main() {
  // Cada 100ms se actualiza el scroll para estar actualizado
  setInterval(function(){  
    elmnt.scrollTop = elmnt.scrollHeight;
  }, 100);

  document.onkeydown = function(ev) {
    console.log("Pulsando trcals")
    onKeyDown();
  }

  document.onkeyup = function(ev) {
    console.log("Sa parap")
    typingstopped();
  }
}


function typingstopped(){
  typing = false;
  //socket.emit(notTyping);
}

function onKeyDown(){
  if(typing == false) {
    typing = true
    console.log(user)
    socket.emit('typing', user );
    time = setTimeout(typingstopped, 500);
  } else {
    clear(time);
    time = setTimeout(typingstopped, 500);
  }

}

socket.on('display', (data) => {
  console.log('HA LLEGAOS')
  typing_msg.innerHTML = data + " is typing";
  typing_msg[0].style.display = 'block'
});

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
    user = msg_entry.value;
    msg_entry.value = "";
    login_msg.style.display = 'none'
    // El fondo pasa a blanco
    login_backgr[0].style.animationName = 'static'
    login_backgr[0].style.textAlign = "left"
    nickname = true;
  }

  
}