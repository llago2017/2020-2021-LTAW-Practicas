 # Práctica 3

Mini-chat en el que múltiples usuarios se pueden conectar a través del navegador. Utiliza webscokets para conseguir que sea una aplicación en tiempo real.

Utiliza node.js y hay que instalar previamente los módulos:
 
* socket.io
* express
* colors


Al descargar la carpeta 'Chat' se deben de instalar esto módulos en el mismo directorio o de manera global.


```
 npm i socket.io 
 npm i express 
 npm i colors
```

Cuando esté preparado se puede iniciar desde un terminal en la misma capeta con el comando `node chat-server.js` de esta forma en el terminal nos aparecerá el puerto correspondiente.
En el navegador nos dirigiremos a la siguiente url ` localhost:8080 ` y podremos utilizar el mini-chat.




## Socket.io

Crea un evento para escuchar todas las eventos de socket *io.on(evento, función)* de esta manera cuando un usuario se conecte se activarán los procesos de la retrollamada, que también están escuchando a los eventos que se manden desde el cliente para mostrarlos por pantalla a todos los usuarios.

El servido puede mandar mensajes a los usuarios mediante socket utilizando *io.emit(evento, mensaje)*




## Funcionamiento


Al iniciar el chat se elige un nombre de usuario para poder acceder y una vez dentro se puede acceder a las funciones especiales escribiendo /help, de esta forma nos aparecerá el listado de opciones que están implementadas en el chat.




## Mejoras


* Sonidos al iniciar sesión y recibir mensajes.
* PLos usuarios pueden elegir nickname.
* Función "X está escribiendo"
* Muestra los usuarios conectados (nickname y número)
* Mensajes directos entre usuarios

