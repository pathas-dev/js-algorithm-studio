# 시저 암호

[English](README.md) | [한국어](README.ko-KR.md)

시저 암호는 알파벳의 각 문자를 일정한 칸 수만큼 이동한 문자로 바꾸는 치환 암호입니다. 이동량이 암호 키이며, 알파벳 끝을 넘으면 처음으로 돌아갑니다. 왼쪽으로 3칸 이동하면 `D`는 `A`, `E`는 `B`가 됩니다.

암호화할 때 원래 알파벳과 이동한 알파벳을 나란히 놓고 대응하는 문자를 선택합니다. 복호화는 반대 방향으로 같은 칸 수를 이동합니다. 원문 예제의 `THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG`는 `QEB NRFZH YOLTK CLU GRJMP LSBO QEB IXWV ALD`로 바뀝니다.

입력 길이가 `n`일 때 시간과 결과 문자열 공간은 `O(n)`입니다.

## 예제·수식·시각 자료

![시저 암호 자료](https://upload.wikimedia.org/wikipedia/commons/4/4a/Caesar_cipher_left_shift_of_3.svg)

```text
Plain:    ABCDEFGHIJKLMNOPQRSTUVWXYZ
Cipher:   XYZABCDEFGHIJKLMNOPQRSTUVW
```

```text
Plaintext:  THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG
Ciphertext: QEB NRFZH YOLTK CLU GRJMP LSBO QEB IXWV ALD
```

## 구현과 참고 자료

- [Caesar cipher on Wikipedia](https://en.wikipedia.org/wiki/Caesar_cipher)
