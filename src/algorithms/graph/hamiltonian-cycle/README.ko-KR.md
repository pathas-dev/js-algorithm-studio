# 해밀턴 경로와 사이클

[English](README.md) | [한국어](README.ko-KR.md)

해밀턴 경로는 모든 정점을 정확히 한 번씩 방문합니다. 마지막 정점이 시작 정점과 연결되어 돌아오면 해밀턴 사이클입니다. 간선마다 한 번씩 지나는 오일러 경로와 구분해야 합니다.

단순한 완전 탐색은 정점 순서 `n!`개를 모두 검사합니다. 백트래킹은 시작 정점을 경로에 넣고, 현재 정점과 인접하면서 아직 경로에 없는 정점만 추가합니다. 더 추가할 수 없으면 되돌아가 다른 선택을 시도합니다. 모든 정점을 추가한 뒤 시작점으로 돌아갈 간선도 확인해야 사이클이 됩니다.

## 예제·수식·시각 자료

![해밀턴 경로와 사이클 자료](https://upload.wikimedia.org/wikipedia/commons/6/6c/Hamiltonian_path_3d.svg)

```
while there are untried configurations
{
   generate the next configuration
   if ( there are edges between two consecutive vertices of this
      configuration and there is an edge from the last vertex to
      the first ).
   {
      print this configuration;
      break;
   }
}
```

## 구현과 참고 자료

- [Hamiltonian path on Wikipedia](https://en.wikipedia.org/wiki/Hamiltonian_path)
- [Hamiltonian path on YouTube](https://www.youtube.com/watch?v=dQr4wZCiJJ4&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
- [Hamiltonian cycle on GeeksForGeeks](https://www.geeksforgeeks.org/backtracking-set-7-hamiltonian-cycle/)
