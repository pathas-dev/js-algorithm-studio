# K 평균 군집화

[English](README.md) | [한국어](README.ko-KR.md)

K 평균은 라벨이 없는 데이터를 유사한 벡터끼리 `k`개 군집으로 나누는 비지도 학습 알고리즘입니다. 초기 중심점을 선택한 뒤 각 점을 가장 가까운 중심에 배정하고, 각 군집의 점들로 새 중심을 계산합니다.

일반적으로 유클리드 거리를 사용합니다. 배정과 중심 갱신을 중심 위치가 충분히 안정될 때까지 반복합니다. 원문의 애니메이션은 반복 중 중심이 이동하다 점차 변화가 작아지는 모습을 보여 줍니다.

입력 벡터의 차원과 데이터의 유효성을 확인해야 하며, 초기 중심 선택이 결과에 영향을 줄 수 있습니다. 라벨이 있는 이웃을 참고해 분류하는 K 최근접 이웃과는 목적이 다릅니다.

## 예제·수식·시각 자료

![K 평균 군집화 자료](https://upload.wikimedia.org/wikipedia/commons/5/55/Euclidean_distance_2d.svg)

![K 평균 군집화 자료](https://upload.wikimedia.org/wikipedia/commons/e/ea/K-means_convergence.gif)

## 구현과 참고 자료

- [Euclidean distance](https://github.com/trekhleb/javascript-algorithms/tree/master/src/algorithms/math/euclidean-distance)
- [Wikipedia](https://en.wikipedia.org/wiki/Euclidean_distance)
- [Wikipedia](https://en.wikipedia.org/wiki/K-means_clustering)
- [kMeans.js](./kMeans.js)
- [kMeans.test.js](./__test__/kMeans.test.js)
- [k-Means neighbors algorithm on Wikipedia](https://en.wikipedia.org/wiki/K-means_clustering)
