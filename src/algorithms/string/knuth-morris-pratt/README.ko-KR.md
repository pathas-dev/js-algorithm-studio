# 커누스–모리스–프랫 탐색 (KMP)

[English](README.md) | [한국어](README.ko-KR.md)

KMP는 텍스트 `T` 안에서 패턴 `W`를 찾는 문자열 탐색 알고리즘입니다. 불일치가 발생해도 앞서 일치한 문자들을 처음부터 다시 비교하지 않습니다.

패턴의 접두사와 접미사에 관한 정보를 미리 계산하고, 불일치 시 그 정보로 다음 비교 위치를 결정합니다. 패턴 전처리와 텍스트 탐색을 합한 시간은 `O(|W|+|T|)`, 패턴 보조 배열 공간은 `O(|W|)`입니다.

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm)
- [YouTube](https://www.youtube.com/watch?v=GTJr8OvyEVQ&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
