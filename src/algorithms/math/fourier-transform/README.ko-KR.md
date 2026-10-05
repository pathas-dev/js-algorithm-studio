# 푸리에 변환

[English](README.md) | [한국어](README.ko-KR.md)

푸리에 변환은 시간에 따라 변하는 신호를 구성 주파수로 분해합니다. 여러 음이 섞인 화음을 각 음의 진폭과 위상으로 나누는 것과 비슷합니다. 역변환은 주파수 성분을 다시 합쳐 신호를 복원합니다.

이산 푸리에 변환(DFT)은 등간격으로 얻은 `N`개의 표본을 같은 수의 복소수 주파수 계수로 바꿉니다. 이산시간 푸리에 변환(DTFT)은 이산 표본에 대한 연속적이고 주기적인 주파수 함수이며, DFT는 그 주파수 함수의 일정한 위치를 표본화한 결과로 해석할 수 있습니다.

고속 푸리에 변환(FFT)은 다른 변환 정의가 아니라 DFT와 역 DFT를 효율적으로 계산하는 알고리즘입니다. 직접 DFT는 `O(N²)`이고 FFT는 `O(N log N)`입니다.

복소 지수는 복소평면 위의 원운동으로 이해할 수 있습니다. 각 주파수에서 모든 시간 표본의 기여를 복소수로 더합니다. `n`은 표본 위치, `k`는 주파수 구간의 인덱스이며 실제 Hz 값은 표본화 주파수와 `N`에 의존합니다. 정규화 계수 `1/N`을 정변환이나 역변환 중 어디에 둘지는 정의에 따라 다르지만 두 변환의 조합은 일관되어야 합니다.

## 예제·수식·시각 자료

![푸리에 변환 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/1af0a78dc50bbf118ab6bd4c4dcc3c4ff8502223)

![푸리에 변환 자료](https://upload.wikimedia.org/wikipedia/commons/6/61/FFT-Time-Frequency-View.png)

![푸리에 변환 자료](https://upload.wikimedia.org/wikipedia/commons/6/64/FFT_of_Cosine_Summation_Function.png)

![푸리에 변환 자료](https://betterexplained.com/wp-content/plugins/wp-latexrender/pictures/45c088dbb767150fc0bacfeb49dd49e5.png)

![푸리에 변환 자료](https://betterexplained.com/wp-content/plugins/wp-latexrender/pictures/faeb9c5bf2e60add63ae4a70b293c7b4.png)

![푸리에 변환 자료](https://betterexplained.com/wp-content/uploads/euler/equal_paths.png)

![푸리에 변환 자료](https://betterexplained.com/wp-content/uploads/images/fourier-explained-20121219-224649.png)

![푸리에 변환 자료](https://betterexplained.com/wp-content/uploads/images/DerivedDFT.png)

## 구현과 참고 자료

- [An Interactive Guide To The Fourier Transform](https://betterexplained.com/articles/an-interactive-guide-to-the-fourier-transform/)
- [DFT on YouTube by Better Explained](https://www.youtube.com/watch?v=iN0VG9N2q0U&t=0s&index=77&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
- [FT on YouTube by 3Blue1Brown](https://www.youtube.com/watch?v=spUNpyF58BY&t=0s&index=76&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
- [FFT on YouTube by Simon Xu](https://www.youtube.com/watch?v=htCj9exbGo0&index=78&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&t=0s)
- [FT](https://en.wikipedia.org/wiki/Fourier_transform)
- [DFT](https://www.wikiwand.com/en/Discrete_Fourier_transform)
- [DTFT](https://en.wikipedia.org/wiki/Discrete-time_Fourier_transform)
- [FFT](https://www.wikiwand.com/en/Fast_Fourier_transform)
