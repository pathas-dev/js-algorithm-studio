# 계수 정렬

[English](README.md) | [한국어](README.ko-KR.md)

계수 정렬은 작은 정수 키의 등장 횟수를 세어 정렬합니다. 원소끼리 비교하는 방식이 아니므로 비교 정렬의 `Ω(n log n)` 하한을 그대로 적용하지 않습니다.

첫 단계에서 각 값의 빈도를 세고, 다음 단계에서 누적합으로 각 값 이하의 원소 수를 계산합니다. 마지막으로 누적합을 이용해 결과 배열의 위치를 결정합니다. 같은 값의 원래 순서를 유지하도록 배치하면 안정 정렬이 됩니다.

값의 범위 크기를 `r`이라고 하면 시간과 공간은 `O(n+r)`입니다. 값의 범위가 입력 원소 수보다 지나치게 크면 비효율적이며, 기수 정렬의 내부 정렬로 활용할 수 있습니다. 원문 표의 `r`은 배열 최댓값을 기준으로 표현되어 있습니다.

## 예제·수식·시각 자료

![계수 정렬 자료](https://3.bp.blogspot.com/-jJchly1BkTc/WLGqCFDdvCI/AAAAAAAAAHA/luljAlz2ptMndIZNH0KLTTuQMNsfzDeFQCLcB/s1600/CSortUpdatedStepI.gif)

![계수 정렬 자료](https://1.bp.blogspot.com/-1vFu-VIRa9Y/WLHGuZkdF3I/AAAAAAAAAHs/8jKu2dbQee4ap9xlVcNsILrclqw0UxAVACLcB/s1600/Step-II.png)

![계수 정렬 자료](https://1.bp.blogspot.com/-xPqylngqASY/WLGq3p9n9vI/AAAAAAAAAHM/JHdtXAkJY8wYzDMBXxqarjmhpPhM0u8MACLcB/s1600/ResultArrayCS.gif)

| 알고리즘                  | 최선            | 평균             | 최악               | 추가 공간    | 안정성    | 비고  |
| --------------------- | :-------------: | :-----------------: | :-----------------: | :-------: | :-------: | :-------- |
| **Counting sort**     | n + r           | n + r               | n + r               | n + r     | 예       | r: 배열의 최댓값 |

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Counting_sort)
- [YouTube](https://www.youtube.com/watch?v=OKd534EWcdk&index=61&t=0s&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
- [EfficientAlgorithms](https://efficientalgorithms.blogspot.com/2016/09/lenear-sorting-counting-sort.html)
