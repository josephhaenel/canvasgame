const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw(){
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw(){
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw(){
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

const x = canvas.width / 2;
const y = canvas.height / 2;

const player = new Player(x, y, 30, 'blue');
const projectiles = []
const enemies = []

function spawnEnemies() {
    setInterval(() => {
        radius = Math.random() * (40 - 10) + 10;

        let x;
        let y;

        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }
        const color = 'green'

        const angle = Math.atan2(
        canvas.height / 2 - y, 
        canvas.width / 2 - x
    )

    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
        enemies.push(new Enemy(x, y, radius, color, velocity))
    }, 1000)
} 

let animationId
function animate() {
    animationId = requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    player.draw();
    projectiles.forEach((projectile, pIndex) => {
            projectile.update()

            if (projectile.x - projectile.radius < 0) {
                projectiles.splice(pIndex, 1) // Removes projectile from projectiles array 
            }
    })
    enemies.forEach((enemy, index) => {
        enemy.update()

        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        if (dist - enemy.radius - player.radius < -1e-10) {
            // End game
            cancelAnimationFrame(animationId)
        }

        projectiles.forEach((projectile, pIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

            // If bullet & enemy touch
            if (dist - enemy.radius - projectile.radius < 1) {
                // Remove projectile & enemy from screen
                setTimeout(() => {
                    enemies.splice(index, 1) // Removes enemy from enemies array
                    projectiles.splice(pIndex, 1) // Removes projectile from projectiles array 
                }, 0);
            }
        })
    })
}

addEventListener('click', (e) => {
    console.log(projectiles)
    const angle = Math.atan2(
        e.clientY - canvas.height / 2, 
        e.clientX - canvas.width / 2
    )
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
    projectiles.push(new Projectile(
        canvas.width / 2, 
        canvas.height / 2, 
        5, 
        'red', 
        velocity)
    )
})

animate()
spawnEnemies()
