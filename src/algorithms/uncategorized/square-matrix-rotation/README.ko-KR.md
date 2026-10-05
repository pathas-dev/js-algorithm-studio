# 정사각 행렬의 제자리 회전

[English](README.md) | [한국어](README.ko-KR.md)

`n×n` 행렬을 시계 방향으로 90도 회전합니다. 새 2차원 행렬을 만들어 결과를 복사하는 대신 입력 행렬 자체를 수정해야 합니다.

주대각선을 기준으로 전치한 다음 각 행의 좌우를 뒤집으면 시계 방향 회전이 됩니다. 두 번의 반사를 조합하는 원문의 설명과 같은 원리입니다. 좌표 `(row,column)`의 값은 결과에서 `(column,n-1-row)`로 옮겨집니다.

모든 원소를 처리하므로 시간은 `O(n²)`입니다. 원문의 입력·출력 행렬과 반사 예제를 비교하면 값들의 위치가 어떻게 바뀌는지 확인할 수 있습니다.

## 예제·수식·시각 자료

```
[
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]
```

```
[
  [7, 4, 1],
  [8, 5, 2],
  [9, 6, 3],
]
```

```
[
  [5, 1, 9, 11],
  [2, 4, 8, 10],
  [13, 3, 6, 7],
  [15, 14, 12, 16],
]
```

```
[
  [15, 13, 2, 5],
  [14, 3, 4, 1],
  [12, 6, 8, 9],
  [16, 7, 10, 11],
]
```

```
Let's say we have a string at the top of the matrix:

A B C
• • •
• • •

Let's do top-right/bottom-left diagonal reflection:

A B C
/ / •
/ • •

And now let's do horizontal reflection:

A → →
B → →
C → →

The string has been rotated to 90 degree:

• • A
• • B
• • C
```

## 구현과 참고 자료

- [LeetCode](https://leetcode.com/problems/rotate-image/description/)
