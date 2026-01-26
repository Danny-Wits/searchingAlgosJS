# SAVAGE

**Searching Algorithm Visualization & Graph Engine**

SAVAGE is an interactive, grid-based visualization tool for exploring classic searching and pathfinding algorithms. It allows users to construct environments, place obstacles, configure traversal rules, and visually observe algorithm behavior step by step.

---
## Preview
[Live Link](https://danny-wits.github.io/searchingAlgosJS/)
| Mobile | Desktop |
| :--- | :---: |
|<img width="450" height="919" alt="image" src="https://github.com/user-attachments/assets/e88f9077-601e-461c-bcf7-7e9f2be4ed70" /> | <img width="1891" height="901" alt="image" src="https://github.com/user-attachments/assets/f8560220-874a-4ad5-a74b-6213ef4d6eb8" /> |

---
## Features

- Interactive grid-based search space
- Visual step-by-step execution of algorithms
- Adjustable grid resolution and brush size
- Support for diagonal and non-diagonal traversal
- Obstacle drawing and editing
- Start and end node placement
- Real-time visualization controls
- Mobile-friendly behavior

---

## Controls Overview

### Mode Selection

Use the **Mode** buttons to choose how mouse interactions affect the grid:

- **Obstacle** – Draw or erase obstacles
- **Start** – Place the starting node
- **End** – Place the destination node
- **Neighbour** – Inspect neighboring cells (default mode)

---

### Grid & Drawing Controls

| Control        | Description                                       |
| -------------- | ------------------------------------------------- |
| **Size**       | Adjusts grid density (rebuilds the map)           |
| **Brush Size** | Controls obstacle drawing radius                  |
| **Sleep Time** | Adds delay between algorithm steps (visual speed) |

---

### Toggles

| Option              | Function                               |
| ------------------- | -------------------------------------- |
| **Show FPS**        | Displays rendering frame rate          |
| **Draw Obstacles**  | Enables/disables obstacle placement    |
| **Show Box Number** | Displays cell indices                  |
| **Diagonal Search** | Allows diagonal movement during search |

---

### Algorithms

Click an algorithm button to visualize its execution:

- **BFS** – Breadth First Search
- **DFS** – Depth First Search

The algorithm will:

1. Clear previous paths
2. Traverse from start to end
3. Animate visited nodes
4. Draw the final path

> Start and end nodes must be set before running any algorithm.

---

### Utility Buttons

- **Clear** – Removes visited/path states but keeps obstacles
- **Reset** – Rebuilds the grid entirely

---

## Technical Notes

- Built using **p5.js**
- Grid rendered on canvas
- Algorithms executed asynchronously for animation
- Designed for extensibility (additional algorithms can be added easily)

---

## Future Enhancements

- Additional algorithms (A\*, Dijkstra, Greedy Best-First)

---

## Author

**Danny Wits**  
Software Developer | Algorithm Visualization Enthusiast

- GitHub: https://github.com/Danny-Wits
