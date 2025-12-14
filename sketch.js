// Visually intense Lorenz strange attractor in 3D.
// Classic parameters give the butterfly‑wing shape. [web:274]

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
  orbitControl();                          // [web:201]

  // Slow auto‑spin for drama.
  rotateY(frameCount * 0.002);
  rotateX(frameCount * 0.001);

  // Integrate many steps per frame for a smooth ribbon.
  for (let i = 0; i < 20; i++) {
    const dx = sigma * (y - x) * dt;
    const dy = (x * (rho - z) - y) * dt;
    const dz = (x * y - beta * z) * dt;

    x += dx;
    y += dy;
    z += dz;

    const hue = (frameCount * 2 + pts.length * 0.1) % 360;
    pts.push({ v: createVector(x, y, z), h: hue });
  }

  // Center + scale into view.
  translate(0, 0, -50);
  scale(min(width, height) * 0.12);

  // Draw glowing ribbon.
  noFill();
  beginShape();
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    stroke(p.h, 90, 100);      // vivid color
    strokeWeight(0.25);        // thick ribbon
    vertex(p.v.x, p.v.y, p.v.z);
  }
  endShape();

  // Optional: cap trail length to keep it crisp.
  if (pts.length > 6000) {
    pts.splice(0, pts.length - 6000);
  }
}
