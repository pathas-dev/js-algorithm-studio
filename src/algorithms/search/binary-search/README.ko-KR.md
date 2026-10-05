# 이진 탐색

[English](README.md) | [한국어](README.ko-KR.md)

이진 탐색은 정렬된 배열에서 목표 값을 찾습니다. 현재 탐색 범위의 가운데 값과 목표를 비교하고, 목표가 있을 수 없는 절반을 버립니다. 이 과정을 반복하다 같으면 위치를 반환하고 범위가 비면 값이 없다고 판단합니다.

예를 들어 가운데 값이 목표보다 작으면 오른쪽 절반만 탐색합니다. 입력이 정렬되어 있어야 이 판단이 성립합니다. 매번 범위를 절반으로 줄이므로 시간 복잡도는 `O(log n)`입니다.

## 예제·수식·시각 자료

![이진 탐색 자료](https://upload.wikimedia.org/wikipedia/commons/8/83/Binary_Search_Depiction.svg)

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Binary_search_algorithm)
- [YouTube](https://www.youtube.com/watch?v=P3YID7liBug&index=29&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
