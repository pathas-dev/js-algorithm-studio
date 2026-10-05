# 최장 공통 부분 문자열

[English](README.md) | [한국어](README.ko-KR.md)

최장 공통 부분 문자열 문제는 둘 이상의 문자열에 연속해서 나타나는 가장 긴 문자열을 찾습니다. 원래 위치가 연속하지 않아도 되는 최장 공통 부분수열 문제와 다릅니다.

`ABABC`, `BABCA`, `ABCBA`의 최장 공통 부분 문자열은 길이 3인 `ABC`입니다. `A`, `AB`, `B`, `BA`, `BC`, `C`도 공통 부분 문자열이지만 더 짧습니다. 동적 계획법에서 문자가 일치하면 이전 대각선의 길이를 늘리고, 불일치하면 연속 길이를 0으로 초기화합니다.

## 예제·수식·시각 자료

```
ABABC
  |||
 BABCA
  |||
  ABCBA
```

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Longest_common_substring_problem)
- [YouTube](https://www.youtube.com/watch?v=BysNXJHzCEs&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
