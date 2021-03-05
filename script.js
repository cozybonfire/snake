const ROW_SIZE = 10;
const BOARD_SIZE = ROW_SIZE ** 2;

let availableSquares = []
for (let i = 0; i < ROW_SIZE; i++) {
    for (let j = 0; j < ROW_SIZE; j++) {
        availableSquares.push(document.getElementById(`sq_${i}_${j}`));
    }
}
let clock = 800;
let direction = '';
let gameStarted = false;
let intervalID = '';
let pelletSquare;
let score = 0;
let snake = [];

let assignHead = function(headSquare) {
    // if(snake[0]) {
    //     snake[0].setAttribute('class', 'segment');
    // }
    snake.unshift(headSquare);
    headSquare.setAttribute('class', 'head');
}

let assignPellet = function(pelletSquare) {
    pelletSquare.setAttribute('class', 'pellet');
}

let handleKeyPress = function(event) {
    let key = String.fromCharCode(event.which);
    switch (key) {
        case "A":
        case "%":
            direction = "left";
            break;
        case "D":
        case "'":
            direction = "right";
            break;
        case "W":
        case "&":
            direction = "up";
            break;
        case "S":
        case "(":
            direction = "down";
            break;
        default:
    }

    if (!gameStarted && direction !== '') {
        gameStarted = true;
        runGame();
    }
}

// this get prohibitive in later stages of the game
// better to have a list of available squares and detract from it or add to it as the snake moves
let newPelletLocation = function() {
    let pelletSquare;

    do {
        let pelletSquareRow = random1_8();
        let pelletSquareCol = random1_8();
        pelletSquare = document.getElementById(`sq_${pelletSquareCol}_${pelletSquareRow}`);
    } while (snake.includes(pelletSquare));

    return pelletSquare;
}

let random1_8 = function() {
    return (Math.floor(Math.random() * (ROW_SIZE - 2)) + 1).toString();
}

let removeFromAvailableSquares = function(sq) {
    availableSquares.splice(availableSquares.indexOf(sq), 1);
}

let initializeBoard = function() {
    let headSquareRow = random1_8();
    let headSquareCol = random1_8();
    let headSquare = document.getElementById(`sq_${headSquareCol}_${headSquareRow}`);

    assignHead(headSquare);

    pelletSquare = newPelletLocation();

    assignPellet(pelletSquare);

    document.body.addEventListener("keydown", (event) => handleKeyPress(event));
}

let updateBoard = function() {
    let head = snake[0];
    let headX = head.id[3];
    let headY = head.id[5];

    let nextSquareX = '';
    let nextSquareY = '';
    switch (direction) {
        case 'left':
            nextSquareX = headX - 1;
            nextSquareY = headY;
            break;
        case 'right':
            nextSquareX = parseInt(headX) + 1;
            nextSquareY = headY;
            break;
        case 'up':
            nextSquareX = headX;
            nextSquareY = headY - 1;
            break;
        case 'down':
            nextSquareX = headX;
            nextSquareY = parseInt(headY) + 1;
            break;
        default:
    }

    let nextSquare = document.getElementById(`sq_${nextSquareX}_${nextSquareY}`);

    if (!nextSquare || snake.includes(nextSquare)) {
        console.log("Game lost. Clearing interval.");
        clearInterval(intervalID);
        return;
    }

    assignHead(nextSquare);

    if (nextSquare === pelletSquare) {
        score += 100;
        if(availableSquares.length === 0) {
            console.log("Game won. Clearing interval.");
            clearInterval(intervalID);
        }
        pelletSquare = newPelletLocation();
        assignPellet(pelletSquare);
    } else {
        let previousTail = snake.pop();
        availableSquares.push(previousTail);
        previousTail.setAttribute('class', 'square');
    }

    let scoreDisplay = document.getElementById('score');
    scoreDisplay.innerHTML = score;
}

let runGame = function() {
    console.log("Starting interval...");
    intervalID = window.setInterval(updateBoard, clock);
}

initializeBoard();
