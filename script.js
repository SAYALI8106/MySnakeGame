
document.addEventListener('DOMContentLoaded', function () {
    const gameArena = document.getElementById('game-arena');
    const gameOverUI = document.getElementById('game-over');
    const arenaSize = 600;
    const cellSize = 20;
    let score = 0;
    let gameStarted = false;
    let food = { x: 300, y: 200 };
    let snake = [{ x: 160, y: 200 }, { x: 140, y: 200 }, { x: 120, y: 200 }];
    let dx = cellSize;
    let dy = 0;
    let intervalId;
    let gameSpeed = 200;

    function moveFood() {
        let newX, newY;
        do {
            newX = Math.floor(Math.random() * 30) * cellSize;
            newY = Math.floor(Math.random() * 30) * cellSize;
        } while (snake.some(snakeCell => snakeCell.x === newX && snakeCell.y === newY));
        food = { x: newX, y: newY };
    }

    function updateSnake() {
        const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(newHead);
        if (newHead.x === food.x && newHead.y === food.y) {
            score += 10;
            moveFood();
            if (gameSpeed > 50) {
                clearInterval(intervalId);
                gameSpeed -= 10;
                gameLoop();
            }
        } else {
            snake.pop();
        }
    }

    function changeDirection(e) {
        const isGoingDown = dy === cellSize;
        const isGoingUp = dy === -cellSize;
        const isGoingRight = dx === cellSize;
        const isGoingLeft = dx === -cellSize;
        if (e.key === 'ArrowUp' && !isGoingDown) {
            dx = 0;
            dy = -cellSize;
        } else if (e.key === 'ArrowDown' && !isGoingUp) {
            dx = 0;
            dy = cellSize;
        } else if (e.key === 'ArrowLeft' && !isGoingRight) {
            dx = -cellSize;
            dy = 0;
        } else if (e.key === 'ArrowRight' && !isGoingLeft) {
            dx = cellSize;
            dy = 0;
        }
    }

    function drawDiv(x, y, className) {
        const divElement = document.createElement('div');
        divElement.classList.add(className);
        divElement.style.top = `${y}px`;
        divElement.style.left = `${x}px`;
        return divElement;
    }

    function drawFoodAndSnake() {
        gameArena.innerHTML = '';
        snake.forEach(snakeCell => {
            const snakeElement = drawDiv(snakeCell.x, snakeCell.y, 'snake');
            gameArena.appendChild(snakeElement);
        });
        const foodElement = drawDiv(food.x, food.y, 'food');
        gameArena.appendChild(foodElement);
    }

    function isGameOver() {
        const hitLeftWall = snake[0].x < 0;
        const hitRightWall = snake[0].x > arenaSize - cellSize;
        const hitTopWall = snake[0].y < 0;
        const hitBottomWall = snake[0].y > arenaSize - cellSize;
        if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
            showGameOverUI();
            return true;
        }
        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
                showGameOverUI();
                return true;
            }
        }
        return false;
    }

    function gameLoop() {
        intervalId = setInterval(() => {
            if (isGameOver()) {
                clearInterval(intervalId);
                gameStarted = false;
                return;
            }
            updateSnake();
            drawFoodAndSnake();
            drawScoreBoard();
        }, gameSpeed);
    }

    function runGame() {
        if (!gameStarted) {
            gameStarted = true;
            document.addEventListener('keydown', changeDirection);
            gameLoop();
        }
    }

    function drawScoreBoard() {
        const scoreBoard = document.getElementById('score-board');
        scoreBoard.textContent = `Score: ${score}`;
    }

    function showGameOverUI() {
        const finalScore = document.getElementById('final-score');
        finalScore.textContent = score;
        gameOverUI.style.display = 'flex';
    }

    function hideGameOverUI() {
        gameOverUI.style.display = 'none';
    }

    document.getElementById('restart-button').addEventListener('click', function () {
        hideGameOverUI();  // Hide the game over screen when restarting
        score = 0;
        dx = cellSize;
        dy = 0;
        snake = [{ x: 160, y: 200 }, { x: 140, y: 200 }, { x: 120, y: 200 }];
        gameSpeed = 200;
        runGame();
    });

    function initiateGame() {
        const scoreBoard = document.createElement('div');
        scoreBoard.id = 'score-board';
        document.body.insertBefore(scoreBoard, gameArena);

        const startButton = document.createElement('button');
        startButton.textContent = 'Start Game';
        startButton.classList.add('start-button');

        startButton.addEventListener('click', function () {
            startButton.style.display = 'none';
            runGame();
        });

        document.body.appendChild(startButton);
    }

    // Ensure game over screen is hidden when the page loads or refreshes
    window.onload = function() {
        hideGameOverUI();
    };

    initiateGame();
});

