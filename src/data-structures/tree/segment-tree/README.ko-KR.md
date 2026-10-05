# 세그먼트 트리

[English](README.md) | [한국어](README.ko-KR.md)

세그먼트 트리는 배열의 구간 정보를 미리 모아 구간 최솟값·최댓값·합 등을 효율적으로 조회합니다. 루트는 배열 전체를, 각 자식은 해당 구간의 절반을 나타냅니다.

부모 값은 두 자식 값을 결합해 계산합니다. 조회 구간이 노드의 구간 전체를 포함하면 저장된 값을 바로 쓰고, 일부만 겹치면 자식으로 나눠 조회합니다. 적절한 결합 연산을 사용하는 표준 구간 조회의 시간은 `O(log n)`입니다.

이 구현에는 이항 함수를 전달할 수 있으며 테스트에서 `min`, `max`, `sum`을 사용합니다. 구간을 어떤 방식으로 나눠도 일관된 결과를 얻으려면 결합법칙과 범위 밖에 사용할 항등값을 고려해야 합니다.

원문은 생성 시간을 `O(n log n)`으로 설명하지만 자식을 한 번씩 결합하는 표준 구축은 `O(n)`입니다. 또한 세그먼트 트리가 일반적으로 수정 불가능하다는 뜻은 아니며, 이 저장소에서 제공하는 갱신 API 여부와 구분해야 합니다.

## 예제·수식·시각 자료

![세그먼트 트리 자료](https://www.geeksforgeeks.org/wp-content/uploads/RangeMinimumQuery.png)

![세그먼트 트리 자료](https://www.geeksforgeeks.org/wp-content/uploads/segment-tree1.png)

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Segment_tree)
- [YouTube](https://www.youtube.com/watch?v=ZBHKZF5w4YU&index=65&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
- [GeeksForGeeks](https://www.geeksforgeeks.org/segment-tree-set-1-sum-of-given-range/)
