document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const scoreDisplay = document.getElementById("score-display");
    const startButton = document.getElementById("start-button");
    

    const width = 10; // Number of cells in a row
    const height = 20; // Number of rows in the grid
    const gridCells = [];
    let timerId;
    let score = 0;

    // Create the grid
    function createGrid() {
        for (let i = 0; i < width * height; i++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            grid.appendChild(cell);
            gridCells.push(cell);
        }
    }
    createGrid();

    // Tetromino shapes
    const tetrominoes = [
        [1, width + 1, width * 2 + 1, 2], // L-shape
        [0, width, width + 1, width * 2 + 1], // Z-shape
        [1, width, width + 1, width + 2], // T-shape
        [0, 1, width, width + 1], // Square
        [1, width + 1, width * 2 + 1, width * 3 + 1], // Line
    ];

    let currentPosition = 4;
    let currentRotation = 0;
    let currentTetromino = getRandomTetromino();

    function drawTetromino() {
        currentTetromino.forEach((index) => {
            gridCells[currentPosition + index].classList.add("tetromino");
        });
    }

    function undrawTetromino() {
        currentTetromino.forEach((index) => {
            gridCells[currentPosition + index].classList.remove("tetromino");
        });
    }

    function moveDown() {
        undrawTetromino();
        currentPosition += width;
        drawTetromino();
        freezeTetromino();
    }

    function moveLeft() {
        undrawTetromino();
        if (!isAtLeftEdge()) currentPosition -= 1;
        drawTetromino();
    }

    function moveRight() {
        undrawTetromino();
        if (!isAtRightEdge()) currentPosition += 1;
        drawTetromino();
    }

    function isAtLeftEdge() {
        return currentTetromino.some((index) => (currentPosition + index) % width === 0);
    }

    function isAtRightEdge() {
        return currentTetromino.some((index) => (currentPosition + index) % width === width - 1);
    }

    function rotateTetromino() {
        undrawTetromino();
        currentRotation = (currentRotation + 1) % 4;
        currentTetromino = tetrominoes[getRandomIndex()].map(
            (index) => index + width * (currentRotation % 4)
        );
        drawTetromino();
    }

    function freezeTetromino() {
        if (
            currentTetromino.some(
                (index) =>
                    gridCells[currentPosition + index + width].classList.contains("occupied")
            )
        ) {
            currentTetromino.forEach((index) =>
                gridCells[currentPosition + index].classList.add("occupied")
            );
            currentTetromino = getRandomTetromino();
            currentPosition = 4;
            addScore();
            drawTetromino();
        }
    }

    function getRandomTetromino() {
        return tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
    }

    function addScore() {
        for (let i = 0; i < height; i++) {
            const row = Array.from({ length: width }, (_, idx) => i * width + idx);
            if (row.every((index) => gridCells[index].classList.contains("occupied"))) {
                row.forEach((index) => {
                    gridCells[index].classList.remove("occupied");
                    gridCells[index].classList.remove("tetromino");
                });
                score += 10;
                scoreDisplay.textContent = `Score: ${score}`;
                const removed = gridCells.splice(i * width, width);
                gridCells.unshift(...removed);
                gridCells.forEach((cell, idx) => (cell.style.gridRowStart = idx));
            }
        }
    }

    // Event listeners for controls
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") moveLeft();
        if (e.key === "ArrowRight") moveRight();
        if (e.key === "ArrowDown") moveDown();
        if (e.key === "ArrowUp") rotateTetromino();
    });

    startButton.addEventListener("click", () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            drawTetromino();
            timerId = setInterval(moveDown, 1000);
        }
    });
});
