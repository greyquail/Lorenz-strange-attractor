// Bright, zoomed-in Lorenz strange attractor in 3D.[web:274][web:279]

let x = 0.01, y = 0, z = 0;
const sigma = 10;
const rho   = 28;
const beta  = 8 / 3;

let dt = 0.01;
let pts = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(0);

  // Mouse orbit + wheel zoom.
  orbitControl();                       // [web:201]

  // Stronger auto‑spin.
  rotateY(frameCount * 0.003);
  rotateX(frameCount * 0.002);

  // Integrate more steps per frame for dense ribbon.
  for (let i = 0; i < 40; i++) {
    const dx = sigma * (y - x) * dt;
    const dy = (x * (rho - z) - y) * dt;
    const dz = (x * y - beta * z) * dt;

    x += dx;
    y += dy;
    z += dz;

    const hue = (frameCount * 3 + pts.length * 0.2) % 360;
    pts.push({ v: createVector(x, y, z), h: hue });
  }

  // Zoom in a lot so it's visible on phone.
  scale(min(width, height) * 0.2);      // larger than before

  // Bright, thick ribbon.
  noFill();
  beginShape();
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    stroke(p.h, 100, 100);              // max saturation & brightness
    strokeWeight(0.5);                  // thick lines
    vertex(p.v.x, p.v.y, p.v.z);
  }
  endShape();

  // Limit trail length to keep it crisp.
  if (pts.length > 8000) {
    pts.splice(0, pts.length - 8000);
  }
}
