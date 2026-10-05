import BubbleSort from '../../algorithms/sorting/bubble-sort/BubbleSort';
import bubbleAction from '../bubble-action';

it('describes actual comparisons, post-swap snapshots, and early completion', () => {
  const steps = [];
  new BubbleSort({
    compareCallback: (a, b) => a.value - b.value,
    stepCallback: (step) => steps.push(step),
  }).sort([8, 3, 3, -2.5].map((value, id) => ({ value, id })));
  expect(bubbleAction(steps[0], 'ko')).toEqual(['준비', '4개 값', '복사본에서 정렬 시작']);
  expect(bubbleAction(steps.find((step) => step.type === 'compare'), 'en')).toEqual(['Compare', '8 > 3', 'Swap the pair next']);
  expect(bubbleAction(steps.find((step) => step.type === 'swap'), 'ko')).toEqual(['교환', '3 < 8', '작은 값이 왼쪽으로']);
  const equal = steps.find((step) => step.type === 'compare' && step.array[step.indices[0]].value === step.array[step.indices[1]].value);
  expect(bubbleAction(equal, 'en')).toEqual(['Compare', '3 = 3', 'Keep the current order']);
  const sorted = [];
  new BubbleSort({ stepCallback: (step) => sorted.push(step) }).sort([]);
  expect(bubbleAction(sorted[1], 'en')[2]).toBe('Empty array · nothing to compare');
  const early = [];
  new BubbleSort({
    compareCallback: (a, b) => a.value - b.value,
    stepCallback: (step) => early.push(step),
  }).sort([1, 2].map((value, id) => ({ value, id })));
  expect(bubbleAction(early[1], 'ko')).toEqual(['비교', '1 < 2', '현재 순서를 유지합니다']);
  expect(bubbleAction(early.find((step) => step.type === 'pass'), 'en')[2]).toBe('No swaps · finish early');
  expect(bubbleAction(early[early.length - 1], 'ko')[2]).toBe('오름차순 정렬 완료');
  expect(bubbleAction(steps.find((step) => step.type === 'pass'), 'ko')[2]).toBe('뒤쪽 한 자리를 확정합니다');
});
