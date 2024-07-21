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
    
    // A method that calculates a steering force towards a target
    // STEER = DESIRED MINUS VELOCITY
    seek(target) {
          // A vector pointing from the location to the target
      
      let desired = this.position.sub(target); 
      let d = desired.mag();
  
      // Steering = Desired minus Velocity
      let steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);  // Limit to maximum steering force
      this.applyForce(steer);
      
    }
    
    //checks if a predator is hitting the boid passed to the function 
    eating(boidX, boidY, size) {
      if(boidX == null) console.log("null");
      let boidP1 = createVector(boidX,  boidY - size*2);
      let boidP2 = createVector(boidX - size, boidY + size * 2);
      let boidP3 = createVector(boidX + size, boidY + size * 2);
      let boidPoints = [boidP1, boidP2, boidP3];
      
      let predatorP1 = createVector(this.position.x, this.position.y - this.size * 2);
      let predatorP2 = createVector(this.position.x - this.size, this.position.y + this.size * 2);
      let predatorP3 = createVector(this.position.x + this.size, this.position.y + this.size * 2);
       let predatorPoints = [predatorP1, predatorP2, predatorP3];
      
      return this.polyPoly(boidPoints, predatorPoints);
    }  
    
    polyPoly(p1, p2) {
  
    // go through each of the vertices, plus the next
    // vertex in the list
    let next = 0;
    for (let current = 0; current < p1.length; current++) {
  
      // get next vertex in list
      // if we've hit the end, wrap around to 0
      next = current+1;
      if (next == p1.length) next = 0;
  
      // get the PVectors at our current position
      // this makes our if statement a little cleaner
      let vc = p1[current];    // c for "current"
      let vn = p1[next];       // n for "next"
  
      // now we can use these two points (a line) to compare
      // to the other polygon's vertices using polyLine()
      let collision = this.polyLine(p2, vc.x,vc.y,vn.x,vn.y);
      if(collision) return true; //<------problem line
    }
  
    return false;
  }
  
  
  // POLYGON/LINE
   polyLine(vertices, x1, y1, x2, y2) {
  
    // go through each of the vertices, plus the next
    // vertex in the list
    let next = 0;
    for (let current = 0; current < vertices.length; current++) {
  
      // get next vertex in list
      // if we've hit the end, wrap around to 0
      next = current+1;
      if (next == vertices.length) next = 0;
  
      // get the PVectors at our current position
      // extract X/Y coordinates from each
      let x3 = vertices[current].x;
      let y3 = vertices[current].y;
      let x4 = vertices[next].x;
      let y4 = vertices[next].y;
  
      // do a Line/Line comparison
      // if true, return 'true' immediately and
      // stop testing (faster)
      let hit = this.lineLine(x1, y1, x2, y2, x3, y3, x4, y4);
      if (hit) return true;
    }
  
    // never got a hit
    return false;
  }
  
  
  // LINE/LINE
   lineLine(x1, y1, x2, y2, x3, y3, x4, y4) {
  
    // calculate the direction of the lines
    let uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
    let uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  
    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) return true;
    return false;
  }
    
  }
  
  
  