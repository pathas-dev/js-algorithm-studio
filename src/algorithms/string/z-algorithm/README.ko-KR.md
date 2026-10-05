# Z 알고리즘

[English](README.md) | [한국어](README.ko-KR.md)

Z 알고리즘은 문자열의 각 위치에서 시작하는 부분 문자열이 전체 문자열의 접두사와 얼마나 길게 일치하는지 계산합니다. 결과 배열의 `Z[i]`는 그 일치 길이입니다.

패턴 `W`, 두 입력에 없는 구분 문자, 텍스트 `T`를 이어 붙여 Z 배열을 구하면 패턴 길이와 같은 값이 나타나는 텍스트 위치에서 패턴을 찾을 수 있습니다. 이미 접두사와 일치한 구간 `[L,R]`을 유지하고 그 정보를 재사용하여 중복 비교를 줄입니다.

이 구현은 구분자로 고유한 `Symbol` 토큰을 사용하므로 `$`를 포함한 모든 입력 문자와 충돌하지 않습니다. 겹치는 일치 위치도 모두 반환하며, 빈 패턴은 `0`부터 텍스트 길이까지 모든 경계 위치를 반환합니다. 인덱스는 JavaScript의 UTF-16 코드 단위 기준입니다.

패턴 탐색 시간은 `O(|W|+|T|)`입니다. 원문은 공간을 `O(|W|)`로 제시하지만, 연결 문자열 전체의 Z 배열을 저장하는 구현에서는 `O(|W|+|T|)` 공간이 필요합니다. 실제 저장 방식과 원문 표의 가정을 구분해야 합니다.

## 예제·수식·시각 자료

```
Index            0   1   2   3   4   5   6   7   8   9  10  11
Text             a   a   b   c   a   a   b   x   a   a   a   z
Z values         X   1   0   0   3   1   0   0   2   2   1   0
```

```
str =  a a a a a a
Z[] =  x 5 4 3 2 1
```

```
str =  a a b a a c d
Z[] =  x 1 0 2 1 0 0
```

```
str =  a b a b a b a b
Z[] =  x 0 6 0 4 0 2 0
```

![Z 알고리즘 자료](https://ivanyu.me/wp-content/uploads/2014/09/zalg1.png)

## 구현과 참고 자료

- [GeeksForGeeks](https://www.geeksforgeeks.org/z-algorithm-linear-time-pattern-searching-algorithm/)
- [YouTube](https://www.youtube.com/watch?v=CpZh4eF8QBw&t=0s&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=70)
- [Z Algorithm by Ivan Yurchenko](https://ivanyu.me/blog/2013/10/15/z-algorithm/)
