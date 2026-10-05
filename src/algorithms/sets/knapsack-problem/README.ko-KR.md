# 배낭 문제

[English](README.md) | [한국어](README.ko-KR.md)

무게와 가치가 있는 물건들에서 배낭의 무게 제한을 넘지 않으면서 가치의 합을 최대화하는 문제입니다. 가장 가치가 큰 물건만 고르거나 가치 대비 무게만 비교한다고 항상 최적의 결과가 나오지는 않습니다.

0/1 배낭은 각 물건을 최대 한 번 사용합니다. 제한된 배낭은 종류별 사용 횟수에 상한이 있고, 무제한 배낭은 같은 종류를 여러 번 사용할 수 있습니다. 세 문제는 물건 수에 대한 제약이 다릅니다.

물건 `i`의 무게를 `wi`, 가치를 `vi`, 개수를 `xi`라고 하면 `Σ wi×xi ≤ W`를 만족하면서 `Σ vi×xi`를 최대화합니다. 원문 그림은 15kg 제한 안에서 금액의 합을 가장 크게 만드는 상자 선택을 보여 줍니다.

## 예제·수식·시각 자료

![배낭 문제 자료](https://upload.wikimedia.org/wikipedia/commons/f/fd/Knapsack.svg)

![배낭 문제 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/85620037d368d2136fb3361702df6a489416931b)

![배낭 문제 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/dd6e7c9bca4397980976ea6d19237500ce3b8176)

![배낭 문제 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/07dda71da2a630762c7b21b51ea54f86f422f951)

![배낭 문제 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/85620037d368d2136fb3361702df6a489416931b)

![배낭 문제 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/dd6e7c9bca4397980976ea6d19237500ce3b8176)

![배낭 문제 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/6c8c5ac4f8247b3b8e01e89de76a1df0ea969821)

![배낭 문제 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/85620037d368d2136fb3361702df6a489416931b)

![배낭 문제 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/dd6e7c9bca4397980976ea6d19237500ce3b8176)

![배낭 문제 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/90a99710f61d5dea19e49ae5b31164d2b56b07e3)

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Knapsack_problem)
- [0/1 Knapsack Problem on YouTube](https://www.youtube.com/watch?v=8LusJS5-AGo&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
