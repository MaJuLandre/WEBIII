// script.js
document.addEventListener("DOMContentLoaded", () => {
    const boardSize = 10;
    const mineCount = 10;
    const board = document.getElementById("gameBoard");
    let cells = [];
    let mines = [];
    let isGameOver = false;

    function createBoard() {
        board.style.gridTemplateColumns = `repeat(${boardSize}, 30px)`;
        board.innerHTML = "";
        cells = [];

        for (let i = 0; i < boardSize * boardSize; i++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.index = i;
            cell.addEventListener("click", handleClick);
            cell.addEventListener("contextmenu", handleRightClick);
            board.appendChild(cell);
            cells.push(cell);
        }

        placeMines();
        calculateNumbers();
    }

    function placeMines() {
        mines = [];
        while (mines.length < mineCount) {
            const index = Math.floor(Math.random() * cells.length);
            if (!mines.includes(index)) {
                mines.push(index);
                cells[index].classList.add("mine");
            }
        }
    }

    function calculateNumbers() {
        cells.forEach((cell, index) => {
            if (cell.classList.contains("mine")) return;
            let mineCount = 0;
            const neighbors = getNeighbors(index);
            neighbors.forEach(neighbor => {
                if (cells[neighbor].classList.contains("mine")) mineCount++;
            });
            cell.dataset.number = mineCount;
        });
    }

    function getNeighbors(index) {
        const neighbors = [];
        const row = Math.floor(index / boardSize);
        const col = index % boardSize;
        for (let r = -1; r <= 1; r++) {
            for (let c = -1; c <= 1; c++) {
                if (r === 0 && c === 0) continue;
                const newRow = row + r;
                const newCol = col + c;
                if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                    neighbors.push(newRow * boardSize + newCol);
                }
            }
        }
        return neighbors;
    }

    function handleClick(event) {
        if (isGameOver) return;
        const cell = event.target;
        const index = cell.dataset.index;

        if (cell.classList.contains("revealed") || cell.classList.contains("flagged")) return;
        
        revealCell(cell);
        if (cell.classList.contains("mine")) {
            gameOver();
        } else if (cell.dataset.number === "0") {
            revealEmptyCells(index);
        }
    }

    function revealCell(cell) {
        cell.classList.add("revealed");
        const number = cell.dataset.number;
        if (number > 0) {
            cell.textContent = number;
        }
    }

    function revealEmptyCells(index) {
        const queue = [index];
        while (queue.length) {
            const currentIndex = queue.shift();
            const cell = cells[currentIndex];
            if (cell.classList.contains("revealed") || cell.classList.contains("mine")) continue;
            revealCell(cell);
            if (cell.dataset.number === "0") {
                getNeighbors(currentIndex).forEach(neighbor => {
                    if (!cells[neighbor].classList.contains("revealed")) {
                        queue.push(neighbor);
                    }
                });
            }
        }
    }

    function handleRightClick(event) {
        event.preventDefault();
        if (isGameOver) return;
        const cell = event.target;
        if (cell.classList.contains("revealed")) return;

        cell.classList.toggle("flagged");
    }

    function gameOver() {
        isGameOver = true;
        cells.forEach(cell => {
            if (cell.classList.contains("mine")) {
                cell.classList.add("revealed");
            }
        });
        alert("Game Over!");
    }

    document.getElementById("restartButton").addEventListener("click", () => {
        isGameOver = false;
        createBoard();
    });

    createBoard();
});
