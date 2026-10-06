import recordStep from '../../../utils/trace/recordStep';

/**
 * @param {number[][]} chessboard
 * @param {number[]} position
 * @return {number[][]}
 */
function getPossibleMoves(chessboard, position) {
  // Generate all knight moves (even those that go beyond the board).
  const possibleMoves = [
    [position[0] - 1, position[1] - 2],
    [position[0] - 2, position[1] - 1],
    [position[0] + 1, position[1] - 2],
    [position[0] + 2, position[1] - 1],
    [position[0] - 2, position[1] + 1],
    [position[0] - 1, position[1] + 2],
    [position[0] + 1, position[1] + 2],
    [position[0] + 2, position[1] + 1],
  ];

  // Filter out all moves that go beyond the board.
  return possibleMoves.filter((move) => {
    const boardSize = chessboard.length;
    return move[0] >= 0 && move[1] >= 0 && move[0] < boardSize && move[1] < boardSize;
  });
}

/**
 * @param {number[][]} chessboard
 * @param {number[]} move
 * @return {boolean}
 */
function isMoveAllowed(chessboard, move) {
  return chessboard[move[0]][move[1]] !== 1;
}

/**
 * @param {number[][]} chessboard
 * @param {number[][]} moves
 * @return {boolean}
 */
function isBoardCompletelyVisited(chessboard, moves) {
  const totalPossibleMovesCount = chessboard.length ** 2;
  const existingMovesCount = moves.length;

  return totalPossibleMovesCount === existingMovesCount;
}

/**
 * @param {number[][]} chessboard
 * @param {number[][]} moves
 * @return {boolean}
 */
function knightTourRecursive(chessboard, moves, stepCallback, useHeuristic) {
  const currentChessboard = chessboard;

  // If board has been completely visited then we've found a solution.
  if (isBoardCompletelyVisited(currentChessboard, moves)) {
    return true;
  }

  // Get next possible knight moves.
  const lastMove = moves[moves.length - 1];
  const possibleMoves = getPossibleMoves(currentChessboard, lastMove);

  if (useHeuristic) {
    const onwardCount = (position) => getPossibleMoves(currentChessboard, position)
      .filter((move) => isMoveAllowed(currentChessboard, move)).length;
    possibleMoves.sort((a, b) => onwardCount(a) - onwardCount(b));
  }

  // Try to do next possible moves.
  for (let moveIndex = 0; moveIndex < possibleMoves.length; moveIndex += 1) {
    const currentMove = possibleMoves[moveIndex];

    // Check if current move is allowed. We aren't allowed to go to
    // the same cells twice.
    if (isMoveAllowed(currentChessboard, currentMove)) {
      // Actually do the move.
      moves.push(currentMove);
      currentChessboard[currentMove[0]][currentMove[1]] = 1;
      recordStep(
        stepCallback,
        'move',
        [],
        [],
        () => ({
          moves: JSON.stringify(moves),
          row: currentMove[0],
          column: currentMove[1],
        }),
        'currentChessboard[currentMove[0]][currentMove[1]] = 1',
      );

      // If further moves starting from current are successful then
      // return true meaning the solution is found.
      if (knightTourRecursive(currentChessboard, moves, stepCallback, useHeuristic)) {
        return true;
      }

      // BACKTRACKING.
      // If current move was unsuccessful then step back and try to do another move.
      moves.pop();
      currentChessboard[currentMove[0]][currentMove[1]] = 0;
      recordStep(
        stepCallback,
        'backtrack',
        [],
        [],
        () => ({
          moves: JSON.stringify(moves),
          row: currentMove[0],
          column: currentMove[1],
        }),
        'currentChessboard[currentMove[0]][currentMove[1]] = 0',
      );
    }
  }

  // Return false if we haven't found solution.
  return false;
}

/**
 * @param {number} chessboardSize
 * @param {function} [stepCallback]
 * @param {boolean} [useHeuristic] - Try cells with fewer onward moves first.
 * @return {number[][]}
 */
export default function knightTour(chessboardSize, stepCallback = undefined, useHeuristic = false) {
  // Init chessboard.
  const chessboard = Array(chessboardSize).fill(null).map(() => Array(chessboardSize).fill(0));

  // Init moves array.
  const moves = [];

  // Do first move and place the knight to the 0x0 cell.
  const firstMove = [0, 0];
  moves.push(firstMove);
  chessboard[firstMove[0]][firstMove[0]] = 1;

  recordStep(
    stepCallback,
    'start',
    [],
    [],
    { moves: JSON.stringify(moves), row: 0, column: 0 },
    'moves.push(firstMove)',
  );

  // Recursively try to do the next move.
  const solutionWasFound = knightTourRecursive(chessboard, moves, stepCallback, useHeuristic);

  return solutionWasFound ? moves : [];
}
