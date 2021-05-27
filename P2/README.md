 # Práctica 2

Tienda con node.js que además implementa cookies para recordar datos de usuario y la lista de la compra.

En esta tienda se tiene acceso a la cesta, se puede utilizar el buscador y además iniciar sesión.

Todo esto el navegador lo recordará al utilizar cookies de esta forma sabe quién realiza los pedidos o está conectado.

## Puesta en marcha

Una vez descargado del repositorio se abre un terminal en la carpeta P2 y se ejecuta el comando:  `node tienda.js`

Nos indicará el puerto en el que está conectado y podremos acceder con la dirección "localhost:9000".

### Cookies
Una vez en la página principal podemos acceder a las secciones de los productos y añadir los que queramos en la cesta, de esta forma ser creará la cookie con valor carrtito=articulo1:articulo2...

También podemos iniciar sesión, solo admite a los usuarios ya registrados que se encuentran en la base de datos "tienda.json". Cuando se realiza el login correctamente se genera la cookie user=usuario, de forma que el navegador reconoce el usuario.

### Peticiones AJAX
La búsqueda de productos funciona con peticiones AJAX que se van generando cada vez que se introduce un nuevo caracter, de forma que busca en la base de datos los artículos que comiencen con los carácteres introducidos, en el caso de que existan, se abrirá un apartado en el que se puede seleccionar y se redirigirá a la página de la sección de ese producto.

### Finalizando la compra
Cuando hayamos iniciado sesión y tengamos artículos en la cesta podemos finalizar la compra accediendo a la cesta, donde tendremos que rellenar los datos de dirección, tarjeta...

## Mejoras

* Autenticación con usuario y password.

* Listado de pedidos pendientes: una vez iniciada la sesion con el usuario root, al pulsar sobre el nombre se accede a la página donde se puede ver la lista de pedidos pendientes.

* Gestor para introducir productos nuevos: una vez iniciada la sesion con el usuario root, al pulsar sobre el nombre se accede a la página donde se pueden incluir productos mediante un formulario.

* Acceso a los productos disponibles con /productos