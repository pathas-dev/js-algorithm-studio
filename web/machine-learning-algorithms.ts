import source from '../src/algorithms/ml/knn/kNN.js?raw';
import traceKnn from '../src/visualization/machine-learning';
import { algorithmCode } from '../src/visualization/playback';
import type { Algorithm, TextAlgorithm } from './algorithms';

const knn: TextAlgorithm = {
  id: 'knn', category: 'ml', inputMode: 'text',
  example: ['[[1,1,0],[2,3,0],[3,2,0],[7,6,1],[8,8,1],[6,8,1]]', '[4,3,3]'],
  name: { ko: 'K 최근접 이웃 (K-NN)', en: 'k-nearest neighbors' }, time: 'O(n log n)',
  summary: { ko: '새 점에서 각 학습 점까지 거리를 계산하고 가까운 k개 이웃의 라벨을 셉니다. 가장 많은 표를 얻은 라벨을 새 점의 클래스로 정합니다.', en: 'Measure distances from a query to training points, then count labels among the k nearest. Predict the label with the most votes.' },
  inputLabels: [{ ko: '학습 점 · [x,y,라벨] JSON', en: 'Training points · [x,y,label] JSON' }, { ko: '질의 · [x,y,k] JSON', en: 'Query · [x,y,k] JSON' }],
  inputHint: { ko: '2차원 점 1–16개 · 좌표 −20–20 · 라벨 정수 0–5 · k=1–점 개수 · 거리 소수 2자리', en: '1–16 two-dimensional points · coordinates −20–20 · labels 0–5 · k=1–point count · distances rounded to two decimals' },
  source: algorithmCode(source), run: traceKnn,
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['새 점의 클래스를 이웃에게 묻기', `k=${v.k}개의 가까운 이웃을 선택합니다. 학습 점의 라벨은 이미 알려져 있고 ◆는 아직 분류하지 않은 질의 점입니다.`] : ['Ask nearby points to classify the query', `Select k=${v.k} neighbors. Training labels are known; ◆ is the query awaiting prediction.`];
    if (step.type === 'distance') return ko ? ['현재 점까지 거리 계산', `P${v.current}와 질의 점 사이의 유클리드 거리를 기록합니다. 원본 거리 함수는 소수 2자리로 반올림합니다.`] : ['Measure distance to this point', `Record the Euclidean distance between P${v.current} and the query. The original distance function rounds to two decimals.`];
    if (step.type === 'nearest') return ko ? ['거리 순서로 정렬하고 k개 선택', '작은 거리부터 정렬하고 앞의 k개를 고릅니다. 거리가 같으면 입력 순서를 유지합니다.'] : ['Sort by distance and select k neighbors', 'Sort nearest first and select the first k. Equal distances preserve input order.'];
    if (step.type === 'vote') return ko ? ['선택한 이웃의 라벨에 한 표 추가', `현재 선두는 클래스 ${v.topClass}, ${v.topClassCount}표입니다. 표수가 엄격히 커질 때만 선두를 바꾸므로 동률은 현재 선두를 유지합니다.`] : ['Add a vote for this neighbor’s label', `Current leader: class ${v.topClass}, ${v.topClassCount} votes. Update only for a strictly greater count, retaining the leader on ties.`];
    return ko ? ['질의 점 분류 완료', `예측 클래스는 ${v.result}입니다. k나 좌표를 바꾸면 선택되는 이웃과 투표 결과도 달라질 수 있습니다.`] : ['Query classification ready', `Predicted class: ${v.result}. Changing k or coordinates can change the neighbors and their votes.`];
  },
};

export const machineLearningAlgorithms: Algorithm[] = [knn];
