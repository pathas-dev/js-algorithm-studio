# 버킷 정렬

[English](README.md) | [한국어](README.ko-KR.md)

버킷 정렬은 값을 여러 버킷에 분배하고, 각 버킷 안에서 정렬한 뒤 버킷 순서대로 합칩니다. 먼저 빈 버킷들을 준비하고 입력을 분배한 다음, 비어 있지 않은 버킷들을 정렬합니다.

성능은 버킷 수, 입력 분포, 내부 정렬 방법에 달려 있습니다. 값이 균일하게 분배되면 평균 시간은 버킷 수 `k`에 대해 `O(n+k)`입니다. 삽입 정렬을 사용하고 모든 값이 한 버킷에 몰리면 최악에는 `O(n²)`이며, 내부 정렬이 `O(n log n)`이면 그에 따른 최악의 시간도 달라집니다.

## 예제·수식·시각 자료

![버킷 정렬 자료](./images/bucket_sort_1.png)

![버킷 정렬 자료](./images/bucket_sort_2.png)

## 구현과 참고 자료

- [Bucket Sort on Wikipedia](https://en.wikipedia.org/wiki/Bucket_sort)
