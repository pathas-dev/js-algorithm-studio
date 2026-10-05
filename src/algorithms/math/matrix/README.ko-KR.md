# 행렬

[English](README.md) | [한국어](README.ko-KR.md)

행렬은 수나 식을 행과 열로 배열한 직사각형 표입니다. `m×n` 행렬은 가로 방향의 행 `m`개와 세로 방향의 열 `n`개를 갖습니다. 원소 `a₂,₁`은 두 번째 행, 첫 번째 열의 값입니다.

덧셈과 뺄셈은 같은 크기의 행렬에서 대응 위치끼리 계산합니다. 상수 곱은 모든 원소에 그 상수를 곱합니다.

행렬 곱에서 왼쪽 행렬의 열 수와 오른쪽 행렬의 행 수가 같아야 합니다. 결과의 각 원소는 왼쪽 행과 오른쪽 열의 내적입니다. `m×n`과 `n×p`의 곱은 `m×p`입니다. 전치는 행과 열을 맞바꾸며 `T`로 표시합니다. 아래 그림은 각 연산의 예를 보여 줍니다.

## 예제·수식·시각 자료

```
| 1  9 -13 |
| 20 5 -6  |
```

![행렬 자료](https://upload.wikimedia.org/wikipedia/commons/b/bf/Matris.png)

![행렬 자료](https://www.mathsisfun.com/algebra/images/matrix-addition.gif)

![행렬 자료](https://www.mathsisfun.com/algebra/images/matrix-subtraction.gif)

![행렬 자료](https://www.mathsisfun.com/algebra/images/matrix-multiply-constant.gif)

![행렬 자료](https://www.mathsisfun.com/algebra/images/matrix-multiply-a.svg)

![행렬 자료](https://www.mathsisfun.com/algebra/images/matrix-multiply-b.svg)

![행렬 자료](https://www.mathsisfun.com/algebra/images/matrix-multiply-c.svg)

![행렬 자료](https://www.mathsisfun.com/algebra/images/matrix-transpose.gif)

## 구현과 참고 자료

- [dot product](https://www.mathsisfun.com/algebra/vectors-dot-product.html)
- [Matrices on MathIsFun](https://www.mathsisfun.com/algebra/matrix-introduction.html)
- [Matrix on Wikipedia](https://en.wikipedia.org/wiki/Matrix_(mathematics))
