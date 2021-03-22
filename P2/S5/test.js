//-- Leo fichero

const fs = require('fs');

//-- Fichero de la tienda
const FICHERO_JSON = "../json/tienda.json";

//-- Leo el fichero
const tienda_json = fs.readFileSync(FICHERO_JSON);

//-- Creo la estructura
const tienda = JSON.parse(tienda_json);

//-- Muestro info
console.log("Usuarios en la tienda: " + tienda["usuarios"].length);
console.log("Productos en la tienda: " + tienda["productos"].length);

//-- Cambio un valor
console.log("Primer usuario: " + tienda["usuarios"][0]["nombre"]);

tienda["usuarios"][0]["nombre"] = "cambio";

console.log("Primer usuario cambiado: " + tienda["usuarios"][0]["nombre"]);