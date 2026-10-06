import source from '../src/algorithms/statistics/weighted-random/weightedRandom.js?raw';
import traceWeighted from '../src/visualization/statistics';
import { algorithmCode } from '../src/visualization/playback';
import type { Algorithm, TextAlgorithm } from './algorithms';

const weighted: TextAlgorithm = {
  id: 'weighted-random', category: 'statistics', inputMode: 'text',
  example: ['[["A",1],["B",4],["C",3]]', '0.62'],
  name: { ko: '가중 무작위 선택', en: 'Weighted random selection' }, time: 'O(n)',
  summary: { ko: '가중치를 누적해 구간을 만들고, 전체 합 × 난수 u가 속하는 구간을 선택합니다. 재생마다 같은 선택을 따라가도록 이 화면에서는 난수를 직접 지정합니다.', en: 'Build cumulative-weight intervals and select the one containing total weight × u. This view fixes the random draw explicitly so playback follows the same selection.' },
  inputLabels: [{ ko: '항목·가중치 JSON', en: 'Items and weights · JSON' }, { ko: '난수 u · 0 이상 1 미만', en: 'Draw u · 0 ≤ u < 1' }],
  inputHint: { ko: '항목 1–8개 · 이름 최대 10글자 · 가중치 0–100, 합은 양수 · 0 가중치는 선택되지 않음', en: '1–8 items · names up to ten characters · weights 0–100 with positive total · zero-weight items are never selected' },
  source: algorithmCode(source), run: traceWeighted,
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['가중치 합을 구간 길이로 사용', `전체 가중치 합은 ${v.total}입니다. 항목의 선택 확률은 자기 가중치 ÷ 전체 합입니다.`] : ['Use weight total as the interval length', `Total weight: ${v.total}. Each item’s probability is its weight divided by the total.`];
    if (step.type === 'prefix') return ko ? ['이전 합에 현재 가중치 누적', '이전 누적합에 현재 가중치를 더해 구간의 오른쪽 경계를 만듭니다. 가중치 0은 폭이 없는 구간입니다.'] : ['Accumulate the next weight', 'Add the current weight to the previous sum for the right interval boundary. Zero weight creates a zero-width interval.'];
    if (step.type === 'draw') return ko ? ['난수를 전체 구간으로 확대', `r = ${v.total} × ${v.u} = ${Number(Number(v.randomNumber).toFixed(4))}. u는 재생을 위해 직접 지정한 [0,1) 값입니다.`] : ['Scale the draw to the full interval', `r = ${v.total} × ${v.u} = ${Number(Number(v.randomNumber).toFixed(4))}. u is an explicitly fixed value in [0,1) for playback.`];
    if (step.type === 'check') return ko ? ['난수가 오른쪽 경계보다 작은지 확인', `r=${Number(Number(v.randomNumber).toFixed(4))}, 경계=${v.boundary}. 경계보다 엄격히 작을 때 선택합니다. 정확히 경계에 있으면 다음 구간으로 넘어갑니다.`] : ['Check whether the draw is below this boundary', `r=${Number(Number(v.randomNumber).toFixed(4))}, boundary=${v.boundary}. Select only when strictly below; a draw exactly on a boundary belongs to the next interval.`];
    return ko ? ['난수가 속한 항목 선택', `선택 결과는 “${v.result}”입니다. 가중치나 u를 수정하면 각 구간의 크기와 선택 위치를 비교할 수 있습니다.`] : ['Select the item containing the draw', `Selected: “${v.result}”. Edit weights or u to compare interval sizes and selection positions.`];
  },
};

export const statisticsAlgorithms: Algorithm[] = [weighted];
