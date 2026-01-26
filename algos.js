const ALGOS = ["BFS", "DFS"];
let sleepTimeSlider;
async function BFS(map, start, end) {
  let queue = [start];
  let visited = new Set([start.index]);
  let parents = new Map();
  while (queue.length > 0) {
    const current = queue.shift();

    const neighbors = map.getNeighbors(current);
    for (let neighbor of neighbors) {
      if (!visited.has(neighbor.index)) {
        visited.add(neighbor.index);
        neighbor.setVisited(true);
        parents.set(neighbor, current);
        if (current === end) {
          return parents;
        }
        queue.push(neighbor);
        await sleep(sleepTimeSlider.value());
      }
    }
  }
}
async function DFS(map, start, end) {
  let queue = [start];
  let parents = new Map();
  let visited = new Set([start.index]);
  while (queue.length > 0) {
    const current = queue.pop();
    const neighbors = map.getNeighbors(current);
    for (let neighbor of neighbors) {
      if (!visited.has(neighbor.index)) {
        visited.add(neighbor.index);
        neighbor.setVisited(true);
        parents.set(neighbor, current);
        if (neighbor === end) {
          return parents;
        }
        queue.push(neighbor);
        await sleep(sleepTimeSlider.value());
      }
    }
  }
}

function highlightNeighbors(map, box) {
  const neighbors = map.getNeighbors(box);
  console.log(neighbors, box);

  neighbors.forEach((neighbor) => {
    neighbor.highlight();
  });
}
function getCallbackForAlgo(algo) {
  switch (algo) {
    case ALGOS[0]:
      return BFS;
    case ALGOS[1]:
      return DFS;
    default:
      return BFS;
  }
}
async function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
async function drawPath(path) {
  for (let box of path) {
    box.highlight();
    await sleep(20);
  }
}
function pathFormParents(parents, start, end) {
  let path = [];
  let current = end;
  while (current !== start) {
    path.push(current);
    current = parents.get(current);
  }
  path.push(start);
  return path;
}
