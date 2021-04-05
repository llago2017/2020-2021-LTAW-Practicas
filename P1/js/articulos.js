//-- Obtener elementos del DOM
const canvas = document.getElementById('canvas');
let imgs =  document.getElementsByClassName('images');
const ctx = canvas.getContext('2d');

var img = [];

function main() {
  console.log("Ejecutando js")

  for (var i = 0; i < imgs.length; i++) {
    imgs[i].onclick = (ev) => {
        console.log(ev.target.height);
        img = ev.target;
        img.style.border = '0px'
        canvas.height = 250;
        canvas.width = 180;
        ctx.drawImage(img, 0,0);
        console.log('click')
        // Quito el borde de la imagen no seleccionada
        if (imgs[0].style.border = '4px solid grey') {
            imgs[0].style.border = '0px solid grey'
        }
      img.style.backgroundColor = 'rgba(0,0,0,0.75)'
      img.style.border = 'silver 10px solid'
      img.style.borderImageSlice = '27 fill'
      img.style.borderImageSource = 'url(../img/border.png)'
    }
    
    console.log("Imagen lista...");
  }
}