# 선택 정렬

[English](README.md) | [한국어](README.ko-KR.md)

선택 정렬은 미정렬 구간에서 최솟값을 찾고 그 구간의 첫 원소와 교환하는 과정을 반복합니다. 매번 하나의 위치가 확정되어 정렬된 앞부분이 늘어납니다.

최솟값을 찾으려면 남은 구간을 모두 비교하므로 최선·평균·최악의 시간은 `O(n²)`입니다. 전형적인 제자리 구현의 추가 공간은 `O(1)`이고 일반적으로 안정 정렬이 아닙니다. 단순하고 추가 메모리가 작지만 큰 입력에서는 비효율적입니다.

## 예제·수식·시각 자료

![선택 정렬 자료](https://upload.wikimedia.org/wikipedia/commons/b/b0/Selection_sort_animation.gif)

![선택 정렬 자료](https://upload.wikimedia.org/wikipedia/commons/9/94/Selection-Sort-Animation.gif)

| 알고리즘                  | 최선            | 평균             | 최악               | 추가 공간    | 안정성    | 비고  |
| --------------------- | :-------------: | :-----------------: | :-----------------: | :-------: | :-------: | :-------- |
| **Selection sort**    | n<sup>2</sup>   | n<sup>2</sup>       | n<sup>2</sup>       | 1         | 아니요        |           |

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Selection_sort)
