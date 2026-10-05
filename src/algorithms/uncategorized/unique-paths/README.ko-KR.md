# 격자의 서로 다른 경로 수

[English](README.md) | [한국어](README.ko-KR.md)

`m×n` 격자의 왼쪽 위에서 오른쪽 아래까지, 오른쪽 또는 아래로만 이동하는 서로 다른 경로 수를 구합니다. 장애물은 없고 되돌아가는 이동은 허용되지 않습니다.

동적 계획법에서는 각 칸에 도달하는 경로 수가 위 칸과 왼쪽 칸의 경로 수의 합입니다. 첫 행과 첫 열은 경로가 하나이며 시작 칸도 1로 둡니다. 원문 표의 시작 칸 0은 이 표준 초기값과 달라 주의가 필요합니다. 모든 칸을 저장하면 시간과 공간은 `O(mn)`입니다.

전체 이동 `m+n-2`번 중 아래 이동 `m-1`번의 위치를 선택하므로 이항계수 `C(m+n-2,m-1)`로도 계산할 수 있습니다. 이는 파스칼 삼각형과 연결됩니다. 모든 경로를 백트래킹으로 만들면 경우의 수가 지수적으로 늘어납니다.

## 예제·수식·시각 자료

![격자의 서로 다른 경로 수 자료](https://leetcode.com/static/images/problemset/robot_maze.png)

```
Input: m = 3, n = 2
Output: 3
Explanation:
From the top-left corner, there are a total of 3 ways to reach the bottom-right corner:
1. Right -> Right -> Down
2. Right -> Down -> Right
3. Down -> Right -> Right
```

```
Input: m = 7, n = 3
Output: 28
```

```
                START
                /   \
               D     R
             /     /   \
           R      D      R
         /      /         \
        R      R            D

       END    END          END
```

```
BOARD[i][j] = BOARD[i - 1][j] + BOARD[i][j - 1]; // since we can only move down or right.
```

```
BOARD[0][any] = 1; // only one way to reach any top slot.
BOARD[any][0] = 1; // only one way to reach any slot in the leftmost column.
```

|     | 0   | 1   | 1   |
|:---:|:---:|:---:|:---:|
|**0**| 0   | 1   | 1   |
|**1**| 1   | 2   | 3   |

## 구현과 참고 자료

- [LeetCode](https://leetcode.com/problems/unique-paths/description/)
