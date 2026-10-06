import hanoiSource from '../src/algorithms/uncategorized/hanoi-tower/hanoiTower.js?raw';
import traceHanoi from '../src/visualization/puzzles';
import { algorithmCode } from '../src/visualization/playback';
import type { Algorithm, NumericAlgorithm } from './algorithms';

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

export const puzzleAlgorithms: Algorithm[] = [hanoi];
