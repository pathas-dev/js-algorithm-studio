# 유휘의 원주율 알고리즘

[English](README.md) | [한국어](README.ko-KR.md)

유휘의 알고리즘은 원에 내접하는 정다각형의 변 수를 반복해서 두 배로 늘리며 원주율을 근사합니다. 내접 정육각형에서 시작하여 12각형, 24각형 등으로 세분할수록 다각형과 원의 차이가 작아집니다.

기존 변 길이 `M`과 반지름 `r`로 직각삼각형을 만들고 피타고라스 정리를 적용하여 다음 다각형의 변 길이 `m`을 계산합니다. 예를 들어 `G=√(r²-(M/2)²)`, `j=r-G`, `m=√((M/2)²+j²)`입니다.

원 넓이와 원둘레의 관계는 `A=rC/2=πr²`입니다. 다각형의 넓이나 둘레를 반복적으로 계산해 원에 접근시킵니다. 원문은 96각형과 개선된 근사로 `π≈3.1416`을 얻은 역사적 설명 및 기하학적 유도를 담고 있습니다.

## 예제·수식·시각 자료

![유휘의 원주율 알고리즘 자료](https://upload.wikimedia.org/wikipedia/commons/6/69/Cutcircle2.svg)

![유휘의 원주율 알고리즘 자료](https://upload.wikimedia.org/wikipedia/commons/9/95/Cutcircle.svg)

![유휘의 원주율 알고리즘 자료](https://upload.wikimedia.org/wikipedia/commons/4/46/Liuhui_geyuanshu.svg)

![유휘의 원주율 알고리즘 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/dbfc192c78539c3901c7bad470302ededb76f813)

![유휘의 원주율 알고리즘 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/ccd12a402367c2d6614c88e75006d50bfc3a9929)

![유휘의 원주율 알고리즘 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/65d77869fc02c302d2d46d45f75ad7e79ae524fb)

![유휘의 원주율 알고리즘 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/a7a0d0d7f505a0f434e5dd80c2fef6d2b30d6100)

![유휘의 원주율 알고리즘 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/c31b9acf38f9d1a248d4023c3bf286bd03007f37)

![유휘의 원주율 알고리즘 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/0dee798efb0b1e3e64d6b3542106cb3ecaa4a383)

![유휘의 원주율 알고리즘 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/3ffeafe88d2983b364ad3442746063e3207fe842)

## 구현과 참고 자료

- [Gou Gu](https://en.wikipedia.org/wiki/Pythagorean_theorem)
- [Wikipedia](https://en.wikipedia.org/wiki/Liu_Hui%27s_%CF%80_algorithm)
