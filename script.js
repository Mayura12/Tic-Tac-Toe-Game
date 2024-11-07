const gameCells = document.querySelector(".board");
const statusDisplay = document.getElementById("turn");
const countdownDisplay = document.getElementById("timer");
const overlayStart = document.getElementById("overlay");
const overlayConfirmation = document.getElementById("confirmationOverlay");
const overlayWinner = document.getElementById("winnerOverlay");
const overlayTie = document.getElementById("tieOverlay");
const messageWinner = document.getElementById("winnerMessage");
const messageTie = document.getElementById("tieMessage");
const indicatorPlayerX = document.getElementById("player-X");
const indicatorPlayerO = document.getElementById("player-O");

let currentPlayer = "X";
let board = Array(9).fill(null);
let countdownTimer;
let countdown = 15;

// Define winning combinations
const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Initialize the game
function initializeGame() {
  overlayStart.style.display = "none";
  currentPlayer = "X";
  board = Array(9).fill(null);
  gameCells.innerHTML = ""; // Clear any existing cells

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-index", i);
    cell.addEventListener("click", handleCellClick);
    gameCells.appendChild(cell);
  }

  statusDisplay.textContent = "Player X's turn";
  resetPlayerIndicators();
  startCountdown();
}

// Reset player indicators
function resetPlayerIndicators() {
  indicatorPlayerX.classList.remove("active");
  indicatorPlayerO.classList.remove("active");
  indicatorPlayerX.classList.add("active");
}

// Start countdown timer
function startCountdown() {
  clearInterval(countdownTimer);
  countdown = 15;
  updateCountdownDisplay();
  countdownTimer = setInterval(() => {
    countdown--;
    updateCountdownDisplay();
    if (countdown === 0) {
      clearInterval(countdownTimer);
      handleTimeout();
    }
  }, 1000);
}

// Update countdown display
function updateCountdownDisplay() {
  countdownDisplay.textContent = `Time left: ${countdown}s`;
}

// Handle cell click event
function handleCellClick(event) {
  const index = event.target.getAttribute("data-index");

  if (!board[index]) {
    board[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    event.target.classList.add("taken");

    if (checkWin()) {
      clearInterval(countdownTimer);
      displayWinner(currentPlayer);
    } else if (board.every((cell) => cell !== null)) {
      clearInterval(countdownTimer);
      displayTieMessage();
    } else {
      togglePlayer();
      statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
      updatePlayerIndicators();
      startCountdown();
    }
  }
}

// Toggle the current player
function togglePlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
}

// Check for a winning combination
function checkWin() {
  return winPatterns.some((pattern) => {
    return pattern.every((index) => board[index] === currentPlayer);
  });
}

// Show winner message
function displayWinner(winner) {
  messageWinner.textContent = `Player ${winner} wins!`;
  overlayWinner.style.display = "flex";
}

// Display tie message
function displayTieMessage() {
  messageTie.textContent = "It's a tie!";
  overlayTie.style.display = "flex";
}

// Handle timeout
function handleTimeout() {
  const winner = currentPlayer === "X" ? "O" : "X";
  messageWinner.textContent = `Player ${currentPlayer} took too long! Player ${winner} wins!`;
  overlayWinner.style.display = "flex";
}

// Update player indicators
function updatePlayerIndicators() {
  if (currentPlayer === "X") {
    indicatorPlayerX.classList.add("active");
    indicatorPlayerO.classList.remove("active");
  } else {
    indicatorPlayerO.classList.add("active");
    indicatorPlayerX.classList.remove("active");
  }
}

// Restart game and show start overlay
function resetGame() {
  clearInterval(countdownTimer);
  overlayStart.style.display = "flex";
  overlayTie.style.display = "none";
  board = Array(9).fill(null);
  initializeGame();
}

function confirmExit() {
  overlayConfirmation.style.display = "none";
  resetGame();
}

function cancelExit() {
  overlayConfirmation.style.display = "none";
}

document
  .querySelector("button[onclick='initializeGame()']")
  .addEventListener("click", resetGame);

function restartAfterTie() {
  tieOverlay.style.display = "none";
  initializeGame();
}

function restartGame() {
  confirmationOverlay.style.display = "flex";
}

function confirmExit() {
  confirmationOverlay.style.display = "none";
  resetGame(); 
}

function cancelExit() {
  confirmationOverlay.style.display = "none"; 
}
