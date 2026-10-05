# 힐 암호

[English](README.md) | [한국어](README.ko-KR.md)

힐 암호는 선형대수에 기반한 다문자 치환 암호입니다. 알파벳을 `A=0, B=1, …, Z=25`로 표현하고, 문자를 `n`개씩 묶은 벡터에 키인 `n×n` 행렬을 곱한 뒤 각 값을 26으로 나눈 나머지를 구합니다.

원문에 나온 키 행렬로 `ACT`를 암호화하면 `POH`가 되고, 같은 문자를 다른 순서로 배치한 `CAT`는 `FIN`이 됩니다. 문자 순서가 결과에 영향을 줍니다.

복호화에는 키 행렬의 모듈러 역행렬을 사용합니다. 역행렬이 존재하려면 행렬식과 모듈러 기준인 26이 서로소여야 합니다. 따라서 행렬식이 0이거나 2 또는 13의 배수인 키는 사용할 수 없습니다. 일반 실수 행렬에서 역행렬이 존재한다는 조건만으로는 충분하지 않습니다.

## 예제·수식·시각 자료

| **문자** | A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V | W | X | Y | Z |
| ------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **수** | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 |

```
| 6   24   1  |
| 13  16   10 |
| 20  17   15 |
```

```
|  0  |
|  2  |
|  19 |
```

```
| 6   24   1  |  |  0  |   |  67  |   |  15 |
| 13  16   10 |  |  2  | = |  222 | ≡ |  14 | (mod 26)
| 20  17   15 |  |  19 |   |  319 |   |  7  |
```

```
|  2  |
|  0  |
|  19 |
```

```
| 6   24   1  |  |  2  |   |  31  |   |  5  |
| 13  16   10 |  |  0  | = |  216 | ≡ |  8  | (mod 26)
| 20  17   15 |  |  19 |   |  325 |   |  13 |
```

```
                -1
| 6   24   1  |                | 8   5    10 |
| 13  16   10 |    (mod 26) ≡  | 21  8    21 |
| 20  17   15 |                | 21  12   8  |
```

```
| 8   5    10 |  |  15 |   |  260 |   |  0  |
| 21  8    21 |  |  14 | = |  574 | ≡ |  2  | (mod 26)
| 21  12   8  |  |  7  |   |  539 |   |  19 |
```

## 구현과 참고 자료

- [polygraphic substitution](https://en.wikipedia.org/wiki/Polygraphic_substitution)
- [modulo](https://en.wikipedia.org/wiki/Modular_arithmetic)
- [matrix inversion](https://en.wikipedia.org/wiki/Matrix_inversion)
- [determinant](https://en.wikipedia.org/wiki/Determinant)
- [Hill cipher on Wikipedia](https://en.wikipedia.org/wiki/Hill_cipher)
- [Matrix inversion on MathIsFun](https://www.mathsisfun.com/algebra/matrix-inverse.html)
- [GeeksForGeeks](https://www.geeksforgeeks.org/hill-cipher/)
