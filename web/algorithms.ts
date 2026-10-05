import hashTableSource from '../src/data-structures/hash-table/HashTable.js?raw';
import traceHashTable from '../src/visualization/hash';
import segmentSource from '../src/data-structures/tree/segment-tree/SegmentTree.js?raw';
import fenwickSource from '../src/data-structures/tree/fenwick-tree/FenwickTree.js?raw';
import { traceFenwick, traceSegment } from '../src/visualization/range';
import trieSource from '../src/data-structures/trie/Trie.js?raw';
import trieNodeSource from '../src/data-structures/trie/TrieNode.js?raw';
import { traceTrie } from '../src/visualization/trie';
import bstSource from '../src/data-structures/tree/binary-search-tree/BinarySearchTree.js?raw';
import bstNodeSource from '../src/data-structures/tree/binary-search-tree/BinarySearchTreeNode.js?raw';
import priorityQueueSource from '../src/data-structures/priority-queue/PriorityQueue.js?raw';
import heapClassSource from '../src/data-structures/heap/Heap.js?raw';
import minHeapSource from '../src/data-structures/heap/MinHeap.js?raw';
import linkedListSource from '../src/data-structures/linked-list/LinkedList.js?raw';
import queueSource from '../src/data-structures/queue/Queue.js?raw';
import stackSource from '../src/data-structures/stack/Stack.js?raw';
import { traceStack, traceQueue, traceLinkedList, traceHeap, tracePriorityQueue, traceBinarySearchTree } from '../src/visualization/structures';
import topologicalSource from '../src/algorithms/graph/topological-sorting/topologicalSort.js?raw';
import kruskalSource from '../src/algorithms/graph/kruskal/kruskal.js?raw';
import primSource from '../src/algorithms/graph/prim/prim.js?raw';
import floydSource from '../src/algorithms/graph/floyd-warshall/floydWarshall.js?raw';
import bellmanSource from '../src/algorithms/graph/bellman-ford/bellmanFord.js?raw';
import dijkstraSource from '../src/algorithms/graph/dijkstra/dijkstra.js?raw';
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
import { traceBfs, traceDfs, traceDijkstra, traceBellmanFord, traceFloydWarshall, tracePrim, traceKruskal, traceTopological } from '../src/visualization/graph';
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


type AlgorithmConfig = {
  id: string;
  name: Record<Language, string>;
  summary: Record<Language, string>;
  source: string;
  time: string | Record<Language, string>;
  category: 'sort' | 'search' | 'graph' | 'structure';
  operations?: string;
  operationHint?: string;
  target?: number;
  requiresSorted?: boolean;
  inputHint?: Record<Language, string>;
  randomMax?: number;
  graphEdges?: number[][];
  usesStart?: boolean;
  graphWeighted?: boolean;
  graphDirected?: boolean;
  fixedDirection?: boolean;
  explain(step: Step, language: Language): [string, string];
};

export type NumericAlgorithm = AlgorithmConfig & {
  inputMode?: 'numbers';
  example: number[];
  run(values: number[], target?: number, edges?: number[][], directed?: boolean, operations?: string): Step[];
};
export type WordAlgorithm = AlgorithmConfig & {
  inputMode: 'words';
  example: string[];
  run(words: string[], target?: number, edges?: number[][], directed?: boolean, operations?: string): Step[];
};
export type Algorithm = NumericAlgorithm | WordAlgorithm;

function runSort(Sorter: typeof BubbleSort, values: number[]): Step[] {
  const steps: Step[] = [];
  // ponytail: full snapshots for at most 32 values; use deltas for larger lessons.
  new Sorter({
    compareCallback: (a: Item, b: Item) => a.value - b.value,
    stepCallback: (step: Step) => steps.push(step),
  }).sort(values.map((value, id) => ({ value, id })));
  return steps;
}

export const bubble: NumericAlgorithm = {
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

export const selection: NumericAlgorithm = {
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

export const insertion: NumericAlgorithm = {
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

export const merge: NumericAlgorithm = {
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

export const quick: NumericAlgorithm = {
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

export const linear: NumericAlgorithm = {
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

export const binary: NumericAlgorithm = {
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

export const bfs: NumericAlgorithm = {
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

export const dfs: NumericAlgorithm = {
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

export const shell: NumericAlgorithm = {
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

export const heap: NumericAlgorithm = {
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

export const counting: NumericAlgorithm = {
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

export const radix: NumericAlgorithm = {
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

export const jump: NumericAlgorithm = {
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

export const interpolation: NumericAlgorithm = {
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

export const dijkstra: NumericAlgorithm = {
  id: 'dijkstra', category: 'graph', target: 1, graphWeighted: true,
  name: { ko: '다익스트라', en: 'Dijkstra' },
  summary: { ko: '가장 가까운 미처리 정점을 먼저 꺼내 이웃의 거리를 줄입니다. 음수 가중치는 허용하지 않습니다.', en: 'Process the closest unsettled vertex and relax neighbor distances. Requires nonnegative weights.' },
  source: algorithmCode(dijkstraSource), example: [1, 2, 3, 4, 5, 6],
  graphEdges: [[1, 2, 7], [1, 3, 2], [3, 2, 1], [2, 4, 3], [3, 5, 8], [4, 5, 1]],
  time: { ko: '이 구현 O(VE + V log V)', en: 'This implementation O(VE + V log V)' },
  run: (nodes, start = 1, edges = dijkstra.graphEdges!, directed = false) => traceDijkstra(nodes, start, edges, directed),
  explain(step, language) {
    const ko = language === 'ko';
    const v = step.variables;
    switch (step.type) {
      case 'start': return ko ? ['거리 초기화', `시작 정점 ${v.current}의 거리는 0, 나머지는 ∞입니다. 시작점을 우선순위 큐에 넣습니다. 이전 정점은 경로를 복원할 때 사용합니다.`]
        : ['Initialize distances', `Start vertex ${v.current} has distance 0; all others have ∞. Enqueue the start. Previous vertices allow path reconstruction.`];
      case 'enter': return ko ? ['가장 가까운 정점 선택', `우선순위 큐에서 최소 거리의 정점 ${v.current}를 꺼냈습니다. 음수 간선이 없으므로 이 거리는 확정할 수 있습니다.`]
        : ['Select the closest vertex', `Poll minimum-distance vertex ${v.current}. Without negative edges, this distance can be settled.`];
      case 'compare': return ko ? ['이웃의 거리 비교', `정점 ${v.current}를 거쳐 ${v.next}로 가는 후보 거리는 ${v.candidate}입니다. 기존 거리보다 작을 때만 갱신합니다.`]
        : ['Compare a neighbor distance', `The candidate distance to ${v.next} through ${v.current} is ${v.candidate}. Update only if it is smaller.`];
      case 'relax': return ko ? ['더 짧은 경로 갱신', `정점 ${v.next}의 거리를 ${v.candidate}로 줄이고 이전 정점을 ${v.current}로 기록했습니다. 큐에 이미 있다면 우선순위도 바꿉니다.`]
        : ['Relax the path', `Set distance to ${v.next} to ${v.candidate} and predecessor to ${v.current}. Change its queue priority if already present.`];
      case 'leave': return ko ? ['정점 처리 완료', `정점 ${v.current}의 모든 미처리 이웃을 확인했습니다. 초록색 정점의 최단 거리는 확정됐습니다.`]
        : ['Vertex complete', `All unsettled neighbors of ${v.current} were checked. Green vertices have settled shortest distances.`];
      default: return ko ? ['최단 거리 계산 완료', '큐가 비었습니다. ∞인 정점에는 시작점에서 도달할 수 없습니다. 이전 정점 열을 따라가면 각 최단 경로를 복원할 수 있습니다.']
        : ['Shortest distances complete', 'The queue is empty. Vertices at ∞ are unreachable. Follow previous vertices to reconstruct shortest paths.'];
    }
  },
};

export const bellman: NumericAlgorithm = {
  id: 'bellman-ford', category: 'graph', target: 1, graphWeighted: true, graphDirected: true,
  name: { ko: '벨만–포드', en: 'Bellman–Ford' },
  summary: { ko: '음수 간선을 포함한 그래프에서 V−1회 완화한 뒤, 도달 가능한 음수 사이클을 검사합니다.', en: 'Relax edges V−1 times, including negative weights, then check for a reachable negative cycle.' },
  source: algorithmCode(bellmanSource), example: [1, 2, 3, 4, 5, 6],
  graphEdges: [[1, 2, 8], [1, 3, 10], [2, 4, 1], [4, 3, -4], [4, 5, -1], [3, 5, 2]],
  time: { ko: 'O(VE) 완화 검사 · 간선 조회 비용 별도', en: 'O(VE) relaxation checks · edge lookup costs extra' },
  run: (nodes, start = 1, edges = bellman.graphEdges!, directed = true) => traceBellmanFord(nodes, start, edges, directed),
  explain(step, language) {
    const ko = language === 'ko';
    const v = step.variables;
    switch (step.type) {
      case 'start': return ko ? ['거리 초기화', `시작 정점 ${v.current}의 거리는 0, 나머지는 ∞입니다. 이전 정점은 아직 없으며 완화가 성공할 때 기록합니다.`]
        : ['Initialize distances', `Start vertex ${v.current} has distance 0; all others have ∞. Predecessors are empty until a relaxation succeeds.`];
      case 'pass': return ko ? ['완화 반복', `${v.iteration}번째 반복입니다. 모든 정점의 나가는 간선을 검사합니다. 사이클 없는 최단 경로는 최대 V−1개의 간선을 사용합니다.`]
        : ['Relaxation round', `Round ${v.iteration}: inspect outgoing edges of every vertex. A shortest path without cycles uses at most V−1 edges.`];
      case 'compare': return ko ? ['후보 거리 비교', `정점 ${v.current}를 거쳐 ${v.next}로 가는 후보 거리는 ${Number.isFinite(v.candidate) ? v.candidate : '∞'}입니다. 출발 정점에 도달할 수 없으면 이 간선으로도 거리를 줄일 수 없습니다.`]
        : ['Compare a candidate', `Candidate distance to ${v.next} through ${v.current}: ${Number.isFinite(v.candidate) ? v.candidate : '∞'}. An unreachable source cannot improve this edge.`];
      case 'relax': return ko ? ['거리와 이전 정점 갱신', `정점 ${v.next}의 거리를 ${v.candidate}로 줄이고 이전 정점을 ${v.current}로 기록했습니다. 값은 이후 반복에서 더 줄어들 수 있습니다.`]
        : ['Update distance and predecessor', `Set distance to ${v.next} to ${v.candidate} and predecessor to ${v.current}. Later rounds may improve it further.`];
      case 'check-cycle': return ko ? ['음수 사이클 검사', 'V−1회 이후에도 도달 가능한 간선에서 거리가 줄어드는지 검사합니다. 더 줄어든다면 반복해서 비용을 낮출 수 있는 음수 사이클이 있습니다.']
        : ['Check for a negative cycle', 'Check for a reachable improvement after V−1 rounds. Any improvement proves a negative cycle can lower the cost indefinitely.'];
      case 'negative-cycle': return ko ? ['음수 사이클 발견', '시작점에서 도달 가능한 음수 사이클이 있습니다. 표의 값은 잠정값이며 최단 거리로 확정할 수 없습니다. 타임라인에서 거리 감소를 확인하세요.']
        : ['Negative cycle detected', 'A negative cycle is reachable from the start. Table values are tentative and cannot be treated as shortest distances. Inspect the repeated decreases on the timeline.'];
      default: return ko ? ['최단 거리 계산 완료', '추가 완화가 없어 도달 가능한 음수 사이클이 없습니다. ∞는 도달 불가이며 이전 정점으로 경로를 복원할 수 있습니다.']
        : ['Shortest distances complete', 'No further relaxation means no reachable negative cycle. ∞ marks unreachable vertices; use predecessors to reconstruct paths.'];
    }
  },
};

export const floyd: NumericAlgorithm = {
  id: 'floyd-warshall', category: 'graph', graphWeighted: true, graphDirected: true, usesStart: false,
  name: { ko: '플로이드–워셜', en: 'Floyd–Warshall' },
  summary: { ko: '경유 정점을 하나씩 허용하며 모든 정점 쌍의 거리 행렬을 갱신합니다.', en: 'Allow intermediate vertices one at a time and update distances for every pair.' },
  source: algorithmCode(floydSource), example: [1, 2, 3, 4],
  graphEdges: [[1, 2, 3], [1, 4, 10], [2, 3, -1], [3, 4, 2]], time: 'O(V³)',
  run: (nodes, _start, edges = floyd.graphEdges!, directed = true) => traceFloydWarshall(nodes, edges, directed),
  explain(step, language) {
    const ko = language === 'ko';
    const v = step.variables;
    switch (step.type) {
      case 'start': return ko ? ['거리 행렬 초기화', '대각선은 0, 직접 연결은 간선 가중치, 나머지는 ∞입니다. 행은 출발 정점, 열은 도착 정점입니다. 시작점 하나를 지정할 필요가 없습니다.']
        : ['Initialize the distance matrix', 'Set the diagonal to 0, direct paths to edge weights, and other entries to ∞. Rows are sources; columns are destinations. No single start is needed.'];
      case 'via': return ko ? ['경유 정점 선택', `정점 ${v.via}를 새로운 경유 정점으로 허용합니다. 이전까지 허용한 경유 정점들도 계속 사용할 수 있습니다.`]
        : ['Allow an intermediate vertex', `Allow vertex ${v.via} as an intermediate. Previously allowed intermediates remain available.`];
      case 'compare': return ko ? ['직접 거리와 경유 거리 비교', `${v.current} → ${v.next}의 기존 거리와 ${v.via}를 거치는 후보 거리 ${Number.isFinite(v.candidate) ? v.candidate : '∞'}를 비교합니다. 한쪽 구간이 도달 불가면 후보도 ∞입니다.`]
        : ['Compare a path through the intermediate', `Compare ${v.current} → ${v.next} with candidate ${Number.isFinite(v.candidate) ? v.candidate : '∞'} through ${v.via}. An unreachable leg makes the candidate ∞.`];
      case 'relax': return ko ? ['거리 행렬 갱신', `${v.current} → ${v.next}의 거리를 ${v.candidate}로 줄였습니다. 강조한 셀과 행·열의 정점을 함께 확인하세요.`]
        : ['Update the distance matrix', `Reduce distance ${v.current} → ${v.next} to ${v.candidate}. Inspect the highlighted cell and its row and column vertices.`];
      case 'negative-cycle': return ko ? ['음수 사이클 발견', '대각선에 음수가 있습니다. 자신으로 돌아오는 비용을 계속 줄일 수 있어 행렬 전체를 최단 거리 결과로 확정하지 않습니다.']
        : ['Negative cycle detected', 'A negative diagonal shows a cycle that can repeatedly reduce cost. Do not treat the matrix as a finalized shortest-distance result.'];
      default: return ko ? ['모든 쌍의 거리 계산 완료', '모든 정점을 경유 후보로 처리했습니다. ∞인 셀은 해당 출발점에서 도착점에 도달할 수 없음을 뜻합니다.']
        : ['All-pairs distances complete', 'Every vertex has been considered as an intermediate. ∞ cells represent unreachable source–destination pairs.'];
    }
  },
};

export const prim: NumericAlgorithm = {
  id: 'prim', category: 'graph', graphWeighted: true, fixedDirection: true, usesStart: false,
  name: { ko: '프림', en: 'Prim' },
  summary: { ko: '첫 정점과 연결된 성분에서 가장 싼 경계 간선으로 최소 신장 트리를 확장합니다.', en: 'Grow a minimum spanning tree of the first vertex’s component using the cheapest frontier edge.' },
  source: algorithmCode(primSource), example: dijkstra.example, graphEdges: dijkstra.graphEdges, time: 'O(V + E log E)',
  run: (nodes, _start, edges = prim.graphEdges!) => tracePrim(nodes, edges),
  explain(step, language) {
    const ko = language === 'ko';
    const v = step.variables;
    switch (step.type) {
      case 'start': return ko ? ['트리 시작', `내부 정점 순서의 첫 정점 ${v.current}에서 시작합니다. 이 정점의 간선을 가중치 우선순위 큐에 넣고 최소 간선을 선택합니다.`]
        : ['Start the tree', `Start at vertex ${v.current}, first in the internal vertex order. Enqueue its edges by weight and select the minimum.`];
      case 'edge': return ko ? ['가장 싼 경계 간선 선택', `간선 ${v.current}–${v.next}를 꺼냈습니다. 한쪽 끝이 미방문이면 트리에 추가할 수 있고, 양쪽 모두 방문했다면 건너뜁니다.`]
        : ['Select the cheapest frontier edge', `Poll edge ${v.current}–${v.next}. Add it if one endpoint is unvisited; skip if both were visited.`];
      case 'choose': return ko ? ['트리 확장', `간선 ${v.current}–${v.next}를 추가했습니다. 초록색 간선이 선택된 트리이며 현재 가중치 합은 ${v.weight}입니다. 새 정점의 경계 간선을 큐에 넣습니다.`]
        : ['Grow the tree', `Add edge ${v.current}–${v.next}. Green edges form the selected tree, totaling ${v.weight}. Enqueue frontier edges of the new vertex.`];
      case 'skip': return ko ? ['사이클 간선 제외', '양쪽 끝이 이미 트리에 있습니다. 이 간선을 넣으면 사이클이 생기므로 건너뜁니다.']
        : ['Skip a cycle edge', 'Both endpoints are already in the tree. Adding this edge would create a cycle, so skip it.'];
      default: return ko ? ['성분의 최소 트리 완료', `선택한 간선의 가중치 합은 ${v.weight}입니다. 흐린 정점은 시작 성분과 연결되지 않았으며 이 트리에 포함되지 않습니다.`]
        : ['Component tree complete', `Selected edges total ${v.weight}. Dim vertices lie outside the starting component and are not part of this tree.`];
    }
  },
};

export const kruskal: NumericAlgorithm = {
  id: 'kruskal', category: 'graph', graphWeighted: true, fixedDirection: true, usesStart: false,
  name: { ko: '크루스칼', en: 'Kruskal' },
  summary: { ko: '가벼운 간선부터 확인하며 서로 다른 집합을 연결합니다. 미연결 그래프는 최소 신장 숲이 됩니다.', en: 'Consider edges by weight and connect different sets. Disconnected graphs produce a minimum spanning forest.' },
  source: algorithmCode(kruskalSource), example: prim.example, graphEdges: prim.graphEdges,
  time: { ko: '이 구현 최악 O(E² + V² + E log V)', en: 'This implementation worst O(E² + V² + E log V)' },
  run: (nodes, _start, edges = kruskal.graphEdges!) => traceKruskal(nodes, edges),
  explain(step, language) {
    const ko = language === 'ko';
    const v = step.variables;
    switch (step.type) {
      case 'start': return ko ? ['간선 정렬과 집합 준비', '간선을 가중치 오름차순으로 정렬하고 각 정점의 독립 집합을 만듭니다. 집합 표시는 실제 분리 집합의 대표 정점입니다.']
        : ['Sort edges and prepare sets', 'Sort edges by increasing weight and create one set per vertex. Group labels show actual disjoint-set representatives.'];
      case 'edge': return ko ? ['다음 간선의 집합 비교', `간선 ${v.current}–${v.next}의 양 끝이 서로 다른 집합인지 확인합니다. 같은 집합이라면 기존 경로가 있어 사이클을 만들게 됩니다.`]
        : ['Compare endpoint sets', `Check whether endpoints of ${v.current}–${v.next} belong to different sets. Same-set endpoints already have a path and would create a cycle.`];
      case 'choose': return ko ? ['집합 병합과 간선 추가', `두 집합을 병합하고 간선 ${v.current}–${v.next}를 선택했습니다. 현재 가중치 합은 ${v.weight}입니다.`]
        : ['Union sets and select the edge', `Unite the sets and select edge ${v.current}–${v.next}. Total weight: ${v.weight}.`];
      case 'skip': return prim.explain(step, language);
      default: return ko ? ['최소 신장 숲 완료', `선택한 간선의 가중치 합은 ${v.weight}입니다. 각 집합은 하나의 연결 성분이며, 고립 정점도 독립 집합으로 남습니다.`]
        : ['Minimum spanning forest complete', `Selected edges total ${v.weight}. Each set is a connected component; isolated vertices remain singleton sets.`];
    }
  },
};

export const topological: NumericAlgorithm = {
  id: 'topological-sort', category: 'graph', graphDirected: true, fixedDirection: true, usesStart: false,
  name: { ko: '위상 정렬', en: 'Topological sort' },
  summary: { ko: '방향 비순환 그래프의 의존 순서를 구합니다. DFS 종료 시 스택에 쌓아 역순으로 읽습니다.', en: 'Order dependencies in a directed acyclic graph. Push on DFS completion and read in reverse finish order.' },
  source: algorithmCode(topologicalSource), example: [1, 2, 3, 4, 5, 6, 7],
  graphEdges: [[1, 3], [2, 3], [2, 4], [3, 5], [4, 6], [5, 6]], time: { ko: '이 구현 최악 O(V² + E)', en: 'This implementation worst O(V² + E)' },
  run: (nodes, _start, edges = topological.graphEdges!) => traceTopological(nodes, edges),
  explain(step, language) {
    const ko = language === 'ko';
    const v = step.variables;
    switch (step.type) {
      case 'start': return ko ? ['의존 순서 탐색 준비', '각 간선 A→B는 A가 B보다 먼저 와야 함을 뜻합니다. 미방문 정점 모두에서 DFS를 시작하므로 고립 정점도 결과에 포함됩니다.']
        : ['Prepare dependency ordering', 'Each edge A→B requires A before B. Start DFS from every unvisited vertex, including isolated vertices.'];
      case 'enter': return ko ? ['DFS 진입', `정점 ${v.current}를 재귀 스택에 넣고 방문 표시합니다. 의존하는 다음 정점들을 처리한 뒤 완료 스택에 넣습니다.`]
        : ['Enter DFS', `Push vertex ${v.current} onto the recursion stack and mark it visited. Process its successors before pushing it onto the completion stack.`];
      case 'edge': return ko ? ['의존 간선 확인', `${v.current} → ${v.next}를 검사합니다. ${v.next}가 현재 재귀 스택 안에 있다면 사이클입니다. 이미 완료했다면 재방문하지 않습니다.`]
        : ['Inspect a dependency', `Check ${v.current} → ${v.next}. A successor in the active recursion stack means a cycle; skip already completed vertices.`];
      case 'leave': return ko ? ['완료 스택에 추가', `정점 ${v.current}의 다음 정점들을 모두 처리했습니다. 완료 스택 맨 위에 넣습니다. 아래 결과는 아직 최종 순서가 아니며 이후 앞쪽에 값이 더 들어갑니다.`]
        : ['Push onto the completion stack', `Finish successors of ${v.current} and push it on top. This is not yet the final order; later completions are prepended.`];
      default: return ko ? ['위상 순서 완료', `위상 순서: ${v.order}. 모든 간선의 출발 정점이 도착 정점보다 앞에 옵니다. 유효한 위상 순서는 여러 개일 수 있습니다.`]
        : ['Topological order complete', `Order: ${v.order}. Every edge source precedes its destination. Multiple valid topological orders may exist.`];
    }
  },
};

export const stack: NumericAlgorithm = {
  id: 'stack', category: 'structure', usesStart: false,
  name: { ko: '스택', en: 'Stack' },
  summary: { ko: '맨 위에 넣고 맨 위에서 꺼내는 LIFO 구조입니다. 초기 값도 순서대로 push합니다.', en: 'Push and pop at the top: last in, first out. Initial values are also pushed in order.' },
  source: stackSource, example: [3, 6, 2], operations: 'peek, push 9, pop, pop, peek', operationHint: 'push 9, pop, peek',
  time: { ko: 'push · pop · peek O(1)', en: 'push · pop · peek O(1)' },
  run: (values, _target, _edges, _directed, operations = stack.operations) => traceStack(values, operations),
  explain(step, language) {
    const ko = language === 'ko';
    const v = step.variables;
    switch (step.type) {
      case 'start': return ko ? ['빈 스택 준비', '기존 Stack 클래스로 빈 연결 리스트를 만듭니다. 초기 값을 왼쪽부터 하나씩 넣은 뒤 입력한 연산을 실행합니다.']
        : ['Create an empty stack', 'The existing Stack class creates an empty linked list. Push initial values from left to right, then execute your operations.'];
      case 'push': return ko ? [v.phase === 'input' ? '초기 값 넣기' : '맨 위에 넣기', `push(${v.value}): 연결 리스트 앞에 새 노드를 넣었습니다. TOP은 ${v.value}이며 기존 노드들은 아래로 이동합니다.`]
        : [v.phase === 'input' ? 'Push an initial value' : 'Push onto the top', `push(${v.value}) prepends a new linked-list node. TOP is ${v.value}; existing nodes move below it.`];
      case 'pop': return ko ? ['맨 위에서 꺼내기', v.result === 'null' ? '빈 스택이라 삭제할 노드가 없습니다. pop()은 null을 반환합니다.' : `TOP 노드를 삭제하고 값 ${v.result}을 반환했습니다. 다음 노드가 새로운 TOP이 됩니다.`]
        : ['Pop from the top', v.result === 'null' ? 'There is no node to remove. pop() returns null on an empty stack.' : `Remove the TOP node and return ${v.result}. The next node becomes TOP.`];
      case 'peek': return ko ? ['맨 위 값 조회', v.result === 'null' ? '빈 스택이므로 peek()은 null을 반환합니다. 구조는 바뀌지 않습니다.' : `TOP의 값 ${v.result}을 읽기만 합니다. 노드를 삭제하지 않으므로 구조는 그대로입니다.`]
        : ['Peek at the top', v.result === 'null' ? 'peek() returns null on an empty stack, without changing it.' : `Read TOP value ${v.result} without removing its node.`];
      default: return ko ? ['연산 완료', '모든 연산을 실행했습니다. 아래 값은 TOP부터 아래 방향의 순서입니다. 이전 단계로 돌아가 각 연산 전후를 비교하세요.']
        : ['Operations complete', 'All operations have run. Values are shown from TOP downward. Rewind to compare before and after each operation.'];
    }
  },
};

export const queue: NumericAlgorithm = {
  id: 'queue', category: 'structure', usesStart: false,
  name: { ko: '큐', en: 'Queue' },
  summary: { ko: '뒤로 넣고 앞에서 꺼내는 FIFO 구조입니다. 먼저 들어온 값이 먼저 나갑니다.', en: 'Enqueue at the rear and dequeue at the front: first in, first out.' },
  source: queueSource, example: [3, 6, 2], operations: 'peek, enqueue 9, dequeue, dequeue, peek', operationHint: 'enqueue 9, dequeue, peek',
  time: { ko: 'enqueue · dequeue · peek O(1)', en: 'enqueue · dequeue · peek O(1)' },
  run: (values, _target, _edges, _directed, operations = queue.operations) => traceQueue(values, operations),
  explain(step, language) {
    const ko = language === 'ko';
    const v = step.variables;
    switch (step.type) {
      case 'start': return ko ? ['빈 큐 준비', '기존 Queue 클래스로 빈 연결 리스트를 만듭니다. 초기 값을 왼쪽부터 뒤에 넣은 뒤 입력한 연산을 실행합니다.']
        : ['Create an empty queue', 'The existing Queue class creates an empty linked list. Enqueue initial values from left to right, then execute your operations.'];
      case 'enqueue': return ko ? [v.phase === 'input' ? '초기 값 넣기' : '뒤에 넣기', `enqueue(${v.value}): 연결 리스트 뒤에 새 노드를 붙였습니다. REAR는 ${v.value}이며 앞의 노드들 다음에 처리됩니다.`]
        : [v.phase === 'input' ? 'Enqueue an initial value' : 'Enqueue at the rear', `enqueue(${v.value}) appends a node. REAR is ${v.value}; it is processed after the nodes ahead of it.`];
      case 'dequeue': return ko ? ['앞에서 꺼내기', v.result === 'null' ? '빈 큐라 삭제할 노드가 없습니다. dequeue()은 null을 반환합니다.' : `FRONT 노드를 삭제하고 값 ${v.result}을 반환했습니다. 다음 노드가 새로운 FRONT가 됩니다.`]
        : ['Dequeue from the front', v.result === 'null' ? 'There is no node to remove. dequeue() returns null on an empty queue.' : `Remove the FRONT node and return ${v.result}. The next node becomes FRONT.`];
      case 'peek': return ko ? ['앞의 값 조회', v.result === 'null' ? '빈 큐이므로 peek()은 null을 반환합니다. 구조는 바뀌지 않습니다.' : `FRONT의 값 ${v.result}을 읽기만 합니다. 노드를 삭제하지 않습니다.`]
        : ['Peek at the front', v.result === 'null' ? 'peek() returns null on an empty queue, without changing it.' : `Read FRONT value ${v.result} without removing its node.`];
      default: return ko ? ['연산 완료', '모든 연산을 실행했습니다. 아래 값은 FRONT에서 REAR 순서입니다. 뒤로 이동해 FIFO 처리 순서를 다시 살펴보세요.']
        : ['Operations complete', 'All operations have run. Values are ordered FRONT to REAR. Rewind to inspect FIFO processing.'];
    }
  },
};

export const linkedList: NumericAlgorithm = {
  id: 'linked-list', category: 'structure', usesStart: false,
  name: { ko: '연결 리스트', en: 'Linked list' },
  summary: { ko: '노드의 next 연결로 순서를 유지합니다. 검색과 역순 전환의 포인터 이동을 따라가 보세요.', en: 'Maintain order through next links. Follow pointer movement during search and reversal.' },
  source: algorithmCode(linkedListSource), example: [3, 6, 2], operations: 'prepend 9, find 6, reverse, delete 3, append 7',
  operationHint: 'append 7, prepend 9, find 6, delete 3, reverse, deleteHead, deleteTail',
  time: { ko: '앞·뒤 추가 O(1) · 검색·삭제·역순 O(n)', en: 'prepend / append O(1) · find / delete / reverse O(n)' },
  run: (values, _target, _edges, _directed, operations = linkedList.operations) => traceLinkedList(values, operations),
  explain(step, language) {
    const ko = language === 'ko';
    const v = step.variables;
    switch (step.type) {
      case 'start': return ko ? ['빈 연결 리스트 준비', 'HEAD와 TAIL이 null인 리스트를 만듭니다. N 번호는 값이 같아도 서로 다른 노드를 구별하는 식별자입니다.']
        : ['Create an empty linked list', 'HEAD and TAIL begin as null. N identifiers distinguish nodes even when their values are equal.'];
      case 'append': case 'prepend': return ko ? [step.type === 'append' ? '뒤에 연결' : '앞에 연결', `${v.operation}(${v.value})으로 새 노드를 ${step.type === 'append' ? 'TAIL 뒤' : 'HEAD 앞'}에 연결했습니다. 화살표는 각 노드의 실제 next 연결입니다.`]
        : [step.type === 'append' ? 'Link at the tail' : 'Link at the head', `${v.operation}(${v.value}) links a new node ${step.type === 'append' ? 'after TAIL' : 'before HEAD'}. Arrows show each actual next link.`];
      case 'inspect': return ko ? ['검색 포인터 이동', `인덱스 ${v.index}의 값과 목표 ${v.value}을 비교합니다. 일치하면 그 노드를 반환하고, 아니면 next를 따라 이동합니다.`]
        : ['Move the search pointer', `Compare index ${v.index} with target ${v.value}. Return the node if it matches; otherwise follow next.`];
      case 'find': return ko ? ['검색 결과', v.result === 'null' ? '끝까지 일치하는 노드가 없어 null을 반환합니다.' : `첫 일치 노드의 값 ${v.result}을 반환합니다. 리스트는 변경하지 않습니다.`]
        : ['Search result', v.result === 'null' ? 'No matching node exists; return null.' : `Return the first matching node, with value ${v.result}. Leave the list unchanged.`];
      case 'reverse-link': return ko ? ['next 연결 뒤집기', `N${v.current}의 next를 ${Number(v.previous) < 0 ? 'null' : `N${v.previous}`}로 바꿨습니다. 다음 처리 대상은 ${Number(v.next) < 0 ? '없음' : `N${v.next}`}입니다. 중간 단계에는 연결이 끊긴 노드도 계속 표시하며 HEAD·TAIL은 마지막에 갱신합니다.`]
        : ['Reverse a next link', `Point N${v.current}.next to ${Number(v.previous) < 0 ? 'null' : `N${v.previous}`}. Next to process: ${Number(v.next) < 0 ? 'none' : `N${v.next}`}. Disconnected nodes remain visible; update HEAD and TAIL after the loop.`];
      case 'reverse': return ko ? ['HEAD·TAIL 갱신', '모든 next 연결을 뒤집었습니다. 이전 HEAD가 새 TAIL이 되고, 마지막으로 처리한 노드가 새 HEAD가 됩니다.']
        : ['Update HEAD and TAIL', 'All next links are reversed. The old HEAD becomes TAIL; the last processed node becomes HEAD.'];
      case 'delete': case 'deleteHead': case 'deleteTail': return ko ? ['노드 삭제', v.result === 'null' ? '삭제할 노드가 없어 null을 반환합니다.' : `${v.operation}이 값 ${v.result}인 노드를 삭제했습니다.${step.type === 'delete' ? ' delete(value)는 같은 값의 모든 노드를 삭제하고 마지막 삭제 노드를 반환합니다.' : ''} 남은 노드의 연결과 HEAD·TAIL을 확인하세요.`]
        : ['Remove nodes', v.result === 'null' ? 'No node can be removed; return null.' : `${v.operation} removes node value ${v.result}.${step.type === 'delete' ? ' delete(value) removes all matching nodes and returns the last removed node.' : ''} Inspect the remaining links, HEAD and TAIL.`];
      default: return ko ? ['연산 완료', '남은 노드를 HEAD에서 next 방향으로 표시했습니다. 타임라인을 되돌려 각 연결이 바뀌는 순간을 살펴보세요.']
        : ['Operations complete', 'Show remaining nodes from HEAD along next links. Rewind to inspect each link change.'];
    }
  },
};

export const minHeap: NumericAlgorithm = {
  id: 'min-heap', category: 'structure', usesStart: false,
  name: { ko: '최소 힙', en: 'Min heap' },
  summary: { ko: '루트에서 최솟값을 꺼냅니다. 삽입 후 위로, 추출 후 아래로 교환하며 힙 순서를 복원합니다.', en: 'Extract the minimum at the root. Restore heap order upward after insertion and downward after extraction.' },
  source: algorithmCode(heapClassSource + '\n' + minHeapSource), example: [8, 3, 6, 1, 5, 2],
  operations: 'peek, add 0, poll, poll, peek', operationHint: 'add 0, poll, peek',
  time: { ko: 'add · poll O(log n) · peek O(1)', en: 'add · poll O(log n) · peek O(1)' },
  run: (values, _target, _edges, _directed, operations = minHeap.operations) => traceHeap(values, operations),
  explain(step, language) {
    const ko = language === 'ko';
    const v = step.variables;
    switch (step.type) {
      case 'start': return ko ? ['빈 최소 힙 준비', '기존 MinHeap을 실행합니다. 배열 인덱스 i의 자식은 2i+1, 2i+2이며 부모는 floor((i-1)/2)입니다.']
        : ['Create an empty min heap', 'Run the existing MinHeap. Children of index i are 2i+1 and 2i+2; its parent is floor((i-1)/2).'];
      case 'add': return ko ? ['마지막 위치에 추가', `값 ${v.value}을 배열 끝에 추가했습니다. 아직 부모보다 작을 수 있어 위로 올리며 확인합니다.`]
        : ['Append at the last position', `Append ${v.value}. It may be smaller than its parent, so check upward.`];
      case 'compare-up': return ko ? ['부모와 비교', step.indices.length > 1 ? '부모 ≤ 자식인지 확인합니다. 자식이 더 작으면 두 위치를 교환하고 새 부모를 확인합니다.' : '루트에 도달해 부모가 없습니다. 위로 올리기를 끝냅니다.']
        : ['Compare with the parent', step.indices.length > 1 ? 'Check parent ≤ child. Swap if the child is smaller, then inspect its new parent.' : 'The root has no parent. Stop moving upward.'];
      case 'swap': return ko ? ['힙 위치 교환', '순서가 어긋난 부모와 자식을 교환했습니다. 새 위치에서 힙 조건을 다시 확인합니다. 주황색 노드가 교환한 위치입니다.']
        : ['Swap heap positions', 'Swap the out-of-order parent and child. Check heap order again at the new position. Orange marks the exchanged positions.'];
      case 'replace-root': return ko ? ['마지막 값을 루트로 이동', '기존 최솟값을 빼고 배열 마지막 값을 루트로 옮겼습니다. 더 작은 자식과 비교하며 아래로 내려 힙 순서를 복원합니다.']
        : ['Move the last value to the root', 'Remove the old minimum and move the last value to the root. Compare with the smaller child and move downward to restore order.'];
      case 'compare-down': return ko ? ['더 작은 자식과 비교', '왼쪽·오른쪽 자식 중 작은 쪽을 골랐습니다. 부모가 그 자식 이하이면 멈추고, 그렇지 않으면 교환합니다.']
        : ['Compare with the smaller child', 'Choose the smaller child. Stop if the parent is no greater; otherwise swap.'];
      case 'settled': return ko ? ['힙 순서 복원', '삽입을 마쳤습니다. 모든 부모가 자식 이하이며 루트가 최솟값입니다. 배열 전체가 정렬된 것은 아닙니다.']
        : ['Heap order restored', 'Insertion is complete. Every parent is no greater than its children; the root is minimum. The full array is not sorted.'];
      case 'peek': case 'poll': return ko ? [step.type === 'peek' ? '최솟값 조회' : '최솟값 추출', v.result === 'null' ? '빈 힙이므로 null을 반환합니다.' : `${v.operation}()의 반환 값은 ${v.result}입니다.${step.type === 'peek' ? ' 구조는 바뀌지 않습니다.' : ' 남은 힙의 순서를 복원했습니다.'}`]
        : [step.type === 'peek' ? 'Peek at the minimum' : 'Extract the minimum', v.result === 'null' ? 'The heap is empty; return null.' : `${v.operation}() returns ${v.result}.${step.type === 'peek' ? ' Leave the heap unchanged.' : ' Restore order in the remaining heap.'}`];
      default: return ko ? ['연산 완료', '남은 최소 힙입니다. 타임라인에서 교환 전후와 최솟값 추출을 비교해 보세요.']
        : ['Operations complete', 'The remaining min heap is shown. Rewind to compare swaps and minimum extraction.'];
    }
  },
};

export const priorityQueue: NumericAlgorithm = {
  id: 'priority-queue', category: 'structure', usesStart: false,
  name: { ko: '우선순위 큐', en: 'Priority queue' },
  summary: { ko: '값과 별개인 우선순위로 처리 순서를 정합니다. 작은 우선순위 숫자가 먼저 나옵니다.', en: 'Order items by priority independently of their value. Smaller priority numbers come first.' },
  source: algorithmCode(heapClassSource + '\n' + priorityQueueSource), example: [8, 3, 6],
  operations: 'add 42 -1, peek, changePriority 8 -2, poll, remove 6, peek',
  operationHint: 'add 42 -1, changePriority 8 -2, remove 6, poll, peek',
  inputHint: { ko: '서로 다른 값 최대 32개 · 초기 우선순위 = 값 · 연산 최대 64개', en: 'Up to 32 distinct values · initial priority = value · at most 64 operations' },
  time: { ko: 'add · poll O(log n) · 변경·삭제 최악 O(n)', en: 'add · poll O(log n) · update / remove worst O(n)' },
  run: (values, _target, _edges, _directed, operations = priorityQueue.operations) => tracePriorityQueue(values, operations),
  explain(step, language) {
    const ko = language === 'ko';
    const v = step.variables;
    switch (step.type) {
      case 'start': return ko ? ['우선순위 큐 준비', '기존 PriorityQueue는 최소 힙에 우선순위 비교를 연결합니다. 초기 값의 우선순위는 그 값이며, add 값 우선순위로 서로 다르게 지정할 수 있습니다.']
        : ['Prepare the priority queue', 'The existing PriorityQueue compares heap items by priority. Initial priorities equal their values; use add value priority to set them independently.'];
      case 'add': return ko ? ['힙 끝에 넣기', `값 ${v.value}, 우선순위 ${v.priority}을 넣었습니다. 값의 크기가 아닌 우선순위로 부모와 비교합니다.`]
        : ['Append to the heap', `Add value ${v.value} with priority ${v.priority}. Compare parent priorities, not item values.`];
      case 'compare-up': return ko ? ['부모의 우선순위 비교', step.indices.length > 1 ? '부모 우선순위 ≤ 자식 우선순위이면 멈춥니다. 자식이 더 먼저 처리돼야 하면 교환합니다.' : '루트에 도달해 위로 올리기를 끝냅니다.']
        : ['Compare parent priority', step.indices.length > 1 ? 'Stop if parent priority ≤ child priority; otherwise swap.' : 'The item reached the root. Stop moving upward.'];
      case 'compare-down': return ko ? ['자식의 우선순위 비교', '두 자식 중 우선순위 숫자가 작은 쪽을 선택해 부모와 비교합니다. 부모가 더 늦게 처리돼야 한다면 교환합니다.']
        : ['Compare child priority', 'Choose the child with the smaller priority number. Swap if the parent should be processed later.'];
      case 'swap': return ko ? ['우선순위로 위치 교환', '부모와 자식을 교환했습니다. 표시된 p가 우선순위이며, 값이 큰 노드도 우선순위가 작으면 위로 갑니다.']
        : ['Swap by priority', 'Swap parent and child. The p label is priority; a larger value can move upward when its priority number is smaller.'];
      case 'replace-root': return ko ? ['루트 자리 채우기', '우선순위가 가장 앞선 노드를 꺼내고 마지막 노드를 루트로 옮겼습니다. 아래로 비교해 우선순위 순서를 복원합니다.']
        : ['Fill the root position', 'Extract the item with the smallest priority number, then move the last item to the root and restore priority order.'];
      case 'settled': return ko ? ['우선순위 저장과 삽입 완료', `값 ${v.value}의 우선순위는 ${v.priority}입니다. 같은 우선순위끼리의 처리 순서는 보장하지 않습니다.`]
        : ['Priority saved and insertion complete', `Value ${v.value} has priority ${v.priority}. Equal-priority processing order is not guaranteed.`];
      case 'changePriority': return ko ? ['우선순위 변경', `값 ${v.value}을 기존 위치에서 제거하고 우선순위 ${v.priority}로 다시 넣었습니다. 실제 구현의 remove와 add가 순서를 복원합니다.`]
        : ['Change priority', `Remove ${v.value} and add it back with priority ${v.priority}. The existing remove and add methods restore order.`];
      case 'remove': return ko ? ['지정한 값 삭제', `값 ${v.value}과 그 우선순위 항목을 제거했습니다. 남은 힙을 확인하세요.`]
        : ['Remove an item', `Remove value ${v.value} and its priority entry. Inspect the remaining heap.`];
      case 'peek': case 'poll': return ko ? [step.type === 'peek' ? '다음 값 조회' : '다음 값 추출', v.result === 'null' ? '빈 큐이므로 null을 반환합니다.' : `${v.operation}()은 값 ${v.result}을 반환합니다. 가장 작은 값이 아니라 우선순위가 가장 앞선 값입니다.`]
        : [step.type === 'peek' ? 'Peek at the next item' : 'Extract the next item', v.result === 'null' ? 'The queue is empty; return null.' : `${v.operation}() returns value ${v.result}, selected by priority rather than minimum value.`];
      default: return ko ? ['연산 완료', '남은 우선순위 큐입니다. 노드 값과 p 우선순위를 비교하고, 되감기로 위치 변화를 살펴보세요.']
        : ['Operations complete', 'The remaining priority queue is shown. Compare values with p priorities and rewind to inspect movement.'];
    }
  },
};

export const binarySearchTree: NumericAlgorithm = {
  id: 'binary-search-tree', category: 'structure', usesStart: false,
  name: { ko: '이진 검색 트리', en: 'Binary search tree' },
  summary: { ko: '왼쪽은 더 작은 값, 오른쪽은 더 큰 값입니다. 비교 경로를 따라 삽입·검색·삭제합니다.', en: 'Smaller values go left, larger values right. Follow comparisons to insert, find and remove.' },
  source: algorithmCode(bstSource + '\n' + bstNodeSource), example: [8, 4, 12, 2, 6, 10, 14],
  operations: 'find 6, insert 5, remove 4, find 4', operationHint: 'insert 5, find 6, remove 4',
  inputHint: { ko: '서로 다른 노드 최대 12개 · 중복 삽입은 무시 · 연산 최대 64개', en: 'At most 12 distinct nodes · duplicate inserts ignored · at most 64 operations' },
  time: { ko: 'O(h) · 균형을 맞추지 않아 최악 O(n)', en: 'O(h) · unbalanced, worst O(n)' },
  run: (values, _target, _edges, _directed, operations = binarySearchTree.operations) => traceBinarySearchTree(values, operations),
  explain(step, language) {
    const ko = language === 'ko';
    const v = step.variables;
    switch (step.type) {
      case 'start': return ko ? ['빈 이진 검색 트리 준비', '기존 BinarySearchTree의 루트는 빈 값을 표시하는 null로 시작합니다. 첫 삽입이 이 루트의 값을 채웁니다.']
        : ['Create an empty BST', 'The existing BinarySearchTree starts with a null root value. The first insertion fills that root.'];
      case 'inspect-insert': case 'inspect-find': return ko ? ['현재 노드와 비교', v.current === '∅' ? `빈 루트입니다. 삽입이면 ${v.value}으로 채우고, 검색이면 일치하는 값이 없습니다.` : `현재 값 ${v.current}과 목표 ${v.value}을 비교합니다. 목표가 작으면 왼쪽, 크면 오른쪽으로 이동합니다. 같으면 ${step.type === 'inspect-insert' ? '중복을 추가하지 않습니다' : '이 노드를 반환합니다'}.`]
        : ['Compare at the current node', v.current === '∅' ? `The root is empty. An insertion fills it with ${v.value}; a search has no match.` : `Compare current value ${v.current} with target ${v.value}. Go left if smaller, right if larger. On equality, ${step.type === 'inspect-insert' ? 'do not add a duplicate' : 'return this node'}.`];
      case 'insert': return ko ? ['값 배치', `값 ${v.value}을 빈 루트 또는 부모의 빈 자식 위치에 배치했습니다. 경로의 모든 대소 관계가 유지됩니다.`]
        : ['Place the value', `Place ${v.value} in the empty root or a vacant child position. Preserve every comparison along the path.`];
      case 'insert-done': return ko ? ['삽입 완료', `값 ${v.value}의 위치가 정해졌습니다. 같은 값이 있었다면 새 노드를 만들지 않습니다. 아래 중위 순회는 오름차순입니다.`]
        : ['Insertion complete', `Value ${v.value} has its position. Existing values do not create duplicate nodes. Inorder output below is ascending.`];
      case 'find': return ko ? ['검색 결과', v.result === 'null' ? `값 ${v.value}이 없어 null을 반환합니다. 비어 있는 다음 가지에서 탐색이 끝납니다.` : `값 ${v.result}의 노드를 찾았습니다. 트리는 변경하지 않습니다.`]
        : ['Search result', v.result === 'null' ? `Value ${v.value} is absent; return null when the next branch is empty.` : `Find node value ${v.result} without changing the tree.`];
      case 'remove': return ko ? ['노드 삭제', `${v.value}을 삭제했습니다. ${v.children === 0 ? '잎이면 부모의 연결을 끊고, 마지막 루트면 null로 비웁니다.' : v.children === 1 ? '유일한 자식을 부모에 연결합니다. 루트라면 자식의 값과 연결을 복사합니다.' : '오른쪽 부분 트리의 최솟값으로 대체하고 그 노드를 제거합니다.'} 부모 연결도 유지해 이후 삭제를 계속할 수 있습니다.`]
        : ['Remove a node', `Remove ${v.value}. ${v.children === 0 ? 'Detach a leaf, or clear the last root to null.' : v.children === 1 ? 'Connect its only child to the parent; for the root, copy the child’s value and links.' : 'Replace it with the minimum from its right subtree and remove that successor.'} Preserve parent links for later removals.`];
      default: return ko ? ['연산 완료', '현재 트리와 중위 순회 결과입니다. 균형을 맞추지 않으므로 정렬된 입력은 긴 한쪽 가지를 만들 수 있습니다.']
        : ['Operations complete', 'Inspect the current tree and inorder output. This tree does not balance itself, so sorted input can form a long one-sided chain.'];
    }
  },
};

export const trie: WordAlgorithm = {
  id: 'trie', category: 'structure', inputMode: 'words', usesStart: false,
  name: { ko: '트라이', en: 'Trie' },
  summary: { ko: '공유 접두사를 글자 경로로 저장합니다. 단어 종료 표시는 접두사와 완전한 단어를 구별합니다.', en: 'Store shared prefixes as character paths. Terminal markers distinguish complete words from prefixes.' },
  source: algorithmCode(trieSource + '\n' + trieNodeSource), example: ['car', 'cat', 'cart', '가방', '가게'],
  operations: 'find ca, suggest ca, add carpet, delete car, find car, find cart',
  operationHint: 'add carpet, delete car, find cart, suggest ca',
  inputHint: { ko: '최대 12단어 · 단어당 16글자 · 최대 80노드 · 대소문자 구분', en: 'Up to 12 words · 16 code points per word · 80 nodes · case-sensitive' },
  time: { ko: '추가·검색·삭제 O(m) · m은 글자 수', en: 'add / find / delete O(m) · m is word length' },
  run: (words, _target, _edges, _directed, operations = trie.operations) => traceTrie(words, operations),
  explain(step, language) {
    const ko = language === 'ko';
    const v = step.variables;
    switch (step.type) {
      case 'start': return ko ? ['빈 트라이 준비', 'ROOT는 글자를 저장하는 경로의 시작입니다. 초록 테두리는 완전한 단어의 끝이며, 자식이 있어도 단어의 끝이 될 수 있습니다.']
        : ['Create an empty trie', 'ROOT starts each character path. A green outline marks a complete word ending; a terminal node can still have children.'];
      case 'add-character': return ko ? ['글자 경로 연결', `단어 ${v.word}의 ${Number(v.charIndex) + 1}번째 글자 “${v.character}”를 연결했습니다. 같은 접두사의 기존 노드는 재사용하고 마지막 글자는 단어 종료로 표시합니다.`]
        : ['Link a character', `Link character “${v.character}” at position ${Number(v.charIndex) + 1} in ${v.word}. Reuse shared-prefix nodes and mark the last character as terminal.`];
      case 'inspect-character': case 'delete-inspect': return ko ? ['다음 글자 확인', `“${v.word}”의 ${Number(v.charIndex) + 1}번째 글자 “${v.character}”로 가는 자식이 있는지 확인합니다. 없으면 이 경로의 탐색이 끝납니다.`]
        : ['Inspect the next character', `Check for child “${v.character}” at position ${Number(v.charIndex) + 1} of “${v.word}”. A missing child ends the lookup.`];
      case 'delete-prune': return ko ? ['불필요한 연결 정리', `“${v.character}” 자식이 다른 단어의 끝도 아니고 자식도 없을 때만 삭제합니다. 공유 접두사는 다른 단어에 필요하므로 남습니다.`]
        : ['Prune unnecessary links', `Remove child “${v.character}” only if it is neither terminal nor has children. Preserve shared prefixes used by other words.`];
      case 'add': return ko ? ['단어 저장 완료', `“${v.word}”의 경로와 단어 종료 표시를 저장했습니다. 중복 추가는 새로운 단어를 만들지 않습니다.`]
        : ['Word stored', `Store the path and terminal marker for “${v.word}”. Duplicate additions create no new word.`];
      case 'delete': return ko ? ['단어 삭제 완료', `“${v.word}”의 종료 표시를 해제하고 불필요한 가지를 정리했습니다. 다른 단어의 공유 경로는 보존됩니다. 없는 단어의 삭제는 구조를 바꾸지 않습니다.`]
        : ['Deletion complete', `Unmark “${v.word}” and prune unused branches, preserving shared paths. Deleting an absent word leaves the trie unchanged.`];
      case 'find': return ko ? ['완전한 단어 확인', v.result ? `“${v.word}”의 경로 끝에 단어 종료 표시가 있어 true입니다.` : `“${v.word}”는 저장된 완전한 단어가 아니므로 false입니다. 경로만 존재하는 접두사도 false입니다.`]
        : ['Check for a complete word', v.result ? `“${v.word}” ends at a terminal marker: true.` : `“${v.word}” is not a stored complete word: false. A prefix path alone is insufficient.`];
      case 'suggest': return ko ? ['다음 글자 제안', v.result === 'null' ? `접두사 “${v.word}”의 경로가 없어 null을 반환합니다.` : v.result === '∅' ? `접두사 “${v.word}”에는 다음 글자가 없습니다. 빈 배열을 반환합니다.` : `접두사 “${v.word}” 다음에 올 수 있는 글자는 ${v.result}입니다. 완성 단어 목록이 아니라 바로 다음 글자를 반환합니다.`]
        : ['Suggest next characters', v.result === 'null' ? `Prefix “${v.word}” has no path: return null.` : v.result === '∅' ? `Prefix “${v.word}” has no next characters: return an empty array.` : `Next characters after “${v.word}”: ${v.result}. Return immediate characters, not complete word suggestions.`];
      default: return ko ? ['연산 완료', '아래 목록은 종료 표시가 있는 완전한 단어입니다. 타임라인을 되돌려 접두사를 공유하는 노드와 삭제된 가지를 비교하세요.']
        : ['Operations complete', 'The list below contains terminal words. Rewind to compare shared-prefix nodes and pruned branches.'];
    }
  },
};

export const fenwick: NumericAlgorithm = {
  id: 'fenwick-tree', category: 'structure', usesStart: false,
  name: { ko: '펜윅 트리', en: 'Fenwick tree' },
  summary: { ko: 'lowbit(i) = i & -i로 담당 구간과 이동 위치를 정해 값 증가와 구간 합을 계산합니다.', en: 'Use lowbit(i) = i & -i to determine stored ranges and jumps for increments and range sums.' },
  source: algorithmCode(fenwickSource), example: [3, 2, -1, 6, 5, 4, -3, 3],
  operations: 'query 7, increase 3 2, range 2 6', operationHint: 'query 7, increase 3 2, range 2 6',
  inputHint: { ko: '인덱스는 1부터 · 최대 32값 · increase 위치 증가량 · range 왼쪽 오른쪽', en: '1-based indices · up to 32 values · increase position delta · range left right' },
  time: { ko: '구성 O(n log n) · 증가·조회 O(log n)', en: 'Build O(n log n) · increment / query O(log n)' },
  run: (values, _target, _edges, _directed, operations = fenwick.operations) => traceFenwick(values, operations),
  explain(step, language) {
    const ko = language === 'ko';
    const v = step.variables;
    switch (step.type) {
      case 'start': return ko ? ['0으로 트리 준비', 'tree[0]은 사용하지 않습니다. tree[i]는 i-lowbit(i)+1부터 i까지의 합을 저장합니다. 초기 값도 increase로 하나씩 반영합니다.']
        : ['Initialize zeros', 'tree[0] is unused. tree[i] stores the sum from i-lowbit(i)+1 through i. Build by applying increase to each initial value.'];
      case 'increase-node': return ko ? ['담당 구간 합 갱신', `tree[${v.i}]에 ${v.value}을 더했습니다. lowbit=${v.lowbit}이므로 다음 위치는 ${v.next}입니다. 이 위치가 배열 길이를 넘으면 갱신을 끝냅니다.`]
        : ['Update a stored range', `Add ${v.value} to tree[${v.i}]. lowbit=${v.lowbit}, so the next index is ${v.next}. Stop beyond the array length.`];
      case 'increased': return ko ? ['증가량 반영 완료', `원본 위치 ${v.position}에 ${v.value}을 더하고 관련 구간 합을 모두 갱신했습니다. 대입이 아니라 기존 값에 더하는 연산입니다.`]
        : ['Increment complete', `Add ${v.value} at position ${v.position} and update every affected stored sum. This increments the value rather than replacing it.`];
      case 'query-node': return ko ? ['접두 합 누적', `${v.position}까지의 합에 tree[${v.i}]를 더해 현재 합은 ${v.sum}입니다. 다음 위치 ${v.next}로 이동합니다. 0에 도달하면 겹치지 않는 구간 합을 모두 모았습니다.`]
        : ['Accumulate a prefix sum', `Add tree[${v.i}] while querying through ${v.position}. Running sum: ${v.sum}. Move to ${v.next}; reaching 0 completes the disjoint ranges.`];
      case 'query': return ko ? ['접두 합 결과', `1부터 ${v.position}까지의 합은 ${v.result}입니다.`] : ['Prefix sum result', `Sum from 1 through ${v.position}: ${v.result}.`];
      case 'range': return ko ? ['구간 합 결과', `${v.position}부터 ${v.right}까지의 합은 ${v.result}입니다. 오른쪽 접두 합에서 왼쪽 직전 접두 합을 뺍니다. 왼쪽이 1이면 오른쪽 합만 사용합니다.`]
        : ['Range sum result', `Sum from ${v.position} through ${v.right}: ${v.result}. Subtract the prefix before the left bound from the right prefix; if left is 1, use only the right prefix.`];
      default: return ko ? ['연산 완료', '담당 구간 표와 현재 원본 값입니다. 뒤로 이동해 lowbit을 따라 갱신·누적한 위치를 비교하세요.']
        : ['Operations complete', 'Inspect stored ranges and current input values. Rewind to compare lowbit update and query paths.'];
    }
  },
};

export const segment: NumericAlgorithm = {
  id: 'segment-tree', category: 'structure', usesStart: false,
  name: { ko: '구간 트리', en: 'Segment tree' },
  summary: { ko: '구간을 반으로 나누어 합을 저장하고, 전체·부분·불일치 구간을 구별해 조회합니다.', en: 'Split ranges in half and store sums. Query by distinguishing total, partial and no overlap.' },
  source: algorithmCode(segmentSource), example: [3, 2, -1, 6, 5, 4],
  operations: 'range 1 4, range 0 5, range 2 2', operationHint: 'range 1 4, range 0 5, range 2 2',
  inputHint: { ko: '0부터 시작하는 인덱스 · 1–32값 · 구간 합 조회 · 값 변경은 배열 재적용', en: '0-based indices · 1–32 values · range sums · reapply input to change values' },
  time: { ko: '구성 O(n) · 구간 합 O(log n)', en: 'Build O(n) · range sum O(log n)' },
  run: (values, _target, _edges, _directed, operations = segment.operations) => traceSegment(values, operations),
  explain(step, language) {
    const ko = language === 'ko';
    const v = step.variables;
    switch (step.type) {
      case 'start': return ko ? ['저장 공간 준비', '기존 SegmentTree를 합 연산과 항등원 0으로 실행합니다. 각 노드는 담당 구간의 합이며, 잎부터 부모 방향으로 채웁니다.']
        : ['Prepare storage', 'Run the existing SegmentTree with sum and identity 0. Each node stores its range sum, filled from leaves toward parents.'];
      case 'build-enter': return ko ? ['구간 분할', `구간 [${v.left}, ${v.right}]에 진입했습니다. 한 원소면 잎이고, 두 개 이상이면 중간을 기준으로 반으로 나눕니다.`]
        : ['Split a range', `Enter [${v.left}, ${v.right}]. A single element is a leaf; otherwise split at the midpoint.`];
      case 'leaf': return ko ? ['잎의 값 저장', `입력 인덱스 ${v.left}의 값을 잎에 복사했습니다. 이 노드는 한 원소의 구간 합입니다.`]
        : ['Store a leaf', `Copy input index ${v.left} into a leaf. This node sums a single-element range.`];
      case 'build-combine': return ko ? ['두 자식 합치기', `두 자식의 합을 더해 구간 [${v.left}, ${v.right}]의 합을 저장했습니다.`]
        : ['Combine child sums', `Add both child sums to store the sum of [${v.left}, ${v.right}].`];
      case 'total': return ko ? ['전체 포함', `조회 [${v.queryLeft}, ${v.queryRight}]가 노드 구간 [${v.left}, ${v.right}]를 모두 포함합니다. 자식에 내려가지 않고 저장된 합 ${v.value}을 반환합니다.`]
        : ['Total overlap', `Query [${v.queryLeft}, ${v.queryRight}] fully contains [${v.left}, ${v.right}]. Return stored sum ${v.value} without descending.`];
      case 'none': return ko ? ['겹치지 않는 구간', `노드 구간 [${v.left}, ${v.right}]는 조회와 겹치지 않습니다. 합의 항등원인 0을 반환합니다.`]
        : ['No overlap', `[${v.left}, ${v.right}] does not overlap the query. Return 0, the identity for addition.`];
      case 'partial': return ko ? ['부분 포함', `일부만 겹치므로 중간 인덱스 ${v.middleIndex}에서 나누어 두 자식의 결과를 구합니다.`]
        : ['Partial overlap', `Only part overlaps. Split at midpoint ${v.middleIndex} and query both children.`];
      case 'query-combine': return ko ? ['조회 결과 합치기', `왼쪽 결과 ${v.leftResult}과 오른쪽 결과 ${v.rightResult}을 더하면 ${v.result}입니다.`]
        : ['Combine query results', `${v.leftResult} from the left plus ${v.rightResult} from the right gives ${v.result}.`];
      case 'range': return ko ? ['구간 합 결과', `[${v.queryLeft}, ${v.queryRight}]의 합은 ${v.result}입니다. 양 끝 인덱스를 모두 포함합니다.`]
        : ['Range sum result', `Sum of inclusive range [${v.queryLeft}, ${v.queryRight}]: ${v.result}.`];
      default: return ko ? ['연산 완료', '구간별 합과 입력 배열입니다. 되감기로 분할과 포함 관계에 따라 사용한 노드를 비교하세요.']
        : ['Operations complete', 'Inspect range sums and input values. Rewind to compare nodes used for splits and overlaps.'];
    }
  },
};

export const hashTable: WordAlgorithm = {
  id: 'hash-table', category: 'structure', inputMode: 'words', usesStart: false,
  name: { ko: '해시 테이블', en: 'Hash table' },
  summary: { ko: '키를 버킷으로 매핑하고, 같은 해시의 다른 키는 연결 리스트에서 비교합니다.', en: 'Map keys to buckets, then compare colliding keys in a linked list.' },
  source: algorithmCode(hashTableSource), example: ['ab', 'ba', 'ac'],
  operations: 'get ba, set ab updated, set cb new, delete ba, get ba, has ab',
  operationHint: 'set ab updated, get ba, delete ba, has ab',
  inputHint: { ko: '최대 12키 · 키·값 각각 16글자 · 8버킷 · 초기 값은 입력 인덱스', en: 'Up to 12 keys · 16 code points per key / value · 8 buckets · initial values are input indices' },
  time: { ko: 'O(k + c) · 키 길이 k · 버킷 길이 c', en: 'O(k + c) · key length k · bucket length c' },
  run: (keys, _target, _edges, _directed, operations = hashTable.operations) => traceHashTable(keys, operations),
  explain(step, language) {
    const ko = language === 'ko';
    const v = step.variables;
    switch (step.type) {
      case 'start': return ko ? ['8개 버킷 준비', '기존 HashTable을 8버킷으로 실행합니다. 각 버킷은 연결 리스트입니다. 초기 키의 값은 0부터 시작하는 입력 순서입니다.']
        : ['Prepare eight buckets', 'Run the existing HashTable with eight linked-list buckets. Initial values are zero-based input positions.'];
      case 'hash': return ko ? ['해시로 버킷 선택', `키 “${v.key}”의 문자 코드 합 ${v.hash}를 8로 나눈 나머지는 ${v.keyHash}입니다. “ab”와 “ba”처럼 서로 다른 키가 같은 버킷을 사용할 수 있습니다.`]
        : ['Select a bucket by hash', `The character-code sum for “${v.key}” is ${v.hash}; modulo 8 selects bucket ${v.keyHash}. Different keys such as “ab” and “ba” can collide.`];
      case 'probe': return ko ? ['버킷 안의 키 비교', `요청 키 “${v.key}”와 후보 “${v.candidate}”가 같은지 비교합니다. 해시가 같아도 키가 다르면 다음 노드를 확인합니다.`]
        : ['Compare keys within the bucket', `Compare requested key “${v.key}” with candidate “${v.candidate}”. Equal hashes do not imply equal keys; follow the next node if different.`];
      case 'set-new': return ko ? ['새 키 추가', `키 “${v.key}”, 값 “${v.value}”를 선택한 버킷의 연결 리스트 끝에 추가했습니다.`]
        : ['Append a new key', `Append key “${v.key}” with value “${v.value}” to the selected bucket chain.`];
      case 'set-update': return ko ? ['기존 값 변경', `기존 키 “${v.key}”의 값만 “${v.value}”로 바꿨습니다. 새 노드를 만들지 않습니다.`]
        : ['Update an existing value', `Replace the value of “${v.key}” with “${v.value}” without creating a new node.`];
      case 'get': return ko ? ['값 조회 결과', `get(“${v.key}”)의 결과는 ${v.result}입니다. 키가 없으면 undefined를 반환합니다.`]
        : ['Get result', `get(“${v.key}”) returns ${v.result}. Missing keys return undefined.`];
      case 'has': return ko ? ['키 존재 확인', `has(“${v.key}”)는 ${v.result}입니다. 이 구현은 키 사전을 직접 확인하므로 버킷을 순회하지 않습니다.`]
        : ['Check key presence', `has(“${v.key}”) is ${v.result}. This implementation checks its key dictionary directly, without scanning buckets.`];
      case 'delete': return ko ? ['키 삭제 결과', `키 “${v.key}”를 삭제했습니다. 반환 값은 ${v.result}입니다. 키가 없으면 null이며, 충돌한 다른 키는 남습니다.`]
        : ['Delete result', `Remove “${v.key}”; returned value: ${v.result}. Missing keys return null; other colliding keys remain.`];
      default: return ko ? ['연산 완료', '버킷의 키:값과 남은 키 목록입니다. 되감기로 충돌 처리, 값 변경, 삭제 전후를 비교하세요.']
        : ['Operations complete', 'Inspect bucket key:value entries and remaining keys. Rewind to compare collisions, updates and deletions.'];
    }
  },
};

export const algorithms: Algorithm[] = [bubble, selection, insertion, merge, quick, shell, heap, counting, radix, linear, binary, jump, interpolation, bfs, dfs, dijkstra, bellman, floyd, prim, kruskal, topological, stack, queue, linkedList, minHeap, priorityQueue, binarySearchTree, trie, fenwick, segment, hashTable];
