# 퀵 정렬

[English](README.md) | [한국어](README.ko-KR.md)

퀵 정렬은 피벗을 선택하고, 피벗보다 작은 값과 큰 값으로 배열을 분할하는 분할 정복 알고리즘입니다. 분할된 두 구간에도 같은 과정을 재귀적으로 적용합니다.

제자리 분할에서는 분할이 끝난 피벗의 위치가 확정됩니다. 균형 있게 분할되면 최선·평균 시간은 `O(n log n)`이지만, 매우 치우친 분할이 반복되면 최악은 `O(n²)`입니다. 일반적인 구현은 안정 정렬이 아닙니다.

원문 표는 제자리 구현의 평균적인 재귀 스택 공간을 `O(log n)`으로 제시합니다. 별도 부분 배열을 만드는 구현이나 최악의 재귀 깊이에서는 공간 비용이 달라집니다.

## 예제·수식·시각 자료

![퀵 정렬 자료](https://upload.wikimedia.org/wikipedia/commons/6/6a/Sorting_quicksort_anim.gif)

| 알고리즘                  | 최선            | 평균             | 최악               | 추가 공간    | 안정성    | 비고  |
| --------------------- | :-------------: | :-----------------: | :-----------------: | :-------: | :-------: | :-------- |
| **Quick sort**        | n&nbsp;log(n)   | n&nbsp;log(n)       | n<sup>2</sup>       | log(n)    | 아니요        |  제자리 퀵 정렬의 평균 재귀 스택 공간 O(log(n)) |

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Quicksort)
- [YouTube](https://www.youtube.com/watch?v=SLauY6PpjW4&index=28&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
