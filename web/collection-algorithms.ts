import shuffleSource from '../src/algorithms/sets/fisher-yates/fisherYates.js?raw';
import type { Algorithm, TextAlgorithm, NumericAlgorithm } from './algorithms';
import source from '../src/algorithms/sets/cartesian-product/cartesianProduct.js?raw';
import { algorithmCode } from '../src/visualization/playback';
import traceCartesian, { traceShuffle } from '../src/visualization/collections';

export const cartesianLesson: TextAlgorithm = {
  id: 'cartesian-product', category: 'sets', inputMode: 'text',
  name: { ko: '카티지언 프로덕트', en: 'Cartesian product' },
  summary: { ko: 'A의 각 원소를 B의 모든 원소와 짝짓습니다. (a,b)는 순서쌍이므로 A×B와 B×A는 일반적으로 다릅니다.', en: 'Pair every element of A with every element of B. Pairs are ordered, so A×B generally differs from B×A.' },
  source: algorithmCode(source), example: ['1, 2, 3', 'a, b'], time: 'O(|A| × |B|)',
  inputLabels: [{ ko: '집합 A', en: 'Set A' }, { ko: '집합 B', en: 'Set B' }],
  inputHint: { ko: '쉼표 또는 공백 구분 · 각 집합 최대 6개 · 원소당 12글자 · 중복 제거 · 빈 집합 허용', en: 'Comma or space separated · at most six items per set · twelve characters per item · duplicates removed · empty sets allowed' },
  run: (inputs) => traceCartesian(inputs),
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['두 집합 준비', '바깥 반복문에서 A의 원소를 고르고 안쪽 반복문에서 B의 원소를 하나씩 선택합니다.'] : ['Prepare the two sets', 'The outer loop picks an element of A; the inner loop picks every element of B.'];
    if (step.type === 'append-pair') return ko ? ['순서쌍 추가', `(${v.first}, ${v.second})를 추가했습니다. 첫 자리는 A, 둘째 자리는 B에서 온 값입니다. 지금까지 ${v.count}쌍을 만들었습니다.`] : ['Append an ordered pair', `Append (${v.first}, ${v.second}). The first item comes from A and the second from B. Created ${v.count} pairs so far.`];
    return ko ? ['카티지언 프로덕트 완성', Number(v.count) ? `총 ${v.count}쌍입니다. 원소 수는 |A|×|B|이며 서로 다른 집합의 같은 글자도 각 자리를 유지합니다.` : '빈 집합과의 곱은 빈 집합입니다. 원래 함수는 이 경우 null을 반환하며 화면에서는 ∅로 표시합니다.'] : ['Cartesian product ready', Number(v.count) ? `${v.count} pairs, equal to |A|×|B|. Matching item labels from different sets retain their positions.` : 'A product with an empty set is empty. The original function returns null here; the interface displays ∅.'];
  },
};

export const shuffleLesson: NumericAlgorithm = {
  id: 'fisher-yates', category: 'sets', usesStart: false, singleInput: true,
  name: { ko: 'Fisher–Yates 셔플', en: 'Fisher–Yates shuffle' },
  summary: { ko: '오른쪽 자리부터 0–i 중 한 위치를 무작위로 골라 교환합니다. 녹색 자리는 확정됐으며 뒤의 반복에서 다시 바꾸지 않습니다.', en: 'From the right, choose a random position in 0–i and swap. Green positions are fixed and untouched by later iterations.' },
  source: algorithmCode(shuffleSource), example: [1, 2, 3, 4, 5, 6, 7, 8], time: 'O(n)',
  inputHint: { ko: '숫자 최대 32개 · 중복과 음수 허용 · 다시 재생은 같은 추첨, 입력 적용은 새 추첨', en: 'At most 32 numbers · duplicates and negatives allowed · replay keeps the draw; applying input draws anew' },
  run: (values) => traceShuffle(values),
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['입력 배열 복사', '원본을 보존하고 복사본을 섞습니다. 오른쪽부터 한 자리씩 확정합니다. 셔플 결과가 원본과 같을 수도 있습니다.'] : ['Copy the input array', 'Preserve the original and shuffle a copy, fixing positions from the right. A valid shuffle can equal the original.'];
    if (step.type === 'select') return ko ? ['남은 범위에서 균등 선택', `0부터 ${v.i}까지 ${Number(v.i) + 1}개 위치 중 ${v.randomIndex}를 골랐습니다. 자기 자신도 선택할 수 있어야 모든 순열이 균등하게 가능합니다.`] : ['Choose uniformly from the remaining range', `Choose ${v.randomIndex} from ${Number(v.i) + 1} positions, zero through ${v.i}. Allow self-selection so every permutation remains equally possible.`];
    if (step.type === 'swap') return ko ? ['교환하고 오른쪽 자리 확정', `${v.i}와 ${v.randomIndex}를 교환했습니다. ${v.i}번 자리는 이후 반복에서 제외합니다.`] : ['Swap and fix the right position', `Swap positions ${v.i} and ${v.randomIndex}. Position ${v.i} is excluded from later iterations.`];
    return ko ? ['셔플 완료', '값을 추가하거나 삭제하지 않고 순서만 바꿨습니다. 재생을 다시 하면 기록한 동일 추첨을 보여주며 입력 적용 시 새로 추첨합니다.'] : ['Shuffle ready', 'Only the order changed; no values were added or removed. Replay uses the recorded draw; applying input draws a new shuffle.'];
  },
};

export const collectionAlgorithms: Algorithm[] = [cartesianLesson, shuffleLesson];
