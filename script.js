const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const backgroundImage = new Image();
backgroundImage.src = "flappy-bird-background.png";

// General Game Settings
let isGameActive = false;
let isGameOver = false;
const gravityForce = 0.5;
const horizontalSpeed = 3.2;
const birdDimensions = [51, 36];
const jumpStrength = -11.5;
let birdPositionX;

let animationFrame = 0,
  maxScore = 0,
  birdFlight,
  birdVerticalPosition,
  liveScore,
  pipes;

const pipeWidth = 78;
const pipeGapSize = 270;
const generatePipePosition = () => (Math.random() * ((canvas.height - pipeGapSize) - pipeWidth)) + pipeWidth;

const initializeGame = () => {
  liveScore = 0;
  birdFlight = jumpStrength;
  if(birdVerticalPosition < (canvas.height / 2) - (birdDimensions[1] / 2))
    birdVerticalPosition += (canvas.height / 5) - (birdDimensions[1] / 2)
  if(birdVerticalPosition > (canvas.height / 2) - (birdDimensions[1] / 2))
    birdVerticalPosition -= (canvas.height / 5) - (birdDimensions[1] / 2)
  pipes = Array(3).fill().map((_, index) => [canvas.width + (index * (pipeGapSize + pipeWidth)), generatePipePosition()]);
}

const renderGame = () => {
  animationFrame++;
  // Clear canvas and draw background
  context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height, -(animationFrame * (horizontalSpeed / 2)) % canvas.width + canvas.width, 0, canvas.width, canvas.height);
  context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height, -(animationFrame * (horizontalSpeed / 2)) % canvas.width, 0, canvas.width, canvas.height);

  if (isGameActive) {
    // Render pipes
    pipes.forEach(pipe => {
      pipe[0] -= horizontalSpeed;

      // Top Pipe
      context.drawImage(backgroundImage, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
      // Bottom Pipe
      context.drawImage(backgroundImage, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGapSize, pipe[0], pipe[1] + pipeGapSize, pipeWidth, canvas.height - pipe[1] + pipeGapSize);

      // Update score and create new pipes
      if (pipe[0] <= -pipeWidth) {
        liveScore++;
        maxScore = Math.max(maxScore, liveScore);

        pipes = [...pipes.slice(1), [pipes[pipes.length - 1][0] + pipeGapSize + pipeWidth, generatePipePosition()]];
      }

      // Collision detection
      if ([
        pipe[0] <= birdPositionX + birdDimensions[0],
        pipe[0] + pipeWidth >= birdPositionX,
        pipe[1] > birdVerticalPosition || pipe[1] + pipeGapSize < birdVerticalPosition + birdDimensions[1]
      ].every(condition => condition)) {
        isGameActive = false;
        isGameOver = true;
      }
    });
  }
  context.drawImage(backgroundImage, 432, Math.floor((animationFrame % 9) / 3) * birdDimensions[1], ...birdDimensions, birdPositionX, birdVerticalPosition, ...birdDimensions);
  birdVerticalPosition = Math.min(birdVerticalPosition + birdFlight, canvas.height - birdDimensions[1]);

  // Draw bird
  if (isGameActive) {
    birdFlight += gravityForce;
    if(birdPositionX > canvas.width / 10)
    birdPositionX -= canvas.width / 100
  } else if (isGameOver) {
    // Game Over Display
    context.fillStyle = "black";
    context.fillText(`Game Over`, canvas.width / 3.5, canvas.height / 2 - 50);
    context.fillText(`Final Score: ${liveScore}`, canvas.width / 3.5, canvas.height / 2 - 10);
    context.fillText('Click to Restart', canvas.width / 3.5, canvas.height / 2 + 40);
    context.font = "bold 25px courier";
  } else {
    // Welcome Screen
    // context.drawImage(backgroundImage, 432, Math.floor((animationFrame % 9) / 3) * birdDimensions[1], ...birdDimensions, (canvas.width / 2) - birdDimensions[0] / 2, birdVerticalPosition, ...birdDimensions);
    birdVerticalPosition = (canvas.height / 2) - (birdDimensions[1] / 2);
    birdPositionX = (canvas.width / 2) - (birdDimensions[1] / 2);
    // Display welcome text
    context.fillText(`Best score: ${maxScore}`, 115, 180);
    context.fillText('Click or press space', 60, 430);
    context.fillText('to play', 160, 460);

    context.font = "bold 25px courier";
  }

  document.getElementById('highScore').textContent = `Best: ${maxScore}`;
  document.getElementById('liveScore').textContent = `Current: ${liveScore}`;

  if (!isGameOver) window.requestAnimationFrame(renderGame); // Stop animation when game is over
}

// Start the game
initializeGame();
backgroundImage.onload = renderGame;

document.addEventListener('click', () => {
  if (isGameOver) {
    initializeGame();
    window.requestAnimationFrame(renderGame);
    isGameOver = false;
  }
  isGameActive = true;
  birdFlight = jumpStrength;
});

document.addEventListener('keydown', () => {
  if (isGameOver) {
    initializeGame();
    window.requestAnimationFrame(renderGame);
    isGameOver = false;
  }else{
    
  }
  isGameActive = true;
  birdFlight = jumpStrength;
});
