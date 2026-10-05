# 연결 리스트 순회

[English](README.md) | [한국어](README.ko-KR.md)

연결 리스트를 머리 노드부터 다음 노드 링크를 따라 정방향으로 방문합니다. 배열의 인덱스로 접근하는 대신 현재 노드의 다음 참조를 사용합니다.

각 노드를 정확히 한 번 방문하므로 노드 수가 `n`일 때 시간 복잡도는 `O(n)`입니다. 빈 리스트에서는 방문할 노드가 없습니다. 원문 그림과 예제는 방문되는 값의 순서를 보여 줍니다.

## 예제·수식·시각 자료

![연결 리스트 순회 자료](https://upload.wikimedia.org/wikipedia/commons/6/6d/Singly-linked-list.svg)

```text
12 → 99 → 37
```

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Linked_list)
