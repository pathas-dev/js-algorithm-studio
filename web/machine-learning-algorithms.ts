import meansSource from '../src/algorithms/ml/k-means/kMeans.js?raw';
import source from '../src/algorithms/ml/knn/kNN.js?raw';
import traceKnn, { traceKmeans } from '../src/visualization/machine-learning';
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

const kmeans: TextAlgorithm = {
  id: 'k-means', category: 'ml', inputMode: 'text',
  example: ['[[1,1],[8,8],[2,3],[3,2],[7,6],[6,8]]', '2'],
  name: { ko: 'K 평균 군집화', en: 'k-means clustering' }, time: 'O(tnk)',
  summary: { ko: '처음 k개 점을 중심으로 삼고 가장 가까운 중심에 점을 배정합니다. 각 군집의 평균으로 중심을 옮긴 뒤 배정이 바뀌지 않을 때까지 반복합니다.', en: 'Initialize centers with the first k points. Assign each point to its nearest center, move centers to cluster means, and repeat until assignments stop changing.' },
  inputLabels: [{ ko: '점 · [x,y] JSON', en: 'Points · [x,y] JSON' }, { ko: '군집 수 k', en: 'Cluster count k' }],
  inputHint: { ko: '점 1–16개 · 좌표 −20–20 · k=1–6, 점 개수 이하 · 첫 k개 점으로 초기화 · 최대 100회', en: '1–16 points · coordinates −20–20 · k=1–6, no more than point count · first k points initialize centers · at most 100 iterations' },
  source: algorithmCode(meansSource), run: traceKmeans,
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['처음 k개 점으로 중심 초기화', `k=${v.k}개의 중심을 정했습니다. 아직 배정하지 않은 점은 회색이며, 중심은 +로 표시합니다.`] : ['Initialize centers from the first k points', `Set k=${v.k} centers. Gray points are unassigned; + marks each center.`];
    if (step.type === 'assign') return ko ? ['가장 가까운 중심에 점 배정', `${v.iteration}회차에서 P${v.current}의 거리를 비교했습니다. 소수 2자리 거리의 최솟값을 고르며 동률은 작은 군집 번호가 우선입니다.`] : ['Assign the point to its nearest center', `In iteration ${v.iteration}, compare P${v.current} distances rounded to two decimals. Ties select the lowest cluster index.`];
    if (step.type === 'centroid') return ko ? ['군집 평균으로 중심 이동', `군집 ${v.cluster}에 속한 점들의 x, y 평균을 각각 계산했습니다. 중심 좌표도 소수 2자리로 반올림합니다.`] : ['Move the center to the cluster mean', `Average x and y of points in cluster ${v.cluster}. Center coordinates are also rounded to two decimals.`];
    if (step.type === 'empty-cluster') return ko ? ['빈 군집은 이전 중심 유지', `군집 ${v.cluster}에 배정된 점이 없어 평균을 구할 수 없습니다. 0으로 나누는 대신 이전 중심을 보존합니다.`] : ['Keep the previous center for an empty cluster', `Cluster ${v.cluster} has no assigned points. Preserve its previous center rather than dividing by zero.`];
    return ko ? ['배정이 유지되어 군집화 완료', `${v.iteration}회 반복 후 점별 군집은 [${v.result}]입니다. 초기 중심과 반올림에 영향을 받으며 최적 군집을 보장하지 않습니다.`] : ['Assignments stabilized · clustering ready', `After ${v.iteration} iterations, assignments are [${v.result}]. Initialization and rounding affect the result; a global optimum is not guaranteed.`];
  },
};

export const machineLearningAlgorithms: Algorithm[] = [knn, kmeans];
