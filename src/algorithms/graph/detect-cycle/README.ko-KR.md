# 그래프의 사이클 탐지

[English](README.md) | [한국어](README.ko-KR.md)

사이클은 간선을 따라 출발 정점으로 돌아올 수 있는 경로입니다. 닫힌 보행은 시작점과 끝점이 같으며 정점이나 간선을 반복할 수 있습니다. 단순 사이클은 시작점과 끝점의 중복을 제외하면 정점과 간선을 반복하지 않습니다. 방향 그래프에서는 간선 방향을 따라야 합니다.

무방향 그래프의 DFS에서는 이미 방문한 이웃이 현재 정점의 부모가 아닌지 확인합니다. 방향 그래프에서는 현재 탐색 경로에 있는 정점으로 돌아가는 간선을 구분해야 합니다. 방문했다는 사실만으로 방향 사이클을 판정하면 다른 갈래의 정상적인 간선도 잘못 처리할 수 있습니다.

원문의 그림에서 초록색 `H-A-B`는 경로, 파란색 `B-D-E-F-D-C-B`는 정점을 반복하는 닫힌 보행, 빨간색 `H-D-G-H`는 단순 사이클입니다.

## 예제·수식·시각 자료

![그래프의 사이클 탐지 자료](https://upload.wikimedia.org/wikipedia/commons/e/e7/Graph_cycle.gif)

![그래프의 사이클 탐지 자료](https://www.geeksforgeeks.org/wp-content/uploads/cycleGraph.png)

![그래프의 사이클 탐지 자료](https://cdncontribute.geeksforgeeks.org/wp-content/uploads/cycle.png)

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Cycle_(graph_theory))
- [Detect Cycle in Undirected Graph on GeeksForGeeks](https://www.geeksforgeeks.org/detect-cycle-undirected-graph/)
- [Detect Cycle in Undirected Graph Algorithm on YouTube](https://www.youtube.com/watch?v=n_t0a_8H8VY&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
- [Detect Cycle in Directed Graph on GeeksForGeeks](https://www.geeksforgeeks.org/detect-cycle-in-a-graph/)
- [Detect Cycle in Directed Graph Algorithm on YouTube](https://www.youtube.com/watch?v=rKQaZuoUR4M&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
