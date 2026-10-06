import type { Algorithm, TextAlgorithm } from './algorithms';
import source from '../src/algorithms/sets/cartesian-product/cartesianProduct.js?raw';
import { algorithmCode } from '../src/visualization/playback';
import traceCartesian from '../src/visualization/collections';

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

export const collectionAlgorithms: Algorithm[] = [cartesianLesson];
