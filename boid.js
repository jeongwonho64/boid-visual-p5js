class Boid {
  constructor() {
    this.position = createVector(floor(random(0, width)), floor(random(0, height)));
    this.velocity = p5.Vector.random2D();
    this.acceleration = createVector();
    this.maxForce = 0.2;
    this.maxSpeed = 4;
    this.size = 5;
    this.alive = true;
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
    if(this.alive == false) return;
    // Draw a triangle rotated in the direction of velocity
    let theta = this.velocity.heading() + PI / 2;
    noFill();
    stroke(255, 50);
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

  separation(boids) {
    let perceptionRadius = 50;
    let steering = createVector();
    let total = 0;

    for (const other of boids) {
      let distance = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );

      if (other !== this && distance < perceptionRadius) {
        let difference = p5.Vector.sub(this.position, other.position);
        difference.div(distance);
        steering.add(difference);
        total++;
      }
    }

    if (total > 0) {
      steering.div(total); //redundant, but still
      steering.setMag(this.maxSpeed); //desired velocity
      steering.sub(this.velocity); //calculate force
      steering.limit(this.maxForce);
    }

    return steering;
  }

  cohesion(boids) {
    let perceptionRadius = 100;
    let steering = createVector();
    let total = 0;

    for (const other of boids) {
      let distance = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );

      if (other !== this && distance < perceptionRadius) {
        steering.add(other.position);
        total++;
      }
    }

    if (total > 0) {
      steering.div(total); //average
      steering.sub(this.position); //desired velocity
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity); //calculate force
      steering.limit(this.maxForce);
    }

    return steering;
  }

  alignment(boids) {
    let perceptionRadius = 50;
    let steering = createVector();
    let total = 0;

    for (const other of boids) {
      let distance = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );

      if (other !== this && distance < perceptionRadius) {
        steering.add(other.velocity);
        total++;
      }
    }

    if (total > 0) {
      steering.div(total); //average
      steering.setMag(this.maxSpeed); //desired velocity
      steering.sub(this.velocity); //calculate force
      steering.limit(this.maxForce);
    }

    return steering;
  }

  flock(boids) {
    let sep = this.separation(boids);
    let coh = this.cohesion(boids);
    let ali = this.alignment(boids);

    this.applyForce(sep);
    this.applyForce(coh);
    this.applyForce(ali);
  }
  
  // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  evade(target) {
		// A vector pointing from the location to the target
    let desired = p5.Vector.sub(target, this.position); 
    let d = desired.mag();
    
    // Steering = Desired minus Velocity
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);  // Limit to maximum steering force
    steer.mult(-1);
    this.applyForce(steer);
  }
  
  followLeader(leader, minDist){
    let leaderPos = createVector(leader.position.x, leader.position.y);
    let desired = p5.Vector.sub(leaderPos, this.position); 
    let d = desired.mag();
    
    // Steering = Desired minus Velocity
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);  
    if(d < minDist) steer = createVector(1,1);
    this.applyForce(steer);
  }
}
