// Zoomable, bright Lorenz strange attractor in 3D.[web:274][web:279]

let x = 0.01, y = 0, z = 0;
const sigma = 10;
const rho   = 28;
const beta  = 8 / 3;

let dt = 0.01;
let pts = [];

// global zoom factor controlled by mouse wheel
let zoom = 0.2;   // starting zoom (scene scale)

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, WEBGL);
}

// mouse wheel: zoom in/out around center[web:201][web:244]
function mouseWheel(event) {
  const factor = event.deltaY > 0 ? 0.9 : 1.1; // down = zoom out
  zoom *= factor;
  zoom = constrain(zoom, 0.02, 0.6);          // allow far out and fairly close
  return false;
}

function draw() {
  background(0);

  // orbitControl: drag to orbit, right‑drag / two‑finger to pan, wheel to move camera.[web:201]
  orbitControl();

  // gentle auto rotation
  rotateY(frameCount * 0.003);
  rotateX(frameCount * 0.002);

  // integrate many steps per frame
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

  // scale using zoom so user can see whole figure or details
  scale(min(width, height) * zoom);

  // bright, reasonably thick ribbon
  noFill();
  beginShape();
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    stroke(p.h, 100, 100);    // vivid color
    strokeWeight(0.35);       // clear at both near and far zoom
    vertex(p.v.x, p.v.y, p.v.z);
  }
  endShape();

  // limit trail length so it stays crisp
  if (pts.length > 8000) {
    pts.splice(0, pts.length - 8000);
  }
}
