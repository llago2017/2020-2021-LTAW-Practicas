 # Práctica 4
Mini-chat con electron en el que múltiples usuarios se pueden conectar a través del navegador. Utiliza webscokets para conseguir que sea una aplicación en tiempo real.
 
 
Al utilizar electron se abrirá una interfaz gráfica en la que se pueden visualizar todos los mensajes del chat, obtener información adicional o acceder al chat mediante su url o con un código qr.
 
Utiliza node.js y hay que instalar previamente los módulos:
 
* socket.io
* express
* colors
* electron
* ip
* qrcode
 
 
Al descargar la carpeta 'Chat' se deben de instalar esto módulos en el mismo directorio o de manera global.
 
 
```
 npm i socket.io 
 npm i express 
 npm i colors
 npm i electron
 npm i ip
 npm i qrcode
```
 
Cuando esté preparado se puede iniciar desde un terminal en la misma capeta con el comando `npm start` de esta forma se iniciará la interfaz gráfica de electron.
 
## Funcionamiento.
 
 
El servidor principal y desde donde se gestiona la interfaz gráfica de electron se encuentran en el archivo **main.js** que es el que se activa al iniciar la práctica. En electron aparece la página correspondiente a **index.html** el proceso de renderizado es el que se comunica con electron con el proceso principal, de esta manera cuando ha llegado un mensaje al servidor se envía con *win.webcontents(evento, mensaje)*. Además de escuchar los eventos de electron con *electron.ipcMain.handle(evento, función)*.
 
 
Cuando se accede al chat cargan los contenidos de la anterior práctica, donde estaba el mini-chat.
 
 
## Mejoras
 
* Muestra la URL de conexión mediante un código en la interfaz gráfica, esto se hace con el módulo qr.
* Muestra más información del sistema.
