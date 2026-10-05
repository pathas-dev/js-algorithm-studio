# 계단 오르기 경우의 수

[English](README.md) | [한국어](README.ko-KR.md)

한 번에 한 칸 또는 두 칸씩 올라갈 수 있을 때 `n`칸 계단의 꼭대기에 도달하는 방법 수를 구합니다. 마지막 이동이 한 칸인 경우와 두 칸인 경우로 나누면 `ways(n)=ways(n-1)+ways(n-2)`입니다.

원문은 완전 탐색 재귀, 메모이제이션 재귀, 동적 계획법, 반복문 풀이를 비교합니다. 단순 재귀의 시간은 `O(2^n)`이고, 메모이제이션과 동적 계획법의 시간·공간은 `O(n)`입니다. 앞의 두 값만 유지하는 반복문은 `O(n)` 시간과 `O(1)` 추가 공간을 사용합니다.

원문의 단순 재귀 공간 표기는 `O(1)`이지만 호출 스택까지 계산하면 `O(n)`입니다. 계단 수가 0인 경우 등 초기값의 정의를 실제 구현과 함께 확인해야 합니다.

## 예제·수식·시각 자료

![계단 오르기 경우의 수 자료](https://cdncontribute.geeksforgeeks.org/wp-content/uploads/nth-stair.png)

## 구현과 참고 자료

- [Brute Force Recursive Solution](./recursiveStaircaseBF.js)
- [Recursive Solution With Memoization](./recursiveStaircaseMEM.js)
- [Dynamic Programming Solution](./recursiveStaircaseDP.js)
- [Iterative Solution](./recursiveStaircaseIT.js)
- [On YouTube by Gayle Laakmann McDowell](https://www.youtube.com/watch?v=eREiwuvzaUM&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=81&t=0s)
- [GeeksForGeeks](https://www.geeksforgeeks.org/count-ways-reach-nth-stair/)
