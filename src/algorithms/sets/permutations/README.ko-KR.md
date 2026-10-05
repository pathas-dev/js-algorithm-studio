# 순열

[English](README.md) | [한국어](README.ko-KR.md)

순열은 원소를 선택하거나 배치할 때 순서를 구분합니다. 금고 암호 `472`와 `724`가 다른 것처럼, 같은 원소라도 순서가 다르면 다른 결과입니다.

중복 없이 `n`개 전체를 배치하는 경우의 수는 `n!`입니다. `ABC`의 순열은 `ABC`, `ACB`, `BAC`, `BCA`, `CAB`, `CBA`입니다. `n`종류에서 반복을 허용하여 `r`자리를 채우면 경우의 수는 `n^r`입니다.

순열과 조합의 차이는 순서의 의미이며, 각각에서 중복 허용 여부를 별도로 구분해야 합니다. 아래 그림은 네 경우를 비교합니다.

## 예제·수식·시각 자료

```
n * (n-1) * (n -2) * ... * 1 = n!
```

![순열 자료](https://www.mathsisfun.com/combinatorics/images/permutation-lock.jpg)

```
n * n * n ... (r times) = n^r
```

![순열 자료](./images/overview.png)

![순열 자료](./images/permutations-overview.jpeg)

| | |
| --- | --- |
|![Permutations with repetition](./images/permutations-with-repetitions.jpg) | ![Permutations without repetition](./images/permutations-without-repetitions.jpg) |

## 구현과 참고 자료

- [okso.app](https://okso.app)
- [Math Is Fun](https://www.mathsisfun.com/combinatorics/combinations-permutations.html)
- [Permutations/combinations cheat sheets](https://medium.com/@trekhleb/permutations-combinations-algorithms-cheat-sheet-68c14879aba5)
