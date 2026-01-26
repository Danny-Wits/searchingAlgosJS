let box_size = 50;
let offsetX = 0;
let offsetY = 0;
let showBoxNumber = false;
let diagonalSearch = false;
class BoxData {
  constructor(x, y) {
    this.isVisited = false;
    this.isObstacle = false;
    this.isStart = false;
    this.isEnd = false;
  }
}
class Box {
  unvisitedColor = "#eaeaea";
  visitedColor = "#c4f6b5";
  startColor = "#76ff76";
  endColor = "#5757ff";
  obstacleColor = "#000000";
  highlightColor = "#ff00008a";
  constructor(index, x, y, Box_Data) {
    this.index = index;
    this.x = x;
    this.y = y;
    this.isVisited = Box_Data.isVisited;
    this.isStart = Box_Data.isStart;
    this.isEnd = Box_Data.isEnd;
    this.isObstacle = Box_Data.isObstacle;
    this.isHighlighted = false;
  }
  getBoxData() {
    return {
      isVisited: this.isVisited,
      isStart: this.isStart,
      isEnd: this.isEnd,
      isObstacle: this.isObstacle,
    };
  }
  clear() {
    this.isVisited = false;
    this.draw();
  }
  draw() {
    stroke(50);
    fill(this.unvisitedColor);
    if (this.isVisited) fill(this.visitedColor);
    if (this.isStart) fill(this.startColor);
    if (this.isEnd) fill(this.endColor);
    if (this.isObstacle) fill(this.obstacleColor);
    if (this.isHighlighted) fill(this.highlightColor);
    rect(this.x, this.y, box_size, box_size, 6);
    stroke(0);
    if (showBoxNumber) {
      fill(0);
      noStroke();
      textSize(10);
      text(this.index, this.x + 4, this.y + box_size - 4);
    }
  }
  highlight() {
    this.isHighlighted = true;
    this.draw();
    setTimeout(() => {
      this.isHighlighted = false;
      this.draw();
    }, 2000);
  }
  toggleVisited() {
    this.setVisited(!this.isVisited);
  }
  setVisited(value) {
    this.isVisited = value;
    this.draw();
  }
  toggleObstacle() {
    this.setObstacle(!this.isObstacle);
  }
  setObstacle(value) {
    this.isObstacle = value;
    this.draw();
  }
  setStart(value) {
    this.isStart = value;
    this.draw();
  }
  setEnd(value) {
    this.isEnd = value;
    this.draw();
  }
}
function createBox(index, x, y) {
  return new Box(index, x, y, new BoxData());
}

class Grid {
  constructor(size) {
    this.size = size;
    this.boxes = new Array(size * size);
    for (let i = 0; i < size * size; i++) {
      let row = floor(i / size);
      let col = i % size;
      this.boxes[i] = createBox(
        i,
        col * box_size + offsetX,
        row * box_size + offsetY,
      );
    }
  }
  foreach(callback) {
    for (let i = 0; i < this.boxes.length; i++) {
      callback(this.boxes[i], i);
    }
  }
  clear() {
    this.boxes.forEach((box) => box.clear());
  }
  draw() {
    for (let i = 0; i < this.boxes.length; i++) {
      this.boxes[i].draw();
    }
  }
  getBox(row, col) {
    return this.boxes[row * size + col];
  }
  getBoxData() {
    let data = new Array(size * size);
    this.foreach((box, index) => {
      data[index] = box.getBoxData();
    });
    return data;
  }
  setBoxData(data) {
    this.foreach((box, index) => {
      box.isVisited = data[index].isVisited;
      box.isObstacle = data[index].isObstacle;
      box.isStart = data[index].isStart;
      box.isEnd = data[index].isEnd;
    });
  }
  getBox(index) {
    return this.boxes[index];
  }
  getNeighbors(box) {
    const index = box.index;
    const row = floor(index / size);
    const col = index % size;
    let neighbors = [];

    if (row > 0) neighbors.push(index - size);
    if (row < size - 1) neighbors.push(index + size);
    if (col > 0) neighbors.push(index - 1);
    if (col < size - 1) neighbors.push(index + 1);
    if (diagonalSearch) {
      if (row > 0 && col > 0) neighbors.push(index - size - 1);
      if (row > 0 && col < size - 1) neighbors.push(index - size + 1);
      if (row < size - 1 && col > 0) neighbors.push(index + size - 1);
      if (row < size - 1 && col < size - 1) neighbors.push(index + size + 1);
    }
    neighbors = neighbors
      .map((index) => this.getBox(index))
      .filter((box) => !box.isObstacle);
    return neighbors;
  }
}
