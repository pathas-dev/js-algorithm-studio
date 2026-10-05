# 최단 공통 상위 수열

[English](README.md) | [한국어](README.ko-KR.md)

두 수열 `X`와 `Y`를 각각 부분수열로 포함하는 가장 짧은 수열을 찾습니다. 각 입력의 순서는 유지해야 하지만 입력 사이에 다른 문자가 들어가도 됩니다.

`geek`와 `eke`의 답 중 하나는 `geeke`이고, `AGGTAB`와 `GXTXAYB`의 답 중 하나는 `AGXGTXAYB`입니다. 두 입력에서 공통으로 유지할 수 있는 부분을 찾는 최장 공통 부분수열 문제와 밀접하게 연결됩니다.

## 예제·수식·시각 자료

```
Input:   str1 = "geek",  str2 = "eke"
Output: "geeke"

Input:   str1 = "AGGTAB",  str2 = "GXTXAYB"
Output:  "AGXGTXAYB"
```

## 구현과 참고 자료

- [GeeksForGeeks](https://www.geeksforgeeks.org/shortest-common-supersequence/)
