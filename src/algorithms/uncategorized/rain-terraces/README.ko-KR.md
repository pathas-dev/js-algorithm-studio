# 빗물 가두기

[English](README.md) | [한국어](README.ko-KR.md)

폭이 1인 막대들의 높이가 음이 아닌 정수 배열로 주어졌을 때, 비가 온 뒤 고일 수 있는 물의 양을 구합니다. 각 위치의 물 높이는 왼쪽 최대 높이와 오른쪽 최대 높이 중 작은 값에서 현재 막대 높이를 뺀 값입니다.

매 위치에서 양쪽을 다시 탐색하면 시간은 `O(n²)`이고 추가 공간은 `O(1)`입니다. 왼쪽·오른쪽 최대 높이를 미리 저장하면 각 위치를 일정한 횟수만 확인하므로 시간 `O(n)`, 추가 공간 `O(n)`입니다.

`[3,0,0,2,0,4]`에서는 물이 총 10만큼 고입니다. 배열 양 끝에서는 바깥쪽 벽이 없어 물을 가둘 수 없습니다. 원문의 그림과 예제는 위치별 물의 높이를 보여 줍니다.

## 예제·수식·시각 자료

![빗물 가두기 자료](https://www.geeksforgeeks.org/wp-content/uploads/watertrap.png)

```
Input: arr[] = [2, 0, 2]
Output: 2
Structure is like below:

| |
|_|

We can trap 2 units of water in the middle gap.
```

```
Input: arr[] = [3, 0, 0, 2, 0, 4]
Output: 10
Structure is like below:

     |
|    |
|  | |
|__|_|

We can trap "3*2 units" of water between 3 an 2,
"1 unit" on top of bar 2 and "3 units" between 2
and 4. See below diagram also.
```

```
Input: arr[] = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]
Output: 6
Structure is like below:

       |
   |   || |
_|_||_||||||

Trap "1 unit" between first 1 and 2, "4 units" between
first 2 and 3 and "1 unit" between second last 1 and last 2.
```

![빗물 가두기 자료](https://leetcode.com/problems/trapping-rain-water/Figures/42/trapping_rain_water.png)

## 구현과 참고 자료

- [GeeksForGeeks](https://www.geeksforgeeks.org/trapping-rain-water/)
- [LeetCode](https://leetcode.com/problems/trapping-rain-water/solution/)
