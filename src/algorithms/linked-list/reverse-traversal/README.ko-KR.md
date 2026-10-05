# 연결 리스트 역순 순회

[English](README.md) | [한국어](README.ko-KR.md)

연결 리스트의 값들을 꼬리 쪽부터 머리 쪽 순서로 방문하는 문제입니다. 정방향 순회와 결과 순서가 반대이며 링크 자체를 뒤집는 작업과는 구분합니다.

단일 연결 리스트에서는 재귀로 다음 노드를 먼저 처리한 뒤 현재 값을 방문하거나, 스택에 기록한 값을 역순으로 꺼낼 수 있습니다. 각 노드를 한 번씩 처리하므로 시간은 `O(n)`이며 재귀나 스택에는 추가 공간이 필요합니다.

## 예제·수식·시각 자료

![연결 리스트 역순 순회 자료](https://upload.wikimedia.org/wikipedia/commons/6/6d/Singly-linked-list.svg)

```text
37 → 99 → 12
```

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Linked_list)
