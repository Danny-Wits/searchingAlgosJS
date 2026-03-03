const ALGOS = ["BFS", "DFS", "Dijkstra", "AStar"];
const callbacks = {
  BFS,
  DFS,
  Dijkstra,
  AStar,
};
let sleepTimeSlider;

/**
 * Breadth-First Search algorithm for finding the shortest path between two nodes in a graph.
 * @param {Grid} map - The graph to search.
 * @param {Box} start - The starting node.
 * @param {Box} end - The ending node.
 * @returns {Map<Box, Box>} - A map of nodes to their parents in the shortest path.
 *
 * This algorithm works by maintaining a queue of nodes to visit. It starts by visiting the start node, and then adds all of its unvisited neighbors to the queue. It then visits the next node in the queue, marks it as visited, and adds all of its unvisited neighbors to the queue. This continues until the end node is visited, at which point the algorithm returns a map of nodes to their parents in the shortest path.
 */
async function BFS(map, start, end) {
  let queue = [start];
  let visited = new Set([start.index]);
  let parents = new Map();
  while (queue.length > 0) {
    const current = queue.shift();
    if (current === end) {
      return parents;
    }
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

/**
 * Depth-First Search algorithm for finding the shortest path between two nodes in a graph.
 * @param {Grid} map - The graph to search.
 * @param {Box} start - The starting node.
 * @param {Box} end - The ending node.
 * @returns {Map<Box, Box>} - A map of nodes to their parents in the shortest path.
 */
async function DFS(map, start, end) {
  let stack = [start];
  let parents = new Map();
  let visited = new Set([start.index]);
  while (stack.length > 0) {
    const current = stack.pop();
    if (current === end) {
      return parents;
    }
    const neighbors = map.getNeighbors(current);
    for (let neighbor of neighbors) {
      if (!visited.has(neighbor.index)) {
        visited.add(neighbor.index);
        neighbor.setVisited(true);
        parents.set(neighbor, current);
        if (neighbor === end) {
          return parents;
        }
        stack.push(neighbor);
        await sleep(sleepTimeSlider.value());
      }
    }
  }
}
/**
 * Dijkstra's algorithm for finding the shortest path between two nodes in a graph.
 * @param {Grid} map - The graph to search.
 * @param {Box} start - The starting node.
 * @param {Box} end - The ending node.
 * @returns {Map<Box, Box>} - A map of nodes to their parents in the shortest path.
 */
async function Dijkstra(map, start, end) {
  let stack = [start];
  let parents = new Map();
  let visited = new Set([start.index]);
  let valueList = [];
  valueList[start.index] = map.getHeuristicValue(start, end);
  while (stack.length > 0) {
    const current = map.getBestBox(stack, valueList);
    stack = stack.filter((box) => box !== current);
    if (current === end) {
      return parents;
    }
    const neighbors = map.getNeighbors(current);
    for (let neighbor of neighbors) {
      if (!visited.has(neighbor.index)) {
        valueList[neighbor.index] = map.getHeuristicValue(neighbor, end);
        visited.add(neighbor.index);
        neighbor.setVisited(true);
        parents.set(neighbor, current);
        if (neighbor === end) {
          return parents;
        }
        stack.push(neighbor);
        await sleep(sleepTimeSlider.value());
      }
    }
  }
}
/**
 * A* pathfinding algorithm for finding the shortest path between two nodes in a graph.
 * Uses a best-first search approach with a heuristic to guide the search towards the end node.
 * @param {Grid} map - The graph to search.
 * @param {Box} start - The starting node.
 * @param {Box} end - The ending node.
 * @returns {Map<Box, Box>} - A map of nodes to their parents in the shortest path.
 */
async function AStar(map, start, end) {
  let stack = [start];
  let pathCostList = new Array(map.size * map.size).fill(Infinity);
  let valueList = new Array(map.size * map.size).fill(Infinity);
  pathCostList[start.index] = 0;
  valueList[start.index] = map.getHeuristicValue(start, end);
  let parents = new Map();
  let visited = new Set();
  while (stack.length > 0) {
    const current = map.getBestBox(stack, valueList);
    stack = stack.filter((box) => box !== current);
    if (current === end) {
      return parents;
    }
    const neighbors = map.getNeighbors(current);

    for (let neighbor of neighbors) {
      const newValue = fn(neighbor, end, current, pathCostList);
      if (valueList[neighbor.index] > newValue) {
        valueList[neighbor.index] = newValue;
        pathCostList[neighbor.index] =
          pathCostList[current.index] +
          map.getHeuristicValue(neighbor, current);
        parents.set(neighbor, current);
        if (!visited.has(neighbor.index)) {
          visited.add(neighbor.index);
          neighbor.setVisited(true);
          stack.push(neighbor);
          await sleep(sleepTimeSlider.value());
        }
      }
    }
  }
}
function fn(neighbor, end, current, pathCostList) {
  return (
    2 * map.getHeuristicValue(neighbor, end) +
    map.getHeuristicValue(neighbor, current) +
    pathCostList[current.index]
  );
}
function highlightNeighbors(map, box) {
  const neighbors = map.getNeighbors(box);
  console.log(neighbors, box);

  neighbors.forEach((neighbor) => {
    neighbor.highlight();
  });
}
function getCallbackForAlgo(algo) {
  const callback = callbacks[algo];
  if (!callback) return BFS;
  return callback;
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
