# 나이트 투어

[English](README.md) | [한국어](README.ko-KR.md)

체스의 나이트가 보드의 모든 칸을 정확히 한 번씩 방문하는 이동 순서를 찾습니다. 나이트의 이동은 한 방향 두 칸과 수직 방향 한 칸의 조합입니다.

마지막 칸에서 한 번의 나이트 이동으로 시작 칸으로 돌아갈 수 있으면 닫힌 투어, 그렇지 않으면 열린 투어입니다. 보드 칸을 정점, 가능한 이동을 간선으로 보면 열린 투어는 해밀턴 경로, 닫힌 투어는 해밀턴 사이클의 한 예입니다.

일반적인 `8×8`뿐 아니라 다른 크기나 비정형 보드에서도 정의할 수 있습니다. 원문은 열린 투어와 `5×5` 보드의 애니메이션을 보여 줍니다.

## 예제·수식·시각 자료

![나이트 투어 자료](https://upload.wikimedia.org/wikipedia/commons/d/da/Knight%27s_tour_anim_2.gif)

![나이트 투어 자료](https://upload.wikimedia.org/wikipedia/commons/c/ca/Knights-Tour-Animation.gif)

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Knight%27s_tour)
- [GeeksForGeeks](https://www.geeksforgeeks.org/backtracking-set-1-the-knights-tour-problem/)
