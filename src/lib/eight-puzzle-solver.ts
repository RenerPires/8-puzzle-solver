export type MoveOptions = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type AlgorithmOptions = 'DEEP' | 'WIDE' | 'A-STAR';

function getColumn(index: number): number {
  return index % 3
}

function getLine(index: number): number {
  return Math.floor(index / 3)
}

function getWhiteTile(currentPosition: string): number {
  return currentPosition.indexOf('0')
}

function swapPositions(currentPosition: string, indexA: number, indexB: number): string {
  let temp = currentPosition.split("")
  let aux = temp[indexA]
  temp[indexA] = temp[indexB]
  temp[indexB] = aux

  return temp.join("")
}

function moveLeft(currentPosition: string): string {

  let whiteTileIndex = getWhiteTile(currentPosition)

  if (getColumn(whiteTileIndex) == 0)
    return currentPosition

  currentPosition = swapPositions(currentPosition, whiteTileIndex, whiteTileIndex - 1)
  return currentPosition
}

function moveDown(currentPosition: string): string {
  let whiteTileIndex = getWhiteTile(currentPosition)

  if (getLine(whiteTileIndex) == 2)
    return currentPosition

  currentPosition = swapPositions(currentPosition, whiteTileIndex, whiteTileIndex + 3)
  return currentPosition
}

function moveRight(currentPosition: string): string {
  let whiteTileIndex = getWhiteTile(currentPosition)

  if (getColumn(whiteTileIndex) == 2)
    return currentPosition

  currentPosition = swapPositions(currentPosition, whiteTileIndex, whiteTileIndex + 1)
  return currentPosition
}

function moveUp(currentPosition: string): string {

  let whiteTileIndex = getWhiteTile(currentPosition)

  if (getLine(whiteTileIndex) == 0)
    return currentPosition

  currentPosition = swapPositions(currentPosition, whiteTileIndex, whiteTileIndex - 3)
  return currentPosition
}

function manhattanDistance(currentPosition: string, goalState: string): number {
  let distance = 0;
  currentPosition.split("").forEach((tile, originIndex) => {
    let destinationIndex = goalState.indexOf(tile);

    let currentColumn = getColumn(originIndex);
    let destinationColumn = getColumn(destinationIndex);

    let currentLine = getLine(originIndex);
    let destinationLine = getLine(destinationIndex);

    distance += Math.abs(currentColumn - destinationColumn) + Math.abs(currentLine - destinationLine);
  });
  return distance;
}

export function applyMove(state: string, move: MoveOptions): string {
  switch (move) {
    case 'UP':
      return moveUp(state);
    case 'DOWN':
      return moveDown(state);
    case 'LEFT':
      return moveLeft(state);
    case 'RIGHT':
      return moveRight(state);
    default:
      throw new Error(`Invalid move: ${move}`);
  }
}

export function undoMove(state: string, move: MoveOptions): string {
  switch (move) {
    case 'UP':
      return moveDown(state);
    case 'DOWN':
      return moveUp(state);
    case 'LEFT':
      return moveRight(state);
    case 'RIGHT':
      return moveLeft(state);
    default:
      throw new Error(`Invalid move: ${move}`);
  }
}

export function solvePuzzle(initialState: string, goalState: string, algorithm: AlgorithmOptions): MoveOptions[] | null {
  // ? Deep search only throws a stack overflow error
  // function deepSearch(state: string, goal: string, visited = new Set(), path = [] as MoveOptions[]): MoveOptions[] | null {
  //     if (state === goal) return path;
  //     if (visited.has(state)) return null;
  //     visited.add(state);

  //     const moves = ['UP', 'DOWN', 'LEFT', 'RIGHT'] as MoveOptions[];
  //     for (let move of moves) {
  //         let newState = applyMove(state, move);
  //         if (!newState) continue;
  //         let result = deepSearch(newState, goal, visited, path.concat(move));
  //         if (result) return result;
  //     }
  //     return null;
  // }

  // ? Limiting the deep search to 1000 moves
  function deepSearch(state: string, goal: string): MoveOptions[] | null {
    let depth = 0;
    while (true) {
      let result = deepSearchCall(state, goal, depth);
      if (result) return result;
      depth++;
    }
  }
  function deepSearchCall(state: string, goal: string, depth: number, visited = new Set(), path = [] as MoveOptions[]): MoveOptions[] | null {
    if (state === goal) return path;
    if (depth <= 0 || visited.has(state)) return null;
    visited.add(state);

    const moves = ['UP', 'DOWN', 'LEFT', 'RIGHT'] as MoveOptions[];
    for (let move of moves) {
      let newState = applyMove(state, move);
      if (!newState) continue;
      let result = deepSearchCall(newState, goal, depth - 1, visited, path.concat(move));
      if (result) return result;
    }
    return null;
  }

  function wideSearch(state: string, goal: string): MoveOptions[] | null {
    let queue = [{ state: state, path: [] as MoveOptions[] }];
    let visited = new Set();

    while (queue.length > 0) {
      let node = queue.shift();
      visited.add(node!.state);

      if (node!.state === goal) return node!.path;

      const moves = ['UP', 'DOWN', 'LEFT', 'RIGHT'] as MoveOptions[];
      for (let move of moves) {
        let newState = applyMove(node!.state, move);
        if (newState && !visited.has(newState)) {
          queue.push({ state: newState, path: node!.path.concat(move) });
        }
      }
    }
    return null;
  }

  function aStarSearch(state: string, goal: string): MoveOptions[] | null {
    let openList = [{ state: state, path: [] as MoveOptions[], cost: 0 }];
    let closedList = new Set();

    while (openList.length > 0) {
      openList.sort((a, b) => a.cost - b.cost);
      let node = openList.shift();
      closedList.add(node!.state);

      if (node!.state === goal) return node!.path;

      const moves = ['UP', 'DOWN', 'LEFT', 'RIGHT'] as MoveOptions[];
      for (let move of moves) {
        let newState = applyMove(node!.state, move);
        if (newState && !closedList.has(newState)) {
          let cost = node!.path.length + 1 + manhattanDistance(newState, goalState);
          openList.push({ state: newState, path: node!.path.concat(move), cost: cost });
        }
      }
    }
    return null;
  }

  switch (algorithm) {
    case 'DEEP':
      return deepSearch(initialState, goalState);
    case 'WIDE':
      return wideSearch(initialState, goalState);
    case 'A-STAR':
      return aStarSearch(initialState, goalState);
    default:
      throw new Error(`Invalid algorithm ${algorithm}`);
  }
}

export function shufflePuzzle(state: string, moves: number): string {
  let shuffledState = state;
  for (let i = 0; i < moves; i++) {
    let move = ['UP', 'DOWN', 'LEFT', 'RIGHT'][Math.floor(Math.random() * 4)] as MoveOptions;
    shuffledState = applyMove(shuffledState, move);
  }
  return shuffledState;
}

// let initialState = '123456078';  // Replace this with your initial state.
// let goalState = '123456780';
// let result = solvePuzzle(initialState, goalState, 'A-STAR');

// if (result) {
//   console.log('Solution:', result);
// } else {
//   console.log('No solution found');
// }