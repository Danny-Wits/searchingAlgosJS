const BACKGROUND = 0;
let size = 20;
/** @type {Grid} */
let map;
let backupMap;
let brushSizeSlider;
let drawObstacleCheckbox;
let fpsCheckbox;
let audioCheckbox;
let canvasWidth, canvasHeight;
let CLICK_MODES = ["obstacle", "start", "end", "neighbour"];
let clickMode = CLICK_MODES[0];
let startBox, endBox;
document.oncontextmenu = function () {
  return false;
};

window.onload = () => {
  size = JSON.parse(localStorage.getItem("size")) || 20;
  console.log(size);
  backupMap = JSON.parse(localStorage.getItem("map"));
};

window.addEventListener("beforeunload", () => {
  localStorage.setItem("size", size);
  localStorage.setItem("map", JSON.stringify(map.getBoxData()));
});

function setup() {
  // frameRate(10);
  setUpCanvasDimensions();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(canvasContainer);
  setUpControls();
  setMap(backupMap);
  //sound
  oscillator = new p5.Oscillator("triangle");
  oscillator.amp(0.2);
  oscillator.freq(880);

  oscillatorLow = new p5.Oscillator("sine");
  oscillatorLow.amp(0.5);
  oscillatorLow.freq(200);
}
function setUpStartEnd() {
  startBox = null;
  endBox = null;
  map.boxes.forEach((box) => {
    if (box.isStart) {
      startBox = box;
    }
    if (box.isEnd) {
      endBox = box;
    }
  });
  console.log(startBox, endBox);
}
function setUpControls() {
  let sizeSlider = createSlider(1, 100, size, 1);
  sizeSlider.input(() => {
    size = sizeSlider.value();
    setMap();
  });
  brushSizeSlider = createSlider(5, 100, 1, 1);
  sleepTimeSlider = createSlider(0, 1000, 1, 1);
  const resetButton = createButton("Reset");
  resetButton.mousePressed(() => {
    resetMap();
  });
  const clearButton = createButton("Clear");
  clearButton.mousePressed(() => {
    map.clear();
  });
  fpsCheckbox = createCheckbox("Show FPS");
  fpsCheckbox.mouseClicked(() => {
    map.draw();
  });
  drawObstacleCheckbox = createCheckbox("Draw Obstacles");
  boxNumberCheckbox = createCheckbox("Show Box Number");
  boxNumberCheckbox.checked(showBoxNumber);
  boxNumberCheckbox.mouseClicked(() => {
    showBoxNumber = boxNumberCheckbox.checked();
    map.draw();
  });
  diagonalSearchCheckbox = createCheckbox("Diagonal Search");
  diagonalSearchCheckbox.checked(diagonalSearch);
  diagonalSearchCheckbox.mouseClicked(() => {
    diagonalSearch = diagonalSearchCheckbox.checked();
  });
  audioCheckbox = createCheckbox("Audio");
  const modeGroup = createDiv();
  modeGroup.id("modeGroup");
  for (let mode of CLICK_MODES) {
    const modeButton = createButton(mode);
    modeButton.id(mode);
    modeButton.mousePressed(() => {
      setMode(mode);
    });
    modeGroup.child(modeButton);
  }
  setMode(CLICK_MODES[3]);
  const controls = select("#controls");

  controls.child(createP("Mode"));
  controls.child(modeGroup);
  controls.child(createP("Size"));
  controls.child(sizeSlider);
  controls.child(createP("Brush Size"));
  controls.child(brushSizeSlider);
  controls.child(createP("Sleep Time"));
  controls.child(sleepTimeSlider);
  controls.child(fpsCheckbox);
  controls.child(drawObstacleCheckbox);
  controls.child(boxNumberCheckbox);
  controls.child(diagonalSearchCheckbox);
  controls.child(audioCheckbox);
  controls.child(createP("Algorithms "));
  for (let algo of ALGOS) {
    const algoButton = createButton(algo);
    algoButton.id(algo);
    algoButton.mousePressed(async () => {
      const callback = getCallbackForAlgo(algo);
      if (!startBox || !endBox || !map) {
        alert("Please set start and end box");
        return;
      }
      map.clear();
      if (isMobile()) {
        setTimeout(() => {
          scrollTo(0, 0);
        }, 100);
      }
      const parents = await callback(map, startBox, endBox);
      await sleep(500);
      drawPath(pathFormParents(parents, startBox, endBox));
    });
    controls.child(algoButton);
  }
  controls.child(clearButton);
  controls.child(resetButton);
}
function setMode(mode) {
  clickMode = mode;
  activeCheck();
}
function activeCheck() {
  for (let mode of CLICK_MODES) {
    const button = select("#" + mode);
    if (mode == clickMode) {
      button.class("activeMode");
    } else {
      button.class("");
    }
  }
}

function resetMap() {
  map = new Grid(size, size);
  setMap();
}
function setMap(boxData) {
  box_size = min(width - offsetX, height - offsetY) / size;
  map = new Grid(size, size);
  if (boxData) {
    map.setBoxData(boxData);
  }
  background(BACKGROUND);
  setUpStartEnd();
  map.draw();
}
function isMobile() {
  return windowWidth < 900;
}
function windowResized() {
  setUpCanvasDimensions();
  resizeCanvas(canvasWidth, canvasHeight);
  setMap(map.getBoxData());
}

function setUpCanvasDimensions() {
  const canvasContainer = select("#canvasContainer");
  if (isMobile()) {
    canvasContainer.height = canvasContainer.width;
  } else {
    canvasContainer.width = canvasContainer.height;
  }
  canvasWidth = canvasContainer.width;
  canvasHeight = canvasContainer.height;
}

function draw() {
  if (fpsCheckbox.checked()) drawFPS();
}
function drawFPS() {
  fill(BACKGROUND);
  rect(0, 0, 40, 40, 0, 0, 10, 0);
  fill("white");
  text(round(frameRate(), 2), 5, 25);
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
function getClickedBox() {
  const mouse = new pRect(
    mouseX,
    mouseY,
    brushSizeSlider.value(),
    brushSizeSlider.value(),
  );
  return map.boxes.find((box) =>
    rect_rect(new pRect(box.x, box.y, box_size, box_size), mouse),
  );
}

function mouseDragged() {
  if (!drawObstacleCheckbox.checked()) return;
  if (mouseButton == RIGHT)
    doToCollidingBox((box) => {
      box.setObstacle(false);
    });
  else
    doToCollidingBox((box) => {
      box.setObstacle(true);
    });
}

function mouseClicked() {
  const box = getClickedBox();
  if (drawObstacleCheckbox.checked()) return;
  if (box) {
    switch (clickMode) {
      case CLICK_MODES[0]:
        box.toggleObstacle();
        break;
      case CLICK_MODES[1]:
        if (startBox) startBox.setStart(false);
        box.setStart(true);
        startBox = box;
        setMode("end");
        break;
      case CLICK_MODES[2]:
        if (endBox) endBox.setEnd(false);
        box.setEnd(true);
        endBox = box;
        break;
      case CLICK_MODES[3]:
        highlightNeighbors(map, box);
        break;
      default:
        break;
    }
  }
}

function keyPressed() {
  if (key == "R") {
    resetMap();
  }
  if (key == "c") {
    map.clear();
  }
  if (key == "d") {
    setMode("obstacle");
  }
  if (key == "s") {
    setMode("start");
  }
  if (key == "e") {
    setMode("end");
  }
  if (key == "n") {
    setMode("neighbour");
  }
  if (key == "S") {
    const data = map.getBoxData();
    localStorage.setItem("map", JSON.stringify(data));
    alert("Saving Data");
  }
}
