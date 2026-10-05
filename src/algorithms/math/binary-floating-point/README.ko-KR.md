# 부동소수점 수의 이진 표현

[English](README.md) | [한국어](README.ko-KR.md)

컴퓨터는 유한한 비트로 소수와 매우 크거나 작은 수를 표현해야 합니다. IEEE 754 부동소수점 표현은 비트를 부호·지수·가수로 나눠 과학적 표기법처럼 값을 저장합니다. 이진 표현의 밑은 2입니다.

16비트 반정밀도는 부호 1비트, 지수 5비트, 가수 10비트이고, 32비트 단정밀도는 1·8·23비트, 64비트 배정밀도는 1·11·52비트입니다. 지수에 비트를 배정하면 정수 표현보다 넓은 범위와 0과 1 사이의 값을 표현할 수 있지만 가수에 사용할 비트는 줄어듭니다.

지수는 바이어스를 더한 값으로 저장합니다. 지수 비트 수가 `e`이면 바이어스는 `2^(e-1)-1`이며 반정밀도에서는 15입니다. 정규화된 값은 부호, 숨겨진 선행 1을 포함한 가수, 바이어스를 뺀 지수를 조합합니다.

원문의 범위 표는 정규화된 양수의 최소값을 보여 줍니다. 비정규화된 수, 양수·음수 0, 무한대, `NaN` 등은 별도 처리가 필요한 특수 경우이며 원문도 이를 생략한 개요임을 밝힙니다. 비트 배열 변환과 JavaScript의 실제 이진 표현을 확인하는 코드 링크는 아래에 보존했습니다.

## 예제·수식·시각 자료

```text
(0000000000000000)₂ = (0)₁₀

(0000000000010001)₂ =
    (1 × 2⁴) +
    (0 × 2³) +
    (0 × 2²) +
    (0 × 2¹) +
    (1 × 2⁰) = (17)₁₀

(1111111111111111)₂ =
    (1 × 2¹⁵) +
    (1 × 2¹⁴) +
    (1 × 2¹³) +
    (1 × 2¹²) +
    (1 × 2¹¹) +
    (1 × 2¹⁰) +
    (1 × 2⁹) +
    (1 × 2⁸) +
    (1 × 2⁷) +
    (1 × 2⁶) +
    (1 × 2⁵) +
    (1 × 2⁴) +
    (1 × 2³) +
    (1 × 2²) +
    (1 × 2¹) +
    (1 × 2⁰) = (65535)₁₀
```

![부동소수점 수의 이진 표현 자료](images/03-scientific-notation.png)

| 부동소수점 형식 | 전체 비트 | 부호 비트 | 지수 비트 | 가수 비트 | 밑 |
| :-------------------- | :--------: | :-------: | :-----------: | :--------------: | :--: |
| [반정밀도](https://en.wikipedia.org/wiki/Half-precision_floating-point_format)        | 16         | 1         | 5             | 10               | 2    |
| [단정밀도](https://en.wikipedia.org/wiki/Single-precision_floating-point_format)      | 32         | 1         | 8             | 23               | 2    |
| [배정밀도](https://en.wikipedia.org/wiki/Double-precision_floating-point_format)      | 64         | 1         | 11            | 52               | 2    |

```
exponent_bias = 2 ^ (k−1) − 1

k - number of exponent bits
```

![부동소수점 수의 이진 표현 자료](images/02-half-precision-floating-point-number-explained.png)

| 부동소수점 형식 | 최소 지수 | 최대 지수 | 범위            | 최소 정규 양수 |
| :-------------------- | :------ | :------ | :--------------- | :----------- |
| 반정밀도        | −14     | +15     | ±65,504          | 6.10 × 10⁻⁵  |
| 단정밀도      | −126    | +127    | ±3.4028235 × 10³⁸| 1.18 × 10⁻³⁸ |

## 구현과 참고 자료

- [two's complement](https://en.wikipedia.org/wiki/Two%27s_complement)
- [IEEE 754](https://en.wikipedia.org/wiki/IEEE_754)
- [scientific notation](https://en.wikipedia.org/wiki/Scientific_notation)
- [Half-precision](https://en.wikipedia.org/wiki/Half-precision_floating-point_format)
- [Single-precision](https://en.wikipedia.org/wiki/Single-precision_floating-point_format)
- [Double-precision](https://en.wikipedia.org/wiki/Double-precision_floating-point_format)
- [biased exponent](https://en.wikipedia.org/wiki/Exponent_bias)
- [interactive version of this diagram](https://trekhleb.dev/blog/2021/binary-floating-point/)
- [bitsToFloat.js](bitsToFloat.js)
- [floatAsBinaryString.js](floatAsBinaryString.js)
- [Interactive version of this article](https://trekhleb.dev/blog/2021/binary-floating-point/)
- [Here is what you need to know about JavaScript’s Number type](https://indepth.dev/posts/1139/here-is-what-you-need-to-know-about-javascripts-number-type)
- [Float Exposed](https://float.exposed/)
- [IEEE754 Visualization](https://bartaz.github.io/ieee754-visualization/)
