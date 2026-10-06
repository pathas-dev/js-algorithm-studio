import stairsSource from '../src/algorithms/uncategorized/recursive-staircase/recursiveStaircaseDP.js?raw';
import knightSource from '../src/algorithms/uncategorized/knight-tour/knightTour.js?raw';
import queensSource from '../src/algorithms/uncategorized/n-queens/nQueens.js?raw';
import rainSource from '../src/algorithms/uncategorized/rain-terraces/dpRainTerraces.js?raw';
import pathsSource from '../src/algorithms/uncategorized/unique-paths/dpUniquePaths.js?raw';
import jumpSource from '../src/algorithms/uncategorized/jump-game/greedyJumpGame.js?raw';
import rotationSource from '../src/algorithms/uncategorized/square-matrix-rotation/squareMatrixRotation.js?raw';
import hanoiSource from '../src/algorithms/uncategorized/hanoi-tower/hanoiTower.js?raw';
import traceHanoi, { traceRotation, traceJump, tracePaths, traceRain, traceQueens, traceKnight, traceStairs } from '../src/visualization/puzzles';
import { algorithmCode } from '../src/visualization/playback';
import type { Algorithm, NumericAlgorithm, TextAlgorithm } from './algorithms';

const hanoi: NumericAlgorithm = {
  id: 'hanoi-tower', category: 'other', example: [3], usesStart: false, singleInput: true,
  name: { ko: '하노이 탑', en: 'Tower of Hanoi' }, time: 'O(2ⁿ)',
  summary: { ko: '작은 원판 n−1개를 보조 기둥으로 옮기고, 가장 큰 원판을 목적지로 옮긴 뒤 작은 원판들을 그 위로 옮깁니다. 큰 원판을 작은 원판 위에 놓지 않습니다.', en: 'Move n−1 smaller discs to the auxiliary pole, move the largest disc to the destination, then move the smaller discs onto it. Never place a larger disc on a smaller one.' },
  inputLabels: [{ ko: '원판 개수', en: 'Disc count' }, { ko: '', en: '' }],
  inputHint: { ko: '원판 1–6개 · A → C · B는 보조 기둥 · 최소 이동 2ⁿ−1회', en: '1–6 discs · A → C with B auxiliary · minimum 2ⁿ−1 moves' },
  source: algorithmCode(hanoiSource), run: traceHanoi,
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['A 기둥에 원판 준비', `${v.n}개의 원판을 크기 순서로 쌓았습니다. 원판 하나를 옮기는 n=1 호출이 재귀의 기본 경우입니다.`] : ['Prepare discs on pole A', `Stack ${v.n} discs in size order. Moving one disc in an n=1 call is the recursive base case.`];
    if (step.type === 'move') return ko ? ['원판 하나를 목적 기둥으로 이동', `원판 ${v.disc}: ${'ABC'[Number(v.from)]} → ${'ABC'[Number(v.to)]}. ${v.moves}번째 이동입니다. 재귀 호출에서 출발·보조·목적 기둥의 역할을 서로 바꾸어 해결합니다.`] : ['Move one disc to its target pole', `Disc ${v.disc}: ${'ABC'[Number(v.from)]} → ${'ABC'[Number(v.to)]}. Move ${v.moves}. Recursive calls exchange the source, auxiliary and destination roles.`];
    return ko ? ['모든 원판이 C에 도착', `${v.moves}회 이동했습니다. T(n)=2T(n−1)+1이므로 필요한 최소 이동은 2^${v.n}−1입니다.`] : ['All discs reached pole C', `Completed ${v.moves} moves. T(n)=2T(n−1)+1 gives the minimum 2^${v.n}−1.`];
  },
};

const rotation: TextAlgorithm = {
  id: 'square-matrix-rotation', category: 'other', inputMode: 'text', singleInput: true,
  example: ['[[1,2,3],[4,5,6],[7,8,9]]', ''],
  name: { ko: '정방 행렬 회전', en: 'Square matrix rotation' }, time: 'O(n²)',
  summary: { ko: '주대각선을 기준으로 전치한 뒤 각 행을 뒤집으면 시계 방향 90도 회전이 됩니다. 원본 함수가 행 배열의 셀을 실제로 교환하는 과정을 따라갑니다.', en: 'Transpose across the main diagonal, then reverse each row for a 90° clockwise rotation. Follow the original function swapping cells in the same row arrays.' },
  inputLabels: [{ ko: '정방 행렬 · JSON', en: 'Square matrix · JSON' }, { ko: '', en: '' }],
  inputHint: { ko: '1–6행 × 같은 수의 열 · 숫자 −999–999 · 시계 방향 90°', en: '1–6 rows with the same column count · values −999–999 · 90° clockwise' },
  source: algorithmCode(rotationSource), run: traceRotation,
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['전치 후 행 뒤집기 준비', '원본 입력을 왼쪽에 보존하고 실제 교환 중인 행렬을 오른쪽에 표시합니다. 주대각선의 위치는 전치에서 바뀌지 않습니다.'] : ['Prepare transpose followed by row reversal', 'Keep the initial input on the left and show actual swaps on the right. The main diagonal remains unchanged during transpose.'];
    if (step.type === 'transpose') return ko ? ['행·열 위치를 서로 교환', `(${v.row}, ${v.column}) ↔ (${v.otherRow}, ${v.otherColumn}). 대각선 위쪽만 순회하므로 같은 쌍을 다시 교환하지 않습니다.`] : ['Swap row and column positions', `(${v.row}, ${v.column}) ↔ (${v.otherRow}, ${v.otherColumn}). Visit only above the diagonal to avoid swapping the same pair twice.`];
    if (step.type === 'reverse-row') return ko ? ['현재 행의 양끝을 교환', `행 ${v.row}: 열 ${v.column} ↔ ${v.otherColumn}. 전치된 행을 좌우로 뒤집어 시계 방향 회전을 완성합니다.`] : ['Swap opposite ends of the row', `Row ${v.row}: columns ${v.column} ↔ ${v.otherColumn}. Reversing the transposed row completes the clockwise rotation.`];
    return ko ? ['시계 방향 90도 회전 완료', '원래 (행, 열) 위치는 (열, n−1−행)으로 이동합니다. 값을 수정해 같은 변환이 적용되는지 확인할 수 있습니다.'] : ['90° clockwise rotation ready', 'Original (row, column) moves to (column, n−1−row). Edit values to inspect the same transformation.'];
  },
};

const jump: NumericAlgorithm = {
  id: 'jump-game', category: 'other', example: [2,3,1,1,4], usesStart: false, singleInput: true,
  name: { ko: '점프 게임', en: 'Jump game' }, time: 'O(n)',
  summary: { ko: '각 숫자는 그 위치에서 앞으로 뛸 수 있는 최대 칸 수입니다. 오른쪽부터 마지막 칸에 도달할 수 있는 가장 왼쪽 위치를 갱신해 시작점의 가능 여부를 판정합니다.', en: 'Each value is the maximum forward jump from that position. Scan right to left, updating the leftmost position that can reach the end, then test the starting point.' },
  inputLabels: [{ ko: '위치별 최대 점프', en: 'Maximum jumps by position' }, { ko: '', en: '' }],
  inputHint: { ko: '정수 1–18개 · 각 값 0–12 · 0칸 점프는 이동 불가 · 최소 점프 횟수 문제와 다름', en: '1–18 integers · values 0–12 · zero cannot move · reachability, rather than minimum jump count' },
  source: algorithmCode(jumpSource), run: traceJump,
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['마지막 칸부터 도달 가능 위치 기록', `마지막 위치 ${v.leftGoodPosition}는 이미 목적지입니다. 시작점 쪽으로 한 칸씩 거슬러 올라갑니다.`] : ['Mark the final position as reachable', `Position ${v.leftGoodPosition} is already the goal. Scan backward toward the start.`];
    if (step.type === 'check') return ko ? ['현재 점프로 좋은 위치에 닿는지 확인', `${v.numberIndex}에서 최대 ${v.maxCurrentJumpLength}까지 갈 수 있습니다. 좋은 위치 ${v.leftGoodPosition}에 ${v.reachable ? '닿으므로 갱신합니다' : '못 닿으므로 유지합니다'}. 최대보다 짧게 뛰어도 됩니다.`] : ['Check whether this jump reaches a good position', `From ${v.numberIndex}, reach at most ${v.maxCurrentJumpLength}. ${v.reachable ? 'Update' : 'Keep'} good position ${v.leftGoodPosition}. Jumps may be shorter than the maximum.`];
    if (step.type === 'good') return ko ? ['가장 왼쪽 좋은 위치 갱신', `위치 ${v.leftGoodPosition}에서도 마지막 칸에 도달할 수 있습니다. 초록색은 이미 도달 가능하다고 확인한 위치입니다.`] : ['Update the leftmost good position', `Position ${v.leftGoodPosition} can also reach the end. Green positions have already been confirmed reachable.`];
    return ko ? [v.result ? '시작점에서 마지막 칸 도달 가능' : '시작점에서 마지막 칸 도달 불가', `가장 왼쪽 좋은 위치는 ${v.leftGoodPosition}입니다. 이 값이 0일 때만 시작점부터 도달할 수 있습니다.`] : [v.result ? 'The start can reach the final position' : 'The start cannot reach the final position', `Leftmost good position: ${v.leftGoodPosition}. The start reaches the end only when this is zero.`];
  },
};

const paths: NumericAlgorithm = {
  id: 'unique-paths', category: 'other', example: [4], target: 3, usesStart: true,
  name: { ko: 'Unique 경로', en: 'Unique paths' }, time: 'O(wh)',
  summary: { ko: '왼쪽 위에서 오른쪽 아래까지 오른쪽·아래로만 이동하는 경로 수를 셉니다. 각 칸은 위와 왼쪽에서 오는 경로 수를 더하며 장애물이 없는 격자를 사용합니다.', en: 'Count paths from top-left to bottom-right moving only right or down. Each cell adds paths from above and left on a grid without obstacles.' },
  inputLabels: [{ ko: '격자 폭', en: 'Grid width' }, { ko: '격자 높이', en: 'Grid height' }],
  targetLabel: { ko: '격자 높이', en: 'Grid height' },
  inputHint: { ko: '폭과 높이 각각 정수 1–10 · 숫자는 이동 횟수가 아닌 해당 칸까지의 경로 수', en: 'Integer width and height 1–10 · cells show path counts, rather than move counts' },
  source: algorithmCode(pathsSource), run: tracePaths,
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['장애물 없는 격자에서 경로 수 계산', `${v.width}×${v.height} 격자의 왼쪽 위가 시작, 오른쪽 아래가 목적지입니다. 아직 계산하지 않은 칸은 —입니다.`] : ['Count paths on an obstacle-free grid', `Start at the top-left of this ${v.width}×${v.height} grid and finish bottom-right. Uncomputed cells show —.`];
    if (step.type === 'base') return ko ? ['첫 행·첫 열의 경로 수는 1', '첫 행은 오른쪽으로만, 첫 열은 아래로만 올 수 있어 경로가 하나뿐입니다. 시작 칸도 경로 수 1로 둡니다.'] : ['First row and column each have one path', 'The first row can only be reached from the left; the first column only from above. Initialize the starting cell to one too.'];
    if (step.type === 'cell-sum') return ko ? ['위와 왼쪽 경로 수를 더하기', `행 ${v.row}, 열 ${v.column}에는 위에서 오거나 왼쪽에서 옵니다. 두 경우가 겹치지 않으므로 경로 수를 더합니다.`] : ['Add paths from above and left', `Cell (${v.row}, ${v.column}) is entered from above or left. These cases are disjoint, so add their counts.`];
    return ko ? ['목적지까지의 서로 다른 경로 수 확정', `전체 경로는 ${v.result}개입니다. 폭이나 높이가 1이면 한 방향으로만 움직여 경로가 1개입니다.`] : ['Destination path count ready', `There are ${v.result} paths. A width or height of one allows just one direction, producing one path.`];
  },
};

const rain: NumericAlgorithm = {
  id: 'rain-terraces', category: 'other', example: [0,1,0,2,1,0,1,3,2,1,2,1], usesStart: false, singleInput: true,
  name: { ko: '빗물 담기 문제', en: 'Trapping rain water' }, time: 'O(n)',
  summary: { ko: '각 위치 왼쪽·오른쪽의 최대 높이를 미리 기록합니다. 둘 중 낮은 벽 높이에서 현재 지형 높이를 빼면 이 칸에 고이는 물의 양입니다.', en: 'Precompute the maximum heights to each position’s left and right. The lower wall minus the current terrain height gives water stored at that position.' },
  inputLabels: [{ ko: '지형 높이', en: 'Terrain heights' }, { ko: '', en: '' }],
  inputHint: { ko: '정수 높이 1–18개 · 높이 0–12 · 칸 너비는 모두 1', en: '1–18 integer heights · values 0–12 · every cell has unit width' },
  source: algorithmCode(rainSource), run: traceRain,
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['양쪽 벽의 최대 높이 준비', '지형을 바꾸지 않고 왼쪽 최대, 오른쪽 최대, 각 칸의 물 높이를 별도로 저장합니다.'] : ['Prepare maximum walls on both sides', 'Keep the terrain unchanged and separately store left maxima, right maxima and water heights.'];
    if (step.type === 'left-max') return ko ? ['왼쪽에서 현재까지 최대 높이 기록', `위치 ${v.current}의 왼쪽 최대는 현재 높이와 직전 왼쪽 최대 중 큰 값입니다. 자기 위치도 포함합니다.`] : ['Record the maximum from the left', `At ${v.current}, take the larger of this height and the preceding left maximum, including the current position.`];
    if (step.type === 'right-max') return ko ? ['오른쪽에서 현재까지 최대 높이 기록', `위치 ${v.current}의 오른쪽 최대는 현재 높이와 다음 오른쪽 최대 중 큰 값입니다. 오른쪽 끝부터 계산합니다.`] : ['Record the maximum from the right', `At ${v.current}, take the larger of this height and the next right maximum, scanning from the right edge.`];
    if (step.type === 'water') return ko ? ['낮은 벽을 기준으로 물 높이 계산', `위치 ${v.current}의 수면 한계는 ${v.currentTerraceBoundary}입니다. 이 값에서 지형 높이를 뺀 만큼만 고이며 누적 물은 ${v.waterAmount}입니다.`] : ['Use the lower wall for water height', `Position ${v.current} has waterline limit ${v.currentTerraceBoundary}. Subtract terrain height; accumulated water is ${v.waterAmount}.`];
    return ko ? ['전체 빗물 양 계산 완료', `총 ${v.result} 단위의 물이 고입니다. 양끝이나 단조롭게 오르내리는 지형은 양쪽 벽이 없으므로 물이 고이지 않습니다.`] : ['Total trapped water ready', `Total water: ${v.result} units. Edges and monotonic terrain cannot hold water without bounding walls on both sides.`];
  },
};

const queens: NumericAlgorithm = {
  id: 'n-queens', category: 'other', example: [4], usesStart: false, singleInput: true,
  name: { ko: 'N-Queens 문제', en: 'N-Queens problem' }, time: 'O(N!) · backtracking',
  summary: { ko: 'N×N 보드의 각 행에 퀸 하나씩 놓되 같은 열이나 대각선에서 공격하지 않게 배치합니다. 후보를 검사하고 막히면 이전 퀸을 빼며 모든 해를 탐색합니다.', en: 'Place one queen per row on an N×N board without sharing a column or diagonal. Check candidates, remove earlier queens on backtracking, and enumerate every solution.' },
  inputLabels: [{ ko: '보드 크기 N', en: 'Board size N' }, { ko: '', en: '' }],
  inputHint: { ko: 'N=1–6 · 모든 해 탐색 · 마지막 보드에는 첫 번째 해 표시 · N=2,3은 해가 없음', en: 'N=1–6 · enumerate all solutions · final board shows the first solution · no solution for N=2 or 3' },
  source: algorithmCode(queensSource), run: traceQueens,
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['첫 행부터 퀸 배치 탐색', '각 행에 하나씩 놓고 왼쪽 열부터 후보를 검사합니다. 같은 열·두 대각선에 기존 퀸이 있으면 놓을 수 없습니다.'] : ['Start placing queens from the first row', 'Try columns left to right, placing one queen per row. Existing queens in the same column or either diagonal block placement.'];
    if (step.type === 'check') return ko ? [v.safe ? '공격받지 않는 후보' : '기존 퀸과 충돌하는 후보', `행 ${v.row}, 열 ${v.column}: ${v.safe ? '안전하므로 배치합니다' : '같은 열·대각선 충돌로 건너뜁니다'}.`] : [v.safe ? 'A safe candidate' : 'A conflicting candidate', `Row ${v.row}, column ${v.column}: ${v.safe ? 'safe to place' : 'skip a shared-column or diagonal conflict'}.`];
    if (step.type === 'place') return ko ? ['현재 행에 퀸 배치', `(${v.row}, ${v.column})에 놓고 다음 행으로 재귀 탐색합니다. 이 배치가 전체 해가 될지는 아직 모릅니다.`] : ['Place a queen in this row', `Place at (${v.row}, ${v.column}) and recurse into the next row. This partial placement may not lead to a solution.`];
    if (step.type === 'backtrack') return ko ? ['현재 퀸 제거 · 다른 후보 탐색', '아래 행의 탐색을 마쳤거나 막혔으므로 현재 퀸을 제거합니다. 다음 열 후보로 탐색을 이어갑니다.'] : ['Remove this queen and explore another candidate', 'Lower rows finished or reached a dead end. Remove this queen and continue with the next column.'];
    if (step.type === 'solution') return ko ? ['모든 행 배치 성공 · 해 저장', `${v.count}번째 해를 저장했습니다. 다른 해를 찾기 위해 되돌아가 탐색을 계속합니다.`] : ['All rows placed · save a solution', `Saved solution ${v.count}. Backtrack and continue searching for other solutions.`];
    return ko ? [v.count ? '모든 해 탐색 완료' : '가능한 배치가 없음', `총 ${v.count}개입니다. ${v.count ? '보드에는 첫 번째 해를 표시하며 아래에 모든 해의 행별 열 번호가 나옵니다.' : '모든 후보를 검사했지만 N개 퀸을 안전하게 놓을 수 없습니다.'}`] : [v.count ? 'All solutions ready' : 'No valid placement', `Found ${v.count} solutions. ${v.count ? 'The board shows the first; all row-wise column lists appear below.' : 'All candidates were explored without a complete safe placement.'}`];
  },
};

const knight: NumericAlgorithm = {
  id: 'knight-tour', category: 'other', example: [5], usesStart: false, singleInput: true,
  name: { ko: '기사의 여행 문제', en: 'Knight’s tour' }, time: 'O(8^(N²)) · worst case',
  summary: { ko: '기사가 (0,0)에서 시작해 모든 칸을 정확히 한 번 방문하는 열린 경로를 찾습니다. 가능한 다음 이동이 적은 칸을 먼저 시도하고 막히면 되돌리는 백트래킹을 사용합니다.', en: 'Find an open knight path from (0,0) visiting every square exactly once. Try squares with fewer onward moves first and backtrack on dead ends.' },
  inputLabels: [{ ko: '보드 크기 N', en: 'Board size N' }, { ko: '', en: '' }],
  inputHint: { ko: 'N=1–5 · 시작 (0,0) · 원래 구현에 이동 순서 휴리스틱 사용 · 시작점 복귀는 요구하지 않음', en: 'N=1–5 · start (0,0) · enable move-order heuristic in the original solver · returning to start is not required' },
  source: algorithmCode(knightSource), run: traceKnight,
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['왼쪽 위에서 기사 여행 시작', '기사는 한 방향으로 2칸, 직각 방향으로 1칸 이동합니다. 보드 밖이나 이미 방문한 칸은 갈 수 없습니다.'] : ['Start the knight at the top-left', 'Move two squares along one axis and one along the other. Ignore squares outside the board or already visited.'];
    if (step.type === 'move') return ko ? ['방문하지 않은 칸으로 L자 이동', `(${v.row}, ${v.column})까지 ${v.count}칸 방문했습니다. 다음 이동이 적은 후보부터 시도하지만, 막히면 여전히 백트래킹합니다.`] : ['Make an L-shaped move into an unvisited square', `Visited ${v.count} squares through (${v.row}, ${v.column}). Fewer onward choices are tried first, with backtracking when necessary.`];
    if (step.type === 'backtrack') return ko ? ['막힌 경로에서 한 칸 되돌리기', `(${v.row}, ${v.column})의 방문을 취소하고 이전 경로로 돌아갑니다. 방문 표시를 지워 다른 가지에서 다시 시도할 수 있게 합니다.`] : ['Backtrack from a dead end', `Undo the visit to (${v.row}, ${v.column}) and return to the previous path. Clear its mark so another branch can reuse it.`];
    return ko ? [v.result ? '모든 칸을 방문하는 여행 성공' : '이 보드에는 여행 경로가 없음', v.result ? `${v.count}칸을 한 번씩 방문했습니다. 숫자는 방문 순서이며 시작 칸으로 돌아갈 필요는 없습니다.` : '가능한 이동 가지를 모두 탐색했지만 모든 칸을 방문할 수 없었습니다. N=5에서 성공 경로를 확인할 수 있습니다.'] : [v.result ? 'A complete knight tour found' : 'No tour exists on this board', v.result ? `Visited ${v.count} squares once each. Numbers show visit order; returning to the start is not required.` : 'All move branches were exhausted without a complete tour. N=5 provides a successful example.'];
  },
};

const stairs: NumericAlgorithm = {
  id: 'recursive-staircase', category: 'other', example: [5], usesStart: false, singleInput: true,
  name: { ko: '계단 오르기 경우의 수', en: 'Staircase ways' }, time: 'O(n)',
  summary: { ko: '한 번에 1칸 또는 2칸 오를 때 n번째 계단까지 도달하는 순서를 셉니다. 원본 DP 구현은 직전 두 계단의 경우의 수를 더해 다음 값을 계산합니다.', en: 'Count ordered ways to reach stair n using one- or two-step climbs. The original dynamic-programming implementation adds the counts of the two preceding stairs.' },
  inputLabels: [{ ko: '계단 수 n', en: 'Stair count n' }, { ko: '', en: '' }],
  inputHint: { ko: 'n=0–20 · 1칸/2칸 이동 · 원본 함수의 규약상 n=0은 0개', en: 'n=0–20 · one- or two-step moves · the original function defines zero stairs as zero ways' },
  source: algorithmCode(stairsSource), run: traceStairs,
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['계단별 경우의 수 배열 준비', `n=${v.n}까지 계산합니다. [1,2]와 [2,1]은 다른 순서이므로 따로 셉니다.`] : ['Prepare counts for each stair', `Calculate through n=${v.n}. [1,2] and [2,1] count separately because order matters.`];
    if (step.type === 'base') return ko ? ['1칸과 2칸의 기본 경우 설정', '1번째 계단은 [1] 하나, 2번째 계단은 [1,1]과 [2] 두 개입니다. 원본 규약을 따라 0번째 값은 0으로 표시합니다.'] : ['Initialize one- and two-stair base cases', 'Stair 1 has [1]; stair 2 has [1,1] and [2]. Preserve the original convention of zero ways for stair 0.'];
    if (step.type === 'cell-sum') return ko ? ['마지막 이동이 1칸·2칸인 경우 더하기', `${v.current}번째 계단은 직전 계단에서 1칸, 두 칸 전에서 2칸 이동해 옵니다. 두 경우가 겹치지 않으므로 이전 두 값을 더합니다.`] : ['Add cases ending with one- and two-step moves', `Stair ${v.current} is reached by one step from the previous stair or two from the stair before it. Add these disjoint counts.`];
    return ko ? ['계단 오르기 경우의 수 확정', `${v.n}개 계단을 오르는 순서는 ${v.result}개입니다. 재귀 관계를 배열에 저장해 같은 하위 문제를 반복 계산하지 않습니다.`] : ['Staircase count ready', `There are ${v.result} ordered ways for ${v.n} stairs. Storing the recurrence avoids repeated subproblem calculations.`];
  },
};

export const puzzleAlgorithms: Algorithm[] = [hanoi, rotation, jump, paths, rain, queens, knight, stairs];
