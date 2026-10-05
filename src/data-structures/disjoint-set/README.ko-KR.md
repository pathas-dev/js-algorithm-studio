# 서로소 집합

[English](README.md) | [한국어](README.ko-KR.md)

서로소 집합은 원소들을 겹치지 않는 여러 부분집합으로 관리합니다. 새 집합 만들기, 두 집합 합치기(Union), 대표 원소 찾기(Find)를 제공하고 대표를 비교해 같은 집합인지 확인합니다.

경로 압축과 크기·랭크 기준 합치기를 사용하는 표준 구현에서는 연산의 상각 시간이 역 아커만 함수로 제한되어 사실상 상수에 가깝습니다. 이 성능을 모든 단순 구현에 그대로 적용하면 안 됩니다.

그래프의 연결 관계 관리와 크루스칼 최소 신장 트리 알고리즘에 활용됩니다. 원문은 일반 구현과 외부 의존성이 없는 간단한 구현을 함께 소개합니다.

## 예제·수식·시각 자료

![서로소 집합 자료](https://upload.wikimedia.org/wikipedia/commons/6/67/Dsu_disjoint_sets_init.svg)

![서로소 집합 자료](https://upload.wikimedia.org/wikipedia/commons/a/ac/Dsu_disjoint_sets_final.svg)

## 구현과 참고 자료

- [DisjointSet.js](./DisjointSet.js)
- [DisjointSetAdhoc.js](./DisjointSetAdhoc.js)
- [Wikipedia](https://en.wikipedia.org/wiki/Disjoint-set_data_structure)
- [By Abdul Bari on YouTube](https://www.youtube.com/watch?v=wU6udHRIkcc&index=14&t=0s&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
