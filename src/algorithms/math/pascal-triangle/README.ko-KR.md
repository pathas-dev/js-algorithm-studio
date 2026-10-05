# 파스칼 삼각형

[English](README.md) | [한국어](README.ko-KR.md)

파스칼 삼각형은 이항계수를 삼각형으로 배치합니다. 맨 위를 0행으로 두고 값 1에서 시작하며, 각 칸은 바로 위 왼쪽과 오른쪽 값의 합입니다. 범위 밖은 0으로 취급하므로 양 끝은 항상 1입니다.

`n`행 `k`열의 값은 `C(n,k)`입니다. 한 행을 효율적으로 구하려면 첫 값 1부터 `C(n,k)=C(n,k-1)×(n-k+1)/k`로 다음 값을 계산합니다. 각 값을 상수 단계로 구하므로 한 행에는 `O(n)` 시간이 필요합니다.

이는 삼각형 전체를 같은 시간에 만든다는 뜻이 아닙니다. 여러 행을 전부 저장할 때는 전체 원소 수와 공간을 별도로 계산해야 합니다.

## 예제·수식·시각 자료

![파스칼 삼각형 자료](https://upload.wikimedia.org/wikipedia/commons/0/0d/PascalTriangleAnimated2.gif)

![파스칼 삼각형 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/206415d3742167e319b2e52c2ca7563b799abad7)

![파스칼 삼각형 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/b7e35f86368d5978b46c07fd6dddca86bd6e635c)

![파스칼 삼각형 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/203b128a098e18cbb8cf36d004bd7282b28461bf)

![파스칼 삼각형 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/a2457a7ef3c77831e34e06a1fe17a80b84a03181)

```
C(lineNumber, i)   = lineNumber! / ((lineNumber - i)! * i!)
C(lineNumber, i - 1) = lineNumber! / ((lineNumber - i + 1)! * (i - 1)!)
```

```
C(lineNumber, i) = C(lineNumber, i - 1) * (lineNumber - i + 1) / i
```

## 구현과 참고 자료

- [binomial coefficients](https://en.wikipedia.org/wiki/Binomial_coefficient)
- [Wikipedia](https://en.wikipedia.org/wiki/Pascal%27s_triangle)
- [GeeksForGeeks](https://www.geeksforgeeks.org/pascal-triangle/)
