# 점프 탐색

[English](README.md) | [한국어](README.ko-KR.md)

점프 탐색은 정렬된 배열을 일정한 크기의 블록으로 나누고, 블록 경계를 확인하며 목표가 들어갈 구간까지 건너뜁니다. 해당 구간을 찾으면 그 안에서 선형 탐색을 수행합니다.

블록 크기가 `m`이면 대략 `n/m`번의 점프와 최대 `m`번의 구간 탐색이 필요합니다. `m≈√n`으로 잡으면 시간은 `O(√n)`입니다. 점프 탐색은 모든 값을 읽는 선형 탐색보다 적게 비교하지만 정렬된 입력이 필요합니다.

## 구현과 참고 자료

- [GeeksForGeeks](https://www.geeksforgeeks.org/jump-search/)
- [Wikipedia](https://en.wikipedia.org/wiki/Jump_search)
