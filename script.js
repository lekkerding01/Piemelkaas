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
    let currentTetromino = tetrominoes[0];

    // Randomly selects a Tetromino
    function getRandomTetromino() {
        const randomIndex = Math.floor(Math.random() * tetrominoes.length);
        return tetrominoes[randomIndex];
    }

    // Draw the Tetromino on the grid
    function drawTetromino() {
        currentTetromino.forEach((index) => {
            gridCells[currentPosition + index].classList.add("tetromino");
        });
    }

    // Remove the Tetromino from the grid
    function undrawTetromino() {
        currentTetromino.forEach((index) => {
            gridCells[currentPosition + index].classList.remove("tetromino");
        });
    }

    // Move the Tetromino down
    function moveDown() {
        undrawTetromino();
        currentPosition += width;
        drawTetromino();
        freezeTetromino();
    }

    // Freeze the Tetromino if it reaches the bottom or another piece
    function freezeTetromino() {
        if (
            currentTetromino.some(
                (index) =>
                    gridCells[currentPosition + index + width]?.classList.contains("occupied")
            )
        ) {
            currentTetromino.forEach((index) =>
                gridCells[currentPosition + index].classList.add("occupied")
            );
            // Start a new Tetromino
            currentTetromino = getRandomTetromino();
            currentPosition = 4;
            drawTetromino();
            addScore();
        }
    }

    // Move the Tetromino left
    function moveLeft() {
        undrawTetromino();
        if (!isAtLeftEdge() && !isBlocked(-1)) {
            currentPosition -= 1;
        }
        drawTetromino();
    }

    // Move the Tetromino right
    function moveRight() {
        undrawTetromino();
        if (!isAtRightEdge() && !isBlocked(1)) {
            currentPosition += 1;
        }
        drawTetromino();
    }

    // Rotate the Tetromino
    function rotateTetromino() {
        undrawTetromino();
        currentRotation = (currentRotation + 1) % 4;
        drawTetromino();
    }

    // Check if the Tetromino is at the left edge
    function isAtLeftEdge() {
        return currentTetromino.some((index) => (currentPosition + index) % width === 0);
    }

    // Check if the Tetromino is at the right edge
    function isAtRightEdge() {
        return currentTetromino.some((index) => (currentPosition + index) % width === width - 1);
    }

    // Check if the Tetromino is blocked
    function isBlocked(offset) {
        return currentTetromino.some((index) =>
            gridCells[currentPosition + index + offset]?.classList.contains("occupied")
        );
    }

    // Add score for completed rows
    function addScore() {
        for (let i = 0; i < height; i++) {
            const row = Array.from(
                { length: width },
                (_, idx) => gridCells[i * width + idx]
            );
            if (row.every((cell) => cell.classList.contains("occupied"))) {
                row.forEach((cell) => {
                    cell.classList.remove("occupied");
                    cell.classList.remove("tetromino");
                });
                const removedCells = gridCells.splice(i * width, width);
                gridCells.unshift(...removedCells);
                score += 10;
                scoreDisplay.textContent = `Score: ${score}`;
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

    // Start the game
    startButton.addEventListener("click", () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            currentTetromino = getRandomTetromino();
            drawTetromino();
            timerId = setInterval(moveDown, 1000);
        }
    });
});
