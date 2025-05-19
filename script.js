// Game Constants
const GRID_SIZE = 20;
const INITIAL_SNAKE_LENGTH = 5;
const GAME_SPEED = 120; // milliseconds per frame
const BOOST_SPEED = 80; // speed when boost is activated
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;

// Game Variables
let canvas, ctx;
let gameLoop;
let currentTheme = 'space';

// Player 1 Snake (WASD)
let snakeP1 = {
    body: [],
    color: '#4cc9f0',
    direction: 'right',
    nextDirection: 'right',
    score: 0,
    isDead: false,
    isBoost: false
};

// Player 2 Snake (Arrow Keys)
let snakeP2 = {
    body: [],
    color: '#f72585',
    direction: 'left',
    nextDirection: 'left',
    score: 0,
    isDead: false,
    isBoost: false
};

// Food
let food = {
    x: 0,
    y: 0,
    color: '#ffca3a',
    value: 1
};

// Bonus Food (appears periodically)
let bonusFood = {
    x: -1, // Off-screen initially
    y: -1,
    color: '#ff9f1c',
    value: 5,
    isActive: false,
    timer: 0
};

// Theme Elements
let stars = [];
let leaves = [];
let neonLights = [];

// Initialize the game
function init() {
    canvas = document.getElementById('gameCanvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    ctx = canvas.getContext('2d');

    // Apply initial theme
    applyTheme(currentTheme);

    // Initialize game elements
    initStars();
    initLeaves();
    initNeonLights();

    // Set up event listeners
    setupEventListeners();

    // Initialize start screen
    document.getElementById('startScreen').classList.add('active');
}

// Initialize stars for space theme
function initStars() {
    stars = [];
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            opacity: Math.random(),
            twinkleSpeed: 1 + Math.random() * 3
        });
    }
}

// Initialize leaves for jungle theme
function initLeaves() {
    leaves = [];
    const leafCount = 30;
    
    for (let i = 0; i < leafCount; i++) {
        leaves.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 10 + 5,
            speed: Math.random() * 2 + 1,
            rotation: Math.random() * 360
        });
    }
}

// Initialize neon lights for neon theme
function initNeonLights() {
    neonLights = [];
    const lightCount = 20;
    const colors = ['#FF00FF', '#00FFFF', '#FF0099', '#0099FF'];
    
    for (let i = 0; i < lightCount; i++) {
        neonLights.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 40 + 20,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: 0.5 + Math.random() * 2
        });
    }
}

// Setup event listeners
function setupEventListeners() {
    // Player controls
    window.addEventListener('keydown', handleKeyPress);
    
    // Theme selector
    document.getElementById('theme-select').addEventListener('change', function(e) {
        applyTheme(e.target.value);
    });
    
    // Start screen theme selector
    document.getElementById('start-theme-select').addEventListener('change', function(e) {
        applyTheme(e.target.value);
    });
    
    // Game buttons
    document.getElementById('startButton').addEventListener('click', startGame);
    document.getElementById('restartButton').addEventListener('click', restartGame);
}

// Handle key presses for both players
function handleKeyPress(e) {
    // Player 1 Controls (WASD)
    switch(e.key) {
        case 'w':
        case 'W':
            if (snakeP1.direction !== 'down') snakeP1.nextDirection = 'up';
            break;
        case 'a':
        case 'A':
            if (snakeP1.direction !== 'right') snakeP1.nextDirection = 'left';
            break;
        case 's':
        case 'S':
            if (snakeP1.direction !== 'up') snakeP1.nextDirection = 'down';
            break;
        case 'd':
        case 'D':
            if (snakeP1.direction !== 'left') snakeP1.nextDirection = 'right';
            break;
        case 'Shift':
            if (e.location === 1) { // Left Shift
                snakeP1.isBoost = true;
            }
            break;
    }
    
    // Player 2 Controls (Arrow Keys)
    switch(e.key) {
        case 'ArrowUp':
            if (snakeP2.direction !== 'down') snakeP2.nextDirection = 'up';
            break;
        case 'ArrowLeft':
            if (snakeP2.direction !== 'right') snakeP2.nextDirection = 'left';
            break;
        case 'ArrowDown':
            if (snakeP2.direction !== 'up') snakeP2.nextDirection = 'down';
            break;
        case 'ArrowRight':
            if (snakeP2.direction !== 'left') snakeP2.nextDirection = 'right';
            break;
        case 'Shift':
            if (e.location === 2) { // Right Shift
                snakeP2.isBoost = true;
            }
            break;
    }
}

// Key up handler for boost
window.addEventListener('keyup', function(e) {
    if (e.key === 'Shift') {
        if (e.location === 1) { // Left Shift
            snakeP1.isBoost = false;
        } else if (e.location === 2) { // Right Shift
            snakeP2.isBoost = false;
        }
    }
});

// Apply selected theme
function applyTheme(theme) {
    document.body.classList.remove('space-theme', 'jungle-theme', 'neon-theme');
    document.body.classList.add(theme + '-theme');
    
    // Update theme selectors
    document.getElementById('theme-select').value = theme;
    document.getElementById('start-theme-select').value = theme;
    
    currentTheme = theme;
    
    // Reset the background animations
    const starsElement = document.querySelector('.stars');
    if (starsElement) starsElement.innerHTML = '';
    
    const leavesElement = document.querySelector('.leaves');
    if (leavesElement) leavesElement.innerHTML = '';
    
    const neonLightsElement = document.querySelector('.neon-lights');
    if (neonLightsElement) neonLightsElement.innerHTML = '';
}

// Start the game
function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    resetGame();
    gameLoop = setInterval(update, GAME_SPEED);
}

// Restart the game
function restartGame() {
    document.getElementById('gameOver').classList.remove('active');
    resetGame();
    gameLoop = setInterval(update, GAME_SPEED);
}

// Reset the game state
function resetGame() {
    // Reset Player 1 Snake
    snakeP1.body = [];
    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
        snakeP1.body.push({ x: Math.floor(canvas.width / GRID_SIZE / 4) - i, y: Math.floor(canvas.height / GRID_SIZE / 2) });
    }
    snakeP1.direction = 'right';
    snakeP1.nextDirection = 'right';
    snakeP1.score = 0;
    snakeP1.isDead = false;
    snakeP1.isBoost = false;
    
    // Reset Player 2 Snake
    snakeP2.body = [];
    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
        snakeP2.body.push({ x: Math.floor(canvas.width / GRID_SIZE * 3/4) + i, y: Math.floor(canvas.height / GRID_SIZE / 2) });
    }
    snakeP2.direction = 'left';
    snakeP2.nextDirection = 'left';
    snakeP2.score = 0;
    snakeP2.isDead = false;
    snakeP2.isBoost = false;
    
    // Reset food
    placeFood();
    
    // Reset bonus food
    bonusFood.isActive = false;
    bonusFood.timer = 0;
    bonusFood.x = -1;
    bonusFood.y = -1;
    
    // Update UI
    updateScores();
}

// Update scores display
function updateScores() {
    document.getElementById('scoreValueP1').textContent = snakeP1.score;
    document.getElementById('scoreValueP2').textContent = snakeP2.score;
}

// Place food randomly on the grid
function placeFood() {
    let foodPlaced = false;
    
    while (!foodPlaced) {
        food.x = Math.floor(Math.random() * (canvas.width / GRID_SIZE));
        food.y = Math.floor(Math.random() * (canvas.height / GRID_SIZE));
        
        // Make sure food doesn't spawn on snakes
        let validPosition = true;
        
        // Check player 1 snake
        for (let segment of snakeP1.body) {
            if (segment.x === food.x && segment.y === food.y) {
                validPosition = false;
                break;
            }
        }
        
        // Check player 2 snake
        if (validPosition) {
            for (let segment of snakeP2.body) {
                if (segment.x === food.x && segment.y === food.y) {
                    validPosition = false;
                    break;
                }
            }
        }
        
        // Also check bonus food if active
        if (validPosition && bonusFood.isActive) {
            if (bonusFood.x === food.x && bonusFood.y === food.y) {
                validPosition = false;
            }
        }
        
        if (validPosition) {
            foodPlaced = true;
        }
    }
}

// Place bonus food randomly
function placeBonusFood() {
    let foodPlaced = false;
    
    while (!foodPlaced) {
        bonusFood.x = Math.floor(Math.random() * (canvas.width / GRID_SIZE));
        bonusFood.y = Math.floor(Math.random() * (canvas.height / GRID_SIZE));
        
        // Make sure bonus food doesn't spawn on snakes or regular food
        let validPosition = true;
        
        // Check regular food
        if (bonusFood.x === food.x && bonusFood.y === food.y) {
            validPosition = false;
        }
        
        // Check player 1 snake
        if (validPosition) {
            for (let segment of snakeP1.body) {
                if (segment.x === bonusFood.x && segment.y === bonusFood.y) {
                    validPosition = false;
                    break;
                }
            }
        }
        
        // Check player 2 snake
        if (validPosition) {
            for (let segment of snakeP2.body) {
                if (segment.x === bonusFood.x && segment.y === bonusFood.y) {
                    validPosition = false;
                    break;
                }
            }
        }
        
        if (validPosition) {
            foodPlaced = true;
        }
    }
    
    bonusFood.isActive = true;
    bonusFood.timer = 150; // Bonus food will disappear after 150 frames (approx. 15 seconds)
}

// Main game update loop
function update() {
    // Update snake positions
    moveSnake(snakeP1);
    moveSnake(snakeP2);
    
    // Check for collisions
    checkCollisions();
    
    // Handle bonus food timer
    if (bonusFood.isActive) {
        bonusFood.timer--;
        if (bonusFood.timer <= 0) {
            bonusFood.isActive = false;
            bonusFood.x = -1;
            bonusFood.y = -1;
        }
    } else if (Math.random() < 0.005) { // 0.5% chance each frame to spawn bonus food
        placeBonusFood();
    }
    
    // Draw the game
    draw();
    
    // Check for game over
    if (snakeP1.isDead && snakeP2.isDead) {
        endGame();
    }
}

// Move snake based on direction
function moveSnake(snake) {
    if (snake.isDead) return;
    
    // Apply next direction
    snake.direction = snake.nextDirection;
    
    // Calculate new head position
    const head = { x: snake.body[0].x, y: snake.body[0].y };
    
    switch(snake.direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }
    
    // Add new head to beginning of snake body
    snake.body.unshift(head);
    
    // Check if snake ate food
    let ate = false;
    
    // Check regular food
    if (head.x === food.x && head.y === food.y) {
        snake.score += food.value;
        updateScores();
        placeFood();
        ate = true;
    }
    
    // Check bonus food
    if (bonusFood.isActive && head.x === bonusFood.x && head.y === bonusFood.y) {
        snake.score += bonusFood.value;
        updateScores();
        bonusFood.isActive = false;
        bonusFood.x = -1;
        bonusFood.y = -1;
        ate = true;
    }
    
    // If snake didn't eat, remove tail
    if (!ate) {
        snake.body.pop();
    }
}

// Check for collisions
function checkCollisions() {
    checkSnakeCollisions(snakeP1);
    checkSnakeCollisions(snakeP2);
}

// Check collision for a specific snake
function checkSnakeCollisions(snake) {
    if (snake.isDead) return;
    
    const head = snake.body[0];
    
    // Check wall collision
    if (head.x < 0 || head.x >= canvas.width / GRID_SIZE || 
        head.y < 0 || head.y >= canvas.height / GRID_SIZE) {
        snake.isDead = true;
        return;
    }
    
    // Check self collision
    for (let i = 1; i < snake.body.length; i++) {
        if (head.x === snake.body[i].x && head.y === snake.body[i].y) {
            snake.isDead = true;
            return;
        }
    }
    
    // Check collision with other snake
    const otherSnake = snake === snakeP1 ? snakeP2 : snakeP1;
    
    for (let segment of otherSnake.body) {
        if (head.x === segment.x && head.y === segment.y) {
            snake.isDead = true;
            return;
        }
    }
}

// Draw the game
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw theme-specific background elements
    drawThemeElements();
    
    // Draw snakes
    drawSnake(snakeP1);
    drawSnake(snakeP2);
    
    // Draw food
    drawFood();
    
    // Draw bonus food if active
    if (bonusFood.isActive) {
        drawBonusFood();
    }
}

// Draw theme-specific background elements
function drawThemeElements() {
    switch(currentTheme) {
        case 'space':
            drawStars();
            break;
        case 'jungle':
            drawLeaves();
            break;
        case 'neon':
            drawNeonLights();
            break;
    }
}

// Draw stars for space theme
function drawStars() {
    ctx.fillStyle = 'white';
    for (let star of stars) {
        ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.001 * star.twinkleSpeed) * 0.5;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

// Draw leaves for jungle theme
function drawLeaves() {
    ctx.fillStyle = '#64a338';
    for (let leaf of leaves) {
        leaf.y += leaf.speed;
        leaf.rotation += leaf.speed;
        
        if (leaf.y > canvas.height) {
            leaf.y = -leaf.size;
            leaf.x = Math.random() * canvas.width;
        }
        
        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.rotation * Math.PI / 180);
        ctx.globalAlpha = 0.3;
        ctx.fillRect(-leaf.size/2, -leaf.size/2, leaf.size, leaf.size);
        ctx.restore();
    }
    ctx.globalAlpha = 1;
}

// Draw neon lights for neon theme
function drawNeonLights() {
    for (let light of neonLights) {
        ctx.globalAlpha = 0.3 + Math.sin(Date.now() * 0.001 * light.speed) * 0.1;
        ctx.fillStyle = light.color;
        ctx.beginPath();
        ctx.arc(light.x, light.y, light.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

// Draw a snake
function drawSnake(snake) {
    if (snake.isDead) {
        ctx.globalAlpha = 0.5; // Make dead snakes translucent
    }
    
    // Draw body segments
    for (let i = 0; i < snake.body.length; i++) {
        const segment = snake.body[i];
        
        // Different color for head
        if (i === 0) {
            ctx.fillStyle = snake.isBoost ? '#ffffff' : snake.color;
        } else {
            // Gradient effect for body
            const alpha = 1 - (i / snake.body.length * 0.6);
            ctx.fillStyle = snake.isBoost ? 
                `rgba(255, 255, 255, ${alpha})` : 
                `rgba(${hexToRgb(snake.color)}, ${alpha})`;
        }
        
        // Draw segment
        ctx.fillRect(
            segment.x * GRID_SIZE, 
            segment.y * GRID_SIZE, 
            GRID_SIZE - 1, 
            GRID_SIZE - 1
        );
    }
    
    ctx.globalAlpha = 1;
}

// Draw food
function drawFood() {
    ctx.fillStyle = food.color;
    ctx.beginPath();
    ctx.arc(
        food.x * GRID_SIZE + GRID_SIZE/2, 
        food.y * GRID_SIZE + GRID_SIZE/2, 
        GRID_SIZE/2, 
        0, 
        Math.PI * 2
    );
    ctx.fill();
}

// Draw bonus food
function drawBonusFood() {
    ctx.fillStyle = bonusFood.color;
    
    // Make it pulsate
    const pulsate = 1 + Math.sin(Date.now() * 0.01) * 0.2;
    
    // Star shape for bonus food
    drawStar(
        bonusFood.x * GRID_SIZE + GRID_SIZE/2,
        bonusFood.y * GRID_SIZE + GRID_SIZE/2,
        5,
        GRID_SIZE/2 * pulsate,
        GRID_SIZE/4 * pulsate
    );
}

// Draw a star shape (for bonus food)
function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    
    for(let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
}

// End the game
function endGame() {
    clearInterval(gameLoop);
    
    // Set final scores
    document.getElementById('finalScoreP1').textContent = snakeP1.score;
    document.getElementById('finalScoreP2').textContent = snakeP2.score;
    
    // Determine winner
    let winnerText;
    if (snakeP1.score > snakeP2.score) {
        winnerText = "Player 1 Wins!";
    } else if (snakeP2.score > snakeP1.score) {
        winnerText = "Player 2 Wins!";
    } else {
        winnerText = "It's a Tie!";
    }
    
    document.getElementById('winner').textContent = winnerText;
    
    // Show game over screen
    document.getElementById('gameOver').classList.add('active');
}

// Helper function: Convert hex color to RGB string
function hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse r, g, b values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `${r}, ${g}, ${b}`;
}

// Initialize the game when the window loads
window.addEventListener('load', function() {
    init();
    
    // Create background elements if they don't exist
    if (!document.querySelector('.stars')) {
        const starsDiv = document.createElement('div');
        starsDiv.className = 'stars';
        document.querySelector('.game-container').appendChild(starsDiv);
    }
    
    if (!document.querySelector('.leaves')) {
        const leavesDiv = document.createElement('div');
        leavesDiv.className = 'leaves';
        document.querySelector('.game-container').appendChild(leavesDiv);
    }
    
    if (!document.querySelector('.neon-lights')) {
        const neonLightsDiv = document.createElement('div');
        neonLightsDiv.className = 'neon-lights';
        document.querySelector('.game-container').appendChild(neonLightsDiv);
    }
});