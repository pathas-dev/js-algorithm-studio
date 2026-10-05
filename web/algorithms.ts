import interpolationSearch from '../src/algorithms/search/interpolation-search/interpolationSearch';
import interpolationSource from '../src/algorithms/search/interpolation-search/interpolationSearch.js?raw';
import jumpSearch from '../src/algorithms/search/jump-search/jumpSearch';
import jumpSource from '../src/algorithms/search/jump-search/jumpSearch.js?raw';
import radixSource from '../src/algorithms/sorting/radix-sort/RadixSort.js?raw';
import countingSource from '../src/algorithms/sorting/counting-sort/CountingSort.js?raw';
import { traceCounting, traceRadix } from '../src/visualization/numeric';
import HeapSort from '../src/algorithms/sorting/heap-sort/HeapSort';
import heapSource from '../src/algorithms/sorting/heap-sort/HeapSort.js?raw';
import ShellSort from '../src/algorithms/sorting/shell-sort/ShellSort';
import shellSource from '../src/algorithms/sorting/shell-sort/ShellSort.js?raw';
import dfsSource from '../src/algorithms/graph/depth-first-search/depthFirstSearch.js?raw';
import bfsSource from '../src/algorithms/graph/breadth-first-search/breadthFirstSearch.js?raw';
import { traceBfs, traceDfs } from '../src/visualization/graph';
import binarySearch from '../src/algorithms/search/binary-search/binarySearch';
import binarySource from '../src/algorithms/search/binary-search/binarySearch.js?raw';
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
import { algorithmCode, requireSorted } from '../src/visualization/playback';

export type Language = 'ko' | 'en';
export type Item = { value: number; id: number };
export type Step = {
  type: string;
  array: Item[];
  indices: number[];
  variables: Record<string, number | string | boolean>;
  code: string;
  edges?: number[][];
};


export type Algorithm = {
  id: string;
  name: Record<Language, string>;
  summary: Record<Language, string>;
  source: string;
  example: number[];
  time: string | Record<Language, string>;
  category: 'sort' | 'search' | 'graph';
  target?: number;
  requiresSorted?: boolean;
  inputHint?: Record<Language, string>;
  randomMax?: number;
  graphEdges?: number[][];
  run(values: number[], target?: number, edges?: number[][]): Step[];
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
          ? ['이웃한 값 비교', `두 값(${a}, ${b})을 비교합니다. 오른쪽 값이 더 작으면 교환하여 작은 값을 왼쪽으로 보냅니다.`]
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
      case 'split': return ko ? ['반으로 나누기', `분할 위치(${step.variables.middleIndex})를 기준으로 왼쪽과 오른쪽을 나눕니다. 왼쪽부터 재귀적으로 정렬합니다.`]
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
  time: { ko: '평균 O(n log n) · 최악 O(n²)', en: 'Avg O(n log n) · worst O(n²)' },
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

function runSearch(Search: typeof linearSearch | typeof binarySearch | typeof jumpSearch, values: number[], target = 3): Step[] {
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

export const binary: Algorithm = {
  id: 'binary-search', category: 'search', target: 3, requiresSorted: true,
  name: { ko: '이진 검색', en: 'Binary search' },
  summary: { ko: '정렬된 배열의 중간 값을 비교해 탐색 범위를 절반씩 줄입니다. 중복 값은 일치 위치 하나를 반환합니다.', en: 'Halve the search range in a sorted array. Return one matching index when duplicates exist.' },
  source: algorithmCode(binarySource), example: [1, 2, 3, 5, 6, 8], time: 'O(log n)',
  run(values, target) { requireSorted(values); return runSearch(binarySearch, values, target); },
  explain(step, language) {
    const ko = language === 'ko';
    const v = step.variables;
    switch (step.type) {
      case 'start': return ko ? ['검색 구간 준비', `목표 값은 ${v.target}입니다. 오름차순 배열의 양 끝을 탐색 범위로 설정합니다.`]
        : ['Prepare the range', `Target: ${v.target}. Start with the full ascending array.`];
      case 'compare': return ko ? ['중간 값 비교', `구간 ${v.low}…${v.high}의 중간 인덱스 ${v.middleIndex}에서 값(${step.array[Number(v.middleIndex)].value})을 확인합니다.`]
        : ['Inspect the middle', `Inspect value ${step.array[Number(v.middleIndex)].value} at midpoint ${v.middleIndex} of range ${v.low}…${v.high}.`];
      case 'right': return ko ? ['오른쪽 절반 선택', `중간 값이 목표보다 작습니다. 왼쪽과 중간 위치를 제외하고 시작 인덱스를 ${v.low}로 옮깁니다. 흐린 막대는 제외된 위치입니다.`]
        : ['Choose the right half', `The middle value is smaller than the target. Exclude it and the left half; move the start to ${v.low}. Dim bars are excluded.`];
      case 'left': return ko ? ['왼쪽 절반 선택', `중간 값이 목표보다 큽니다. 오른쪽과 중간 위치를 제외하고 끝 인덱스를 ${v.high}로 옮깁니다. 흐린 막대는 제외된 위치입니다.`]
        : ['Choose the left half', `The middle value is larger than the target. Exclude it and the right half; move the end to ${v.high}. Dim bars are excluded.`];
      default: return ko ? ['검색 완료', v.matches ? `인덱스 ${v.matches}에서 찾았습니다. 중복 값 중 하나의 위치를 반환합니다.` : '탐색 범위가 비었습니다. 목표 값이 없으므로 -1을 반환합니다.']
        : ['Search complete', v.matches ? `Found at index ${v.matches}. Return one matching position.` : 'The search range is empty. Return -1 because the target was not found.'];
    }
  },
};

export const bfs: Algorithm = {
  id: 'breadth-first-search', category: 'graph', target: 1,
  name: { ko: '너비 우선 탐색', en: 'Breadth-first search' },
  summary: { ko: '무방향 그래프를 큐로 탐색합니다. 발견한 정점을 기억해 순환에서도 한 번씩만 방문합니다.', en: 'Use a FIFO queue to traverse an undirected graph. Mark discoveries to avoid revisiting cycles.' },
  source: algorithmCode(bfsSource), example: [1, 2, 3, 4, 5, 6, 7],
  graphEdges: [[1, 2], [1, 3], [2, 4], [2, 5], [3, 6], [4, 5]], time: 'O(V + E)',
  run: (nodes, start = 1, edges = bfs.graphEdges!) => traceBfs(nodes, start, edges),
  explain(step, language) {
    const ko = language === 'ko';
    const v = step.variables;
    switch (step.type) {
      case 'start': return ko ? ['시작 정점 준비', `정점 ${v.current}를 큐에 넣고 발견 상태로 표시합니다. 연결되지 않은 정점은 이 시작점에서 도달할 수 없습니다.`]
        : ['Prepare the start', `Enqueue vertex ${v.current} and mark it discovered. Disconnected vertices cannot be reached from this start.`];
      case 'enter': return ko ? ['큐의 맨 앞 방문', `큐에서 정점 ${v.current}를 꺼냈습니다. 먼저 들어온 정점부터 처리해 가까운 정점을 우선 탐색합니다.`]
        : ['Visit the queue head', `Dequeue vertex ${v.current}. FIFO processing visits closer vertices first.`];
      case 'edge': {
        const seen = String(v.seen).split(',').includes(String(v.next));
        return ko ? ['이웃 확인', seen ? `정점 ${v.next}는 이미 발견했습니다. 다시 큐에 넣지 않아 순환이나 여러 경로로 중복 방문하지 않습니다.` : `정점 ${v.current}의 이웃 ${v.next}는 아직 발견하지 않았습니다. 다음 단계에서 큐의 뒤쪽에 넣습니다.`]
          : ['Inspect a neighbor', seen ? `Vertex ${v.next} was already discovered. Skip it to avoid duplicate visits through cycles or multiple paths.` : `Neighbor ${v.next} of ${v.current} is new. Enqueue it at the back next.`];
      }
      case 'enqueue': return ko ? ['이웃을 큐에 추가', `정점 ${v.next}를 발견 표시하고 큐의 뒤에 넣었습니다. 표시 순서가 아니라 실제 방문 순서는 큐에서 꺼낼 때 결정됩니다.`]
        : ['Enqueue a neighbor', `Mark ${v.next} discovered and enqueue it. Visit order is determined when vertices are dequeued.`];
      case 'leave': return ko ? ['정점 처리 완료', `정점 ${v.current}의 모든 이웃을 확인했습니다. 다음 큐 항목으로 진행합니다.`]
        : ['Vertex complete', `All neighbors of ${v.current} have been inspected. Continue with the next queued vertex.`];
      default: return ko ? ['탐색 완료', `큐가 비었습니다. 방문 순서: ${v.order}. 흐린 정점은 시작점에서 도달할 수 없었습니다.`]
        : ['Traversal complete', `The queue is empty. Visit order: ${v.order}. Dim vertices were unreachable from the start.`];
    }
  },
};

export const dfs: Algorithm = {
  id: 'depth-first-search', category: 'graph', target: 1,
  name: { ko: '깊이 우선 탐색', en: 'Depth-first search' },
  summary: { ko: '한 경로를 깊이 탐색한 뒤 돌아옵니다. 재귀 스택과 발견·처리 상태를 확인할 수 있습니다.', en: 'Explore one path deeply, then backtrack. Inspect the recursion stack and discovery states.' },
  source: algorithmCode(dfsSource), example: bfs.example, graphEdges: bfs.graphEdges, time: 'O(V + E)',
  run: (nodes, start = 1, edges = dfs.graphEdges!) => traceDfs(nodes, start, edges),
  explain(step, language) {
    const ko = language === 'ko';
    const v = step.variables;
    switch (step.type) {
      case 'start': return ko ? ['시작 정점 준비', `정점 ${v.current}를 발견 상태로 표시하고 첫 재귀 호출을 준비합니다. 시작점을 미리 기억해 순환에서도 다시 방문하지 않습니다.`]
        : ['Prepare the start', `Mark ${v.current} discovered and prepare the first recursive call. Remember the start to avoid revisiting it through a cycle.`];
      case 'enter': return ko ? ['재귀 호출 진입', `정점 ${v.current}를 재귀 스택의 맨 위에 넣었습니다. 현재 깊이는 ${v.depth}입니다. 다음 미발견 이웃으로 더 깊이 들어갑니다.`]
        : ['Enter a recursive call', `Push ${v.current} onto the recursion stack at depth ${v.depth}. Continue deeper through an undiscovered neighbor.`];
      case 'edge': {
        const seen = String(v.seen).split(',').includes(String(v.next));
        return ko ? ['이웃 확인', seen ? `정점 ${v.next}는 이미 발견했으므로 건너뜁니다. 순환 때문에 같은 경로를 반복하지 않습니다.` : `정점 ${v.next}는 미발견 상태입니다. 이 이웃에 대한 재귀 호출을 시작합니다.`]
          : ['Inspect a neighbor', seen ? `Vertex ${v.next} was already discovered. Skip it to avoid repeating paths through a cycle.` : `Vertex ${v.next} is undiscovered. Begin a recursive call for this neighbor.`];
      }
      case 'leave': return ko ? ['상위 호출로 복귀', v.parent ? `정점 ${v.current}의 모든 이웃을 처리했습니다. 스택에서 빼고 상위 정점 ${v.parent}로 돌아갑니다.` : `시작 정점 ${v.current}의 모든 이웃을 처리했습니다. 마지막 재귀 호출을 마칩니다.`]
        : ['Backtrack', v.parent ? `All neighbors of ${v.current} are complete. Pop it and return to parent ${v.parent}.` : `All neighbors of start vertex ${v.current} are complete. Finish the last recursive call.`];
      default: return ko ? ['탐색 완료', `재귀 스택이 비었습니다. 방문 순서: ${v.order}. 미연결 정점은 방문하지 않습니다.`]
        : ['Traversal complete', `The recursion stack is empty. Visit order: ${v.order}. Disconnected vertices remain unvisited.`];
    }
  },
};

export const shell: Algorithm = {
  id: 'shell-sort', category: 'sort',
  name: { ko: '셸 정렬', en: 'Shell sort' },
  summary: { ko: '간격을 둔 값들을 비교하고, 간격을 절반씩 줄여 마지막에는 이웃한 값을 정렬합니다.', en: 'Compare distant values, halve the gap, then finish with neighboring values.' },
  source: algorithmCode(shellSource), example: bubble.example,
  time: { ko: '최악 O(n²) · 간격에 따라 달라짐', en: 'Worst O(n²) · depends on gaps' },
  run: (values) => runSort(ShellSort, values),
  explain(step, language) {
    const ko = language === 'ko';
    const v = step.variables;
    switch (step.type) {
      case 'gap': return ko ? ['간격 선택', `현재 간격은 ${v.gap}입니다. 같은 간격으로 연결된 위치들을 삽입 정렬하듯 처리합니다.`]
        : ['Choose the gap', `The gap is ${v.gap}. Process positions linked by this gap similarly to insertion sort.`];
      case 'compare': return ko ? ['떨어진 값 비교', `인덱스 ${v.currentIndex}와 ${v.gapShiftedIndex}의 값을 비교합니다. 오른쪽이 더 작으면 간격 ${v.gap}만큼 왼쪽으로 옮깁니다.`]
        : ['Compare distant values', `Compare indices ${v.currentIndex} and ${v.gapShiftedIndex}. A smaller right value moves left by ${v.gap}.`];
      case 'swap': return ko ? ['간격만큼 교환', '두 값을 교환했습니다. 멀리 떨어진 교환은 같은 값들의 기존 순서를 바꿀 수 있으므로 안정 정렬이 아닙니다.']
        : ['Swap across the gap', 'Swap the pair. Distant swaps can change the order of equal values, so this sort is not stable.'];
      case 'pass': return ko ? ['간격 정렬 완료', `간격 ${v.gap}의 처리를 마쳤습니다. 간격을 절반으로 줄입니다. 간격 1을 마치면 전체가 정렬됩니다.`]
        : ['Gap pass complete', `Finish gap ${v.gap} and halve it. Finishing gap 1 sorts the entire array.`];
      default: return bubble.explain(step, language);
    }
  },
};

export const heap: Algorithm = {
  id: 'heap-sort', category: 'sort',
  name: { ko: '힙 정렬', en: 'Heap sort' },
  summary: { ko: '최소 힙에 값을 넣고, 루트의 최솟값을 하나씩 꺼내 결과 배열에 쌓습니다.', en: 'Build a min heap, then repeatedly extract its root into the sorted output.' },
  source: algorithmCode(heapSource), example: bubble.example, time: 'O(n log n)',
  run: (values) => runSort(HeapSort, values),
  explain(step, language) {
    const ko = language === 'ko';
    switch (step.type) {
      case 'start': return ko ? ['최소 힙 준비', '별도의 최소 힙과 빈 결과 배열을 준비합니다. 이 구현은 추가 공간 O(n)을 사용하며 원본을 보존합니다.']
        : ['Prepare a min heap', 'Prepare a separate min heap and empty output. This implementation uses O(n) extra space and preserves the input.'];
      case 'add': return ko ? ['힙에 삽입', `입력 인덱스 ${step.variables.index}의 값을 넣고 힙 순서를 복구했습니다. 부모는 자식보다 작거나 같습니다. 형제 사이의 순서는 정렬되지 않아도 됩니다.`]
        : ['Insert into the heap', `Insert input index ${step.variables.index} and restore heap order. Parents are no greater than children; siblings need not be sorted.`];
      case 'poll': return ko ? ['루트의 최솟값 선택', '루트가 현재 힙의 최솟값입니다. poll은 루트를 꺼내고 마지막 값을 위로 옮긴 뒤 아래로 내려 힙 순서를 복구합니다.']
        : ['Select the minimum root', 'The root is the heap minimum. Poll removes it, moves the last value to the root, then sifts down to restore heap order.'];
      case 'extract': return ko ? ['결과에 최솟값 추가', `꺼낸 값을 결과 뒤에 추가했습니다. 앞의 ${step.variables.sortedCount}개 값은 확정됐으며 남은 힙의 루트를 계속 꺼냅니다.`]
        : ['Append the minimum', `Append the extracted value. The first ${step.variables.sortedCount} values are settled; continue extracting from the remaining heap.`];
      default: return bubble.explain(step, language);
    }
  },
};

function numericSteps(steps: (Omit<Step, 'array'> & { array: number[] })[]): Step[] {
  return steps.map((step) => ({ ...step, array: step.array.map((value, id) => ({ value, id })) }));
}

export const counting: Algorithm = {
  id: 'counting-sort', category: 'sort',
  name: { ko: '계수 정렬', en: 'Counting sort' },
  summary: { ko: '정수의 빈도를 세고 누적합으로 출력 위치를 계산합니다. 음수와 중복을 지원합니다.', en: 'Count integer frequencies, then use cumulative counts to place values. Supports negatives and duplicates.' },
  source: algorithmCode(countingSource), example: [4, 2, -1, 4, 0, 2], time: 'O(n + k)', randomMax: 30,
  inputHint: { ko: '정수만 허용 · 최댓값 − 최솟값 ≤ 63 · k는 버킷 수', en: 'Integers only · max − min ≤ 63 · k is the bucket count' },
  run: (values) => numericSteps(traceCounting(values)),
  explain(step, language) {
    const ko = language === 'ko';
    const v = step.variables;
    switch (step.type) {
      case 'start': return ko ? ['값 범위 준비', '입력에서 최솟값과 최댓값을 미리 계산해 전달했습니다. 두 값 사이의 각 정수에 버킷 하나를 할당합니다.']
        : ['Prepare the range', 'Pass the precomputed input minimum and maximum. Allocate one bucket for each integer in this range.'];
      case 'buckets': return ko ? ['빈도 버킷 생성', `최솟값 ${v.minimum}부터 시작하는 빈도 버킷을 0으로 채웁니다. 값에서 최솟값을 빼면 버킷 인덱스가 됩니다.`]
        : ['Create frequency buckets', `Create zeroed buckets starting at minimum ${v.minimum}. Subtract the minimum to obtain a bucket index.`];
      case 'count': return ko ? ['빈도 증가', '현재 입력 값에 해당하는 버킷의 빈도를 1 늘렸습니다. 막대 배열은 원본 입력이며 버킷이 빈도를 저장합니다.']
        : ['Count a value', 'Increment the bucket for the current input value. Bars show the original input; buckets store frequencies.'];
      case 'prefix': return ko ? ['누적 빈도 계산', '앞 버킷의 누적 빈도를 더합니다. 이 버킷에는 해당 값 이하인 입력 값의 개수가 저장됩니다.']
        : ['Accumulate counts', 'Add the previous cumulative count. This bucket now counts all input values less than or equal to its value.'];
      case 'offset': return ko ? ['출력 시작 위치 계산', '누적 빈도를 한 칸 오른쪽으로 옮기고 처음에 0을 넣었습니다. 각 버킷은 해당 값이 들어갈 첫 출력 위치를 가리킵니다.']
        : ['Compute starting positions', 'Shift cumulative counts right and insert zero. Each bucket points to the first output position for its value.'];
      case 'place': return ko ? ['출력 위치에 배치', `출력 인덱스 ${v.position}에 현재 값을 넣었습니다. 다음 같은 값은 버킷의 위치를 1 늘려 그다음 칸에 넣습니다.`]
        : ['Place in the output', `Place the value at output index ${v.position}. Increment the bucket position for the next equal value.`];
      default: return bubble.explain(step, language);
    }
  },
};

export const radix: Algorithm = {
  id: 'radix-sort', category: 'sort',
  name: { ko: '기수 정렬', en: 'Radix sort' },
  summary: { ko: '일의 자리부터 각 자릿수로 버킷에 나누고 순서대로 모읍니다. 이전 자릿수의 순서를 유지합니다.', en: 'Distribute by digits from right to left, then gather buckets in order while preserving previous digit order.' },
  source: algorithmCode(radixSource), example: [170, 45, 75, 90, 802, 24, 2, 66], time: 'O(d(n + 10))', randomMax: 999,
  inputHint: { ko: '0부터 999까지 정수 · d는 최댓값의 자릿수', en: 'Integers from 0 to 999 · d is the maximum digit count' },
  run: (values) => numericSteps(traceRadix(values)),
  explain(step, language) {
    const ko = language === 'ko';
    const v = step.variables;
    switch (step.type) {
      case 'start': return ko ? ['자릿수 정렬 준비', '입력을 복사하고 최댓값의 자릿수만큼 반복합니다. 빈 배열과 모두 0인 배열은 이미 정렬됐으므로 바로 완료합니다.']
        : ['Prepare digit sorting', 'Copy the input and iterate over the maximum digit count. Empty and all-zero arrays are already sorted.'];
      case 'bucket': return ko ? ['현재 자릿수로 분류', `오른쪽에서 ${v.digit}번째 자릿수로 버킷 ${v.bucket}에 넣었습니다. 해당 자릿수가 없으면 0으로 처리합니다. 같은 버킷 안에서는 입력 순서를 유지합니다.`]
        : ['Distribute by this digit', `Use digit ${v.digit} from the right to place the value in bucket ${v.bucket}. Missing digits count as zero; preserve order within each bucket.`];
      case 'gather': return ko ? ['버킷 순서대로 모으기', '버킷 0부터 9까지 차례대로 이어 붙입니다. 각 버킷 내부의 순서가 유지되어 이전에 정렬한 낮은 자릿수의 순서도 보존됩니다.']
        : ['Gather buckets in order', 'Concatenate buckets 0 through 9. Preserving order within each bucket retains the order of previously processed lower digits.'];
      case 'pass': return ko ? ['한 자릿수 완료', `오른쪽 ${v.digit}개 자릿수를 기준으로 정렬됐습니다. 더 높은 자릿수가 남았다면 다음 반복에서 처리합니다.`]
        : ['Digit pass complete', `Sorted by the rightmost ${v.digit} digits. Process the next higher digit if one remains.`];
      default: return bubble.explain(step, language);
    }
  },
};

export const jump: Algorithm = {
  id: 'jump-search', category: 'search', target: 21, requiresSorted: true,
  name: { ko: '점프 검색', en: 'Jump search' },
  summary: { ko: '√n 크기의 블록 끝을 확인해 점프하고, 후보 블록 안에서 순차 검색합니다.', en: 'Jump across block endpoints of size √n, then scan the candidate block.' },
  source: algorithmCode(jumpSource), example: [1, 2, 5, 10, 20, 21, 24, 30, 48], time: 'O(√n)',
  run(values, target) { requireSorted(values); return runSearch(jumpSearch, values, target); },
  explain(step, language) {
    const ko = language === 'ko';
    const v = step.variables;
    switch (step.type) {
      case 'start': return ko ? ['블록 검색 준비', '배열 크기를 확인합니다. 비어 있으면 -1을 반환하고, 나머지는 √n을 내림한 크기로 블록을 나눕니다.']
        : ['Prepare block searching', 'Check the size. An empty array returns -1; otherwise use a block size of floor(√n).'];
      case 'block': return ko ? ['블록 끝 비교', `블록 ${v.low}…${v.high}의 마지막 값을 목표 ${v.target}와 비교합니다. 목표가 더 크면 다음 블록으로 이동합니다.`]
        : ['Inspect the block endpoint', `Compare the last value of block ${v.low}…${v.high} with target ${v.target}. Jump ahead if the target is greater.`];
      case 'jump': return ko ? ['다음 블록으로 점프', `블록 시작을 ${v.low}로 옮겼습니다. 블록이 배열 밖이면 검색을 끝냅니다. 흐린 막대는 현재 블록 밖의 위치입니다.`]
        : ['Jump to the next block', `Move the block start to ${v.low}. Stop if it is beyond the array. Dim bars lie outside the current block.`];
      case 'compare': return ko ? ['블록 안 순차 검색', `후보 블록 안에서 인덱스 ${v.index}와 목표 값을 비교합니다. 일치하지 않으면 한 칸 전진합니다.`]
        : ['Scan inside the block', `Compare index ${v.index} with the target. Advance one position on a mismatch.`];
      default: return ko ? ['검색 완료', v.matches ? `인덱스 ${v.matches}에서 찾았습니다. 일치 위치 하나를 반환합니다.` : '후보 블록을 모두 확인했거나 배열 밖에 도달했습니다. 목표 값이 없어 -1을 반환합니다.']
        : ['Search complete', v.matches ? `Found at index ${v.matches}. Return one matching position.` : 'The candidate block was exhausted or the search passed the array. Return -1.'];
    }
  },
};

export const interpolation: Algorithm = {
  id: 'interpolation-search', category: 'search', target: 40, requiresSorted: true,
  name: { ko: '보간 검색', en: 'Interpolation search' },
  summary: { ko: '값의 비율로 위치를 예상합니다. 균등 분포에서는 효율적이지만 치우친 분포에서는 느릴 수 있습니다.', en: 'Estimate a position from value ratios. Efficient for uniform values, potentially slow for skewed distributions.' },
  source: algorithmCode(interpolationSource), example: [10, 20, 30, 40, 50, 60, 70],
  time: { ko: '균등 분포 평균 O(log log n) · 최악 O(n)', en: 'Uniform avg O(log log n) · worst O(n)' },
  run(values, target = 40) {
    requireSorted(values);
    const steps: (Omit<Step, 'array'> & { array: number[] })[] = [];
    interpolationSearch(values, target, (step: Omit<Step, 'array'> & { array: number[] }) => steps.push(step));
    return numericSteps(steps);
  },
  explain(step, language) {
    const ko = language === 'ko';
    const v = step.variables;
    switch (step.type) {
      case 'start': return ko ? ['검색 범위 준비', '양쪽 끝 인덱스를 준비합니다. 비어 있는 배열은 바로 -1을 반환합니다.']
        : ['Prepare the range', 'Prepare both endpoint indices. An empty array returns -1 immediately.'];
      case 'range': return ko ? ['값 범위 확인', `끝값 차이 ${v.rangeDelta}, 목표와 왼쪽 값 차이 ${v.valueDelta}를 계산합니다. 목표가 범위 밖이면 종료하고, 끝값이 같으면 나눗셈 없이 일치 여부를 확인합니다.`]
        : ['Inspect the value range', `Endpoint difference: ${v.rangeDelta}; target minus left value: ${v.valueDelta}. Reject out-of-range targets; equal endpoints require no division.`];
      case 'probe': return ko ? ['보간 위치 예상', `low + floor(valueDelta × indexDelta / rangeDelta)로 인덱스 ${v.middleIndex}를 예상했습니다. 이 위치의 값과 목표를 비교합니다.`]
        : ['Estimate the probe', `low + floor(valueDelta × indexDelta / rangeDelta) estimates index ${v.middleIndex}. Compare this value with the target.`];
      case 'right': return ko ? ['오른쪽 범위 선택', `예상 위치의 값이 작으므로 시작을 ${v.low}로 옮깁니다. 새 범위에서 위치를 다시 예상합니다.`]
        : ['Choose the right range', `The probe value is smaller. Move the start to ${v.low} and estimate again.`];
      case 'left': return ko ? ['왼쪽 범위 선택', `예상 위치의 값이 크므로 끝을 ${v.high}로 옮깁니다. 새 범위에서 위치를 다시 예상합니다.`]
        : ['Choose the left range', `The probe value is greater. Move the end to ${v.high} and estimate again.`];
      default: return ko ? ['검색 완료', v.matches ? `인덱스 ${v.matches}에서 찾았습니다. 같은 값이 여러 개면 그중 하나를 반환합니다.` : '목표가 값 범위 밖이거나 탐색 범위를 모두 확인했습니다. -1을 반환합니다.']
        : ['Search complete', v.matches ? `Found at index ${v.matches}. Return one occurrence when duplicates exist.` : 'The target is outside the value range or the search is exhausted. Return -1.'];
    }
  },
};

export const algorithms: Algorithm[] = [bubble, selection, insertion, merge, quick, shell, heap, counting, radix, linear, binary, jump, interpolation, bfs, dfs];
