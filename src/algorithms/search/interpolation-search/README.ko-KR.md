# 보간 탐색

[English](README.md) | [한국어](README.ko-KR.md)

보간 탐색은 수치가 정렬된 배열에서 값의 분포를 이용해 예상 위치를 계산합니다. 항상 중앙을 선택하는 이진 탐색과 달리, 목표가 최댓값에 가까우면 배열 뒤쪽부터 확인합니다.

원문의 식은 양 끝의 인덱스와 값으로 목표의 상대 위치를 추정합니다. 값이 균일하게 분포할 때 평균 시간은 `O(log log n)`이지만, 분포가 치우치면 최악에는 `O(n)`이 될 수 있습니다. 양 끝 값이 같으면 식의 분모가 0이 되므로 별도로 처리해야 합니다.

## 예제·수식·시각 자료

```
// The idea of formula is to return higher value of pos
// when element to be searched is closer to arr[hi]. And
// smaller value when closer to arr[lo]
pos = lo + ((x - arr[lo]) * (hi - lo) / (arr[hi] - arr[Lo]))

arr[] - Array where elements need to be searched
x - Element to be searched
lo - Starting index in arr[]
hi - Ending index in arr[]
```

## 구현과 참고 자료

- [GeeksForGeeks](https://www.geeksforgeeks.org/interpolation-search/)
- [Wikipedia](https://en.wikipedia.org/wiki/Interpolation_search)
