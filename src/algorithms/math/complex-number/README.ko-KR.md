# 복소수

[English](README.md) | [한국어](README.ko-KR.md)

복소수는 `a+bi`로 표현하며 `a`와 `b`는 실수, `i²=-1`입니다. `a`는 실수부, `b`는 허수부입니다. 복소평면에서는 가로축을 실수부, 세로축을 허수부로 사용해 점 `(a,b)`나 벡터로 나타냅니다.

극형식은 원점에서의 거리 `r=√(a²+b²)`와 각도 `φ`를 사용합니다. 직교좌표와의 관계는 `a=r cos φ`, `b=r sin φ`이며 오일러 공식으로 `r e^(iφ)`라고 쓸 수 있습니다. 각도를 구할 때는 사분면을 반영해야 합니다.

덧셈과 뺄셈은 실수부와 허수부를 각각 계산합니다. 곱셈은 분배법칙과 `i²=-1`을 적용하여 `(a+bi)(c+di)=(ac-bd)+(ad+bc)i`로 계산합니다. 켤레복소수 `a-bi`는 복소평면에서 실수축에 대한 대칭입니다.

나눗셈에서는 분자와 분모에 분모의 켤레복소수를 곱해 분모를 실수로 만듭니다. 분모의 크기 제곱은 `c²+d²`이고 0으로 나눌 수는 없습니다. 원문의 그림·수식·계산 예제를 아래에 보존했습니다.

## 예제·수식·시각 자료

![복소수 자료](https://www.mathsisfun.com/numbers/images/complex-example.svg)

![복소수 자료](https://www.mathsisfun.com/numbers/images/complex-number.svg)

| 복소수 | 실수부 | 허수부 |                  |
| :------------- | :-------: | :------------: | ---------------- |
| 3 + 2i         |     3     |       2        |                  |
| 5              |     5     |     **0**      | 실수      |
| −6i            |   **0**   |       -6       | 순허수 |

![복소수 자료](https://upload.wikimedia.org/wikipedia/commons/a/af/Complex_number_illustration.svg)

![복소수 자료](https://upload.wikimedia.org/wikipedia/commons/7/7a/Complex_number_illustration_modarg.svg)

![복소수 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/b59629c801aa0ddcdf17ee489e028fb9f8d4ea75)

![복소수 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/7cbbdd9bb1dd5df86dd2b820b20f82995023e566)

![복소수 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/b03de1e1b7b049880b5e4870b68a57bc180ff6ce)

![복소수 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/0a087c772212e7375cb321d83fc1fcc715cd0ed2)

```text
(a + b * i) + (c + d * i) = (a + c) + (b + d) * i
```

```text
(3 + 5i) + (4 − 3i) = (3 + 4) + (5 − 3)i = 7 + 2i
```

![복소수 자료](https://www.mathsisfun.com/algebra/images/complex-plane-vector-add.svg)

```text
(a + b * i) - (c + d * i) = (a - c) + (b - d) * i
```

```text
(3 + 5i) - (4 − 3i) = (3 - 4) + (5 + 3)i = -1 + 8i
```

![복소수 자료](https://www.mathsisfun.com/algebra/images/foil-complex.svg)

```text
(a + bi)(c + di) = ac + adi + bci + bdi^2
```

```text
(a + bi)(c + di) = (ac − bd) + (ad + bc)i
```

```text
(3 + 2i)(1 + 7i)
= 3×1 + 3×7i + 2i×1+ 2i×7i
= 3 + 21i + 2i + 14i^2
= 3 + 21i + 2i − 14   (because i^2 = −1)
= −11 + 23i
```

```text
(3 + 2i)(1 + 7i) = (3×1 − 2×7) + (3×7 + 2×1)i = −11 + 23i
```

![복소수 자료](https://www.mathsisfun.com/numbers/images/complex-conjugate.svg)

```text
______
5 − 3i   =   5 + 3i
```

![복소수 자료](https://upload.wikimedia.org/wikipedia/commons/6/69/Complex_conjugate_picture.svg)

```text
2 + 3i
------
4 − 5i
```

```text
  (2 + 3i) * (4 + 5i)   8 + 10i + 12i + 15i^2
= ------------------- = ----------------------
  (4 − 5i) * (4 + 5i)   16 + 20i − 20i − 25i^2
```

```text
  8 + 10i + 12i − 15    −7 + 22i   −7   22
= ------------------- = -------- = -- + -- * i
  16 + 20i − 20i + 25      41      41   41

```

```text
(4 − 5i)(4 + 5i) = 16 + 20i − 20i − 25i
```

```text
(4 − 5i)(4 + 5i) = 4^2 + 5^2
```

```text
(a + bi)(a − bi) = a^2 + b^2
```

## 구현과 참고 자료

- [Binomial Multiplication](https://www.mathsisfun.com/algebra/polynomials-multiplying.html)
- [Wikipedia](https://en.wikipedia.org/wiki/Complex_number)
- [Math is Fun](https://www.mathsisfun.com/numbers/complex-numbers.html)
