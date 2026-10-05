# 라빈–카프 알고리즘

[English](README.md) | [한국어](README.ko-KR.md)

라빈–카프는 패턴과 텍스트 구간의 해시를 비교하여 문자열을 찾습니다. 해시가 다르면 문자열도 다르므로 실제 문자 비교를 생략할 수 있습니다. 해시가 같아도 충돌이 가능하므로 문자를 직접 비교해 일치를 확인해야 합니다.

창을 옮길 때 롤링 해시로 빠진 문자와 새 문자를 반영하면 각 구간의 해시를 처음부터 계산하는 비용을 줄입니다. 이 예제는 다항식 롤링 해시를 사용하며, 원문에서 언급하는 라빈 지문과는 다른 해시입니다.

원문은 텍스트 길이 `n`, 여러 패턴의 총길이 `m`, 패턴 수 `p`에 대해 최선·평균 시간 `O(n+m)`, 최악 `O(nm)`, 공간 `O(p)`를 제시합니다. 충돌과 실제 확인 비용이 성능에 영향을 줍니다. 다수 패턴 검색이나 표절 탐지에 활용할 수 있습니다.

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Rabin%E2%80%93Karp_algorithm)
- [YouTube](https://www.youtube.com/watch?v=H4VrKHVG5qI&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
