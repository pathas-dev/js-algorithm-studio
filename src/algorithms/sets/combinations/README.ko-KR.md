# 조합

[English](README.md) | [한국어](README.ko-KR.md)

조합은 순서를 구분하지 않는 선택입니다. 사과·포도·바나나를 고르는 순서가 달라도 같은 선택이며, 순서를 구분하는 순열과 다릅니다.

중복 없이 `n`개 중 `r`개를 선택하는 경우의 수는 `n!/(r!(n-r)!)`입니다. 복권 번호처럼 한 대상을 두 번 고를 수 없습니다. 중복을 허용하는 조합의 수는 `(n+r-1)!/(r!(n-1)!)`입니다.

원문에서 5가지 아이스크림 중 3스쿱을 고를 때 같은 맛을 여러 번 선택할 수 있지만, 스쿱의 순서 자체는 다른 조합으로 세지 않습니다. 아래 그림은 중복 허용 여부와 순열·조합의 차이를 정리합니다.

## 예제·수식·시각 자료

![조합 자료](https://www.mathsisfun.com/combinatorics/images/combinations-no-repeat.png)

![조합 자료](https://www.mathsisfun.com/combinatorics/images/combinations-repeat.gif)

![조합 자료](./images/overview.png)

![조합 자료](./images/combinations-overview.jpg)

| | |
| --- | --- |
|![Combinations with repetition](./images/combinations-with-repetitions.jpg) | ![Combinations without repetition](./images/combinations-without-repetitions.jpg) |

## 구현과 참고 자료

- [okso.app](https://okso.app)
- [Math Is Fun](https://www.mathsisfun.com/combinatorics/combinations-permutations.html)
- [Permutations/combinations cheat sheets](https://medium.com/@trekhleb/permutations-combinations-algorithms-cheat-sheet-68c14879aba5)
