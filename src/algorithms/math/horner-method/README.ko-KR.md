# 호너 방법

[English](README.md) | [한국어](README.ko-KR.md)

호너 방법은 다항식을 중첩된 곱셈과 덧셈으로 바꿔 평가합니다. 각 항의 거듭제곱을 따로 계산하는 대신, 높은 차수의 계수부터 `acc=acc*x+coefficient`로 누적합니다.

`4x⁴+2x³+3x²+x+3`은 `(((4x+2)x+3)x+1)x+3`으로 쓸 수 있습니다. `x=2`를 대입하면 결과는 97입니다. 4차 다항식에서는 4번의 곱셈과 4번의 덧셈이면 충분합니다.

차수 `n`에 대해 연산 수는 `O(n)`이며 계수 배열의 순서가 중요합니다. 원문 일부 연산 개수·누적식에는 표현상의 오류가 있어 위의 표준 누적 관계를 기준으로 이해해야 합니다.

## 예제·수식·시각 자료

![호너 방법 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/2a576e42d875496f8b0f0dda5ebff7c2415532e4)

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Horner%27s_method)
