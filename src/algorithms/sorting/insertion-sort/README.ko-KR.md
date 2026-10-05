# 삽입 정렬

[English](README.md) | [한국어](README.ko-KR.md)

삽입 정렬은 배열 앞부분을 정렬된 구간으로 유지하면서 다음 원소를 올바른 위치에 삽입합니다. 현재 값보다 큰 원소들을 오른쪽으로 이동하고 비워진 위치에 현재 값을 놓습니다.

이미 정렬된 배열은 각 원소를 짧게 확인하므로 최선의 시간은 `O(n)`입니다. 역순 등 많은 이동이 필요한 경우 평균·최악은 `O(n²)`입니다. 전형적인 제자리 구현은 추가 공간 `O(1)`이고, 같은 값을 앞지르지 않게 삽입하면 안정 정렬입니다.

## 예제·수식·시각 자료

![삽입 정렬 자료](https://upload.wikimedia.org/wikipedia/commons/4/42/Insertion_sort.gif)

![삽입 정렬 자료](https://upload.wikimedia.org/wikipedia/commons/0/0f/Insertion-sort-example-300px.gif)

| 알고리즘                  | 최선            | 평균             | 최악               | 추가 공간    | 안정성    | 비고  |
| --------------------- | :-------------: | :-----------------: | :-----------------: | :-------: | :-------: | :-------- |
| **삽입 sort**    | n               | n<sup>2</sup>       | n<sup>2</sup>       | 1         | 예       |           |

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Insertion_sort)
