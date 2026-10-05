# AVL 트리

[English](README.md) | [한국어](README.ko-KR.md)

AVL 트리는 각 노드의 왼쪽·오른쪽 하위 트리 높이 차가 최대 1인 균형 이진 탐색 트리입니다. 삽입이나 삭제로 이 조건을 벗어나면 회전으로 복구합니다.

왼쪽–왼쪽과 오른쪽–오른쪽 불균형은 단일 회전으로, 왼쪽–오른쪽과 오른쪽–왼쪽 불균형은 이중 회전으로 처리합니다. 회전은 이진 탐색 트리의 원소 순서를 유지하면서 높이를 조정합니다.

노드가 `n`개일 때 검색·삽입·삭제 시간은 평균과 최악 모두 `O(log n)`입니다. 원문의 애니메이션과 초록색 균형 인수는 삽입 중 회전과 높이 차를 보여 줍니다.

## 예제·수식·시각 자료

![AVL 트리 자료](https://upload.wikimedia.org/wikipedia/commons/f/fd/AVL_Tree_Example.gif)

![AVL 트리 자료](https://upload.wikimedia.org/wikipedia/commons/a/ad/AVL-tree-wBalance_K.svg)

![AVL 트리 자료](http://btechsmartclass.com/data_structures/ds_images/LL%20Rotation.png)

![AVL 트리 자료](http://btechsmartclass.com/data_structures/ds_images/RR%20Rotation.png)

![AVL 트리 자료](http://btechsmartclass.com/data_structures/ds_images/LR%20Rotation.png)

![AVL 트리 자료](http://btechsmartclass.com/data_structures/ds_images/RL%20Rotation.png)

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/AVL_tree)
- [Tutorials Point](https://www.tutorialspoint.com/data_structures_algorithms/avl_tree_algorithm.htm)
- [BTech](http://btechsmartclass.com/data_structures/avl-trees.html)
- [AVL Tree Insertion on YouTube](https://www.youtube.com/watch?v=rbg7Qf8GkQ4&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=12&)
- [AVL Tree Interactive Visualisations](https://www.cs.usfca.edu/~galles/visualization/AVLtree.html)
