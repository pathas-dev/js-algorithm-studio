# 빠른 거듭제곱

[English](README.md) | [한국어](README.ko-KR.md)

거듭제곱 `X^Y`를 단순히 `Y`번 곱하면 시간은 지수에 비례합니다. 빠른 거듭제곱은 지수를 절반으로 줄이는 분할 정복 방식입니다.

`Y`가 짝수이면 `X^Y=(X^(Y/2))²`, 홀수이면 `X^Y=X×(X^((Y-1)/2))²`입니다. 절반 지수의 결과는 한 번만 계산해 재사용해야 합니다. 같은 하위 문제를 두 번 재귀 호출하면 원하는 효율을 얻을 수 없습니다.

각 단계에서 지수가 절반으로 줄어 곱셈 단계 수는 `O(log Y)`입니다. 원문은 양의 정수 밑과 지수의 경우를 설명하며, 지수가 0인 경계 조건에서는 결과가 1입니다.

## 예제·수식·시각 자료

![빠른 거듭제곱 자료](https://www.mathsisfun.com/algebra/images/exponent-8-2.svg)

```text
X^Y = X^(Y/2) * X^(Y/2)
```

```text
X^Y = X^(Y//2) * X^(Y//2) * X
where Y//2 is result of division of Y by 2 without reminder.
```

```text
2^4 = (2 * 2) * (2 * 2) = (2^2) * (2^2)
```

```text
2^5 = (2 * 2) * (2 * 2) * 2 = (2^2) * (2^2) * (2)
```

```text
O(log(n))
```

## 구현과 참고 자료

- [YouTube](https://www.youtube.com/watch?v=LUWavfN9zEo&index=80&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&t=0s)
- [Wikipedia](https://en.wikipedia.org/wiki/Exponentiation_by_squaring)
