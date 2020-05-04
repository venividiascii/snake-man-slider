const SCALE = 40;
const WIDTH = 600;
const HEIGHT = 600;
const GUI_HEIGHT = 40;
const X_TILES = 15;
const Y_TILES = 15;
const FRAME_RATE = 5;

// state variables
let score = 0;
let input_received = false;
let game_state = 0;

class Snake {
  constructor() {
	this.alive = true;
	this.maxLength = 3;
	this.body = [
	  {x: 1, y: 5},
      {x: 2, y: 5},
      {x: 3, y: 5}
    ]
    this.direction = {
      x: 1,
      y: 0
    }
  }
  move() {
	if (this.alive == false){return}
    let max = this.body.length - 1;
    this.body.push({
      x: this.body[max].x + this.direction.x,
      y: this.body[max].y + this.direction.y
	})
	  if (this.checkCollision()){
		  this.alive = false;
		  this.body.pop();
		  return;
		  
	  }

    if (this.body.length > this.maxLength) {
      this.body.shift();
    }
	input_received = false;
  }
  checkCollision() {
	//Edge-of-map collision
    let lastX = this.body.slice(-1)[0].x;
    let lastY = this.body.slice(-1)[0].y;
	if (lastX <= 0 || lastX >= X_TILES - 1){
		this.alive = false;
		return true;
	}
	if (lastY <= 0 || lastY >= Y_TILES - 1){
		this.alive = false;
		return true;
	}
	//Self collision
	let headPos = this.body.slice(-1)[0];
    for (let i = 0; i < this.body.length -1; i++) {
		if (lastX == this.body[i].x && lastY == this.body[i].y){
			this.alive = false;
			return true;
		}
	}
	return false;
  }
  isAppleEdible(apple) {
    let lastX = this.body.slice(-1)[0].x;
    let lastY = this.body.slice(-1)[0].y;
    if (apple.x == lastX && apple.y == lastY) {
      this.maxLength++;
	  score++;
      return true;
    }
  }
  draw() {
    for (let i = 0; i < this.body.length; i++) {
	  fill(
		128 + sin(i/2 + 3)*128,
		128 + sin(i/2 + 1.5)*128,
		128 + sin(i/2 + 0)*128	  
	  );
      rect(this.body[i].x * SCALE,
        this.body[i].y * SCALE,
        SCALE,
        SCALE)
    }
  }
  changeDirection(direction) {
	if (this.direction.x != -direction.x 
		&& this.direction.x != direction.x){
		if (this.direction.y != -direction.y){
		    input_received = true;
			this.direction = direction;
		}
	}
  }
}

class Apple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.isEaten = false;
  }
  move(isEaten) {
    if (isEaten) {
		let onSnake = true;
		while(onSnake){
			this.x = floor(random(1, X_TILES - 1));
			this.y = floor(random(1, Y_TILES - 1));
			for (let i = 0; i < snake.body.length; i++) {
				if ((this.x == snake.body[i].x && this.y == snake.body[i].y)){
					onSnake = true;
					break;
				}
				onSnake = false;
			}
		}
	}
  }
  draw() {
    fill(230, 0, 0);
	textAlign(CENTER, CENTER);
	textSize(30);
	text('🍎', this.x * SCALE+SCALE/2, this.y * SCALE+SCALE/2);
  }
}


let snake = new Snake();
let apple = new Apple(9, 9);

function setup() {
  createCanvas(WIDTH, HEIGHT + GUI_HEIGHT);
  frameRate(FRAME_RATE);
  //score = 0;
}

function draw() {
  background(20);
  //draw boarder
  noFill();
  strokeWeight(5);
  stroke(50, 50, 255);
  rect(SCALE, SCALE, WIDTH - SCALE*2, HEIGHT - SCALE*2);
  noStroke();
  
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(30);
  text('🐍 ' + (score +3) +'           🍎 ' + score, 0, HEIGHT, width);

 
  snake.checkCollision();
  snake.move();  
  snake.draw();
  
  let eaten = snake.isAppleEdible(apple);
  apple.move(eaten);
  apple.draw();
}


function keyPressed() {
  if (input_received) {return}

  let moveDir = {
    x: 0,
    y: 0
  }

  switch (keyCode) {
    case LEFT_ARROW:
      moveDir.x = -1;
      break;
    case RIGHT_ARROW:
      moveDir.x = 1;
      break;
    case UP_ARROW:
      moveDir.y = -1;
      break;
    case DOWN_ARROW:
      moveDir.y = 1;
      break;
  }

  snake.changeDirection(moveDir);
}