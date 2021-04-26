const http = require('http');
const fs = require('fs');
const url = require('url');
var rute = "";
var user = "";
var registered = false;
//-- Variable para guardar el usuario
let user_activo;
let item_list;
//-- Definir el puerto a utilizar
const PUERTO = 9000;

//-- Imprimir informacion sobre el mensaje de solicitud
function print_info_req(req) {
  console.log("");
  console.log("Mensaje de solicitud");
  console.log("====================");
  console.log("Método: " + req.method);
  console.log("Recurso: " + req.url);
  console.log("Version: " + req.httpVersion)
}

// Función para obtener tipo de archivo
function getExtension(filename) {
  return filename.split('.').pop();
}
const FICHERO_RESP = 'html/form_resp.html';
const FICHERO_CESTA = 'html/cesta.html'
const FICHERO_PEDIDO = 'html/pedido.html'

//-- HTML de la página de respuesta
const RESPUESTA = fs.readFileSync(FICHERO_RESP, 'utf-8');
const CESTA = fs.readFileSync(FICHERO_CESTA, 'utf-8');

//-- HTML página de error
const ERROR = fs.readFileSync('html/error.html', 'utf-8');

//-- HTML principal
const MAIN = fs.readFileSync('index.html', 'utf-8');

//-- Leo base de datos
const FICHERO_JSON = "json/tienda.json"
const tienda_json = fs.readFileSync(FICHERO_JSON);

//-- Creo la estructura
const tienda = JSON.parse(tienda_json);

function get_user(req) {

  //-- Leer la Cookie recibida
  const cookie = req.headers.cookie;

  //-- Hay cookie
  if (cookie) {
    
    //-- Obtener un array con todos los pares nombre-valor
    let pares = cookie.split(";");

    //-- Recorrer todos los pares nombre-valor
    pares.forEach((element, index) => {

      //-- Obtener los nombres y valores por separado
      let [nombre, valor] = element.split('=');

      //-- Leer el usuario
      //-- Solo si el nombre es 'user'
      if (nombre.trim() === 'user') {
        user_activo = valor;
      }
    });

    //-- Si la variable user no está asignada
    //-- se devuelve null
    return user_activo || null;
  } else {
      user_activo = null;
  }
}

function get_items(req) {

  //-- Leer la Cookie recibida
  const cookie = req.headers.cookie;

  //-- Hay cookie
  if (cookie) {
    //-- Obtener un array con todos los pares nombre-valor
    let pares = cookie.split(";");

    //-- Recorrer todos los pares nombre-valor
    pares.forEach((element, index) => {

      //-- Obtener los nombres y valores por separado
      let [nombre, valor] = element.split('=');

      //-- Leer el usuario
      //-- Solo si el nombre es 'user'
      if (nombre.trim() === 'carrito') {
        console.log("Hay objetos")
        item_list = valor;
      }
    });

    //-- Si la variable user no está asignada
    //-- se devuelve null
    return item_list || null;
  } else {
      item_list = null;
  }

}

//-- Crear el servidor
const server = http.createServer((req, res) => {
  // Obtengo URL
  let dir = url.parse(req.url);

  //-- Indicamos que se ha recibido una petición
  console.log("Petición recibida!");

  // Obtengo tipo de archivo
  rute = getExtension(req.url);
  print_info_req(req);
  console.log(rute);

  function dir_document() {
    // Dirección para cargar
    if (dir.pathname == "/") {
      file = "index.html";
    } else {
      var direccion = dir.pathname;
      var len = direccion.length;
      var r_slice = direccion.slice(1,len);
      file = r_slice;
    }
  }

  dir_document();

  // Compruebo si existe la dirección si es una página
  if (rute == 'html') {
    if(fs.existsSync(dir.pathname)){
      // Si existe se manda a esa dirección
      dir_document(); 
   } 
  }


  //-- Construir el objeto url con la url de la solicitud
  const myURL = new URL(req.url, 'http://' + req.headers['host']);      

  if (myURL.pathname == '/procesar') {
    c_type = "text/html";
    file = FICHERO_RESP;
  }

  if (myURL.pathname == '/pedido') {
    c_type = "text/html"
    file = FICHERO_PEDIDO;
    
  }

  if (myURL.pathname == '/productos') {
    c_type = "application/json";
    file = 'json/tienda.json';
  }

  //-- Obtener le usuario que ha accedido
  //-- null si no se ha reconocido
  let user = get_user(req);
  let items = get_items(req);
  console.log("User: " + user);
  console.log("Objetos: " + items);

  //-- Acceso al recurso raiz
  
  //-- Si hay datos en el cuerpo, se imprimen
  req.on('data', (cuerpo) => {

    //-- Los datos del cuerpo son caracteres
    req.setEncoding('utf8');
    console.log(`Cuerpo (${cuerpo.length} bytes)`)
    console.log(` ${cuerpo}`);

    const myURL = new URL('http://' + req.headers['host'] + '?' + cuerpo);

    //-- Leer los parámetros
    let nombre = myURL.searchParams.get('usuario');
    console.log("Nombre: " + nombre);

    for (i=0; i<tienda["usuarios"].length; i++){
      console.log("Tienda JSON: " + tienda["usuarios"][i]["nombre"]);
      var json_user = tienda["usuarios"][i]["nombre"];

      if (json_user == nombre) {
        console.log("usuario existe");
        user = nombre;
        registered = true;
        break;
      } 
    }

    let direccion = myURL.searchParams.get('direccion');
    if (direccion) {
      console.log("Es un pedido")
    }

  });

  fs.readFile(file, function(err, data) {
    console.log(file)
    if (err) {
      res.setHeader('Content-Type','text/html');
      res.statusCode = 404;
      res.write(ERROR);
      res.end();
      return;
    }

    if (file == FICHERO_RESP) {
      c_type = "text/html";

      if (registered) {

        //-- Asignar la cookie de usuario
        res.setHeader('Set-Cookie', "user="+user);
        content = RESPUESTA.replace("PRUEBA", user);
        content = content.replace("REGISTRO", "Usuario válido");
      } else {
        content = RESPUESTA.replace("PRUEBA", "Usuario no registrado");
        content = content.replace("REGISTRO", "Error");
      }

      res.setHeader('Content-Type', c_type);
      res.write(content);
      res.end();
      // Reinicio valor de usuario registrado
      registered = false;
      return;
    }

    if (file == FICHERO_CESTA) {
      c_type = "text/html"
      if (user_activo) {
        // Usuario
        console.log('Hay un usuario en la sesión')
        content = CESTA.replace("Inicie sesión", user);
        // Lista
        if (items) {
          console.log("añadir objetos")
          var item_array = items.split(":")
          var print_item = ""
          for (let i = 0; i < item_array.length; i++) {
            print_item += item_array[i] + numero + "<br>";
          }
          console.log("IMPRIME: " + print_item)
          content = content.replace("Lista vacía",print_item);
        } else {          
          console.log("La lista está vacía")
          content = content.replace("Lista vacía", "Lista vacía");
        }

        res.setHeader('Content-Type', c_type);
        res.write(content);
        res.end();
        return;
      }

    }
    
    if (myURL.pathname == '/') {
      c_type = "text/html";
      //--- Si la variable user está asignada
      if (user_activo) {
          //-- Añadir a la página el nombre del usuario
          console.log("user: " + user_activo);
          data = MAIN.replace("Login", user_activo);
      } else {
          //-- Mostrar el enlace a la página de login
          console.log("No hay user")
          data = MAIN.replace("HTML_EXTRA", `
          <a href="login">Login</a>
          `);
      }
  
      res.setHeader('Content-Type', c_type);
      res.write(data);
      res.end();
      return
    }

    //Tipos de archivo y c_type

    switch (rute) {
      case "png":
        c_type = "image/" + rute;
        break;
      case "jpg":
        c_type = "image/" + rute;
        break;
      case "css":
        c_type = "text/" + rute;
        break;
      case "js":
        c_type = "text/javascript";
        break;
      case "ico":
        c_type = "image/ico"
        break;
      case "/":
        c_type = "text/html"
        break;
      case "html":
        c_type = "text/html"
        break;
    }

    //-- Generar el mensaje de respuesta
      res.writeHead(200, {'Content-Type': c_type});
      res.write(data);
      res.end();
    });
  });
  

//-- Activar el servidor: ¡Que empiece la fiesta!
server.listen(PUERTO);
console.log("Server listo!. Escuchando en puerto: " + PUERTO);