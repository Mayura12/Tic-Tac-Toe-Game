const cells = document.querySelectorAll(".cell");
const turnDisplay = document.getElementById("turn");
const timerDisplay = document.getElementById("timer");
const overlay = document.getElementById("overlay");
const confirmationOverlay = document.getElementById("confirmationOverlay");
const winnerOverlay = document.getElementById("winnerOverlay");
const tieOverlay = document.getElementById("tieOverlay");
const winnerMessage = document.getElementById("winnerMessage");
const tieMessage = document.getElementById("tieMessage");
const playerXIndicator = document.getElementById("playerX");
const playerOIndicator = document.getElementById("playerO");
let currentPlayer = "X";
let board = Array(9).fill(null);
let timer;
let timeLeft = 15;

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// start the game
function startGame() {
  overlay.style.display = "none";
  currentPlayer = "X";
  board = Array(9).fill(null);
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("taken");
  });
  turnDisplay.textContent = "Player X's turn";
  resetPlayerIndicators();
  startTimer();
}

// reset player indicators
function resetPlayerIndicators() {
  playerXIndicator.classList.remove("active");
  playerOIndicator.classList.remove("active");
  playerXIndicator.classList.add("active");
}

// start the timer
function startTimer() {
  clearInterval(timer);
  timeLeft = 15;
  timerDisplay.textContent = `Time left: ${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time left: ${timeLeft}s`;
    if (timeLeft === 0) {
      clearInterval(timer);
      displayTimeoutMessage();
    }
  }, 1000);
}

// handle cell click
function handleCellClick(event) {
  const index = event.target.getAttribute("data-index");

  if (!board[index]) {
    board[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    event.target.classList.add("taken");

    if (checkWin()) {
      clearInterval(timer);
      displayWinner(currentPlayer);
    } else if (board.every((cell) => cell !== null)) {
      clearInterval(timer);
      displayTieMessage();
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      turnDisplay.textContent = `Player ${currentPlayer}'s turn`;
      updatePlayerIndicators();
      startTimer();
    }
  }
}

//  check for a winning combination
function checkWin() {
  return winningCombinations.some((combination) => {
    return combination.every((index) => board[index] === currentPlayer);
  });
}

function restartGame() {
  confirmationOverlay.style.display = "flex";
}

// confirm exit and reset the game
function confirmExit() {
  confirmationOverlay.style.display = "none";
  resetGame();
}

// cancel exit and hide the confirmation overlay
function cancelExit() {
  confirmationOverlay.style.display = "none";
}

function displayWinner(winner) {
  winnerMessage.textContent = `Player ${winner} wins!`;
  winnerOverlay.style.display = "flex";
}

// display tie message in overlay
function displayTieMessage() {
  tieMessage.textContent = "It's a tie!";
  tieOverlay.style.display = "flex";
}

function resetGame() {
    clearInterval(timer);
    overlay.style.display = "flex";
    tieOverlay.style.display = "none"; 
    board = Array(9).fill(null);
    cells.forEach((cell) => {
      cell.textContent = "";
      cell.classList.remove("taken");
    });
    currentPlayer = "X";
    turnDisplay.textContent = "Player X's turn";
    timerDisplay.textContent = `Time left: ${timeLeft}s`;
  }
  

// restart the game after a win
function restartAfterWin() {
  winnerOverlay.style.display = "none";
  startGame();
}

// restart the game after a tie
function restartAfterTie() {
  tieOverlay.style.display = "none";
  startGame();
}

function updatePlayerIndicators() {
  if (currentPlayer === "X") {
    playerXIndicator.classList.add("active");
    playerOIndicator.classList.remove("active");
  } else {
    playerOIndicator.classList.add("active");
    playerXIndicator.classList.remove("active");
  }
}

function displayTimeoutMessage() {
  const winner = currentPlayer === "X" ? "O" : "X";
  winnerMessage.textContent = `Player ${currentPlayer} took too long! Player ${winner} wins!`;
  winnerOverlay.style.display = "flex";
}

cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
