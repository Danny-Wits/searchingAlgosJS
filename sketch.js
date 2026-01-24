const BACKGROUND = 20;
let size = 20;
let map;
let backupMap;
let brushSizeSlider;
document.oncontextmenu = function () {
  return false;
};

window.onload = () => {
  size = JSON.parse(localStorage.getItem("size")) || 20;
  console.log(size);
  backupMap = JSON.parse(localStorage.getItem("map"));
  console.log(backupMap);
};

window.addEventListener("beforeunload", () => {
  localStorage.setItem("size", size);
  localStorage.setItem("map", JSON.stringify(map.getBoxData()));
});
function setup() {
  // frameRate(10);
  createCanvas(windowWidth, windowHeight);
  setMap(backupMap);

  let sizeSlider = createSlider(1, 100, size, 1);
  sizeSlider.input(() => {
    size = sizeSlider.value();
    setMap();
  });
  brushSizeSlider = createSlider(5, 100, 1, 1);
  const resetButton = createButton("Reset");
  resetButton.mousePressed(() => {
    map = new Map(size);
    setMap();
  });
  const controls = select("#controls");
  controls.child(createP("Size"));
  controls.child(sizeSlider);
  controls.child(createP("Brush Size"));
  controls.child(brushSizeSlider);
  controls.child(resetButton);
}

function setMap(boxData) {
  if (map && boxData) {
    map.setBoxData(boxData);
  } else {
    box_size = min(windowWidth - offsetX, windowHeight - offsetY) / size;
    map = new Map(size, size);
    if (boxData) {
      map.setBoxData(boxData);
    }
  }

  background(BACKGROUND);
  map.draw();
}
function isMobile() {
  return windowWidth < 860;
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setMap(map.getBoxData());
}

function draw() {
  fill(BACKGROUND);
  rect(0, 0, 50, 50);
  fill("lime");
  text(round(frameRate(), 2), 10, 40);
}

function doToCollidingBox(callback) {
  const mouse = new pRect(
    mouseX,
    mouseY,
    brushSizeSlider.value(),
    brushSizeSlider.value(),
  );
  map.foreach((box) => {
    if (rect_rect(new pRect(box.x, box.y, box_size, box_size), mouse))
      callback(box);
  });
}

function mouseDragged() {
  if (mouseButton == RIGHT)
    doToCollidingBox((box) => {
      box.setObstacle(false);
    });
  else
    doToCollidingBox((box) => {
      box.setObstacle(true);
    });
}
