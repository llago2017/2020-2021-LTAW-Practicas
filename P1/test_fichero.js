prueba =  "/img/white.jpg"

var recorte = prueba.split('/').pop();
console.log(recorte);

var len = prueba.length;
var r_slice = prueba.slice(1,len);
console.log(r_slice);