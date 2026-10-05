# 힙 정렬

[English](README.md) | [한국어](README.ko-KR.md)

힙 정렬은 최대 원소를 찾아 정렬된 뒤쪽 구간으로 옮기는 비교 정렬입니다. 선택 정렬과 달리 매번 선형 탐색하지 않고 힙 자료 구조로 최대 원소를 찾습니다.

최대 힙을 만든 뒤 루트와 미정렬 구간의 마지막 원소를 교환하고, 구간을 줄여 힙 조건을 복구합니다. 최선·평균·최악의 시간은 `O(n log n)`입니다. 전형적인 제자리 구현의 추가 공간은 `O(1)`이며 일반적으로 안정 정렬이 아닙니다. 실제 구현이 배열이나 힙을 별도로 만들면 그 저장 공간은 따로 계산해야 합니다.

## 예제·수식·시각 자료

![힙 정렬 자료](https://upload.wikimedia.org/wikipedia/commons/1/1b/Sorting_heapsort_anim.gif)

![힙 정렬 자료](https://upload.wikimedia.org/wikipedia/commons/4/4d/Heapsort-example.gif)

| 알고리즘                  | 최선            | 평균             | 최악               | 추가 공간    | 안정성    | 비고  |
| --------------------- | :-------------: | :-----------------: | :-----------------: | :-------: | :-------: | :-------- |
| **Heap sort**         | n&nbsp;log(n)   | n&nbsp;log(n)       | n&nbsp;log(n)       | 1         | 아니요        |           |

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Heapsort)
