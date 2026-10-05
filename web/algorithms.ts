import BubbleSort from '../src/algorithms/sorting/bubble-sort/BubbleSort';
import bubbleSource from '../src/algorithms/sorting/bubble-sort/BubbleSort.js?raw';
import { algorithmCode } from '../src/visualization/playback';

export type Language = 'ko' | 'en';
export type Item = { value: number; id: number };
export type Step = {
  type: string;
  array: Item[];
  indices: number[];
  variables: Record<string, number | string | boolean>;
  code: string;
};

export const bubble = {
  id: 'bubble-sort',
  name: { ko: '버블 정렬', en: 'Bubble sort' },
  summary: {
    ko: '이웃한 두 값을 비교하고 교환하며, 큰 값부터 뒤쪽에 확정합니다.',
    en: 'Compare neighbors, swap when needed, and settle the largest values at the end.',
  },
  source: algorithmCode(bubbleSource),
  example: [8, 3, 6, 1, 5, 2],
  time: 'O(n²)',
  run(values: number[]) {
    const steps: Step[] = [];
    // ponytail: full snapshots for at most 32 values; use deltas for larger lessons.
    new BubbleSort({
      compareCallback: (a: Item, b: Item) => a.value - b.value,
      stepCallback: (step: Step) => steps.push(step),
    }).sort(values.map((value, id) => ({ value, id })));
    return steps;
  },
  explain(step: Step, language: Language): [string, string] {
    const ko = language === 'ko';
    switch (step.type) {
      case 'start':
        return ko
          ? ['입력 준비', '입력 배열을 복사합니다. 원본을 보존하고 이 복사본에서 정렬을 진행합니다.']
          : ['Prepare the input', 'Copy the input so sorting can preserve the original array.'];
      case 'compare': {
        const [a, b] = step.indices.map((index) => step.array[index].value);
        return ko
          ? ['이웃한 값 비교', `${a}와 ${b}를 비교합니다. 오른쪽 값이 더 작으면 교환하여 작은 값을 왼쪽으로 보냅니다.`]
          : ['Compare neighbors', `Compare ${a} and ${b}. Swap if the right value is smaller, moving it to the left.`];
      }
      case 'swap': {
        const [a, b] = step.indices.map((index) => step.array[index].value);
        return ko
          ? ['두 값 교환', `왼쪽 값(${b})이 오른쪽 값(${a})보다 커서 교환했습니다. 이제 작은 값은 왼쪽, 큰 값은 오른쪽에 있습니다.`]
          : ['Swap the pair', `${b} was greater than ${a}, so they swapped. ${a} is now on the left and ${b} on the right.`];
      }
      case 'pass':
        return ko
          ? ['한 번의 순회 완료', step.variables.swapped ? '이번 순회에서 가장 큰 미확정 값이 뒤쪽에 자리 잡았습니다. 다음 순회는 이 위치를 제외합니다.' : '이번 순회에는 교환이 없었습니다. 전체 배열이 정렬되어 있어 조기 종료할 수 있습니다.']
          : ['Pass complete', step.variables.swapped ? 'The largest unsettled value has reached the end. The next pass excludes this position.' : 'No swaps occurred, so the entire array is sorted and can finish early.'];
      default:
        return ko
          ? ['정렬 완료', step.array.length ? '모든 값이 오름차순으로 정렬됐습니다. 타임라인을 움직여 어느 단계든 다시 살펴보세요.' : '빈 배열은 이미 정렬된 상태입니다. 값을 입력하면 비교와 교환을 살펴볼 수 있습니다.']
          : ['Sorted', step.array.length ? 'Every value is in ascending order. Scrub the timeline to revisit any step.' : 'An empty array is already sorted. Add values to explore comparisons and swaps.'];
    }
  },
};
