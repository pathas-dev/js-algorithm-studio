import combinationSumSource from '../src/algorithms/sets/combination-sum/combinationSum.js?raw';
import maximumSource from '../src/algorithms/sets/maximum-subarray/dpMaximumSubarray.js?raw';
import scsSource from '../src/algorithms/sets/shortest-common-supersequence/shortestCommonSupersequence.js?raw';
import lisSource from '../src/algorithms/sets/longest-increasing-subsequence/dpLongestIncreasingSubsequence.js?raw';
import combinationSource from '../src/algorithms/sets/combinations/combineWithoutRepetitions.js?raw';
import permutationSource from '../src/algorithms/sets/permutations/permutateWithoutRepetitions.js?raw';
import powerSetSource from '../src/algorithms/sets/power-set/bwPowerSet.js?raw';
import shuffleSource from '../src/algorithms/sets/fisher-yates/fisherYates.js?raw';
import type { Algorithm, TextAlgorithm, NumericAlgorithm } from './algorithms';
import source from '../src/algorithms/sets/cartesian-product/cartesianProduct.js?raw';
import { algorithmCode } from '../src/visualization/playback';
import traceCartesian, { traceShuffle, tracePowerSet, tracePermutations, traceCombinations, traceLis, traceSupersequence, traceMaximumSubarray, traceCombinationSum } from '../src/visualization/collections';

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

export const powerSetLesson: NumericAlgorithm = {
  ...shuffleLesson, id: 'power-set',
  name: { ko: '멱집합', en: 'Power set' },
  summary: { ko: 'n개 원소는 각각 포함·제외 두 가지 선택이 있어 총 2ⁿ개 부분집합을 만듭니다. 비트 0은 첫 원소이며 빈 집합과 전체 집합도 포함합니다.', en: 'Each of n items is included or excluded, producing 2ⁿ subsets. Bit zero represents the first item; include both the empty and full sets.' },
  source: algorithmCode(powerSetSource), example: [1, 2, 3], time: 'O(n × 2ⁿ)',
  inputHint: { ko: '서로 다른 숫자 최대 6개 · 중복 제거 · 빈 집합도 가능', en: 'At most six distinct numbers · duplicates removed · empty input allowed' },
  run: (values) => tracePowerSet(values),
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['모든 비트 마스크 준비', '0부터 2ⁿ−1까지 마스크를 확인합니다. 각 비트는 한 원소의 포함 여부이며 모두 0인 마스크는 빈 집합입니다.'] : ['Prepare every bit mask', 'Check masks from zero through 2ⁿ−1. Each bit selects one item; the all-zero mask is the empty set.'];
    if (step.type === 'check-bit') return ko ? ['비트로 원소 포함 여부 확인', `마스크 ${v.mask}의 ${v.indexA}번 비트가 ${Number(v.mask) & (1 << Number(v.indexA)) ? '1이라 원소를 포함합니다' : '0이라 원소를 제외합니다'}. 초록색은 현재 선택된 원소입니다.`] : ['Check the item selection bit', `Mask ${v.mask}, bit ${v.indexA}: ${Number(v.mask) & (1 << Number(v.indexA)) ? 'one includes the item' : 'zero excludes the item'}. Green items are selected.`];
    if (step.type === 'append-subset') return ko ? ['부분집합 저장', `마스크 ${v.mask}의 선택을 저장했습니다. 지금까지 ${v.count}개 부분집합을 만들었습니다.`] : ['Save the subset', `Save the selection for mask ${v.mask}; ${v.count} subsets created so far.`];
    return ko ? ['멱집합 완성', `총 ${v.count}개 부분집합입니다. 빈 입력도 빈 집합 하나를 원소로 가지므로 멱집합 크기는 1입니다.`] : ['Power set ready', `${v.count} subsets. Empty input still has one subset, the empty set itself.`];
  },
};

export const permutationLesson: NumericAlgorithm = {
  ...shuffleLesson, id: 'permutations',
  name: { ko: '순열', en: 'Permutations' },
  summary: { ko: '작은 순열의 모든 자리에 첫 원소를 끼워 넣어 전체 순열을 만듭니다. 중복 없는 n개 원소의 순서는 n!개입니다.', en: 'Insert the first item into every position of smaller permutations. There are n! orders for n distinct items.' },
  source: algorithmCode(permutationSource), example: [1, 2, 3], time: 'O(n × n!)',
  inputHint: { ko: '서로 다른 숫자 최대 5개 · 중복 제거 · 원소를 반복 사용하지 않는 순열', en: 'At most five distinct numbers · duplicates removed · permutations without repetition' },
  run: (values) => tracePermutations(values),
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start' || step.type === 'enter') return ko ? ['첫 원소를 제외한 하위 문제 풀기', `현재 ${v.size}개 원소입니다. 첫 원소를 제외한 작은 순열을 먼저 구합니다. 현재 화면은 이 하위 문제의 결과입니다.`] : ['Solve the smaller suffix first', `The current problem has ${v.size} items. First permute the suffix without its first item. The display shows this subproblem.`];
    if (step.type === 'base') return ko ? ['재귀의 가장 작은 순열', '원소가 1개면 그 원소 하나가 유일한 순열입니다. 원소가 0개일 때도 빈 순열 한 가지가 있어 재귀를 종료합니다.'] : ['The smallest permutation problem', 'One item has one order. Zero items have one empty permutation, ending recursion as well.'];
    if (step.type === 'insert') return ko ? ['모든 삽입 위치 시도', `작은 순열 (${v.smaller})의 ${v.position}번 자리에 ${v.firstOption}를 끼워 넣었습니다. 원래 원소의 순서가 달라지면 서로 다른 순열입니다.`] : ['Try every insertion position', `Insert ${v.firstOption} at position ${v.position} of (${v.smaller}). Different item orders are distinct permutations.`];
    return ko ? [step.type === 'done' ? '전체 순열 완성' : '하위 순열 반환', `${v.size}개 원소의 순열 ${v.count}개를 ${step.type === 'done' ? '완성했습니다' : '이전 호출에 반환합니다'}. 결과 수는 ${v.size}!입니다.`] : [step.type === 'done' ? 'All permutations ready' : 'Return the smaller permutations', `${v.count} permutations of ${v.size} items ${step.type === 'done' ? 'are complete' : 'return to the caller'}. The count equals ${v.size}!.`];
  },
};

export const combinationLesson: NumericAlgorithm = {
  ...shuffleLesson, id: 'combinations', usesStart: true, singleInput: false, target: 2,
  name: { ko: '조합', en: 'Combinations' },
  summary: { ko: '원소를 반복 사용하지 않고 k개를 선택합니다. 고른 원소 뒤의 원소만 재귀적으로 선택해 순서만 다른 중복 결과를 만들지 않습니다.', en: 'Choose k items without repetition. Recursively choose only items after the current one, avoiding duplicate results caused by reordered selections.' },
  source: algorithmCode(combinationSource), example: [1, 2, 3, 4], time: 'O(k × C(n,k))',
  targetLabel: { ko: '선택할 개수 k', en: 'Selection count k' },
  inputHint: { ko: '서로 다른 숫자 최대 6개 · k는 0–6 · 중복 제거 · 순서 무관', en: 'At most six distinct numbers · k zero to six · duplicates removed · order ignored' },
  run: (values, k) => traceCombinations(values, k),
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start' || step.type === 'enter') return ko ? ['남은 원소에서 k개 선택', `현재 ${v.size}개 중 ${v.k}개를 고르는 하위 문제입니다. 한 원소를 고르면 그 뒤의 원소들에서 나머지를 고릅니다.`] : ['Choose k from the remaining items', `This subproblem chooses ${v.k} from ${v.size} items. After choosing an item, choose the rest only from its suffix.`];
    if (step.type === 'base') return ko ? ['가장 작은 조합 문제', Number(v.k) === 0 ? '0개를 선택하는 방법은 빈 조합 하나입니다.' : '1개를 선택한다면 남은 각 원소가 하나씩 조합이 됩니다. 남은 원소가 없으면 결과도 없습니다.'] : ['The smallest combination problem', Number(v.k) === 0 ? 'There is one way to choose zero items: the empty combination.' : 'To choose one item, each remaining item forms a singleton. No remaining items means no results.'];
    if (step.type === 'append-combination') return ko ? ['첫 선택과 작은 조합 합치기', `${v.currentOption}에 작은 조합 (${v.smaller})을 붙였습니다. 이후 원소만 고르므로 같은 원소 집합은 한 번만 나옵니다.`] : ['Join the choice with the smaller combination', `Prefix (${v.smaller}) with ${v.currentOption}. Restricting choices to later items produces each selection once.`];
    return ko ? [step.type === 'done' ? '전체 조합 완성' : '작은 조합 반환', `${v.size}개 중 ${v.k}개를 선택하는 방법은 ${v.count}가지입니다. k가 n보다 크면 고를 수 없어 0가지입니다.`] : [step.type === 'done' ? 'All combinations ready' : 'Return the smaller combinations', `${v.count} ways to choose ${v.k} from ${v.size}. If k exceeds n, there are zero ways.`];
  },
};

export const lisLesson: NumericAlgorithm = {
  ...shuffleLesson, id: 'longest-increasing-subsequence',
  name: { ko: '최장 증가 수열', en: 'Longest increasing subsequence' },
  summary: { ko: '각 위치에서 끝나는 엄격히 증가하는 부분 수열의 최대 길이를 계산합니다. 원소를 건너뛸 수 있지만 원래 순서는 유지하며 같은 값은 증가로 보지 않습니다.', en: 'Compute the longest strictly increasing subsequence ending at each position. Items may be skipped but retain their order; equal values are not increasing.' },
  source: algorithmCode(lisSource), example: [3, 1, 2, 5, 4], time: 'O(n²)',
  inputHint: { ko: '숫자 최대 16개 · 중복 유지 · 함수는 수열 자체가 아니라 최대 길이를 반환', en: 'At most sixteen numbers · duplicates preserved · the function returns the length, not the subsequence' },
  run: (values) => traceLis(values),
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['각 원소 하나로 길이 1', '각 원소는 길이 1의 수열이 됩니다. 빈 입력에는 원소가 없어 최대 길이가 0입니다.'] : ['Each item starts with length one', 'Each item forms a length-one subsequence. Empty input has length zero.'];
    if (step.type === 'compare') return ko ? ['앞선 값으로 이어갈 수 있는지 확인', `${v.previousElementIndex}번과 ${v.currentElementIndex}번을 비교합니다. 앞선 값이 더 작을 때만 앞선 길이+1을 후보로 만들며, 현재 길이보다 큰 경우에만 갱신합니다.`] : ['Check whether an earlier sequence can extend', `Compare positions ${v.previousElementIndex} and ${v.currentElementIndex}. Only a smaller earlier value can extend its length by one, and only an improvement updates the current length.`];
    if (step.type === 'update') return ko ? ['현재 위치의 길이 갱신', `앞선 ${v.previousElementIndex}번 위치의 수열에 현재 ${v.currentElementIndex}번 값을 붙이면 더 긴 수열이 됩니다. 표의 현재 길이를 갱신했습니다.`] : ['Update the length ending here', `Appending position ${v.currentElementIndex} to the sequence ending at ${v.previousElementIndex} improves its length. Update the table.`];
    if (step.type === 'best') return ko ? ['모든 끝 위치 중 최댓값', `지금까지 확인한 최대 길이는 ${v.best}입니다. 최장 수열이 마지막 원소에서 끝난다는 보장은 없어 모두 검사합니다.`] : ['Find the maximum over all endpoints', `Best length so far: ${v.best}. The longest subsequence need not end at the final item, so inspect every endpoint.`];
    return ko ? ['최장 증가 수열 길이 완료', `최대 길이는 ${v.result}입니다. 이 함수는 길이만 계산하며 실제 원소 목록을 역추적하지는 않습니다.`] : ['LIS length ready', `The maximum length is ${v.result}. This function computes length without tracing back the actual item list.`];
  },
};

export const supersequenceLesson: TextAlgorithm = {
  ...cartesianLesson, id: 'shortest-common-supersequence',
  name: { ko: '최단 공통 상위 수열', en: 'Shortest common supersequence' },
  summary: { ko: '최장 공통 부분 수열을 기준으로 두 문자열을 합칩니다. 공통 문자는 한 번만 넣고 다른 문자는 각 문자열의 순서대로 넣어 가장 짧은 상위 수열을 만듭니다.', en: 'Merge two strings around their longest common subsequence. Include shared characters once and other characters in their original order to form a shortest supersequence.' },
  source: algorithmCode(scsSource), example: ['GEEK', 'EKE'], time: 'O(mn)',
  inputLabels: [{ ko: '문자열 A', en: 'String A' }, { ko: '문자열 B', en: 'String B' }],
  inputHint: { ko: '각 문자열 최대 12글자 · 유니코드 코드 포인트 · 공백·중복 문자 유지', en: 'Up to twelve Unicode code points per string · spaces and repeated characters preserved' },
  run: (inputs) => traceSupersequence(inputs),
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['공통 부분 수열을 기준으로 준비', '먼저 최장 공통 부분 수열(LCS)을 계산합니다. 두 문자열을 이 순서에 맞춰 진행하고 공통 문자는 한 번만 넣습니다. LCS가 없으면 단순 연결도 최단입니다.'] : ['Prepare around the common subsequence', 'First compute the longest common subsequence (LCS). Merge around its order, including shared characters once. Without an LCS, concatenation is already shortest.'];
    if (step.type === 'append-shared') return ko ? ['공통 문자를 한 번만 추가', '두 입력이 같은 다음 LCS 문자에 도달했습니다. 출력에 한 번만 넣고 두 입력 위치를 함께 이동합니다.'] : ['Append the shared character once', 'Both inputs reached the next LCS character. Append it once and advance both inputs.'];
    if (step.type.startsWith('append-')) return ko ? ['공통 문자 앞의 문자 보존', `${step.type === 'append-first' ? 'A' : 'B'}의 현재 문자를 추가했습니다. 다른 입력은 필요할 때까지 기다려 각 입력의 순서를 보존합니다.`] : ['Preserve the character before the common one', `Append the current character from ${step.type === 'append-first' ? 'A' : 'B'}. The other input waits as needed to retain both orders.`];
    if (step.type.startsWith('tail-')) return ko ? ['공통 수열 뒤의 나머지 붙이기', '공통 문자를 모두 처리했으므로 남아 있는 입력 접미사를 순서대로 한 번에 붙입니다.'] : ['Append the remaining suffix', 'All shared characters are processed. Append the remaining input suffix in order.'];
    return ko ? ['최단 공통 상위 수열 완성', `결과는 ${v.result || '∅'}, 길이는 ${v.count}입니다. 최단 길이는 |A|+|B|−|LCS|이며 같은 길이의 다른 정답이 있을 수도 있습니다.`] : ['Shortest common supersequence ready', `Result: ${v.result || '∅'}; length ${v.count}. The minimum is |A|+|B|−|LCS|; other equally short answers may exist.`];
  },
};

export const maximumLesson: NumericAlgorithm = {
  ...shuffleLesson, id: 'maximum-subarray',
  name: { ko: '최대 구간합', en: 'Maximum subarray' },
  summary: { ko: '연속 구간의 합이 가장 큰 부분 배열을 찾습니다. 현재 합이 음수면 버리고 새로 시작하며 지금까지의 최선 구간은 초록색으로 표시합니다.', en: 'Find a contiguous subarray with maximum sum. Discard a negative running sum and restart; green marks the best interval found so far.' },
  source: algorithmCode(maximumSource), example: [-2, 1, -3, 4, -1, 2, 1, -5, 4], time: 'O(n)',
  inputHint: { ko: '숫자 최대 32개 · 음수 허용 · 비어 있지 않은 입력은 비어 있지 않은 구간 반환', en: 'At most 32 numbers · negatives allowed · nonempty input returns a nonempty interval' },
  run: (values) => traceMaximumSubarray(values),
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['최댓값은 음의 무한대에서 시작', '모든 값이 음수여도 가장 큰 음수 하나를 선택해야 하므로 최댓값을 0으로 시작하지 않습니다. 빈 입력은 빈 결과입니다.'] : ['Initialize the best sum to negative infinity', 'All-negative input must select its largest negative item, so do not start the best sum at zero. Empty input returns empty.'];
    if (step.type === 'add') return ko ? ['현재 연속 구간에 다음 값 더하기', `${v.index}번 값을 더한 현재 합은 ${v.currentSum}입니다. 최선 합 ${v.maxSum}보다 큰지 확인한 뒤 갱신합니다.`] : ['Extend the current contiguous interval', `After adding position ${v.index}, running sum is ${v.currentSum}. Compare it against best sum ${v.maxSum} before updating.`];
    if (step.type === 'best') return ko ? ['더 좋은 구간 저장', `[${v.maxStartIndex}, ${v.maxEndIndex}]의 합 ${v.maxSum}이 새 최선입니다. 동일한 합은 기존 구간을 유지합니다.`] : ['Save a better interval', `Interval [${v.maxStartIndex}, ${v.maxEndIndex}] has new best sum ${v.maxSum}. Ties retain the existing interval.`];
    if (step.type === 'reset') return ko ? ['음수 구간을 버리고 새로 시작', `음수 누적 합은 이후 구간의 합을 줄이므로 0으로 초기화했습니다. 다음 시작 위치는 ${v.currentStartIndex}이며 지금까지의 최선 구간은 보존합니다.`] : ['Discard the negative prefix and restart', `A negative running sum would reduce later intervals, so reset to zero. Next start is ${v.currentStartIndex}; retain the best interval.`];
    return ko ? ['최대 합 연속 구간 완성', v.maxSum === '−∞' ? '빈 입력이라 선택할 구간이 없습니다.' : `최대 합 ${v.maxSum}, 구간 [${v.maxStartIndex}, ${v.maxEndIndex}], 값 [${v.result}]입니다. 원소를 건너뛰지 않는 연속 구간입니다.`] : ['Maximum-sum contiguous interval ready', v.maxSum === '−∞' ? 'Empty input has no interval to select.' : `Sum ${v.maxSum}, interval [${v.maxStartIndex}, ${v.maxEndIndex}], values [${v.result}]. The interval is contiguous; no items are skipped.`];
  },
};

export const combinationSumLesson: NumericAlgorithm = {
  ...combinationLesson, id: 'combination-sum', target: 7,
  name: { ko: '조합 합', en: 'Combination sum' },
  summary: { ko: '양의 정수 후보를 반복 사용해 목표 합을 만듭니다. 같은 후보부터 다시 탐색해 반복을 허용하면서 순서만 다른 결과는 중복 생성하지 않습니다.', en: 'Reuse positive integer candidates to reach a target sum. Recurse from the same candidate to allow repetition while avoiding reordered duplicates.' },
  source: algorithmCode(combinationSumSource), example: [2, 3, 6, 7], time: { ko: '지수적 백트래킹', en: 'Exponential backtracking' },
  targetLabel: { ko: '목표 합', en: 'Target sum' },
  inputHint: { ko: '양의 정수 후보 최대 5개 · 중복 제거 · 목표 0–12 · 0·음수 후보는 무한 재귀 방지를 위해 제외', en: 'At most five positive integer candidates · duplicates removed · target 0–12 · reject zero and negative candidates to prevent unbounded recursion' },
  run: (values, target) => traceCombinationSum(values, target),
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start' || step.type === 'enter') return ko ? ['선택한 후보만큼 남은 합 줄이기', `목표 ${v.target}, 남은 합 ${v.remainingSum}입니다. 같은 후보를 다시 고를 수 있고, 앞선 후보로 돌아가지 않아 순서 중복을 막습니다.`] : ['Reduce the remaining sum by the choice', `Target ${v.target}; remainder ${v.remainingSum}. Reuse the same candidate, but never return to earlier candidates, avoiding reordered duplicates.`];
    if (step.type === 'prune') return ko ? ['목표를 넘은 가지 종료', `남은 합이 ${v.remainingSum}으로 음수입니다. 후보가 모두 양수이므로 더 골라도 회복할 수 없어 이 가지를 버립니다.`] : ['Prune an overshooting branch', `Remainder ${v.remainingSum} is negative. All candidates are positive, so additional choices cannot recover this branch.`];
    if (step.type === 'solution') return ko ? ['목표 합을 만든 조합 저장', `남은 합이 0이므로 현재 선택을 복사해 저장했습니다. 지금까지 ${v.count}가지 해를 찾았습니다. 목표 0에는 빈 조합 하나가 있습니다.`] : ['Save a combination reaching the target', `Zero remainder saves a copy of the selection; ${v.count} solutions found. Target zero has one empty combination.`];
    if (step.type === 'backtrack') return ko ? ['마지막 선택을 빼고 다른 후보 탐색', '마지막 후보를 제거하고 이전 선택 상태로 돌아왔습니다. 저장한 해는 복사본이라 되돌리기에 영향을 받지 않습니다.'] : ['Undo the last choice and try alternatives', 'Remove the last candidate and restore the previous selection. Saved solutions are copies and remain unchanged.'];
    return ko ? ['모든 조합 합 탐색 완료', `목표 ${v.target}을 만드는 방법은 ${v.count}가지입니다. 출력의 순서는 후보 입력 순서를 따르며 각 조합에서 순서만 바꾼 경우는 하나로 셉니다.`] : ['Combination-sum search complete', `${v.count} combinations reach ${v.target}. Output follows candidate order; reordered versions of each combination count once.`];
  },
};

export const collectionAlgorithms: Algorithm[] = [cartesianLesson, shuffleLesson, powerSetLesson, permutationLesson, combinationLesson, lisLesson, supersequenceLesson, maximumLesson, combinationSumLesson];
