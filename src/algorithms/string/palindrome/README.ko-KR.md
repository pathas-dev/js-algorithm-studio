# 회문 검사

[English](README.md) | [한국어](README.ko-KR.md)

회문은 앞에서 읽어도 뒤에서 읽어도 같은 문자열입니다. 양 끝 문자를 비교한 뒤 안쪽으로 이동하면서 모든 대응 문자가 같은지 확인할 수 있습니다. 한 쌍이라도 다르면 회문이 아닙니다.

문자열의 뒤쪽 절반은 앞쪽 절반을 뒤집은 모양입니다. 원문 예제의 대소문자·공백 등은 실제 입력의 일부이므로, 이를 무시할지는 별도의 규칙으로 정해야 합니다. 여기서는 주어진 문자열 자체의 대칭 여부를 다룹니다.

## 예제·수식·시각 자료

```
- "a"
- "pop"     ->  p + o + p
- "deed"    ->  de + ed
- "kayak"   ->  ka + y + ak
- "racecar" ->  rac + e + car
```

```
- "rad"
- "dodo"
- "polo"
```

## 구현과 참고 자료

- [Palindrome](https://en.wikipedia.org/wiki/Palindrome)
- [GeeksForGeeks - Check if a number is Palindrome](https://www.geeksforgeeks.org/check-if-a-number-is-palindrome/)
