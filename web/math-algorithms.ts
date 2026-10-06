import factorialSource from '../src/algorithms/math/factorial/factorial.js?raw';
import type { NumericAlgorithm } from './algorithms';
import { algorithmCode } from '../src/visualization/playback';
import traceBits, { traceFactorial } from '../src/visualization/math';
import getBitSource from '../src/algorithms/math/bits/getBit.js?raw';
import setBitSource from '../src/algorithms/math/bits/setBit.js?raw';
import clearBitSource from '../src/algorithms/math/bits/clearBit.js?raw';
import updateBitSource from '../src/algorithms/math/bits/updateBit.js?raw';
import multiplySource from '../src/algorithms/math/bits/multiplyByTwo.js?raw';
import divideSource from '../src/algorithms/math/bits/divideByTwo.js?raw';

export const bits: NumericAlgorithm = {
  id: 'bits', category: 'math', usesStart: false,
  name: { ko: '비트 연산', en: 'Bit manipulation' },
  summary: { ko: '같은 입력에 비트 조회·설정·삭제·갱신·이동을 각각 적용합니다. 오른쪽 끝이 비트 0이며 각 결과는 원래 숫자로부터 독립적으로 계산합니다.', en: 'Apply read, set, clear, update and shifts independently to the same input. The rightmost bit is position zero.' },
  source: algorithmCode([getBitSource, setBitSource, clearBitSource, updateBitSource, multiplySource, divideSource].join('\n')),
  example: [13, 2, 1], time: 'O(1)',
  inputLabels: [{ ko: '숫자, 비트 위치, 비트 값', en: 'Number, bit position, bit value' }, { ko: '', en: '' }],
  inputHint: { ko: '숫자 0–255 · 비트 위치 0–7 · 비트 값 0 또는 1 · 예: 13, 2, 1', en: 'Number 0–255 · bit position 0–7 · bit value 0 or 1 · e.g. 13, 2, 1' },
  run: (values) => traceBits(values),
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    switch (step.type) {
      case 'start': return ko ? ['입력 비트 준비', `숫자 ${v.number}의 이진 표현을 확인합니다. 선택한 비트 위치는 ${v.position}, 갱신 값은 ${v.bitValue}입니다.`] : ['Prepare input bits', `Inspect the binary representation of ${v.number}. Selected position: ${v.position}; update value: ${v.bitValue}.`];
      case 'getBit': return ko ? ['비트 조회', `오른쪽으로 ${v.position}칸 이동한 뒤 1과 AND합니다. 선택한 비트는 ${v.result}입니다.`] : ['Read a bit', `Shift right by ${v.position} then AND with one. Selected bit: ${v.result}.`];
      case 'setBit': return ko ? ['비트를 1로 설정', '1을 선택한 위치로 이동해 OR합니다. 다른 비트는 그대로 유지합니다.'] : ['Set a bit', 'Shift one to the selected position and OR it. Preserve all other bits.'];
      case 'clearBit': return ko ? ['비트를 0으로 삭제', '선택한 위치만 0인 마스크와 AND합니다. 다른 비트는 유지합니다.'] : ['Clear a bit', 'AND with a mask that is zero only at the selected position. Preserve the other bits.'];
      case 'updateBit': return ko ? ['비트 값 갱신', `선택한 위치를 먼저 0으로 만든 뒤 ${v.bitValue}를 OR하여 원하는 값으로 갱신합니다.`] : ['Update a bit', `Clear the selected position, then OR in ${v.bitValue}.`];
      case 'multiplyByTwo': return ko ? ['왼쪽으로 한 칸 이동', `왼쪽 이동은 현재 입력 범위에서 2배가 됩니다. ${v.number} × 2 = ${v.result}.`] : ['Shift left once', `In this input range a left shift doubles the number: ${v.number} × 2 = ${v.result}.`];
      case 'divideByTwo': return ko ? ['오른쪽으로 한 칸 이동', `오른쪽 이동은 2로 나눈 정수 몫입니다. ${v.number} ÷ 2 → ${v.result}.`] : ['Shift right once', `A right shift gives integer division by two: ${v.number} ÷ 2 → ${v.result}.`];
      default: return ko ? ['비트 연산 비교 완료', '각 연산은 원래 입력에 독립적으로 적용했습니다. 단계가 이전 단계의 결과를 이어 받는 연산 사슬은 아닙니다.'] : ['Bit operation comparison complete', 'Each operation was applied independently to the original input; these are not chained transformations.'];
    }
  },
};

export const factorialLesson: NumericAlgorithm = {
  id: 'factorial', category: 'math', usesStart: false,
  name: { ko: '팩토리얼', en: 'Factorial' },
  summary: { ko: '1부터 n까지 차례로 곱합니다. 0!과 1!은 1이며, 누적 곱을 업데이트하는 과정을 확인합니다.', en: 'Multiply integers from 1 through n. Both 0! and 1! are one; inspect each accumulated product.' },
  source: algorithmCode(factorialSource), example: [6], time: 'O(n)',
  inputLabels: [{ ko: 'n', en: 'n' }, { ko: '', en: '' }],
  inputHint: { ko: '정수 하나 · 0–18 · 정확한 JavaScript 정수 범위', en: 'One integer · 0–18 · exact JavaScript integer results' },
  run: (values) => traceFactorial(values),
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['누적 곱 1로 시작', '곱셈의 항등원 1로 시작합니다. n이 0이나 1이면 곱할 값이 없어 그대로 반환합니다.'] : ['Start with product one', 'Start at the multiplicative identity. For n zero or one, return one without multiplying.'];
    if (step.type === 'multiply') return ko ? ['다음 정수 곱하기', `현재 누적 곱에 ${v.i}를 곱했습니다. ${v.expression}.`] : ['Multiply the next integer', `Multiply the accumulated product by ${v.i}: ${v.expression}.`];
    return ko ? ['팩토리얼 완료', `${v.number}! = ${v.result}. 입력 18까지는 JavaScript의 안전한 정수 범위 안에서 정확합니다.`] : ['Factorial ready', `${v.number}! = ${v.result}. Inputs through 18 remain exact safe JavaScript integers.`];
  },
};

export const mathAlgorithms: NumericAlgorithm[] = [bits, factorialLesson];
