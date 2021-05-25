 # Práctica 1

Se ha contruido un servidor con node.js que carga los contenidos de la tienda.

Son páginas con HTML, las páginas correspondientes a los productos contienen además javascript para mostrar mejor
los artículos disponibles, estos comparten la hoja de estilos (articulos.css), la página principal (index.html) 
tiene su hoja de estilos en el exterior (stylesheet.css).

## Organización

La tienda consta de tres secciones principales, pociones, armas y escudos en las que dentro de cada una de ellas
se pueden encontrar 5 productos diferentes que se pueden ir seleccionando pulsando en su imagen para verlo en
grande y mostrar su descripción.

## Puesta en marcha

Para poner en funcionamiento la tienda una vez descargado todo se abre un terminal en la carpeta de P1, en la cual
se deben encontrar todos los ficheros correspondientes y ejecutar:  `node tienda.js`

De esta forma el servidor se pone en marcha e indica el puerto en el que está, que será el 9000.

Para acceder abrimos el navegador de firefox y nos conectaremos a la url "localhost:9000".

## Servidor

El servidor es un programa, escrito en node.js, se encarga de recibir las peticiones de los clientes y procesarlas detectándo qué es lo que se pide, accede al sistema de ficheros local, localiza el recurso y lo devuelve.

En el navegador renderizará estos recursos para mostrarlos, los correspondietes a imágenes, html o incluso el funcionamiento del código javascript.

Una vez en la página inicial se puede acceder a las páginas de las secciones pulsando sobre el nombre de estas, de esta forma se redirige a cada recurso "/pociones.html", "/armas.html" o "/escudos.html".

Si se accede a un recursos no existente, se renderiza la página de error y aparece el error 404 en el apartado de red.

## Mejoras
* Puerta trasera con el recurso `/ls` muestra todos los ficheros que se encuentran en la carpeta del servidor