let flock = [];
let predators = [];
let leader;

const initBoids = 100;
const initPredators = 10;
const controlSensitivity = 0.2;
const minimumDistance = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);

  leader = new Leader();
  for (let i = 0; i < initBoids; i++) {
    flock.push(new Boid());
  }
  
  for(let i = 0; i < initPredators; i++){
    predators.push(new Predator());
  }
}

function draw() {
  background(51);

  leader.update();
  leader.show();
  leader.control(controlSensitivity);
  
  for (let boid of flock) {
     boid.applyForce(leader.forceOnLeader)
     boid.flock(flock);
     boid.update();
     boid.show();
  }
  
 for(let predator of predators){
    predator.update(flock);
    predator.show();
    for(let boid of flock) if(predator.eating(boid.position.x, boid.position.y, boid.size)) boid.alive = false;
      
  }
  
}
