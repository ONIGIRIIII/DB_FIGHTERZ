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
        this.draw()
        this.animateframes();
    }
}

class Sprite extends backgroundSprite {
    constructor({ position, velocity, imageSrc, scale = 1, framesmax = 1, offset = { x: 0, y: 0 }, sprites, attackBox = { offset: {}, width: 100, height: 50 } }) {
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
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.isAttacking
        this.health = 100
        this.framesCurrent = 0
        this.frameselapsed = 0
        this.frameshold = 15
        this.sprites = sprites

        for (const sprite in sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }


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



    update() {
        this.draw();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        // context.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

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
        this.switchsprites("attack")
        this.isAttacking = true
        setTimeout(() =>
            this.isAttacking = false
            , 100);
    }

    takehit() {
        this.switchsprites("hit");
        this.health -= 5
    }

    switchsprites(sprite) {
        if (this.image === this.sprites.attack.image && this.framesCurrent < this.sprites.attack.framesmax - 1) return
        if (this.image === this.sprites.hit.image && this.framesCurrent < this.sprites.hit.framesmax - 1) return
        switch (sprite) {
            case "idle":
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.framesmax = this.sprites.idle.framesmax
                    this.framesCurrent = 0
                }

                break;
            case "run":
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.framesmax = this.sprites.run.framesmax
                    this.framesCurrent = 0
                }
                break;
            case "jump":
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.framesmax = this.sprites.jump.framesmax
                    this.framesCurrent = 0
                }
                break;
            case "fall":
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image
                    this.framesmax = this.sprites.fall.framesmax
                    this.framesCurrent = 0
                }
                break;
            case "attack":
                if (this.image !== this.sprites.attack.image) {
                    this.image = this.sprites.attack.image
                    this.framesmax = this.sprites.attack.framesmax
                    this.framesCurrent = 0
                }
                break;
            case "hit":
                if (this.image !== this.sprites.hit.image) {
                    this.image = this.sprites.hit.image
                    this.framesmax = this.sprites.hit.framesmax
                    this.framesCurrent = 0
                }
                break;

        }

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
        x: 200,
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
    imageSrc: "./img/f_idle.png",
    scale: 1.2,
    framesmax: 10,
    offset: {
        x: 100,
        y: 40
    },
    sprites: {
        idle: {
            imageSrc: "./img/f_idle.png",
            framesmax: 10
        },
        run: {
            imageSrc: "./img/f_run1.png",
            framesmax: 8
        },
        jump: {
            imageSrc: "./img/f_up1.png",
            framesmax: 4
        },
        fall: {
            imageSrc: "./img/f_down.png",
            framesmax: 3
        },
        attack: {
            imageSrc: "./img/f_aa.png",
            framesmax: 6
        },
        hit: {
            imageSrc: "./img/lmao_1.png",
            framesmax: 4
        }
    },
    attackBox: {
        offset: {
            x: 0,
            y: 0
        },
        width: 100,
        height: 50

    }
});

const enemy = new Sprite({
    position: {
        x: canvas.width - 300,
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
    imageSrc: "./img/cell_idle.png",
    scale: 1,
    framesmax: 4,
    offset: {
        x: 0,
        y: 70
    },
    sprites: {
        idle: {
            imageSrc: "./img/cell_idle.png",
            framesmax: 4
        },
        run: {
            imageSrc: "./img/cell_runn (1).png",
            framesmax: 10
        },
        jump: {
            imageSrc: "./img/cell_jumpy_up.png",
            framesmax: 4
        },
        fall: {
            imageSrc: "./img/cell_jumpy_fall.png",
            framesmax: 4
        },
        attack: {
            imageSrc: "./img/cell_a.png",
            framesmax: 6
        },
        hit: {
            imageSrc: "./img/lmao.png",
            framesmax: 4
        }
    }, attackBox: {
        offset: {
            x: 0,
            y: 0
        },
        width: 100,
        height: 50

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
    enemy.velocity.x = 0;


    if (keys.a.pressed) {
        player.velocity.x = -1;
        player.switchsprites("run")
    } else if (keys.d.pressed) {
        player.velocity.x = 1;
        player.switchsprites("run")
    } else {
        player.switchsprites("idle")
    }

    if (player.velocity.y < 0) {
        player.switchsprites("jump")
    } else if (player.velocity.y > 0) {
        player.switchsprites("fall")
    }



    if (keys.ArrowLeft.pressed) {
        enemy.velocity.x = -1;
        enemy.switchsprites("run")
    } else if (keys.ArrowRight.pressed) {
        enemy.velocity.x = 1;
        enemy.switchsprites("run")
    } else {
        enemy.switchsprites("idle")
    }

    if (enemy.velocity.y < 0) {
        enemy.switchsprites("jump")
    } else if (enemy.velocity.y > 0) {
        enemy.switchsprites("fall")
    }

    if (collision({ p: player, e: enemy })
        && player.isAttacking) {
        enemy.takehit();
        player.isAttacking = false;
        // enemy.health -= 5
        document.querySelector("#enemyHealth").style.width = `${enemy.health}%`;
    }

    if (collision({ p: enemy, e: player })
        && enemy.isAttacking) {
        player.takehit();
        enemy.isAttacking = false;
        // player.health -= 5
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


const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const close_modal = document.querySelector(".close-modal");
const open_modal = document.querySelectorAll(".show-modal");
console.log(open);

function hid() {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
}

for (let i = 0; i < open_modal.length; i++) {
    open_modal[i].addEventListener("click", function () {
        modal.classList.remove("hidden");
        overlay.classList.remove("hidden");
    })

    // close_modal.addEventListener("click", function () {
    //     modal.classList.add("hidden");
    //     overlay.classList.add("hidden");
    // })

    close_modal.addEventListener("click", hid);
    overlay.addEventListener("click", hid);
}

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        hid();
    }
})


