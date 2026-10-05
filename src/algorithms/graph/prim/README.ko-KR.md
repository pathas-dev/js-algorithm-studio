# 프림 알고리즘

[English](README.md) | [한국어](README.ko-KR.md)

프림 알고리즘은 가중치가 있는 연결된 무방향 그래프의 최소 신장 트리를 구하는 탐욕 알고리즘입니다. 임의의 정점에서 시작해 현재 트리와 트리 밖의 정점을 연결하는 간선 중 가장 가벼운 것을 반복해서 추가합니다.

최소 신장 트리는 모든 정점을 연결하고 사이클이 없으며 간선 가중치의 합이 최소인 트리입니다. 이미 트리 안에 있는 두 정점을 연결하는 간선은 후보에서 제외합니다. 같은 가중치의 후보가 여러 개라면 선택에 따라 서로 다른 최소 신장 트리가 나올 수 있습니다.

연결되지 않은 그래프에는 전체를 잇는 하나의 신장 트리가 없습니다. 각 연결 요소의 최소 신장 트리를 모으면 최소 신장 숲이 됩니다.

## 예제·수식·시각 자료

![프림 알고리즘 자료](https://upload.wikimedia.org/wikipedia/commons/f/f7/Prim%27s_algorithm.svg)

![프림 알고리즘 자료](https://upload.wikimedia.org/wikipedia/commons/d/d2/Minimum_spanning_tree.svg)

![프림 알고리즘 자료](https://upload.wikimedia.org/wikipedia/commons/c/c9/Multiple_minimum_spanning_trees.svg)

## 구현과 참고 자료

- [Minimum Spanning Tree on Wikipedia](https://en.wikipedia.org/wiki/Minimum_spanning_tree)
- [Prim's Algorithm on Wikipedia](https://en.wikipedia.org/wiki/Prim%27s_algorithm)
- [Prim's Algorithm on YouTube by Tushar Roy](https://www.youtube.com/watch?v=oP2-8ysT3QQ&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
- [Prim's Algorithm on YouTube by Michael Sambol](https://www.youtube.com/watch?v=cplfcGZmX7I&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)


## 구현 참고

선택적인 두 번째 `stepCallback` 인수로 간선 선택을 기록할 수 있습니다. 이 구현은 그래프 내부 순서의 첫 정점에서 시작하여 도달 가능한 성분의 트리를 반환합니다. 다른 성분은 이 트리에 포함되지 않습니다.
