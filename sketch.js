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
  }