document.addEventListener('DOMContentLoaded', function () {
    const gameArena = document.getElementById('game-arena');
    const gameOverUI = document.getElementById('game-over');
    const arenaSize = gameArena.offsetWidth; // Use dynamic arena size for responsiveness
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
            newX = Math.floor(Math.random() * (arenaSize / cellSize)) * cellSize;
            newY = Math.floor(Math.random() * (arenaSize / cellSize)) * cellSize;
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

    // Swipe handling for touch devices
    let touchStartX = 0;
    let touchStartY = 0;

    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].clientX;
        touchStartY = e.changedTouches[0].clientY;
    }

    function handleTouchMove(e) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;

        if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal swipe
            if (dx > 0 && dx > 50) {
                changeDirection({ key: 'ArrowRight' });
            } else if (dx < 0 && Math.abs(dx) > 50) {
                changeDirection({ key: 'ArrowLeft' });
            }
        } else {
            // Vertical swipe
            if (dy > 0 && dy > 50) {
                changeDirection({ key: 'ArrowDown' });
            } else if (dy < 0 && Math.abs(dy) > 50) {
                changeDirection({ key: 'ArrowUp' });
            }
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
        gameArena.innerHTML = ''; // Clear the game arena
        snake.forEach((snakeCell) => {
            const snakeElement = drawDiv(snakeCell.x, snakeCell.y, 'snake');
            gameArena.appendChild(snakeElement);
        });

        const foodElement = drawDiv(food.x, food.y, 'food');
        gameArena.appendChild(foodElement);
    }

    function isGameOver() {
        const hitLeftWall = snake[0].x < 0;
        const hitRightWall = snake[0].x >= arenaSize;
        const hitTopWall = snake[0].y < 0;
        const hitBottomWall = snake[0].y >= arenaSize;
        if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
            return true;
        }
        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
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
                showGameOverUI();
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
            document.addEventListener('touchstart', handleTouchStart);
            document.addEventListener('touchmove', handleTouchMove);
            gameLoop();
        }
    }

    function showGameOverUI() {
        clearInterval(intervalId);
        gameOverUI.style.display = 'block';
        document.getElementById('final-score').textContent = score;
    }

    function restartGame() {
        score = 0;
        gameStarted = false;
        snake = [{ x: 160, y: 200 }, { x: 140, y: 200 }, { x: 120, y: 200 }];
        dx = cellSize;
        dy = 0;
        gameOverUI.style.display = 'none';
        drawFoodAndSnake();
        drawScoreBoard();
        runGame();
    }

    function drawScoreBoard() {
        const scoreBoard = document.getElementById('score-board');
        scoreBoard.textContent = `Score: ${score}`;
    }

    document.getElementById('restart-button').addEventListener('click', restartGame);
    moveFood();
    drawFoodAndSnake();
    drawScoreBoard();
    runGame();
});

