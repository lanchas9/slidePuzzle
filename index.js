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

// Loading the image
function preload() {
  source = loadImage('checo2.jpg');
}

function setup() {
    
    finalSize = window.innerWidth >= window.innerHeight ? window.innerHeight : window.innerWidth
    let margen = Math.ceil(finalSize * 0.05)
    finalSize = finalSize-margen
    createCanvas(finalSize - margen, finalSize - margen);
  
  alert("Te vamos a presentar la imagen original, tienes " + tiempoVerImagenOriginal +" segundos para aprendertela antes de que sea movida de manera aleatoria")



  image(source,0,0,finalSize - margen, finalSize - margen)
    
  setTimeout(() => {    
      listo = true;
    }, tiempoVerImagenOriginal*1000);

    setTimeout(() => {
      inicio = new Date().getTime();
    }, tiempoVerImagenOriginal*1000-5);

  // add a helper button, when pressed tiles will have be outlined 
  // in white rectangles if the tiles are in the correct position
//   button = createButton('Help Me');
//   button.position(10, 450);
//   button.mousePressed(helper);

  // pixel dimensions of each tiles
  w = finalSize / cols;
  h = finalSize / rows;

  // Chop up source image into tiles
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * w;
      let y = j * h;
      let newW = parseInt(w)
      let newH= parseInt(h)

      let img = createImage(newW, newH);
      img.copy(source, x, y, w, h, 0, 0, w, h);
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
  for (let i = 0; i < 10000; i++) {
    randomMove(arr);
  }
}

// Move based on click
function mousePressed() {
  let i = floor(mouseX / w);
  let j = floor(mouseY / h);
  moveTiles(i, j, board);
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
        image(img, x, y, w, h);
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

      rect(x, y, w, h);
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
    let final  = new Date().getTime();
    let resultado = final - inicio
    alert('Puzzle solucionado en: ' + (resultado/1000) + ' segundos')
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