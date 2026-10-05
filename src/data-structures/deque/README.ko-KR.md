# 덱 (양방향 큐)

[English](README.md) | [한국어](README.ko-KR.md)

덱은 앞과 뒤 양쪽 끝에서 원소를 추가하거나 제거할 수 있는 선형 자료 구조입니다. 스택과 큐의 동작을 모두 표현할 수 있습니다.

이 구현은 기존 이중 연결 리스트를 사용하므로 `addFront`, `addBack`, `removeFront`, `removeBack`과 양쪽 조회가 `O(1)`입니다. `size`도 추가·제거할 때 원소 수를 갱신하므로 `O(1)`입니다. 전체 원소 저장에는 `O(n)` 공간이 필요합니다.

단조 덱을 사용하는 슬라이딩 윈도 최댓값·최솟값, 양 끝 문자 비교, 작업 훔치기 스케줄러 등에 유용합니다. 브라우저 기록이나 실행 취소·재실행 기능에는 덱 외에도 현재 위치 또는 별도 상태 관리가 필요합니다.

## 예제·수식·시각 자료

```
   addFront(3)             addBack(4)
        ↓                       ↓
    ┌───────┬───────┬───────┬───────┐
    │   3   │   1   │   2   │   4   │   ← internal doubly linked list
    └───────┴───────┴───────┴───────┘
        ↑                       ↑
  removeFront()           removeBack()
```

| 메서드          | 설명                                  | 시간 |
| --------------- | -------------------------------------------- | ---- |
| `addFront(v)`   | 원소 `v`를 앞에 삽입              | O(1) |
| `addBack(v)`    | 원소 `v`를 뒤에 삽입               | O(1) |
| `removeFront()` | 앞 원소를 제거하고 반환          | O(1) |
| `removeBack()`  | 뒤 원소를 제거하고 반환           | O(1) |
| `peekFront()`   | 앞 원소를 제거하지 않고 조회 | O(1) |
| `peekBack()`    | 뒤 원소를 제거하지 않고 조회  | O(1) |
| `isEmpty()`     | 비어 있으면 `true` 반환   | O(1) |
| `size`          | 원소 수 반환                | O(1) |

| 연산                    | 시간 |
| ---------------------------- | ---- |
| `addFront` / `addBack`       | O(1) |
| `removeFront` / `removeBack` | O(1) |
| `peekFront` / `peekBack`     | O(1) |
| `isEmpty` / `size`           | O(1) |
| 공간                        | O(n) |

## 구현과 참고 자료

- [`DoublyLinkedList`](../doubly-linked-list/README.ko-KR.md)
- [Deque — Wikipedia](https://en.wikipedia.org/wiki/Double-ended_queue)
- [Deque Data Structure — GeeksForGeeks](https://www.geeksforgeeks.org/deque-set-1-introduction-applications/)
- [▶ Deque (Double-Ended Queue) — YouTube](https://www.youtube.com/watch?v=pqg0SOPRlJ4)
- [▶ Sliding Window Maximum using Deque — YouTube](https://www.youtube.com/watch?v=2SXqBsTR6a8)
