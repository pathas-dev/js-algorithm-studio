import rotationSource from '../src/algorithms/uncategorized/square-matrix-rotation/squareMatrixRotation.js?raw';
import hanoiSource from '../src/algorithms/uncategorized/hanoi-tower/hanoiTower.js?raw';
import traceHanoi, { traceRotation } from '../src/visualization/puzzles';
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

export const puzzleAlgorithms: Algorithm[] = [hanoi, rotation];
