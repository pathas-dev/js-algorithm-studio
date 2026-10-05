# 위상 정렬

[English](README.md) | [한국어](README.ko-KR.md)

위상 정렬은 방향 간선 `u→v`마다 `u`가 `v`보다 먼저 나오도록 정점들을 일렬로 배치합니다. 작업의 선행 조건이나 패키지 의존 관계를 표현하는 데 사용할 수 있습니다.

위상 순서가 존재하려면 그래프가 방향 비순환 그래프(DAG)여야 합니다. 사이클이 있으면 서로를 먼저 완료해야 하는 순환 의존성이 생깁니다. 같은 그래프에서도 여러 올바른 순서가 가능하며, 예시 그림의 `5, 7, 3, 11, 8, 2, 9, 10`과 `3, 5, 7, 8, 11, 2, 9, 10`은 모두 유효합니다.

인접 리스트를 사용한 표준 위상 정렬의 시간은 `O(|V|+|E|)`입니다. 간선이 선행 작업에서 후행 작업을 향하도록 정의하면 결과를 실행 순서로 사용할 수 있습니다.

## 예제·수식·시각 자료

![위상 정렬 자료](https://upload.wikimedia.org/wikipedia/commons/c/c6/Topological_Ordering.svg)

![위상 정렬 자료](https://upload.wikimedia.org/wikipedia/commons/0/03/Directed_acyclic_graph_2.svg)

## 구현과 참고 자료

- [directed acyclic graph](https://en.wikipedia.org/wiki/Directed_acyclic_graph)
- [Wikipedia](https://en.wikipedia.org/wiki/Topological_sorting)
- [Topological Sorting on YouTube by Tushar Roy](https://www.youtube.com/watch?v=ddTC4Zovtbc&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
