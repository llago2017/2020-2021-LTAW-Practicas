console.log("Hola desde el proceso de la web...");

const electron = require('electron');

//-- Obtener elementos de la interfaz
const btn_test = document.getElementById("btn_test");
const info1 = document.getElementById("info1");
const info2 = document.getElementById("info2");
const info3 = document.getElementById("info3");
const info4 = document.getElementById("info4");
const info5 = document.getElementById("info5");
const info6 = document.getElementById("info6");
const dirIP = document.getElementById("dirIP");
const qr = document.getElementById("qr");

//-- Acceder a la API de node para obtener la info
//-- Sólo es posible si nos han dado permisos desde
//-- el proceso princpal
info1.textContent = process.version;
info2.textContent = process.versions["electron"]
info3.textContent = process.versions["chrome"]
info4.textContent = process.platform;
info5.textContent = process.arch;
info6.textContent = process.cwd();

console.log(process.versions)
btn_test.onclick = () => {
    const test_msg =  "Hola desde electron! "
    display.innerHTML += '<p class:"mensaje">' + test_msg + '</p>';
    console.log("Botón apretado!");
    //-- Enviar mensaje al proceso principal
    electron.ipcRenderer.invoke('test', test_msg);
}

// CHAT

//-- Elementos del interfaz
const display = document.getElementById("display");
const login_backgr = document.getElementsByClassName("chat");
var elmnt = document.getElementById("msg_recibidos");
var typing_msg = document.getElementsByClassName("typing");
var nusuarios = document.getElementById("users");


// Comunicacion con main
electron.ipcRenderer.on('print', (event, message) => {
  console.log("Recibido: " + message);
  display.innerHTML += '<p style="color:blue">' + message + '</p>'; 
});

electron.ipcRenderer.on('users', (event, message) => {
  console.log("Recibido: " + message);
  nusuarios.innerHTML = '<p style="color:blue">' + message + '</p>'; 
});

electron.ipcRenderer.on('ip', (event, message) => {
  console.log("Recibido: " + message);
  dirIP.textContent = message;

  //-- Generar el codigo qr de la url
  qrcode.toDataURL(message, function (err, url) {
      console.log("Imprimiendo codigo qr");
      qr.src = url;
  });
   
});

//-- Recepcion del codigo QR
electron.ipcRenderer.on('qr', (event, message) => {
  qr.src = message;
});