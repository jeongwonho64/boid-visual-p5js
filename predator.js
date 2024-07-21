class Predator {
    constructor() {
      this.position = createVector(floor(random(0, width)), floor(random(0, height)));
      this.velocity = p5.Vector.random2D();
      this.acceleration = createVector();
      this.maxForce = 0.2;
      this.maxSpeed = 5;
      this.size = 10;
      this.colors = [color("red"), color("green"), color("blue"), color("yellow"), color("orange"), color("white"), color("black")];
      this.c = random(this.colors);
    }
    
    update(boids) {
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
      
      //seek the nearest boid
      let minDist = Infinity;
      let closestBoid = boids[0];
      let distance = 0;
      
      for(let i = 0; i < boids.length; i++){
        distance = dist(
          this.position.x,
          this.position.y,
          boids[0].position.x,
          boids[0].position.y
        );
        if (distance < minDist) closestBoid = boids[i]; 
      }
  
      let closestBoidPosition = createVector(closestBoid.position.x, closestBoid.position.y)
     // this.seek(closestBoidPosition);
      
      this.velocity.limit(this.maxSpeed);
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
      stroke(color("red"), 50);
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

}