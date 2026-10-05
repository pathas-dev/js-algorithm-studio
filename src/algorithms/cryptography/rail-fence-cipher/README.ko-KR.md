# 레일 펜스 암호

[English](README.md) | [한국어](README.ko-KR.md)

레일 펜스 암호는 문자의 위치를 바꾸는 전치 암호입니다. 여러 줄의 레일 위에 메시지를 위에서 아래로, 다시 아래에서 위로 지그재그로 배치합니다. 마지막 레일과 첫 레일에서 진행 방향을 바꾸며, 암호문은 각 레일의 문자를 위쪽 레일부터 순서대로 이어 붙인 결과입니다.

원문의 3개 레일 예제에서 `WE ARE DISCOVERED. FLEE AT ONCE`를 배치하면 `WECRLTEERDSOEEFEAOCAIVDEN`이 됩니다. 복호화는 동일한 지그재그 경로에서 각 레일이 차지할 위치를 먼저 계산하고, 암호문으로 레일을 채운 다음 경로 순서대로 읽습니다.

## 예제·수식·시각 자료

```
W . . . E . . . C . . . R . . . L . . . T . . . E
. E . R . D . S . O . E . E . F . E . A . O . C .
. . A . . . I . . . V . . . D . . . E . . . N . .
-------------------------------------------------
             WECRLTEERDSOEEFEAOCAIVDEN
```

```
W . . . E . . . C . . . R . . . L . . . T . . . E
. - . - . - . - . - . - . - . - . - . - . - . - .
. . - . . . - . . . - . . . - . . . - . . . - . .
```

## 구현과 참고 자료

- [transposition cipher](https://en.wikipedia.org/wiki/Transposition_cipher)
- [wikipedia](https://en.wikipedia.org/wiki/Rail_fence_cipher)
- [Rail Fence Cipher on Wikipedia](https://en.wikipedia.org/wiki/Rail_fence_cipher)
- [Rail Fence Cipher Calculator](https://crypto.interactive-maths.com/rail-fence-cipher.html)
