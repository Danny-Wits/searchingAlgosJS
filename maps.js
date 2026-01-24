let box_size = 50;
let offsetX = 100;
let offsetY = 20;

class BoxData {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.isVisited = true;
    this.isObstacle = false;
  }
}
class Box {
  visited_Color = "lime";
  constructor(Box_Data) {
    this.x = Box_Data.x;
    this.y = Box_Data.y;
    this.isVisited = Box_Data.isVisited;
    this.isObstacle = Box_Data.isObstacle;
  }
  getBoxData() {
    return {
      x: this.x,
      y: this.y,
      isVisited: this.isVisited,
      isObstacle: this.isObstacle,
    };
  }
  draw() {
    stroke(50);
    fill(0);
    if (this.isVisited) fill(this.visited_Color);
    if (this.isObstacle) fill(50);
    rect(this.x, this.y, box_size, box_size);
    stroke(0);
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
}
function createBox(x, y) {
  return new Box(new BoxData(x, y));
}

class Map {
  constructor(size) {
    this.size = size;
    this.boxes = new Array(size * size);
    for (let i = 0; i < size * size; i++) {
      let row = floor(i / size);
      let col = i % size;
      this.boxes[i] = createBox(
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
    });
  }
}
