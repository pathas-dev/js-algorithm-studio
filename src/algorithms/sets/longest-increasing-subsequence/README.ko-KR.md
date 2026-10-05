# 최장 증가 부분수열

[English](README.md) | [한국어](README.ko-KR.md)

주어진 수열에서 원래 순서를 유지하면서 값이 증가하는 가장 긴 부분수열을 찾습니다. 원소들이 연속할 필요는 없으며 최적의 부분수열이 여러 개일 수 있습니다.

원문 예제에서는 `0, 2, 6, 9, 11, 15`가 길이 6의 답이고, 같은 길이의 다른 답도 존재합니다. 동적 계획법은 각 위치에서 끝나는 증가 부분수열의 길이를 이전 위치들과 비교해 `O(n²)`에 계산합니다. 이진 탐색을 활용하는 방법은 `O(n log n)`에 풀 수 있습니다.

## 예제·수식·시각 자료

```
0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15
```

```
0, 2, 6, 9, 11, 15.
```

```
0, 4, 6, 9, 11, 15 or
0, 2, 6, 9, 13, 15 or
0, 4, 6, 9, 13, 15
```

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Longest_increasing_subsequence)
- [Dynamic Programming Approach on YouTube](https://www.youtube.com/watch?v=CE2b_-XfVDk&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
