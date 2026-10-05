# 깊이 우선 탐색 (DFS)

[English](README.md) | [한국어](README.ko-KR.md)

깊이 우선 탐색은 시작 정점에서 한 갈래를 가능한 깊이까지 따라간 뒤, 더 진행할 수 없으면 이전 분기점으로 돌아가 다른 갈래를 탐색합니다.

재귀 호출이나 스택으로 돌아갈 위치를 기억할 수 있습니다. 그래프에서는 방문한 정점을 기록하여 사이클 때문에 무한히 탐색하거나 같은 정점을 중복 처리하는 일을 방지합니다. BFS는 같은 거리의 이웃부터 탐색하지만 DFS는 한 경로를 먼저 깊게 탐색합니다.

## 예제·수식·시각 자료

![깊이 우선 탐색 (DFS) 자료](https://upload.wikimedia.org/wikipedia/commons/7/7f/Depth-First-Search.gif)

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Depth-first_search)
- [Tree Traversals (Inorder, Preorder and Postorder)](https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/)
- [BFS vs DFS](https://www.geeksforgeeks.org/bfs-vs-dfs-binary-tree/)
- [DFS Visualization](https://www.cs.usfca.edu/~galles/visualization/DFS.html)
