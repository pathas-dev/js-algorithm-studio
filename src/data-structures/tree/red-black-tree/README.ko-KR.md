# 레드–블랙 트리

[English](README.md) | [한국어](README.ko-KR.md)

레드–블랙 트리는 각 노드의 빨강·검정 색을 이용해 높이를 제한하는 균형 이진 탐색 트리입니다. 완전히 같은 높이의 하위 트리를 유지하지 않아도 검색·삽입·삭제를 최악 `O(log n)`에 수행할 수 있습니다.

각 노드는 빨강 또는 검정이고, 루트와 NIL 잎은 검정입니다. 빨간 노드의 두 자식은 검정이며, 한 노드에서 모든 자손 NIL 잎까지의 경로는 같은 수의 검정 노드를 포함합니다. 이 조건은 연속된 빨간 노드와 지나치게 긴 경로를 방지합니다.

삽입이나 삭제 뒤에는 재색칠과 회전으로 조건을 복구합니다. 원문은 삽입 시 삼촌 노드가 빨강인 경우와 검정인 경우, 그리고 왼쪽–왼쪽·왼쪽–오른쪽·오른쪽–오른쪽·오른쪽–왼쪽 배치를 그림으로 구분합니다.

## 예제·수식·시각 자료

![레드–블랙 트리 자료](https://upload.wikimedia.org/wikipedia/commons/6/66/Red-black_tree_example.svg)

![레드–블랙 트리 자료](https://www.geeksforgeeks.org/wp-content/uploads/redBlackCase2.png)

![레드–블랙 트리 자료](https://www.geeksforgeeks.org/wp-content/uploads/redBlackCase3a1.png)

![레드–블랙 트리 자료](https://www.geeksforgeeks.org/wp-content/uploads/redBlackCase3b.png)

![레드–블랙 트리 자료](https://www.geeksforgeeks.org/wp-content/uploads/redBlackCase3c.png)

![레드–블랙 트리 자료](https://www.geeksforgeeks.org/wp-content/uploads/redBlackCase3d.png)

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Red%E2%80%93black_tree)
- [Red Black Tree Insertion by Tushar Roy (YouTube)](https://www.youtube.com/watch?v=UaLIHuR1t8Q&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=63)
- [Red Black Tree Deletion by Tushar Roy (YouTube)](https://www.youtube.com/watch?v=CTvfzU_uNKE&t=0s&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=64)
- [Red Black Tree Insertion on GeeksForGeeks](https://www.geeksforgeeks.org/red-black-tree-set-2-insert/)
- [Red Black Tree Interactive Visualisations](https://www.cs.usfca.edu/~galles/visualization/RedBlack.html)
