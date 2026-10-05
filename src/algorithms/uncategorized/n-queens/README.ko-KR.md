# N 퀸 문제

[English](README.md) | [한국어](README.ko-KR.md)

`n×n` 체스판에 퀸 `n`개를 놓되 어떤 두 퀸도 같은 행·열·대각선에 있지 않게 합니다. `n=2`와 `n=3`에는 해가 없으며 `n=1`과 `n≥4`에는 해가 존재합니다.

백트래킹은 한 행 또는 열에 퀸 하나를 배치하고 다음 위치로 넘어갑니다. 이미 놓은 퀸과 충돌하지 않는 위치만 시도하며, 더 배치할 수 없으면 이전 선택을 되돌립니다. 원문의 출력 행렬은 퀸이 있는 칸을 1로 나타냅니다.

비트 방식은 점유한 열과 두 방향의 대각선을 비트 마스크로 저장합니다. 행마다 퀸을 하나씩 배치하면 같은 행의 충돌은 따로 확인할 필요가 없습니다. 다음 행으로 이동할 때 대각선 마스크를 시프트해 공격 가능한 위치를 갱신합니다. JavaScript의 일반 비트 연산 범위도 고려해야 합니다.

## 예제·수식·시각 자료

![N 퀸 문제 자료](https://cdncontribute.geeksforgeeks.org/wp-content/uploads/N_Queen_Problem.jpg)

```
{ 0,  1,  0,  0}
{ 0,  0,  0,  1}
{ 1,  0,  0,  0}
{ 0,  0,  1,  0}
```

```
while there are untried configurations
{
   generate the next configuration
   if queens don't attack in this configuration then
   {
      print this configuration;
   }
}
```

```
1) Start in the leftmost column
2) If all queens are placed
    return true
3) Try all rows in the current column.  Do following for every tried row.
    a) If the queen can be placed safely in this row then mark this [row,
        column] as part of the solution and recursively check if placing
        queen here leads to a solution.
    b) If placing queen in [row, column] leads to a solution then return
        true.
    c) If placing queen doesn't lead to a solution then unmark this [row,
        column] (Backtrack) and go to step (a) to try other rows.
3) If all rows have been tried and nothing worked, return false to trigger
    backtracking.
```

![N 퀸 문제 자료](http://gregtrowbridge.com/content/images/2014/Jul/Screenshot-from-2014-06-17-19-46-20.png)

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Eight_queens_puzzle)
- [GeeksForGeeks](https://www.geeksforgeeks.org/backtracking-set-3-n-queen-problem/)
- [On YouTube by Abdul Bari](https://www.youtube.com/watch?v=xFv_Hl4B83A&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
- [On YouTube by Tushar Roy](https://www.youtube.com/watch?v=xouin83ebxE&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
- [Solution by Greg Trowbridge](http://gregtrowbridge.com/a-bitwise-solution-to-the-n-queens-problem-in-javascript/)
