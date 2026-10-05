# 정규 표현식 일치 검사

[English](README.md) | [한국어](README.ko-KR.md)

이 문제는 소문자 문자열 `s`가 패턴 `p`와 전체적으로 일치하는지 판단합니다. `.`은 임의의 문자 하나, `*`는 바로 앞 요소의 0회 이상 반복을 뜻합니다. 부분 문자열만 일치해서는 안 됩니다.

`aa`와 `a`는 전체 길이가 달라 불일치합니다. `aa`와 `a*`는 일치하고 `ab`와 `.*`도 일치합니다. `aab`와 `c*a*b`는 `c`를 0회, `a`를 2회, `b`를 1회 사용하므로 일치합니다.

`*`를 처리할 때 앞 요소를 사용하지 않는 경우와 현재 문자를 소비하고 반복을 계속하는 경우를 고려합니다. 빈 문자열과 빈 패턴도 경계 조건에 포함됩니다. 지원 문법은 `.`과 `*`로 제한되며 모든 JavaScript 정규 표현식 기능을 구현하는 문제는 아닙니다.

## 예제·수식·시각 자료

```
s = 'aa'
p = 'a'
```

```
s = 'aa'
p = 'a*'
```

```
s = 'ab'
p = '.*'
```

```
s = 'aab'
p = 'c*a*b'
```

## 구현과 참고 자료

- [YouTube](https://www.youtube.com/watch?v=l3hda49XcDE&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=71&t=0s)
- [LeetCode](https://leetcode.com/problems/regular-expression-matching/description/)
