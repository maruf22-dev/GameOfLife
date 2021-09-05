let runningStatus = false;
let drawStatus = true;
let grid, columns, rows;
let h, w;
let buttonStartX = 0, fps = 14, nodeSize = 12, density = 14;
let currentRow = 0, currentColumn = 0;



function reloadFunction()
{
  window.location = document.URL;
}
function windowResized() {
  reloadFunction();
}
function pausePlay() {
  runningStatus = !runningStatus;
}
function drawErase() {
  runningStatus = false;
  drawStatus = !drawStatus;
}
function makeArray(columns, rows) {
  let grid = new Array(columns);
  for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(rows);
  }
  return grid;
}

function makeEmpty()
{
  runningStatus = false;
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = 0;
    }
  }
}
function makeRandom()
{
  runningStatus = false;
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      let random = Math.floor(Math.random() * 100) + 1;
      let threshold = 100 - density;
      if(j * nodeSize < 110) grid[i][j] = 0;
      else if(random > threshold) grid[i][j] = 1;
      else grid[i][j] = 0;
    }
  }
}
function playPauseButton() {
  button = createButton('Play / Pause');
  button.position(buttonStartX, 50);
  button.size(100, 25);
  button.style('background-color', color(20));
  button.style('color', color(170));
  button.style('font-weight', 600);
  button.style('border-radius: 5px;');
  button.mousePressed(pausePlay);
}
function ActionButton() {
  button = createButton('Draw / Erase');
  button.position(buttonStartX + 110, 50);
  button.size(100, 25);
  button.style('background-color', color(20));
  button.style('color', color(170));
  button.style('font-weight', 600);
  button.style('border-radius: 5px;');
  button.mousePressed(drawErase);
}
function EmptyButton() {
  button = createButton('Empty');
  button.position(buttonStartX, 80);
  button.size(100, 25);
  button.style('background-color', color(20));
  button.style('color', color(170));
  button.style('font-weight', 600);
  button.style('border-radius: 5px;');
  button.mousePressed(makeEmpty);
}
function RandomizeButton() {
  button = createButton('Randomize');
  button.position(buttonStartX + 110, 80);
  button.size(100, 25);
  button.style('background-color', color(20));
  button.style('color', color(170));
  button.style('font-weight', 600);
  button.style('border-radius: 5px;');
  button.mousePressed(makeRandom);
}
function displayText()
{
  stroke(20);
  fill(15);
  rect(buttonStartX, 50, 210, 60);
  rect(0, 0, w, 40);
  fill(170);
  let state, action;
  if(runningStatus) state = 'Playing ';
  else state = 'Paused ';
  if(drawStatus) action = 'Draw ';
  else action = 'Erase ';
  textStyle(BOLD);
  strokeWeight(0);
  textSize(15);
  text('Status : ' + state + '  |  Action : ' + action, w/2 - 120, 25);
  strokeWeight(1);
}


function updateGridFromInput() {
  if (mouseX > 0 && mouseX < w && mouseY > 0 && mouseY < h) {
    currentColumn = floor(mouseX / nodeSize);
    currentRow = floor(mouseY / nodeSize);
  }
  if (currentRow != rows && currentColumn != columns) {
    if (drawStatus && mouseIsPressed) grid[currentColumn][currentRow] = 1;
    else if(!drawStatus && mouseIsPressed) grid[currentColumn][currentRow] = 0;
  }
}
function countSurroundingNodes(grid, columnPassed, rowPassed) {
  let Nodes = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      let col = (columnPassed + i + columns) % columns;
      let row = (rowPassed + j + rows) % rows;
      Nodes += grid[col][row];
    }
  }
  Nodes -= grid[columnPassed][rowPassed];
  return Nodes;
}


function setup() {
  h = windowHeight-1;
  w = windowWidth-1;
  var canvas = createCanvas(w, h);
  canvas.style('display', 'block')
  frameRate(fps);
  buttonStartX = w/2 - 100;
  EmptyButton();
  playPauseButton();
  ActionButton();
  RandomizeButton();
  columns = floor(w / nodeSize);
  rows = floor(h / nodeSize);
  grid = makeArray(columns, rows);
  makeEmpty();

}
function draw() {
  background(20);
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      let colPos = i * nodeSize;
      let rowPos = j * nodeSize;
      if (grid[i][j] == 1) {
        fill(111);
        stroke(20);
        rect(colPos, rowPos, nodeSize - 1, nodeSize - 1);
      }
    }
  }

  let updatedGrid = makeArray(columns, rows);
  if (runningStatus) {
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        let state = grid[i][j];
        let surroundingNodes = countSurroundingNodes(grid, i, j);
        if (state == 0 && surroundingNodes == 3) {
          updatedGrid[i][j] = 1;
        } else if (state == 1 && (surroundingNodes < 2 || surroundingNodes > 3)) {
          updatedGrid[i][j] = 0;
        } else {
          updatedGrid[i][j] = state;
        }
      }
    }
    grid = updatedGrid;
  }
  updateGridFromInput();
  displayText();
}



