//-- Obtener elementos del DOM
const canvas = document.getElementById('canvas');
let imgs =  document.getElementsByClassName('images');
const ctx = canvas.getContext('2d');

var img = [];

for (var i = 0; i < imgs.length; i++) {
    imgs[i].onclick = (ev) => {
        console.log(ev.target);
        img = ev.target;
        img.style.border = '0px'
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0,0);
        console.log('click')
        // Quito el borde de la imagen no seleccionada
        if (imgs[0].style.border = '4px solid grey') {
            imgs[0].style.border = '0px solid grey'
            imgs[1].style.border = '0px solid grey'
        }
      img.style.border = '4px solid grey'
    }
    
    console.log("Imagen lista...");
  }