# 최대 부분 배열 합

[English](README.md) | [한국어](README.ko-KR.md)

숫자 배열에서 합이 가장 큰 연속 구간을 찾습니다. 부분수열과 달리 중간 원소를 건너뛸 수 없습니다. `[-2,1,-3,4,-1,2,1,-5,4]`의 답은 `[4,-1,2,1]`이고 합은 6입니다.

원문은 완전 탐색, 분할 정복, 동적 계획법의 세 구현을 소개합니다. 완전 탐색은 가능한 구간들을 확인하고, 동적 계획법은 현재 원소에서 새 구간을 시작할지 이전 구간을 연장할지 결정합니다. 이 선형 방식은 카데인 알고리즘으로 알려져 있으며 `O(n)`입니다.

원문에는 완전 탐색과 해당 분할 정복 구현의 시간을 `O(n²)`으로 적고 있습니다. 이는 모든 분할 정복 알고리즘의 복잡도를 의미하지 않으며 실제 구현의 합 계산 방식을 확인해야 합니다.

## 예제·수식·시각 자료

![최대 부분 배열 합 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/e8960f093107b71b21827e726e2bad8b023779b2)

![최대 부분 배열 합 자료](https://www.geeksforgeeks.org/wp-content/uploads/kadane-Algorithm.png)

## 구현과 참고 자료

- [bfMaximumSubarray.js](./bfMaximumSubarray.js)
- [dcMaximumSubarraySum.js](./dcMaximumSubarraySum.js)
- [dpMaximumSubarray.js](./dpMaximumSubarray.js)
- [Wikipedia](https://en.wikipedia.org/wiki/Maximum_subarray_problem)
- [YouTube](https://www.youtube.com/watch?v=ohHWQf1HDfU&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
- [GeeksForGeeks](https://www.geeksforgeeks.org/largest-sum-contiguous-subarray/)
- [LeetCode](https://leetcode.com/explore/interview/card/top-interview-questions-easy/97/dynamic-programming/566/discuss/1595195/C++Python-7-Simple-Solutions-w-Explanation-or-Brute-Force-+-DP-+-Kadane-+-Divide-and-Conquer)
