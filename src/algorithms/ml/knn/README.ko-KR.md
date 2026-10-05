# K 최근접 이웃 (K-NN)

[English](README.md) | [한국어](README.ko-KR.md)

K 최근접 이웃은 라벨이 있는 학습 데이터를 참고하여 새 벡터의 클래스를 정하는 지도 학습 알고리즘입니다. 새 점과 모든 학습점의 거리를 계산하고 가까운 `k`개의 라벨 중 가장 많이 나타나는 클래스를 선택합니다.

`k=1`이면 가장 가까운 한 점의 라벨을 사용합니다. 원문의 초록 점은 이웃 3개를 선택하면 빨간 삼각형, 이웃 5개를 선택하면 파란 사각형으로 분류됩니다. 이웃 수에 따라 결과가 달라질 수 있습니다.

데이터 차원·라벨 대응·양의 정수 `k`를 검증해야 합니다. 이진 분류에서는 홀수 `k`가 동률을 줄이지만 다중 클래스에서 모든 동률을 없애지는 못하므로 일관된 동률 규칙도 필요합니다.

## 예제·수식·시각 자료

![K 최근접 이웃 (K-NN) 자료](https://upload.wikimedia.org/wikipedia/commons/5/55/Euclidean_distance_2d.svg)

![K 최근접 이웃 (K-NN) 자료](https://upload.wikimedia.org/wikipedia/commons/e/e7/KnnClassification.svg)

![K 최근접 이웃 (K-NN) 자료](https://media.geeksforgeeks.org/wp-content/uploads/graph2-2.png)

## 구현과 참고 자료

- [Euclidean distance](https://en.wikipedia.org/wiki/Euclidean_distance)
- [Wikipedia](https://en.wikipedia.org/wiki/Euclidean_distance)
- [Wikipedia](https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm)
- [GeeksForGeeks](https://media.geeksforgeeks.org/wp-content/uploads/graph2-2.png)
- [k-nearest neighbors algorithm on Wikipedia](https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm)
