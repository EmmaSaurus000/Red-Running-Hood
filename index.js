// Red Running Hood
// Emma Saurus
// 31 January 2022

// Tutorial: Chris Courses, "HTML5 Canvas and JavaScript Mario Game Tutorial"
// https://www.youtube.com/watch?v=4q2vvZn5aoo 

// Red Riding Hood sprites purchased from user "Legnops" at itch.io
// https://legnops.itch.io/red-hood-character 

// load sprites and set constants
const title = new Image()
title.src =  './img/title.png'

const platform_image = new Image()
platform_image.src =  './img/platform.png'

const platform_image_sm = new Image()
platform_image_sm.src =  './img/platformSmallTall.png'

const hills_image = new Image()
hills_image.src =  './img/hills.png'

const background_image = new Image()
background_image.src =  './img/background.png'

const win_image = new Image()
win_image.src = './img/you_win.png'

const loss_image = new Image()
loss_image.src = './img/you_died.png'

const stand = new Image()
stand.src = './img/red_stand.png'

const run_left = new Image()
run_left.src = './img/red_run_left.png'

const run_right = new Image()
run_right.src = './img/red_run_right.png'

const jump_left = new Image()
jump_left.src = './img/red_jump_left.png'

const jump_right = new Image()
jump_right.src = './img/red_jump_right.png'

const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d')
console.log(c)

let start = true

canvas.width = 1024
canvas.height = 576

const gravity = 0.5
let scroll_offset = 0


// classes: Player, Platform, Backdrop
class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        }

        this.width = 80
        this.height = 80
        this.speed = 5
        this.velocity = {
            x: 0,
            y: 1
        }
        
        // animation properties
        this.frame_count = 0
        this.current_frame = 0
        
        this.sprites = {
            standing: {
                image: stand, 
                pixel_offset: 80,
                num_frames: 17,
                modulo: 3,
            },
            running: {
                right: run_right, 
                left: run_left,
                pixel_offset: 80, //112, //133,
                num_frames: 24,
                modulo: 1
            },
            jumping: {
                right: jump_right, 
                left: jump_left,
                pixel_offset: 80, //112, //133,
                num_frames: 17,
                modulo: 5
            }
        }
        // set default animation properties
        this.current_sprite = this.sprites.standing.image
        this.current_pixel_offset = this.sprites.standing.pixel_offset
        this.current_num_frames = this.sprites.standing.num_frames
        this.modulo = this.sprites.standing.modulo
        
        this.jumping_bool = false
        console.log('player created')
    }

    set_stand() {
        // set idle animation properties
        this.current_sprite = this.sprites.standing.image
        this.current_pixel_offset = this.sprites.standing.pixel_offset
        this.current_num_frames = this.sprites.standing.num_frames
        this.modulo = this.sprites.standing.modulo
        this.frame_count = 0
    }

    set_run_right() {
        // set running animation properties
        if (on_ground == true) {
            this.current_sprite = this.sprites.running.right
            this.current_pixel_offset = this.sprites.running.pixel_offset
            this.current_num_frames = this.sprites.running.num_frames
            this.modulo = this.sprites.running.modulo
            this.frame_count = 0
        }
    }

    set_run_left() {
        // set running animation properties
        if (on_ground == true) {
            this.current_sprite = this.sprites.running.left
            this.current_pixel_offset = this.sprites.running.pixel_offset
            this.current_num_frames = this.sprites.running.num_frames
            this.modulo = this.sprites.running.modulo
            this.frame_count = 0
        }
    }
    
    set_jump() {
        // set jumping animation properties
        this.jumping_bool = true
        if (keys.left.pressed == true) {
            this.current_sprite = this.sprites.jumping.left
        }
        else {
            this.current_sprite = this.sprites.jumping.right
        }
        this.current_pixel_offset = this.sprites.jumping.pixel_offset
        this.current_num_frames = this.sprites.jumping.num_frames
        this.modulo = this.sprites.jumping.modulo
        this.frame_count = 0
    }

    draw() {
        c.drawImage(this.current_sprite, 
            // cropping args: top left corner - x, y; lower right corner - x margin of sprite * frame #, sprite height
            this.current_pixel_offset * this.current_frame, 0, this.current_pixel_offset, this.height,
            this.position.x, this.position.y,
            this.width, this.height)
    }

    check_gravity() {
        // stop player falling when player lands on a platform
        this.position.y += this.velocity.y
        if (platforms.some(platform => 
                player.position.y + (player.height -26) <= platform.position.y
                && player.position.y + (player.height -26) + player.velocity.y >= platform.position.y
                && player.position.x + player.width -35 >= platform.position.x
                && player.position.x <= platform.position.x + platform.width - (player.width / 4)
            )) {
                player.velocity.y = 0
                on_ground = true

                // ensure jump animation changes appropriately on landing, even if key is not pressed
                if (this.jumping_bool !== false) {
                    this.jumping_bool = false
                    if (keys.right.pressed == true) {
                        player.set_run_right()
                    }
                    else if (keys.left.pressed == true && player.velocity.x != 0) {
                        player.set_run_left()
                    }
                    else {
                        player.set_stand()
                    }
                }
        }
        // still falling
        else {
            this.velocity.y += gravity
            on_ground = false
        }
    }

    check_jump() {
        // prevent double-jumps
        if (on_ground != false) {
            player.velocity.y -= 15 
            on_ground = false
            this.set_jump()
        }
    }

    move() {
        // player sprite only moves between left and right margins; else platforms move
        this.position.x += this.velocity.x
        if (keys.right.pressed 
            && player.position.x < 700) {
            player.velocity.x = player.speed
        } else if (keys.left.pressed
            && player.position.x > 200) {
            player.velocity.x = -player.speed
        } else {
            player.velocity.x = player.velocity.x * 0.9
        }
    }

    update() {
        // display next animation frame differentially for each animation series
        this.frame_count += 1
        if (this.frame_count % this.modulo == 0){
            this.current_frame += 1
            if (this.current_frame > this.current_num_frames) {
                this.current_frame = 0
            }
        }
        this.draw()
        this.check_gravity()
    }
}


class Platform {
    constructor({x, y, image}) {
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = image.width
        this.height = image.height
        this.velocity = 0
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }

    smooth_moves() {
        // Move hills (midground) when player at left and right edges of frame
        if (keys.right.pressed 
            && player.position.x > 698) {
            this.velocity = -player.speed
        } else if (keys.left.pressed
            && player.position.x < 202) {
            this.velocity = player.speed
        } else {
            this.velocity = this.velocity * 0.9
        }
        this.position.x += this.velocity
    }

}


class Backdrop {
    constructor({x, y, image}) {
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = image.width
        this.height = image.height
        this.velocity = 0
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }

    smooth_moves() {
        // Move platforms when player at left and right edges of frame
        if (keys.right.pressed 
            && player.position.x > 698) {
            this.velocity = - player.speed / 3
        } else if (keys.left.pressed
            && player.position.x < 202) {
            this.velocity = player.speed / 3
        } else {
            this.velocity = this.velocity * 0.9
        }
        this.position.x += this.velocity
    }

}

// instantiate sprite and key-press variables
let player = ''
let platforms = []
let backdrops = []
let midgrounds = [] // hills
let on_ground = true // jump control
let keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}



function init() {
    // create sprites at start / restart
    player = new Player()

    platforms = [new Platform({x: -1, y: 470, image: platform_image}), 
        new Platform({x: 900, y: 470, image: platform_image}),
        new Platform({x: 1600, y: 420, image: platform_image_sm}),
        new Platform({x: 2100, y: 470, image: platform_image_sm}),
        new Platform({x: 2600, y: 470, image: platform_image}),
        new Platform({x: 3100, y: 470, image: platform_image_sm}),
        new Platform({x: 3500, y: 420, image: platform_image_sm})]

    backdrops = [new Backdrop({x: -1, y: -1, image: background_image})]

    midgrounds = [new Backdrop({x: -1, y: -1, image: hills_image}),
    new Backdrop({x: 300, y: 100, image: hills_image}),
    new Backdrop({x: 900, y: 150, image: hills_image}),
    new Backdrop({x: 1100, y: 0, image: hills_image})]

    // reset progress and key-press variables
    scroll_offset = 0
    on_ground = true
    keys = {
        right: {
            pressed: false
        },
        left: {
            pressed: false
        }
    }
}

function render_all() {
    backdrops.forEach((backdrop) => {
        backdrop.draw()  
      })

    midgrounds.forEach((midground) => {
        midground.smooth_moves()
    })

    midgrounds.forEach((midground) => {
      midground.draw()  
    })

    platforms.forEach((platform) => {
        platform.smooth_moves()
    })
    
    platforms.forEach((platform) => {
        platform.draw()
    })

}

// iterator variables for displaying win/lose/start messages
let counter = 0
let start_counter = 0

function check_win_loss_start() {
    // display title on start but not restart
    if (start !== false) {
        console.log('start was true')
        start_counter ++
        if (start_counter > 0 && start_counter < 75) {
            c.drawImage(title, 300, 50)
        }
        else {
            start = false
        }
    }
    // win condition
       if (scroll_offset > 3500) {
        console.log('You win')
        counter ++
        if (counter > 0 && counter < 75) {
            c.drawImage(win_image, 300, 150)
        }
        else {
            counter = 0
            init()
        }
    }
    // lose condition
    if (player.position.y > canvas.height) {
        console.log('You lose')
        counter ++
        if (counter > 0 && counter < 75) {
            c.drawImage(loss_image, 300, 150)
        }
        else {
            console.log('scroll')
            console.log(scroll_offset)
            counter = 0
            init()
        }
    }
}

function scroll_count() {
    // track player progress
    if (keys.right.pressed) {
        scroll_offset += 5
    } else if (keys.left.pressed) {
        scroll_offset -= 5
    }
}


function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    //c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)    
    player.move()
    render_all()
    player.update()
    scroll_count()
    check_win_loss_start()
}

init()
animate()

// keypress listeners
window.addEventListener('keydown', ({ keyCode }) => {
    switch (keyCode) {
        case 65:
            //console.log('left')
            keys.left.pressed = true
            player.set_run_left()
            break
        case 83:
            //console.log('down')
            break
        case 68:
            //console.log('right')
            keys.right.pressed = true
            player.set_run_right()
            break
        case 87:
            //console.log('up')
            player.check_jump()
            break
    }
}) 


window.addEventListener('keyup', ({ keyCode }) => {
    switch (keyCode) {
        case 65:
            //console.log('left')
            keys.left.pressed = false
            platforms.forEach((platform) => {
                platform.smooth_moves() 
            })
            player.set_stand()
            break
        case 83:
            //console.log('down')
            break
        case 68:
            //console.log('right')
            keys.right.pressed = false
            platforms.forEach((platform) => {
                platform.smooth_moves() 
            })
            player.set_stand()
            break
        case 87:
            //console.log('up')
            break
    }
}) 

