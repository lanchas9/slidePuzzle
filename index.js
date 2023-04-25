// Slide Puzzle Image
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/165-slide-puzzle.html
// https://youtu.be/uQZLzhrzEs4

// Image: https://editor.p5js.org/codingtrain/sketches/o_ljlLilZ
// Video: https://editor.p5js.org/codingtrain/sketches/YnLX7bGwW
// Canvas: https://editor.p5js.org/codingtrain/sketches/MVCd9trLw


// Mushy (mushroom) man digital art by Liesel McGuiness

// Source image to chop up
let source;

// Tiles configuration
let tiles = [];
let cols = 4;
let rows = 4;
let w, h;
let help = false;
let button;
// Order of tiles
let board = [];
let listo = false;
let inicio;
let finalizado = false;
let ultimoTile;
let ultimoBoard;
let tiempoVerImagenOriginal = 10;
let finalSize
let margenWidth
let margenHeight
// import {tingle} from "/libraries/tingle.js";

// Loading the image
function preload() {
 let imgUrlFinal = document.getElementById("imgUrlFinal").href
  source = loadImage(imgUrlFinal);
}

function setup() {
    
  finalSize = window.innerWidth >= window.innerHeight ? window.innerHeight : window.innerWidth
  margenWidth = (window.innerWidth - finalSize)/2 
  margenHeight = (window.innerHeight - finalSize)/2
  if(margenWidth < (finalSize*.05) ){
    margenWidth = (finalSize*.05)
  }

  if(margenHeight < (finalSize*.05) ){
    margenHeight = (finalSize*.05)
  }
  let minTam = margenWidth < margenHeight ? margenWidth : margenHeight 

  finalSize = finalSize - minTam*2
  createCanvas(window.innerWidth , window.innerHeight);
  let msg = '<img src="img/04_PopUp.jpg" alt="" srcset="" style="width: 625px;">'
  // let msg = "Te vamos a presentar la imagen original, tienes " + tiempoVerImagenOriginal +" segundos para aprendertela antes de que sea movida de manera aleatoria"

        var modal = new tingle.modal({
        footer: false,
        stickyFooter: true,
        closeMethods: ['overlay', 'button', 'escape'],
        closeLabel: "Close",
        cssClass: ['custom-class-1', 'custom-class-2'],
        onOpen: function() {
            console.log('modal open');
        },
        onClose: function() {
            image(source,0 + margenWidth,0 + margenHeight,finalSize , finalSize)
            setTimeout(() => {
                creaCuadricula()    
                listo = true;
              }, tiempoVerImagenOriginal*1000);
          
              setTimeout(() => {
                inicio = new Date().getTime();
              }, tiempoVerImagenOriginal*1000-5);
          
            console.log('modal closed');
        },
        beforeClose: function() {
            // here's goes some logic
            // e.g. save content before closing the modal
            return true; // close the modal
            // return false; // nothing happens
        }
        });
        // modal.setContent(`<h2>INSTRUCCIONES</h2><br><br><h3>${msg}</h3>`);

        modal.setContent(`${msg}`);
        
        // add a button
        // modal.addFooterBtn('Inicia Juego', 'tingle-btn tingle-btn--primary', function() {
        // modal.addFooterBtn('', '', function() {
        //     // here goes some logic
            
        //     modal.close();
        // });
        // open modal
        modal.open();
  // add a helper button, when pressed tiles will have be outlined 
  // in white rectangles if the tiles are in the correct position
//   button = createButton('Help Me');
//   button.position(10, 450);
//   button.mousePressed(helper);
}

function creaCuadricula(){
  
    // pixel dimensions of each tiles
    w = finalSize / cols;
    h = finalSize / rows;
    let newOriginal = createImage(finalSize, finalSize); 
    newOriginal.copy(source,0,0,source.width,source.height,0,0,finalSize, finalSize)
    // Chop up source image into tiles
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let x = i * w;
        let y = j * h;
        // let newW = parseInt(w)
        // let newH= parseInt(h)

        let img = createImage(w, h);
        img.copy(newOriginal, x, y, w, h, 0, 0, w, h);
        let index = i + j * cols;
        board.push(index);
        let tile = new Tile(index, img);
        tiles.push(tile);
      }
    }
    //Guarda ultimo
    ultimoTile = tiles.at(tiles.length-1)
    ultimoBoard = board.at(board.length-1)

    // Remove the last tile
    tiles.pop();
    board.pop();
    // -1 means empty spot
    board.push(-1);

    // Shuffle the board
    simpleShuffle(board);
}

// Swap two elements of an array
function swap(i, j, arr) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

// Pick a random spot to attempt a move
// This should be improved to select from only valid moves
function randomMove(arr) {
  let r1 = floor(random(cols));
  let r2 = floor(random(rows));
  moveTiles(r1, r2, arr);
}

// Shuffle the board
function simpleShuffle(arr) {
  for (let i = 0; i < 1000; i++) {
    randomMove(arr);
  }
}

// Move based on click
function mousePressed() {
  if(listo){
    let i = floor((mouseX - margenWidth) / w);
    let j = floor((mouseY - margenHeight) / h);
    console.log('Coor:' + i + "," + j)
    if((i>=0) && (j>=0) && (i<cols) && (j<rows)){
      console.log('valido')
      moveTiles(i, j, board);
    }else{
      console.log('invalido')
    }
  }
}

function draw() {
if(listo){
  background(0);

  // Draw the current board
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let index = i + j * cols;
      let boardIndex = j + i * rows;
      let x = i * w;
      let y = j * h;
      let tileIndex = board[index];
      if (tileIndex > -1) {
        let img = tiles[tileIndex].img;
        image(img, x + margenWidth, y + margenHeight, w, h);
        for (let a = 0; a < board.length - 1; a++) {
          // if the player wants help, show whether tile is in correct place
          if (help && boardIndex == tileIndex) {
            strokeWeight(3);
            stroke(255, 25);
            rect(x, y, w, h);

          }
        }
      }
    }
  }
  // Show it as grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * w;
      let y = j * h;
      strokeWeight(2);
      noFill();

      rect(x + margenWidth, y + margenHeight, w, h);
    }
  }

  // If it is solved
  if (isSolved()) {
    if(!finalizado){
      finalizado = true;
      setTimeout(() => {
        terminalo()
      }, 500);
      setTimeout(() => {
        mensaje()
      }, 1000);
    }
  }
}
  
}

function terminalo(){
  // image(ultimoTile.img,cols*w,rows*h)
  tiles.push(ultimoTile)
  // ultimoBoard
  board.pop();
  board.push(ultimoBoard);

}

function mensaje(){
    listo=false
    let final  = new Date().getTime();
    let resultado = final - inicio
    let msg = 'Puzzle solucionado en: ' + (resultado/1000) + ' segundos'

    var modal = new tingle.modal({
      footer: false,
      stickyFooter: false,
      closeMethods: ['overlay', 'button', 'escape'],
      closeLabel: "Close",
      cssClass: ['custom-class-1', 'custom-class-2'],
      onOpen: function() {
          console.log('modal open');
      },
      onClose: function() {
          setTimeout(() => {
            window.location.href = "index.html";
          }, 5000);
      },
      beforeClose: function() {
          // here's goes some logic
          // e.g. save content before closing the modal
          return true; // close the modal
          // return false; // nothing happens
      }
      });
      //
      modal.setContent(`<div class="letreroFinal">
      <br><br><br><br><br><br><br><br><br>
      <div class="letreroBlanco">${msg}</div>
  </div>`);
      
      // // add a button
      // modal.addFooterBtn('Reinicia Juego', 'tingle-btn tingle-btn--primary', function() {
      //     // here goes some logic
          
      //     modal.close();
      // });
      // open modal
      modal.open();
}

// Check if solved
function isSolved() {
  for (let i = 0; i < board.length - 1; i++) {
    if (board[i] !== tiles[i].index) {
      return false;
    }
  }
  return true;
}

// Swap two pieces
function moveTiles(i, j, arr) {
  let blank = findBlank();
  let blankCol = blank % cols;
  let blankRow = floor(blank / rows);

  // Double check valid move
  if (isNeighbor2(i, j, blankCol, blankRow)) {
    swap(blank, i + j * cols, arr);
  }
}

// Check if neighbor
function isNeighbor(i, j, x, y) {
  if (i !== x && j !== y) {
    return false;
  }

  if (abs(i - x) == 1 || abs(j - y) == 1) {
    return true;
  }
  return false;
}

function isNeighbor2(i, j, x, y) {
  return true;
}

// Probably could just use a variable
// to track blank spot
function findBlank() {
  for (let i = 0; i < board.length; i++) {
    if (board[i] == -1) return i;
  }
}

function helper() {
  help = true;
  return help;
}