# 셸 정렬

[English](README.md) | [한국어](README.ko-KR.md)

셸 정렬은 멀리 떨어진 원소끼리 먼저 정렬하고 간격을 점차 줄이는 비교 정렬입니다. 마지막에 간격을 1로 줄이면 삽입 정렬처럼 작동합니다. 멀리 벗어난 원소를 먼저 옮겨 가까운 원소만 교환하는 방식보다 이동을 줄일 수 있습니다.

원문 예제에서는 간격 4, 2, 1 순서로 부분 수열을 정렬합니다. 간격 2를 처리한 그림에는 오기가 있으며 올바른 배열은 `[14, 10, 27, 19, 35, 33, 42, 44]`입니다.

성능은 간격 수열에 의존합니다. 따라서 원문 표의 특정 시간 표현을 모든 간격 수열의 보장으로 해석하면 안 됩니다. 전형적인 제자리 구현의 추가 공간은 `O(1)`이며 안정 정렬이 아닙니다.

## 예제·수식·시각 자료

![셸 정렬 자료](https://upload.wikimedia.org/wikipedia/commons/d/d8/Sorting_shellsort_anim.gif)

![셸 정렬 자료](https://www.tutorialspoint.com/data_structures_algorithms/images/shell_sort_gap_4.jpg)

![셸 정렬 자료](https://www.tutorialspoint.com/data_structures_algorithms/images/shell_sort_step_1.jpg)

![셸 정렬 자료](https://www.tutorialspoint.com/data_structures_algorithms/images/shell_sort_gap_2.jpg)

![셸 정렬 자료](https://www.tutorialspoint.com/data_structures_algorithms/images/shell_sort_step_2.jpg)

![셸 정렬 자료](https://www.tutorialspoint.com/data_structures_algorithms/images/shell_sort.jpg)

| 알고리즘                  | 최선            | 평균             | 최악               | 추가 공간    | 안정성    | 비고  |
| --------------------- | :-------------: | :-----------------: | :-----------------: | :-------: | :-------: | :-------- |
| **Shell sort**        | n&nbsp;log(n)   | 간격 수열에 따라 다름   | n&nbsp;(log(n))<sup>2</sup>  | 1         | 아니요         |           |

## 구현과 참고 자료

- [Tutorials Point](https://www.tutorialspoint.com/data_structures_algorithms/shell_sort_algorithm.htm)
- [Wikipedia](https://en.wikipedia.org/wiki/Shellsort)
- [YouTube by Rob Edwards](https://www.youtube.com/watch?v=ddeLSDsYVp8&index=79&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
