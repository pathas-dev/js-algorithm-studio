# 주식 매매 최대 이익

[English](README.md) | [한국어](README.ko-KR.md)

각 날짜의 가격이 주어졌을 때 여러 번 사고팔아 얻을 수 있는 최대 이익을 구합니다. 동시에 여러 주식을 보유할 수 없고, 다시 사기 전에 먼저 팔아야 합니다. 이 문제는 한 번만 거래하는 버전과 다릅니다.

`[7,1,5,3,6,4]`에서는 1에 사서 5에 팔고, 3에 사서 6에 팔면 이익은 7입니다. 계속 하락하는 경우에는 거래하지 않아 이익이 0입니다.

모든 매수·매도 선택을 재귀적으로 시도하면 원문 기준 시간은 `O(2^n)`이며 재귀 스택 공간은 `O(n)`입니다. 더 효율적인 방법은 연속된 저점에서 사고 다음 고점에서 파는 것입니다. 더 간단하게는 인접 날짜의 양수 가격 차이만 누적해도 같은 최대 이익을 얻습니다. 이 두 방식은 `O(n)` 시간과 `O(1)` 추가 공간을 사용합니다.

## 예제·수식·시각 자료

```
Input: [7, 1, 5, 3, 6, 4]
Output: 7
```

```
Input: [1, 2, 3, 4, 5]
Output: 4
```

```
Input: [7, 6, 4, 3, 1]
Output: 0
```

![주식 매매 최대 이익 자료](https://leetcode.com/media/original_images/122_maxprofit_1.PNG)

![주식 매매 최대 이익 자료](https://leetcode.com/media/original_images/122_maxprofit_2.PNG)

## 구현과 참고 자료

- [dqBestTimeToBuySellStocks.js](dqBestTimeToBuySellStocks.js)
- [LeetCode](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/solution/)
- [peakvalleyBestTimeToBuySellStocks.js](peakvalleyBestTimeToBuySellStocks.js)
- [accumulatorBestTimeToBuySellStocks.js](accumulatorBestTimeToBuySellStocks.js)
- [Best Time to Buy and Sell Stock on LeetCode](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/)
