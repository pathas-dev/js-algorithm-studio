# 유클리드 거리

[English](README.md) | [한국어](README.ko-KR.md)

유클리드 거리는 두 점을 연결하는 선분의 길이입니다. 피타고라스 정리로 좌표 차이의 제곱 합에 제곱근을 취해 구합니다.

1차원에서는 `|p-q|`, 2차원에서는 `√((px-qx)²+(py-qy)²)`입니다. `n`차원에서는 모든 좌표의 차이를 제곱해 더한 뒤 제곱근을 구합니다. 두 점은 같은 차원의 좌표를 가져야 합니다.

원문의 3차원 예제 `(8,2,6)`과 `(3,5,7)`의 거리는 `√(25+9+1)=√35`입니다. 아래 수식은 1차원부터 고차원까지의 정의를 정리합니다.

## 예제·수식·시각 자료

![유클리드 거리 자료](https://upload.wikimedia.org/wikipedia/commons/5/55/Euclidean_distance_2d.svg)

![유클리드 거리 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/7d75418dbec9482dbcb70f9063ad66e9cf7b5db9)

![유클리드 거리 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/9c0157084fd89f5f3d462efeedc47d3d7aa0b773)

![유클리드 거리 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/d1d13a40a7b203b455ae6d4be8b3cce898bda625)

![유클리드 거리 자료](https://www.mathsisfun.com/algebra/images/dist-2-points-3d.svg)

![유클리드 거리 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/a0ef4fe055b2a51b4cca43a05e5d1cd93f758dcc)

## 구현과 참고 자료

- [Euclidean Distance on MathIsFun](https://www.mathsisfun.com/algebra/distance-2-points.html)
- [Euclidean Distance on Wikipedia](https://en.wikipedia.org/wiki/Euclidean_distance)
