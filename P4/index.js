console.log("Hola desde el proceso de la web...");

const electron = require('electron');

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
const login_backgr = document.getElementsByClassName("chat");
var elmnt = document.getElementById("msg_recibidos");
var typing_msg = document.getElementsByClassName("typing");
var user = "null";
var typing = false;

electron.ipcRenderer.on('print', (event, message) => {
  console.log("Recibido: " + message);
  print.textContent = message;
});
