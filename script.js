// Lijst met mogelijke woorden
const words = ["appel", "banen", "cactus", "dweil", "engel", "fiets", "gazen", "hotel", "ijsje", "jurk"];
let targetWord = ""; // Hier slaan we het gekozen woord op
let attempts = [];

// Kies een willekeurig woord bij het laden van de pagina
function selectRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    targetWord = words[randomIndex];
}

// Functie om te starten
function initializeGame() {
    attempts = [];
    document.getElementById("game-board").innerHTML = "";
    document.getElementById("feedback").textContent = "";
    selectRandomWord();
    console.log(`Hint: Het doelwoord is ${targetWord}`); // Alleen voor debuggen
}

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

// Start het spel bij het laden van de pagina
initializeGame();
