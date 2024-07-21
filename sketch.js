let leader;

function setup() {
    createCanvas(windowWidth, windowHeight);
  
    leader = new Leader();
}

function draw() {
    background(51);
  
    leader.update();
    leader.show();
    leader.control(controlSensitivity);
    
  }