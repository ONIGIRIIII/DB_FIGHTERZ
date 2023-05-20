const canvas = document.querySelector("canvas");

// setting canvas to 2d
const context = canvas.getContext("2d");

// setting canvas heigth and width
canvas.width = 1024;
canvas.height = 576;

// changing background of the canvas using canvas api method
// fillRect takes 4 argument (x-coordinate, y-coordinate , width , height)
// (0,0) being the top left corner of the canvas
context.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.2;


class backgroundSprite {
    constructor({ position, imageSrc, scale = 1, framesmax = 1, offset = { x: 0, y: 0 } }) {
        this.position = position;
        this.width = 50
        this.height = 100;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale
        this.framesmax = framesmax
        this.framesCurrent = 0
        this.frameselapsed = 0
        this.frameshold = 10
        this.offset = offset

    }

    draw() {
        context.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesmax),
            0,
            this.image.width / this.framesmax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesmax) * this.scale,
            this.image.height * this.scale)

    }

    update() {
        this.draw()
        this.frameselapsed++
        if (this.frameselapsed % this.frameshold === 0) {
            if (this.framesCurrent < this.framesmax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }
}

class Sprite extends backgroundSprite {
    constructor({ position, velocity, imageSrc, scale = 1, framesmax = 1, offset = { x: 0, y: 0 } }) {
        super({
            position,
            imageSrc,
            scale,
            framesmax,
            offset
        });
        this.velocity = velocity;
        this.width = 50
        this.height = 100;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 25
        }
        this.isAttacking
        this.health = 100
        this.framesCurrent = 0
        this.frameselapsed = 0
        this.frameshold = 10


    }


    // draw() {
    //     context.fillStyle = "red";
    //     context.fillRect(this.position.x, this.position.y, this.width, this.height);
    //     if (player.isAttacking) {
    //         context.fillStyle = "green";
    //         context.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
    //     }
    // }

    // draw_enemy() {
    //     context.fillStyle = "blue";
    //     context.fillRect(this.position.x, this.position.y, this.width, this.height);
    //     if (enemy.isAttacking) {
    //         context.fillStyle = "green";
    //         context.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
    //     }
    // }

    animateframes() {
        this.frameselapsed++
        if (this.frameselapsed % this.frameshold === 0) {
            if (this.framesCurrent < this.framesmax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }

    }

    update() {
        this.draw();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y > canvas.height - 50) {
            this.velocity.y = 0
        } else {
            this.velocity.y += 0.2;
        }
        this.animateframes();

    }

    attack() {
        this.isAttacking = true
        setTimeout(() =>
            this.isAttacking = false
            , 100);
    }

    // update_enemy() {
    //     this.draw();
    //     this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    //     this.attackBox.position.y = this.position.y

    //     this.position.x += this.velocity.x;
    //     this.position.y += this.velocity.y;

    //     if (this.position.y + this.height + this.velocity.y > canvas.height - 50) {
    //         this.velocity.y = 0
    //     } else {
    //         this.velocity.y += 0.2;
    //     }
    // }


}





const background = new backgroundSprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: "./img/bg.png",
});

const beerus = new backgroundSprite({
    position: {
        x: 200,
        y: 200
    },
    imageSrc: "./img/beerus_2.png",
    scale: 1,
    framesmax: 10
});


const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: "./img/goki.png",
    scale: 1.1,
    framesmax: 6,
    offset: {
        x: 0,
        y: 30
    }
});

const enemy = new Sprite({
    position: {
        x: canvas.width - 50,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: "./img/g21.png",
    scale: 1,
    framesmax: 6,
    offset: {
        x: 0,
        y: 40
    }
});




const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
};


// self referencing the same function over and over again
function animate() { // which function to loop over and over again
    window.requestAnimationFrame(animate);
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    // beerus.update();
    player.update();
    enemy.update();

    player.velocity.x = 0;
    if (keys.a.pressed) {
        player.velocity.x = -1;
    } else if (keys.d.pressed) {
        player.velocity.x = 1;
    }

    enemy.velocity.x = 0;
    if (keys.ArrowLeft.pressed) {
        enemy.velocity.x = -1;
    } else if (keys.ArrowRight.pressed) {
        enemy.velocity.x = 1;
    }

    if (collision({ p: player, e: enemy })
        && player.isAttacking) {
        player.isAttacking = false;
        enemy.health -= 20
        document.querySelector("#enemyHealth").style.width = `${enemy.health}%`;
    }

    if (collision({ p: enemy, e: player })
        && enemy.isAttacking) {
        enemy.isAttacking = false;
        player.health -= 20
        document.querySelector("#playerHealth").style.width = `${player.health}%`;
    }

}

animate();

function collision({ p, e }) {
    return (p.attackBox.position.x + p.attackBox.width >= e.position.x
        && p.attackBox.position.x <= e.position.x + e.width
        && p.attackBox.position.y + p.attackBox.height >= e.position.y
        && p.attackBox.position.y <= e.position.y + e.height)
}


window.addEventListener("keydown", function (event) {
    switch (event.key) {
        case "d":
            keys.d.pressed = true;
            break;
        case "a":
            keys.a.pressed = true;
            break;
        case "w":
            player.velocity.y = -10;
            break;
        case " ":
            player.attack();
            break;
        case "ArrowRight":
            keys.ArrowRight.pressed = true;
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = true;
            break;
        case "ArrowUp":
            enemy.velocity.y = -10;
            break;
        case "ArrowDown":
            enemy.attack();
            break;
    }
})

window.addEventListener("keyup", function (event) {
    switch (event.key) {
        case "d":
            keys.d.pressed = false;
            break;
        case "a":
            keys.a.pressed = false;
            break;
        case "w":
            keys.w.pressed = false;
            break;
        case "ArrowRight":
            keys.ArrowRight.pressed = false;
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;
            break;
        case "ArrowUp":
            keys.ArrowUp.pressed = false;
            break;

    }

})