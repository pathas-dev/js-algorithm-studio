# 소인수분해

[English](README.md) | [한국어](README.ko-KR.md)

소인수는 원래 수를 곱으로 표현하는 소수들입니다. `39=3×13`, `15=3×5`이며 같은 소인수가 여러 번 나타날 수도 있습니다.

작은 약수부터 나누어떨어지는 동안 계속 나누고 인수를 기록합니다. 현재 남은 수의 제곱근까지 확인했는데도 1보다 큰 값이 남으면 그 값 자체가 소수입니다. 원문은 단순 검사 `O(n)`에서 제곱근 검사 `O(√n)`로 줄이는 방법을 설명합니다.

하디–라마누잔 정리는 서로 다른 소인수 수의 정상 차수가 `log log n`임을 말합니다. 이는 수들의 일반적인 경향을 나타내며 특정 정수의 정확한 소인수 개수를 보장하는 식이 아닙니다.

## 예제·수식·시각 자료

![소인수분해 자료](https://www.mathsisfun.com/numbers/images/prime-composite.svg)

![소인수분해 자료](https://www.mathsisfun.com/numbers/images/factor-2x3.svg)

## 구현과 참고 자료

- [Math is Fun](https://www.mathsisfun.com/prime-factorization.html)
- [prime numbers](https://en.wikipedia.org/wiki/Prime_number)
- [Prime numbers on Math is Fun](https://www.mathsisfun.com/prime-factorization.html)
- [Prime numbers on Wikipedia](https://en.wikipedia.org/wiki/Prime_number)
- [Hardy–Ramanujan theorem on Wikipedia](https://en.wikipedia.org/wiki/Hardy%E2%80%93Ramanujan_theorem)
- [Prime factorization of a number on Youtube](https://www.youtube.com/watch?v=6PDtgHhpCHo&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=82)
