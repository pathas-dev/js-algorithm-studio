import linearSearch from '../src/algorithms/search/linear-search/linearSearch';
import linearSource from '../src/algorithms/search/linear-search/linearSearch.js?raw';
import QuickSortInPlace from '../src/algorithms/sorting/quick-sort/QuickSortInPlace';
import quickSource from '../src/algorithms/sorting/quick-sort/QuickSortInPlace.js?raw';
import MergeSort from '../src/algorithms/sorting/merge-sort/MergeSort';
import mergeSource from '../src/algorithms/sorting/merge-sort/MergeSort.js?raw';
import InsertionSort from '../src/algorithms/sorting/insertion-sort/InsertionSort';
import insertionSource from '../src/algorithms/sorting/insertion-sort/InsertionSort.js?raw';
import SelectionSort from '../src/algorithms/sorting/selection-sort/SelectionSort';
import selectionSource from '../src/algorithms/sorting/selection-sort/SelectionSort.js?raw';
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


export type Algorithm = {
  id: string;
  name: Record<Language, string>;
  summary: Record<Language, string>;
  source: string;
  example: number[];
  time: string;
  category: 'sort' | 'search';
  target?: number;
  run(values: number[], target?: number): Step[];
  explain(step: Step, language: Language): [string, string];
};

function runSort(Sorter: typeof BubbleSort, values: number[]): Step[] {
  const steps: Step[] = [];
  // ponytail: full snapshots for at most 32 values; use deltas for larger lessons.
  new Sorter({
    compareCallback: (a: Item, b: Item) => a.value - b.value,
    stepCallback: (step: Step) => steps.push(step),
  }).sort(values.map((value, id) => ({ value, id })));
  return steps;
}

export const bubble: Algorithm = {
  category: 'sort',
  id: 'bubble-sort',
  name: { ko: '버블 정렬', en: 'Bubble sort' },
  summary: {
    ko: '이웃한 두 값을 비교하고 교환하며, 큰 값부터 뒤쪽에 확정합니다.',
    en: 'Compare neighbors, swap when needed, and settle the largest values at the end.',
  },
  source: algorithmCode(bubbleSource),
  example: [8, 3, 6, 1, 5, 2],
  time: 'O(n²)',
  run: (values: number[]) => runSort(BubbleSort, values),
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

export const selection: Algorithm = {
  category: 'sort',
  id: 'selection-sort',
  name: { ko: '선택 정렬', en: 'Selection sort' },
  summary: { ko: '미정렬 구간의 최솟값을 찾아 앞쪽에 하나씩 확정합니다.', en: 'Find the minimum in the remaining range and settle it at the front.' },
  source: algorithmCode(selectionSource),
  example: [8, 3, 6, 1, 5, 2],
  time: 'O(n²)',
  run: (values: number[]) => runSort(SelectionSort, values),
  explain(step: Step, language: Language): [string, string] {
    const ko = language === 'ko';
    const v = step.variables;
    switch (step.type) {
      case 'start': return bubble.explain(step, language);
      case 'compare': {
        const [candidate, minimum] = step.indices.map((index) => step.array[index].value);
        return ko ? ['최솟값 탐색', `후보 값(${candidate})과 현재 최솟값(${minimum})을 비교합니다. 더 작은 값을 찾으면 minIndex를 갱신합니다.`]
          : ['Find the minimum', `Compare candidate ${candidate} with minimum ${minimum}. Update minIndex if the candidate is smaller.`];
      }
      case 'minimum': return ko ? ['최솟값 갱신', `인덱스 ${v.minIndex}의 값(${step.array[Number(v.minIndex)].value})이 지금까지 살펴본 구간의 최솟값입니다.`]
        : ['New minimum', `Value ${step.array[Number(v.minIndex)].value} at index ${v.minIndex} is the smallest seen so far.`];
      case 'swap': return ko ? ['최솟값 배치', `최솟값을 인덱스 ${v.i}로 옮겼습니다. 선택 정렬은 멀리 떨어진 값을 교환하므로 안정 정렬이 아닙니다.`]
        : ['Place the minimum', `Move the minimum to index ${v.i}. Distant swaps mean selection sort is not stable.`];
      case 'pass': return ko ? ['앞쪽 위치 확정', `앞의 ${v.sortedCount}개 위치가 확정됐습니다. 다음 탐색은 나머지 구간에서 시작합니다.`]
        : ['Prefix settled', `The first ${v.sortedCount} positions are settled. Continue with the remaining range.`];
      default: return bubble.explain(step, language);
    }
  },
};

export const insertion: Algorithm = {
  category: 'sort',
  id: 'insertion-sort',
  name: { ko: '삽입 정렬', en: 'Insertion sort' },
  summary: { ko: '다음 값을 앞의 정렬된 구간에 삽입합니다. 이 구간의 값은 이후에도 이동할 수 있습니다.', en: 'Insert the next value into the sorted prefix. Prefix values may still move later.' },
  source: algorithmCode(insertionSource),
  example: [8, 3, 6, 1, 5, 2],
  time: 'O(n²)',
  run: (values: number[]) => runSort(InsertionSort, values),
  explain(step: Step, language: Language): [string, string] {
    const ko = language === 'ko';
    switch (step.type) {
      case 'start': return bubble.explain(step, language);
      case 'compare': {
        if (step.variables.currentIndex === 0) return ko ? ['왼쪽 끝 도달', '삽입할 값이 맨 앞에 도달했습니다. 왼쪽 이웃이 없으므로 while 조건이 거짓이 되어 멈춥니다.']
          : ['Left boundary', 'The value reached the beginning. No left neighbor exists, so the while condition is false.'];
        const [left, current] = step.indices.map((index) => step.array[index].value);
        return ko ? ['삽입 위치 찾기', `왼쪽 값(${left})과 삽입할 값(${current})을 비교합니다. 왼쪽이 더 크면 교환하고 한 칸 더 왼쪽을 확인합니다.`]
          : ['Find the insertion position', `Compare left value ${left} with current value ${current}. Swap and move left if the left value is greater.`];
      }
      case 'swap': return ko ? ['왼쪽으로 이동', '삽입할 값을 한 칸 왼쪽으로 옮겼습니다. 같은 값끼리는 교환하지 않아 기존 순서를 유지합니다.']
        : ['Move left', 'Move the current value one position left. Equal values are not swapped, preserving their original order.'];
      case 'pass': return ko ? ['정렬된 앞쪽 구간', `앞의 ${step.variables.sortedCount}개 값이 정렬됐습니다. 다음 값을 삽입하면 이 구간의 위치가 다시 바뀔 수 있습니다.`]
        : ['Sorted prefix', `The first ${step.variables.sortedCount} values are sorted. Inserting later values can still shift their positions.`];
      default: return bubble.explain(step, language);
    }
  },
};

export const merge: Algorithm = {
  category: 'sort',
  id: 'merge-sort',
  name: { ko: '병합 정렬', en: 'Merge sort' },
  summary: { ko: '부분 배열을 반으로 나누고, 정렬된 두 배열의 앞쪽 값을 비교해 합칩니다.', en: 'Split into halves, then merge sorted halves by comparing their leading values.' },
  source: algorithmCode(mergeSource),
  example: [8, 3, 6, 1, 5, 2],
  time: 'O(n log n)',
  run: (values: number[]) => runSort(MergeSort, values),
  explain(step: Step, language: Language): [string, string] {
    const ko = language === 'ko';
    switch (step.type) {
      case 'start': return ko ? ['분할 시작', '현재 부분 배열의 길이를 확인합니다. 0개 또는 1개면 이미 정렬됐고, 그렇지 않으면 반으로 나눕니다.']
        : ['Begin dividing', 'Check the current subarray length. Zero or one value is already sorted; otherwise split it in half.'];
      case 'focus': return ko ? ['부분 배열 진입', `재귀 깊이 ${step.variables.depth}의 부분 배열을 보고 있습니다. 인덱스는 이 부분 배열 기준입니다.`]
        : ['Enter a subarray', `Viewing the subarray at recursion depth ${step.variables.depth}. Indices are local to this subarray.`];
      case 'split': return ko ? ['반으로 나누기', `인덱스 ${step.variables.middleIndex}를 기준으로 왼쪽과 오른쪽을 나눕니다. 왼쪽부터 재귀적으로 정렬합니다.`]
        : ['Split in half', `Split at index ${step.variables.middleIndex}, then recursively sort the left half before the right half.`];
      case 'base': return ko ? ['재귀 종료 조건', '부분 배열의 길이가 1 이하이므로 비교 없이 반환합니다. 상위 호출에서 이 결과를 병합합니다.']
        : ['Base case', 'Return this subarray without comparisons because it has at most one value. The parent call will merge it.'];
      case 'compare': {
        const [left, right] = step.indices.map((index) => step.array[index].value);
        return ko ? ['두 구간의 앞쪽 비교', `왼쪽의 다음 값(${left})과 오른쪽의 다음 값(${right})을 비교합니다. 같은 값이면 왼쪽부터 선택해 안정성을 유지합니다. 초록색은 현재 병합 결과입니다.`]
          : ['Compare the two heads', `Compare left head ${left} and right head ${right}. Choose the left on equality to preserve stability. Green shows the current merged output.`];
      }
      case 'take': return ko ? ['작은 값 추가', '더 작은 값을 병합 결과 뒤에 넣고 해당 포인터를 전진했습니다. 남은 두 구간의 앞쪽을 다시 비교합니다.']
        : ['Append the smaller value', 'Append the smaller value and advance its pointer. Compare the heads of the remaining ranges next.'];
      case 'merged': return ko ? ['부분 병합 완료', '한쪽 구간을 모두 사용하면 다른 구간의 남은 값을 이어 붙입니다. 정렬된 부분 배열을 상위 호출에 반환합니다.']
        : ['Subarray merged', 'When one side is exhausted, append the remaining values from the other. Return this sorted subarray to its parent.'];
      default: return bubble.explain(step, language);
    }
  },
};

export const quick: Algorithm = {
  category: 'sort',
  id: 'quick-sort',
  name: { ko: '퀵 정렬', en: 'Quick sort' },
  summary: { ko: '입력을 복사하고 구간 내에서 교환합니다. 마지막 값을 피벗으로 삼아 작은 값들을 왼쪽에 모읍니다.', en: 'Copy the input, then partition each range in place using its last value as the pivot.' },
  source: algorithmCode(quickSource),
  example: [8, 3, 6, 1, 5, 2],
  time: 'O(n log n) · worst O(n²)',
  run: (values: number[]) => runSort(QuickSortInPlace, values),
  explain(step: Step, language: Language): [string, string] {
    const ko = language === 'ko';
    const v = step.variables;
    switch (step.type) {
      case 'start': return bubble.explain(step, language);
      case 'range': return ko ? ['재귀 구간 확인', `현재 구간은 ${v.lowIndex}부터 ${v.highIndex}까지입니다. 두 끝이 같거나 역전되면 분할할 필요가 없습니다.`]
        : ['Inspect the recursive range', `Current range: ${v.lowIndex} through ${v.highIndex}. Equal or inverted bounds need no partition.`];
      case 'pivot': return ko ? ['피벗 선택', `구간의 마지막 값(${step.array[Number(v.pivotIndex)].value})을 피벗으로 선택합니다. 점선 테두리와 ◆가 피벗을 표시합니다.`]
        : ['Choose the pivot', `Choose the last value, ${step.array[Number(v.pivotIndex)].value}, as pivot. A dashed outline and ◆ mark it.`];
      case 'compare': return ko ? ['피벗과 비교', `인덱스 ${v.currentIndex}의 값이 피벗보다 작은지 확인합니다. 작으면 partitionIndex 앞쪽 구간에 넣습니다.`]
        : ['Compare with the pivot', `Check whether value at ${v.currentIndex} is smaller than the pivot. If so, move it to the left partition.`];
      case 'swap': return ko ? ['구간 내 교환', `인덱스 ${v.leftIndex}와 ${v.rightIndex}를 교환합니다. 같은 인덱스라면 배열은 그대로입니다. 이 방식은 안정 정렬이 아닙니다.`]
        : ['Swap within the range', `Swap indices ${v.leftIndex} and ${v.rightIndex}. Swapping an index with itself leaves the array unchanged. This variant is not stable.`];
      case 'partition': return ko ? ['피벗 위치 확정', `피벗을 인덱스 ${v.pivotIndex}에 놓았습니다. 왼쪽은 피벗보다 작고 오른쪽은 크거나 같습니다. 양쪽 구간을 각각 정렬합니다.`]
        : ['Pivot settled', `Place the pivot at ${v.pivotIndex}. Left values are smaller; right values are greater or equal. Sort the two ranges recursively.`];
      case 'return': return ko ? ['구간 처리 완료', `구간 ${v.lowIndex}…${v.highIndex}의 처리가 끝나 상위 호출로 돌아갑니다.`]
        : ['Range complete', `Range ${v.lowIndex}…${v.highIndex} is complete. Return to the parent call.`];
      default: return bubble.explain(step, language);
    }
  },
};

function runSearch(Search: typeof linearSearch, values: number[], target = 3): Step[] {
  const steps: Step[] = [];
  const items = values.map((value, id) => ({ value, id }));
  Search(values, target, (a: number, b: number) => a - b, (step: Omit<Step, 'array'>) => steps.push({ ...step, array: [...items] }));
  return steps;
}

export const linear: Algorithm = {
  id: 'linear-search', category: 'search', target: 3,
  name: { ko: '선형 검색', en: 'Linear search' },
  summary: { ko: '처음부터 끝까지 확인해 목표 값과 일치하는 모든 인덱스를 찾습니다.', en: 'Inspect every value and return all matching indices.' },
  source: algorithmCode(linearSource), example: [8, 3, 6, 1, 3, 2], time: 'O(n)',
  run: (values, target) => runSearch(linearSearch, values, target),
  explain(step, language) {
    const ko = language === 'ko';
    const v = step.variables;
    switch (step.type) {
      case 'start': return ko ? ['검색 시작', `목표 값은 ${v.target}입니다. 일치하는 위치를 담을 빈 배열을 준비합니다.`]
        : ['Begin searching', `The target is ${v.target}. Prepare an empty list of matching indices.`];
      case 'compare': return ko ? ['값 확인', `인덱스 ${v.index}의 값(${step.array[Number(v.index)].value})과 목표 값(${v.target})이 같은지 확인합니다.`]
        : ['Inspect a value', `Check whether value ${step.array[Number(v.index)].value} at index ${v.index} equals target ${v.target}.`];
      case 'found': return ko ? ['일치 위치 기록', `인덱스 ${v.index}에서 목표 값을 찾았습니다. 중복 값도 모두 찾기 위해 검색을 계속합니다.`]
        : ['Record a match', `Found the target at index ${v.index}. Continue searching to find every duplicate.`];
      default: return ko ? ['검색 완료', v.matches ? `일치하는 인덱스: ${v.matches}. 반환 값은 일치 위치의 배열입니다.` : '목표 값이 없습니다. 빈 배열을 반환합니다.']
        : ['Search complete', v.matches ? `Matching indices: ${v.matches}. Return the list of all matching positions.` : 'No matches. Return an empty list.'];
    }
  },
};

export const algorithms: Algorithm[] = [bubble, selection, insertion, merge, quick, linear];
