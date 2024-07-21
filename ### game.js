const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;
let snake = [{ x: 5 * box, y: 5 * box }];
let direction = '';
let food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    snake.forEach((segment, index) => {
        ctx.fillRect(segment.x, segment.y, box, box);
        if (index === 0) {
            ctx.fillStyle = 'darkgreen';
        }
    });
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, box, box);
    ctx.fillText(`High Score: ${highScore}`, box, box * 2);
}

function update() {
    if (direction) {
        const head = { x: snake[0].x, y: snake[0].y };
        if (direction === 'LEFT') head.x -= box;
        if (direction === 'RIGHT') head.x += box;
        if (direction === 'UP') head.y -= box;
        if (direction === 'DOWN') head.y += box;

        if (head.x === food.x && head.y === food.y) {
            score++;
            food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
        } else {
            snake.pop();
        }

        snake.unshift(head);

        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || collision(head)) {
            alert('Game Over');
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('highScore', highScore);
            }
            resetGame();
        }
    }
}

function collision(head) {
    return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

function resetGame() {
    snake = [{ x: 5 * box, y: 5 * box }];
    direction = '';
    score = 0;
    food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
    if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

document.getElementById('newGameBtn').addEventListener('click', () => {
    resetGame();
    gameLoop();
});

function gameLoop() {
    draw();
    update();
    setTimeout(gameLoop, 100);
}

canvas.width = 400; // Set the width of the canvas
canvas.height = 400; // Set the height of the canvas
gameLoop();
