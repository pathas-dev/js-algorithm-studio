# 2의 거듭제곱 판별

[English](README.md) | [한국어](README.ko-KR.md)

양의 정수가 2의 거듭제곱인지 판단합니다. 단순한 방식은 계속 2로 나누면서 나머지가 0인지 확인하고 마지막에 1이 되는지 검사합니다.

비트 방식은 양의 2의 거듭제곱의 이진 표현에서 켜진 비트가 정확히 하나라는 성질을 사용합니다. 따라서 양수인지 먼저 확인한 뒤 `(number & (number-1))===0`을 검사합니다. 0이나 부호 비트만 켜진 음수를 거듭제곱으로 잘못 판단하지 않도록 해야 합니다.

JavaScript 비트 연산은 일반 `Number`를 32비트 정수로 변환하므로 이 방법을 더 큰 정수 전체에 그대로 적용해서는 안 됩니다.

## 예제·수식·시각 자료

```
1: 0001
2: 0010
4: 0100
8: 1000
```

```
number & (number - 1)
```

```
  1000
- 0001
  ----
  0111

  1000
& 0111
  ----
  0000
```

## 구현과 참고 자료

- [GeeksForGeeks](https://www.geeksforgeeks.org/program-to-find-whether-a-no-is-power-of-two/)
- [Bitwise Solution on Stanford](http://www.graphics.stanford.edu/~seander/bithacks.html#DetermineIfPowerOf2)
- [Binary number subtraction on YouTube](https://www.youtube.com/watch?v=S9LJknZTyos&t=0s&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=66)
