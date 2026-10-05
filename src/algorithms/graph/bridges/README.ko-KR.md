# 그래프의 단절 간선

[English](README.md) | [한국어](README.ko-KR.md)

무방향 그래프에서 간선을 제거했을 때 연결 요소 수가 증가하면 그 간선을 단절 간선 또는 브리지라고 합니다. 단절점이 정점의 제거를 다루는 데 비해 브리지는 간선의 제거를 다룹니다.

간선이 사이클에 포함되면 그 간선을 우회하는 경로가 있으므로 브리지가 아닙니다. 반대로 사이클에 포함되지 않는 간선은 브리지입니다. 원문의 첫 그림에서는 정점 16개 중 연결을 끊을 수 있는 6개의 간선을 빨간색으로 표시합니다.

## 예제·수식·시각 자료

![그래프의 단절 간선 자료](https://upload.wikimedia.org/wikipedia/commons/d/df/Graph_cut_edges.svg)

![그래프의 단절 간선 자료](https://upload.wikimedia.org/wikipedia/commons/b/bf/Undirected.svg)

![그래프의 단절 간선 자료](https://www.geeksforgeeks.org/wp-content/uploads/Bridge1.png)

![그래프의 단절 간선 자료](https://www.geeksforgeeks.org/wp-content/uploads/Bridge2.png)

![그래프의 단절 간선 자료](https://www.geeksforgeeks.org/wp-content/uploads/Bridge3.png)

## 구현과 참고 자료

- [GeeksForGeeks on YouTube](https://www.youtube.com/watch?v=thLQYBlz2DM&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
- [Wikipedia](https://en.wikipedia.org/wiki/Bridge_%28graph_theory%29#Tarjan.27s_Bridge-finding_algorithm)
- [GeeksForGeeks](https://www.geeksforgeeks.org/bridge-in-a-graph/)
