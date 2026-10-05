# 너비 우선 탐색 (BFS)

[English](README.md) | [한국어](README.ko-KR.md)

너비 우선 탐색은 시작 정점의 이웃부터 방문한 뒤 다음 거리의 정점들을 방문하는 그래프 탐색 방법입니다. 한 경로를 끝까지 내려가는 DFS와 달리 시작점에서 가까운 정점을 먼저 처리합니다.

큐에 시작 정점을 넣고, 앞에서 정점을 꺼내 방문한 다음 아직 방문하지 않은 이웃을 뒤에 넣는 과정을 반복합니다. 사이클이 있는 그래프에서는 방문 기록을 유지해 중복 탐색을 방지해야 합니다. 간선의 가중치가 모두 같을 때는 시작점에서 각 정점까지의 최소 간선 수를 찾는 데 활용할 수 있습니다.

## 예제·수식·시각 자료

![너비 우선 탐색 (BFS) 자료](https://upload.wikimedia.org/wikipedia/commons/5/5d/Breadth-First-Search-Algorithm.gif)

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Breadth-first_search)
- [Tree Traversals (Inorder, Preorder and Postorder)](https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/)
- [BFS vs DFS](https://www.geeksforgeeks.org/bfs-vs-dfs-binary-tree/)
- [BFS Visualization](https://www.cs.usfca.edu/~galles/visualization/BFS.html)
