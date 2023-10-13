let objs = [];
let objsNum = 360;
const noiseScale = 0.01;
let R;
let maxR;
let t = 0;
let nt = 0;
let nR = 0;
let nTheta = 1000;
const palette = ["#ACDEED55", "#EAD5E855", "#84C0E755", "#38439955"];

let points_received = false;

let bgImg;

function preloadpic() {
    bgImg = loadImage("pic/test.png");
}

/* load mouse before calling setup */
// let data;
// function preload() {
//     data = loadJSON("data.json")
// }


function fetchPoints() {
    return new Promise((resolve, reject) => {
      fetch("http://127.0.0.1:12345",{mode:'cors'})
        .then((response) => response.json())
        .then((points) => {
          for (let point of points) {
            objs.push(new Obj(point[0], point[1]));
          }
          points_received = true;
          resolve();
        })
        .catch((error) => {
          console.error("Error fetching points:", error);
          reject(error);
        });
    });
  }
  
  
  function processPoints() {
    points_received = false;
    fetchPoints()
      .then(() => {
        console.log("Points received and processed.");
        points_received = true;
      })
      .catch((error) => {
        console.error("Error in processPoints:", error);
      });
  }

function setup() {
    /* Location of canva: */
    var cnv = createCanvas(2560 * 2 / 3, 1440 * 2 / 3);
    var x = (2560 - width) * 9 / 10;
    var y = (1440 - height) * 2 / 3;
    cnv.position(x, y);

    console.log(x,y)


    angleMode(DEGREES);
    noStroke();


    

    maxR = max(width, height) * 0.45;
    processPoints();

    /* background("#ffffff"); */
}

function draw() {

    if (points_received){
        let R = map(noise(nt * 0.01, nR), 0, 1, 0, maxR);
        let t = map(noise(nt * 0.001, nTheta), 0, 1, -360, 360);
        let x = R * cos(t) + width / 2;
        let y = R * sin(t) + height / 2;
      // objs.push(new Obj(x, y));
    
      //If mouse id pressed:
      //if (mouseIsPressed) {
      //  objs.push(new Obj(mouseX, mouseY));
      //}
      //objs.push(new Obj(mouseX, mouseY));
    
      
      // draw separate path for every points
        for (let i = 0; i < objs.length; i++) {
          objs[i].move();
    
          objs[i].display();
        }
    
        for (let j = objs.length - 1; j >= 0; j--) {
          if (objs[j].isFinished()) {
            objs.splice(j, 1);
          }
        }
    
      // t++;
        nt++;
      }
}

class Obj {
    constructor(ox, oy) {
        this.init(ox, oy);
    }

    init(ox, oy) {
        this.vel = createVector(0, 0);
        this.pos = createVector(ox, oy);
        this.t = random(0, noiseScale);
        this.lifeMax = random(20, 50);
        this.life = this.lifeMax;
        this.step = random(0.1, 0.5);
        this.dMax = random(10) >= 5 ? 10 : 30;
        this.d = this.dMax;
        this.c = color(random(palette));
    }

    move() {
        let theta = map(noise(this.pos.x * noiseScale, this.pos.y * noiseScale, this.t), 0, 1, -360, 360);
        this.vel.x = cos(theta);
        this.vel.y = sin(theta);
        this.pos.add(this.vel);
    }

    isFinished() {
        this.life -= this.step;
        this.d = map(this.life, 0, this.lifeMax, 0, this.dMax);
        if (this.life < 0) {
            return true;
        } else {
            return false;
        }
    }

    display() {
        fill(this.c);

        circle(this.pos.x, this.pos.y, this.d);
    }
}

function func(t, num) {
    let a = 360 / num;
    let A = cos(a);
    let b = acos(cos(num * t));
    let B = cos(a - b / num);

    return A / B;
}