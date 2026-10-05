# 비트 조작

[English](README.md) | [한국어](README.ko-KR.md)

비트 조작은 정수의 이진 표현에 AND(`&`), OR(`|`), XOR(`^`), NOT(`~`), 시프트를 적용합니다. JavaScript의 일반 비트 연산은 32비트 정수로 변환된 값에 적용되므로 큰 수와 부호의 범위를 고려해야 합니다.

### 특정 비트 읽기·설정·지우기·갱신
위치 `p`의 비트는 `(number >> p) & 1`로 읽습니다. `number | (1 << p)`는 해당 비트를 1로, `number & ~(1 << p)`는 0으로 만듭니다. 갱신은 먼저 지운 뒤 필요한 값을 설정합니다.

### 짝수와 부호, 2배와 절반
최하위 비트가 0이면 짝수입니다. 부호 있는 표현에서 최상위 비트로 부호를 구분할 수 있지만 0과 음수 0을 양수로 취급하면 안 됩니다. 왼쪽 시프트는 비트 범위 안에서 2배를, 오른쪽 시프트는 2로 나눈 정수 결과를 나타냅니다. 음수의 산술 시프트는 부호 비트를 보존합니다. 부호 반전은 2의 보수, 즉 비트를 반전하고 1을 더하는 방식으로 설명할 수 있습니다.

### 곱셈과 비트 개수
부호 있는 곱셈은 피연산자의 짝수·홀수·부호에 따라 절반 크기의 문제로 줄입니다. 부호 없는 곱셈은 수를 2의 거듭제곱 합으로 나누고 시프트한 값을 더합니다. 켜진 비트 수는 각 비트를 확인해 셀 수 있고, 두 수의 다른 비트 수는 XOR 결과의 켜진 비트 수입니다. 비트 길이는 값을 표현하는 데 필요한 유효 비트 수입니다.

### 2의 거듭제곱과 전가산기
양의 2의 거듭제곱은 켜진 비트가 하나이므로 `number > 0 && (number & (number - 1)) === 0`으로 확인할 수 있습니다. 먼저 양수 조건을 검사해야 합니다. 전가산기는 두 입력 비트와 이전 자리의 올림을 더해 결과 비트와 다음 올림을 만들며, 이를 32자리에 적용해 2의 보수 정수 덧셈을 표현합니다. 아래 구현 링크와 진리표를 함께 참고하세요.

## 예제·수식·시각 자료

```text
Number: 5 = 0b0101
isEven: false

Number: 4 = 0b0100
isEven: true
```

```text
Number: 1 = 0b0001
isPositive: true

Number: -1 = -0b0001
isPositive: false
```

```
Before the shift
Number: 0b0101 = 5
Powers of two: 0 + 2^2 + 0 + 2^0

After the shift
Number: 0b1010 = 10
Powers of two: 2^3 + 0 + 2^1 + 0
```

```
Before the shift
Number: 0b0101 = 5
Powers of two: 0 + 2^2 + 0 + 2^0

After the shift
Number: 0b0010 = 2
Powers of two: 0 + 0 + 2^1 + 0
```

```
1101 -3
1110 -2
1111 -1
0000  0
0001  1
0010  2
0011  3
```

```text
a * b can be written in the below formats:
  0                     if a is zero or b is zero or both a and b are zeroes
  2a * (b/2)            if b is even
  2a * (b - 1)/2 + a    if b is odd and positive
  2a * (b + 1)/2 - a    if b is odd and negative
```

```text
19 = 2^4 + 2^1 + 2^0
```

```text
x * 19 = x * 2^4 + x * 2^1 + x * 2^0
```

```text
Number: 5 = 0b0101
Count of set bits = 2
```

```
5 = 0b0101
1 = 0b0001
Count of Bits to be Flipped: 1
```

```
5 = 0b0101
Count of valuable bits is: 3
When we shift 1 four times it will become bigger than 5.
```

```
Number: 4 = 0b0100
Number: 3 = (4 - 1) = 0b0011
4 & 3 = 0b0100 & 0b0011 = 0b0000 <-- Equal to zero, is power of two.

Number: 10 = 0b01010
Number: 9 = (10 - 1) = 0b01001
10 & 9 = 0b01010 & 0b01001 = 0b01000 <-- Not equal to zero, not a power of two.
```

```
A = 3: 011
B = 6: 110
┌──────┬────┬────┬─────────┬──────────┬─────────┬───────────┬───────────┐
│  bit │ ai │ bi │ carryIn │ carryOut │  bitSum │ resultBin │ resultDec │
├──────┼────┼────┼─────────┼──────────┼─────────┼───────────┼───────────┤
│   0  │ 1  │ 0  │    0    │    0     │     1   │       1   │     1     │
│   1  │ 1  │ 1  │    0    │    1     │     0   │      01   │     1     │
│   2  │ 0  │ 1  │    1    │    1     │     0   │     001   │     1     │
│   3  │ 0  │ 0  │    1    │    0     │     1   │    1001   │     9     │
└──────┴────┴────┴─────────┴──────────┴─────────┴───────────┴───────────┘
```

## 구현과 참고 자료

- [getBit.js](getBit.js)
- [setBit.js](setBit.js)
- [clearBit.js](clearBit.js)
- [updateBit.js](updateBit.js)
- [isEven.js](isEven.js)
- [isPositive.js](isPositive.js)
- [multiplyByTwo.js](multiplyByTwo.js)
- [divideByTwo.js](divideByTwo.js)
- [switchSign.js](switchSign.js)
- [multiply.js](multiply.js)
- [multiplyUnsigned.js](multiplyUnsigned.js)
- [countSetBits.js](countSetBits.js)
- [bitsDiff.js](bitsDiff.js)
- [bitLength.js](bitLength.js)
- [isPowerOfTwo.js](isPowerOfTwo.js)
- [full adder](<https://en.wikipedia.org/wiki/Adder_(electronics)>)
- [fullAdder.js](fullAdder.js)
- [Full Adder on YouTube](https://www.youtube.com/watch?v=wvJc9CZcvBc&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
- [Bit Manipulation on YouTube](https://www.youtube.com/watch?v=NLKQEOgBAnw&t=0s&index=28&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
- [Negative Numbers in binary on YouTube](https://www.youtube.com/watch?v=4qH4unVtJkE&t=0s&index=30&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
- [Bit Hacks on stanford.edu](https://graphics.stanford.edu/~seander/bithacks.html)
