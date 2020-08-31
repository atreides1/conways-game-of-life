//canvas setup
const c = document.getElementById("gameOfLife");
const ctx = c.getContext("2d");
let dpr = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.

//global variables

let numCols = 39; //want these to depend on height
let numRows = 18; //and width, respectively
let cellSize = numCols * numRows / 14;

let cells = []; //array for storing Cell objects
let nextCellState = null; //to save game state between updates
let paused = false;
let game = null;
//util funcs
function fixBlur()
{
    let style =
    { //get css style width + height of canvas
        //use slice to get rid of 'px,' and + to convert to int
        height() { return +getComputedStyle(c).getPropertyValue('height').slice(0,-2); },
        width() { return +getComputedStyle(c).getPropertyValue('width').slice(0,-2); },
    }
    //set correct attributes
    c.setAttribute('width', style.width() * dpr);
    c.setAttribute('height', style.height() * dpr);
}

function resize(c) //from webGls fundamentals page
{
    //the size the browser displays the canvas
    let displayWidth = c.clientWidth;
    let displayHeight = c.clientHeight;

    //if the canvas is not the same size, make it so
    if (c.width !== displayWidth || c.height !== displayHeight)
    {
        c.width = displayWidth;
        c.height = displayHeight;
        fixBlur()
    }
}

function pause(e)
{
    if (!paused)
    {
        console.log("Paused!");
        game = clearTimeout(game);
        paused = true;
    } else {
        game = setTimeout( () => {
            window.requestAnimationFrame(() => main());
        }, 500);
        paused = false;
    }
}

window.addEventListener('resize', resize, false);
window.addEventListener('keydown', pause, false);


///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////

//check if cell at pos (i,j) is alive or not
//also used to filter out border cells
function isAlive(i, j)
{
    if (i < 0 || j < 0 || i >= numCols || j >= numRows)
    {
        return 0;
    }
    return cells[i][j];
}

function createGrid()
{
    for (let i = 0; i < numCols; i++)
    {
        let row = [];
        for (let j = 0; j < numRows; j++)
        {
            row.push(Math.round(Math.random()));
        }
        cells.push(row);
    }
    console.log(cells);
    nextCellState = [...cells];
}

function main()
{
    fixBlur();

    //update our *future* cell state
    for (let i = 0; i < numCols; i++)
    {
        for (let j = 0; j < numRows; j++)
        {
            let numOfNeighborsAlive = isAlive(i-1, j-1) + isAlive(i-1, j) + isAlive(i-1,j+1) + isAlive(i,j-1) + isAlive(i,j+1) + isAlive(i+1,j-1) + isAlive(i+1,j) + isAlive(i+1,j+1);

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
    //draw viable cells
    for (let i = 0; i < numCols; i++)
    {
        for (let j = 0; j < numRows; j++)
        {
            if (nextCellState[i][j] === 1)
            {
                ctx.fillStyle = 'rgb(' + Math.floor(i/numCols * 255) + ',' + Math.floor(j/numRows * 255 -10) + ', 90)';
                ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
            cells[i][j] = nextCellState[i][j];
        }
    }


    game = setTimeout( () => {
        window.requestAnimationFrame(() => main());
    }, 500)
}

// Now for the game of life!
fixBlur()
createGrid();
window.requestAnimationFrame(main);
