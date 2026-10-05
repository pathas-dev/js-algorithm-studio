# 점프 게임

[English](README.md) | [한국어](README.ko-KR.md)

음이 아닌 정수 배열의 첫 위치에서 시작합니다. 각 값은 해당 위치에서 가능한 최대 점프 길이이며, 마지막 위치까지 도달할 수 있는지 판단합니다. 정확히 그 값만큼 점프해야 하는 것은 아닙니다.

백트래킹은 가능한 점프를 모두 시도하며 최악에 `O(2^n)` 시간과 `O(n)` 재귀 공간을 사용합니다. 하향식 동적 계획법은 각 위치를 도달 가능·불가능·미확정으로 기억해 중복을 줄이고, 상향식 방식은 오른쪽부터 같은 정보를 계산합니다. 두 동적 계획법의 원문 복잡도는 시간 `O(n²)`, 공간 `O(n)`입니다.

탐욕 방식은 마지막 위치에서 시작해 현재 알려진 도달 가능 위치까지 점프할 수 있는 더 왼쪽 위치를 찾습니다. 가장 왼쪽의 도달 가능 위치만 유지하면 `O(n)` 시간과 `O(1)` 추가 공간으로 첫 위치의 가능 여부를 판단할 수 있습니다.

## 예제·수식·시각 자료

```
Input: [2,3,1,1,4]
Output: true
Explanation: Jump 1 step from index 0 to 1, then 3 steps to the last index.
```

```
Input: [3,2,1,0,4]
Output: false
Explanation: You will always arrive at index 3 no matter what. Its maximum
             jump length is 0, which makes it impossible to reach the last index.
```

## 구현과 참고 자료

- [backtrackingJumpGame.js](backtrackingJumpGame.js)
- [dpTopDownJumpGame.js](dpTopDownJumpGame.js)
- [dpBottomUpJumpGame.js](dpBottomUpJumpGame.js)
- [greedyJumpGame.js](greedyJumpGame.js)
- [Jump Game Fully Explained on LeetCode](https://leetcode.com/articles/jump-game/)
- [Dynamic Programming vs Divide and Conquer](https://itnext.io/dynamic-programming-vs-divide-and-conquer-2fea680becbe)
- [Dynamic Programming](https://en.wikipedia.org/wiki/Dynamic_programming)
- [Memoization on Wikipedia](https://en.wikipedia.org/wiki/Memoization)
- [Top-Down and Bottom-Up Design on Wikipedia](https://en.wikipedia.org/wiki/Top-down_and_bottom-up_design)
