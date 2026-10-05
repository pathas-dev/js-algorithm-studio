# 펜윅 트리 (이진 인덱스 트리)

[English](README.md) | [한국어](README.ko-KR.md)

펜윅 트리는 원소 값의 갱신과 접두사 합 계산을 모두 `O(log n)`에 수행합니다. 원소 배열만 저장하면 합 계산이 느리고, 접두사 합 배열만 저장하면 갱신이 느린 문제를 절충합니다.

트리를 배열로 나타내고 각 위치에 특정 구간의 합을 저장합니다. 이 구현은 편의를 위해 크기 `n+1` 배열과 1부터 시작하는 인덱스를 사용합니다. 인덱스의 최하위 켜진 비트를 이용해 합을 모을 다음 위치나 갱신할 부모 위치로 이동할 수 있습니다.

두 접두사 합의 차로 구간 합을 구할 수 있습니다. 원문의 애니메이션은 `[1,2,3,4,5]`를 하나씩 삽입하며 트리를 만드는 과정을 보여 줍니다.

## 예제·수식·시각 자료

![펜윅 트리 (이진 인덱스 트리) 자료](https://www.geeksforgeeks.org/wp-content/uploads/BITSum.png)

![펜윅 트리 (이진 인덱스 트리) 자료](https://upload.wikimedia.org/wikipedia/commons/d/dc/BITDemo.gif)

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Fenwick_tree)
- [GeeksForGeeks](https://www.geeksforgeeks.org/binary-indexed-tree-or-fenwick-tree-2/)
- [YouTube](https://www.youtube.com/watch?v=CWDQJGaN1gY&index=18&t=0s&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
