const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

function resizeCanvas() {
    const container = document.querySelector('.game-container');
    const size = Math.min(container.offsetWidth - 20, 400);
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{x: 10, y: 10}];
let food = generateFood();
let dx = 0;
let dy = 0;
let score = 0;
let gameOver = false;

function generateFood() {
    return {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

function drawGame() {
    if (gameOver) {
        ctx.fillStyle = '#666';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width/2, canvas.height/2);
        ctx.font = '20px Arial';
        ctx.fillText('Tap or Press Space to Restart', canvas.width/2, canvas.height/2 + 40);
        return;
    }
    
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        food = generateFood();
    } else {
        snake.pop();
    }
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize-2, gridSize-2);
    
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize-2, gridSize-2);
    });
    
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver = true;
    }
    
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
        }
    }
}

function gameLoop() {
    drawGame();
    setTimeout(gameLoop, 100);
}

function resetGame() {
    snake = [{x: 10, y: 10}];
    food = generateFood();
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    gameOver = false;
}

document.querySelectorAll('.control-btn').forEach(button => {
    ['touchstart', 'click'].forEach(eventType => {
        button.addEventListener(eventType, (e) => {
            e.preventDefault();
            if (gameOver) {
                resetGame();
                return;
            }
            
            switch(button.className.split(' ')[1]) {
                case 'up':
                    if (dy === 0) { dx = 0; dy = -1; }
                    break;
                case 'down':
                    if (dy === 0) { dx = 0; dy = 1; }
                    break;
                case 'left':
                    if (dx === 0) { dx = -1; dy = 0; }
                    break;
                case 'right':
                    if (dx === 0) { dx = 1; dy = 0; }
                    break;
            }
        });
    });
});

document.addEventListener('keydown', (event) => {
    if (gameOver && event.code === 'Space') {
        resetGame();
        return;
    }
    
    switch (event.key) {
        case 'ArrowUp':
            if (dy === 0) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (dy === 0) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (dx === 0) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx === 0) { dx = 1; dy = 0; }
            break;
    }
});

canvas.addEventListener('click', () => {
    if (gameOver) {
        resetGame();
    }
});

gameLoop();
