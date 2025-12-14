// Zoomable, bright Lorenz strange attractor in 3D.[web:274][web:279]

let x = 0.01, y = 0, z = 0;
const sigma = 10;
const rho   = 28;
const beta  = 8 / 3;

let dt = 0.01;
let pts = [];

// zoom factor we control ourselves (not orbitControl)
let zoom = 0.12;   // starting zoom (scene scale)

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, WEBGL);
}

// mouse wheel: strong zoom in/out around center[web:68][web:288]
function mouseWheel(event) {
  const factor = event.deltaY > 0 ? 0.8 : 1.25; // scroll down = zoom out
  zoom *= factor;
  zoom = constrain(zoom, 0.02, 0.4);           // 0.02 = far, 0.4 = close
  return false;
}

function draw() {
  background(0);

  // orbitControl: rotation & pan only; zoom disabled (third arg = 0).[web:201]
  orbitControl(1, 1, 0);

  // gentle auto-rotation so it "dances"
  rotateY(frameCount * 0.003);
  rotateX(frameCount * 0.002);

  // integrate many steps per frame for a dense ribbon
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

  // apply our own zoom (only place scale is used)
  scale(min(width, height) * zoom);

  // bright, thick ribbon that stays visible when zoomed out
  noFill();
  beginShape();
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    stroke(p.h, 100, 100);    // vivid color
    strokeWeight(0.4);        // clearly visible lines
    vertex(p.v.x, p.v.y, p.v.z);
  }
  endShape();

  // limit trail length to keep drawing crisp
  if (pts.length > 8000) {
    pts.splice(0, pts.length - 8000);
  }
}
