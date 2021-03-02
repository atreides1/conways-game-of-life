/* 
    Conway's game of life is a cellular automata simulation created in the 70s by mathematician John Conway.
    The game consists of a 2D grid of cells, in which each cell can either be "dead" or "alive", and marked accordingly. 
    As time goes on, the state of each cell changes depending on its surrounding environment.
    
    The rules of the "game" are simple:
        1) A live cell with two or three neighbors (horizontal, vertical, or adjacent cells) survives.
        2) A cell with less than two live neighbors or more than three live neighbors dies.
        3) Any cell (dead or alive) with three alive neighbors lives.

    Fun fact: Since this was before computers were widely available,
        John Conway would plot the cells by hand. Just imagine how convenient a computer must have been!
*/

//canvas setup
const canvas = document.getElementById("gameOfLife");
const context = canvas.getContext("2d");
let dpr = window.devicePixelRatio; // For retina screens.

//global variables
let COLS, ROWS, CELL_SIZE;

let cells = []; //array for storing Cell objects
let nextCellState = null; //to save game state between updates
let paused = false;
let game = null;

//util funcs
function fixBlur() {
    let style =
    { //get css style width + height of canvas
        //use slice to get rid of 'px,' and + to convert to int
        height() { return +getComputedStyle(canvas).getPropertyValue('height').slice(0,-2); },
        width() { return +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2); },
    }
    //set correct attributes
    canvas.setAttribute("width", style.width() * dpr);
    canvas.setAttribute("height", style.height() * dpr);
}

// resize the canvas on window resize
//from webGls fundamentals page
function resize() {
    //the size the browser displays the canvas
    let displayWidth = canvas.clientWidth;
    let displayHeight = canvas.clientHeight;

    //if the canvas is not the same size, make it so
    if (canvas.width !== displayWidth || canvas.height !== displayHeight)
    {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        fixBlur();
        createGrid();
    }
}

function pause(e) {
    if (!paused)
    {
        console.log("Paused!");
        game = clearTimeout(game);
        paused = true;
    } else {
        game = setTimeout( () => {
            window.requestAnimationFrame(() => main());
        }, 400);
        paused = false;
    }
}
// event listeners
window.addEventListener('resize', resize, false);
window.addEventListener('keydown', pause, false);


//////////////////////////////////////////////////
//////////////////  The Game   ///////////////////
//////////////////////////////////////////////////

//check if cell at pos (i,j) is alive or not
//also used to filter out border cells
function checkState(i, j)
{
    if (i < 0 || j < 0 || i >= ROWS || j >= COLS)
    {
        return 0;
    }
    return cells[i][j];
}

function createGrid()
{
    // initialize grid
    // https://gist.github.com/xon52/fb895e33d64a8d322da165d158fa11b2
    ROWS = 50;
    COLS = Math.floor(canvas.height / canvas.width * ROWS);
    console.log(COLS)
    CELL_SIZE = Math.floor(canvas.width / ROWS);

    for (let i=0; i<ROWS; i++) {
        let row = [];
        for (let j=0; j<COLS; j++) {
            let state = Math.random() > 0.8 ? 1 : 0;
            row.push(state);
        }
        cells.push(row)
    }
    console.log(cells);
    nextCellState = [...cells];
}

function main()
{
    fixBlur();

    //update our *future* cell state
    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            let numOfNeighborsAlive = checkState(i-1, j-1) + checkState(i-1, j) + checkState(i-1,j+1) + checkState(i,j-1) + checkState(i,j+1) + checkState(i+1,j-1) + checkState(i+1,j) + checkState(i+1,j+1);

            if (numOfNeighborsAlive === 3)
            {

                nextCellState[i][j] = 1;

            } else if (numOfNeighborsAlive === 2)
            {

                nextCellState[i][j] = cells[i][j];

            } else {

                nextCellState[i][j] = 0;

            }
        }
    }
    // //draw viable cells
    for (let i = 0; i < ROWS; i++)
    {
        for (let j = 0; j < COLS; j++)
        {
            if (nextCellState[i][j] === 1)
            {
                context.fillStyle = 'rgb(' + Math.floor(i/ROWS * 255) + ',' + Math.floor(j/COLS * 255 -10) + ', 90)';
                context.fillRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
            cells[i][j] = nextCellState[i][j];
        }
    }


    game = setTimeout( () => {
        window.requestAnimationFrame(() => main());
    }, 400)
}

// Now for the game of life!
// fixBlur()
resize();
createGrid();
window.requestAnimationFrame(main);
