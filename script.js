const targetWord = "appel"; // Het te raden woord
let attempts = [];

document.getElementById("submit-button").addEventListener("click", handleGuess);

function handleGuess() {
    const input = document.getElementById("guess-input");
    const guess = input.value.toLowerCase();

    if (guess.length !== 5) {
        document.getElementById("feedback").textContent = "Het woord moet 5 letters lang zijn!";
        return;
    }

    attempts.push(guess);
    updateBoard(guess);
    input.value = "";

    if (guess === targetWord) {
        document.getElementById("feedback").textContent = "Gefeliciteerd! Je hebt het woord geraden!";
    } else if (attempts.length === 5) {
        document.getElementById("feedback").textContent = `Helaas, je hebt verloren. Het woord was: ${targetWord}`;
    }
}

function updateBoard(guess) {
    const board = document.getElementById("game-board");
    board.innerHTML = ""; // Reset bord

    attempts.forEach((attempt) => {
        const row = document.createElement("div");
        row.className = "row";

        for (let i = 0; i < 5; i++) {
            const tile = document.createElement("div");
            tile.className = "tile";

            tile.textContent = attempt[i];
            if (attempt[i] === targetWord[i]) {
                tile.classList.add("correct");
            } else if (targetWord.includes(attempt[i])) {
                tile.classList.add("present");
            } else {
                tile.classList.add("absent");
            }
            row.appendChild(tile);
        }
        board.appendChild(row);
    });
}
