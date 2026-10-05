# 기수 정렬

[English](README.md) | [한국어](README.ko-KR.md)

기수 정렬은 같은 자릿수의 값을 기준으로 원소를 분류하는 비비교 정렬입니다. 기수는 숫자 체계의 밑으로, 이진수는 2이고 십진수는 10입니다. 적절한 표현을 사용하면 문자열이나 다른 키에도 적용할 수 있습니다.

각 자릿수를 안정적으로 정렬하며 다음 자릿수로 넘어가야 이전 단계의 순서가 보존됩니다. 입력 수를 `n`, 가장 긴 키의 자릿수를 `k`라고 하면 원문 표의 시간은 `O(nk)`입니다.

키 길이를 항상 상수로 볼 수는 없습니다. 키가 길어질수록 처리량이 늘어나므로 기수 정렬이 모든 비교 정렬보다 항상 빠르다고 단정할 수 없습니다.

## 예제·수식·시각 자료

![기수 정렬 자료](./images/radix-sort.png)

| 알고리즘                  | 최선            | 평균             | 최악               | 추가 공간    | 안정성    | 비고  |
| --------------------- | :-------------: | :-----------------: | :-----------------: | :-------: | :-------: | :-------- |
| **Radix sort**        | n * k           | n * k               | n * k               | n + k     | 예       | k: 가장 긴 키의 길이 |

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Radix_sort)
- [YouTube](https://www.youtube.com/watch?v=XiuSW_mEn7g&index=62&t=0s&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
- [ResearchGate](https://www.researchgate.net/figure/Simplistic-illustration-of-the-steps-performed-in-a-radix-sort-In-this-example-the_fig1_291086231)
