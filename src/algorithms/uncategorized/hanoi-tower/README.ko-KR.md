# 하노이의 탑

[English](README.md) | [한국어](README.ko-KR.md)

크기가 다른 원판들이 작은 것부터 위에 놓인 상태에서, 세 기둥을 이용해 모든 원판을 다른 기둥으로 옮기는 퍼즐입니다. 한 번에 원판 하나만 이동하고, 기둥의 맨 위 원판만 꺼낼 수 있으며 큰 원판을 작은 원판 위에 놓을 수 없습니다.

`n-1`개를 보조 기둥으로 옮기고, 가장 큰 원판을 목표 기둥으로 옮긴 뒤, 보조 기둥의 원판들을 목표로 옮기는 재귀 구조입니다. 최소 이동 수는 `2^n-1`이며 원판 3개에는 7번이 필요합니다. 원문 애니메이션은 원판 6개를 옮기는 반복적 풀이를 보여 줍니다.

## 예제·수식·시각 자료

![하노이의 탑 자료](https://upload.wikimedia.org/wikipedia/commons/8/8d/Iterative_algorithm_solving_a_6_disks_Tower_of_Hanoi.gif)

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Tower_of_Hanoi)
- [HackerEarth](https://www.hackerearth.com/blog/algorithms/tower-hanoi-recursion-game-algorithm-explained/)
