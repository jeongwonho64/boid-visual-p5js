class Leader {
    constructor() {
      this.position = createVector(
        floor(random(0, width)),
        floor(random(0, height))
      );
      this.velocity = p5.Vector.random2D();
      this.acceleration = createVector();
      this.maxForce = 0.2;
      this.maxSpeed = 4;
      this.size = 5;
      this.forceOnLeader = createVector(0, 0);
    }
  
    update() {
      this.position.add(this.velocity);
      this.velocity.add(this.acceleration);
      this.velocity.limit(this.maxSpeed);
      this.acceleration.mult(0);
  
      // Wrap around the canvas
      if (this.position.x > width) {
        this.position.x = 0;
      } else if (this.position.x < 0) {
        this.position.x = width;
      }
      if (this.position.y > height) {
        this.position.y = 0;
      } else if (this.position.y < 0) {
        this.position.y = height;
      }
    }
  
    applyForce(force) {
      this.acceleration.add(force);
    }
  
    show() {
      // Draw a triangle rotated in the direction of velocity
      let theta = this.velocity.heading() + PI / 2;
      noFill();
      stroke(color("gold"));
      strokeWeight(2);
      push();
      translate(this.position.x, this.position.y);
      rotate(theta);
      beginShape();
      vertex(0, -this.size * 2);
      vertex(-this.size, this.size * 2);
      vertex(this.size, this.size * 2);
      endShape(CLOSE);
      pop();
    }
  
    control(controlSensitivity) {
      let s = controlSensitivity;
      if (keyIsDown(RIGHT_ARROW)) this.forceOnLeader = createVector(s, 0);
      if (keyCode == LEFT_ARROW) this.forceOnLeader = createVector(-s, 0);
      if (keyCode == UP_ARROW) this.forceOnLeader = createVector(0, -s);
      if (keyCode == DOWN_ARROW) this.forceOnLeader = createVector(0, s);
      leader.applyForce(this.forceOnLeader);
    }
  }
  