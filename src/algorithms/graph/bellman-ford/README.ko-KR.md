# 벨만–포드 알고리즘

[English](README.md) | [한국어](README.ko-KR.md)

벨만–포드 알고리즘은 가중치가 있는 방향 그래프에서 시작 정점으로부터 다른 정점까지의 최단 거리를 계산합니다. 다익스트라보다 느릴 수 있지만 음수 가중치 간선도 다룰 수 있습니다. 도달 가능한 음수 사이클이 있으면 그 사이클을 거치는 최단 거리는 유한하게 정의되지 않습니다.

각 간선을 반복적으로 완화하여 더 짧은 경로를 거리 배열에 반영합니다. 정점 집합을 `V`, 간선 집합을 `E`라고 할 때 원문은 최악의 시간 `O(|V||E|)`, 조기 종료가 가능한 최선의 시간 `O(|E|)`, 추가 공간 `O(|V|)`를 제시합니다.

## 예제·수식·시각 자료

![벨만–포드 알고리즘 자료](https://upload.wikimedia.org/wikipedia/commons/2/2e/Shortest_path_Dijkstra_vs_BellmanFord.gif)

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Bellman%E2%80%93Ford_algorithm)
- [On YouTube by Michael Sambol](https://www.youtube.com/watch?v=obWXjtg0L64&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
