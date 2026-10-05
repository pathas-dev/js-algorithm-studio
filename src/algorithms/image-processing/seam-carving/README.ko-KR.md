# 내용을 보존하는 이미지 크기 조절 (심 카빙)

[English](README.md) | [한국어](README.ko-KR.md)

심 카빙은 중요한 물체의 비율을 유지하면서 이미지의 가로·세로 크기를 줄이는 방법입니다. 단순 축소는 모든 부분을 같은 비율로 압축하지만, 심 카빙은 내용에 기여가 적은 픽셀 경로를 찾아 제거합니다.

### 픽셀 에너지와 에너지 지도
주변 픽셀과 색이 크게 다른 픽셀은 경계에 있을 가능성이 커 중요도가 높다고 봅니다. 원문은 가운데 픽셀과 좌우 이웃의 RGB 차이를 이용해 에너지를 구합니다. 좌우 경계에서는 없는 이웃을 생략합니다. 모든 픽셀의 에너지를 모으면 이미지와 같은 크기의 에너지 지도가 됩니다.

에너지가 밝게 표시된 위치는 보존할 경계, 어두운 위치는 제거 후보입니다. 모든 픽셀이 중요한 경계처럼 보이는 이미지에서는 물체와 배경을 구분하기 어려워 결과가 왜곡될 수 있습니다.

### 최소 에너지 심 찾기
세로 심은 위에서 아래까지 연결된 픽셀 경로이며 다음 행의 왼쪽 아래·바로 아래·오른쪽 아래로 이동할 수 있습니다. 모든 경로를 검사하면 폭 `w`, 높이 `h`에서 `O(w×3^h)`입니다. 매번 가장 낮은 이웃만 고르는 탐욕 방식은 빠르지만 전체 에너지의 최솟값을 보장하지 않습니다.

동적 계획법은 각 픽셀까지 도달하는 최소 누적 에너지를 저장합니다. 현재 값은 자신의 에너지와 이전 행의 인접 세 칸 중 최소 누적 에너지의 합입니다. 첫 행에서 시작해 표를 채운 뒤 마지막 행의 최솟값을 선택합니다. 이전 픽셀의 좌표도 기록하면 아래에서 위로 경로를 복원할 수 있습니다. 한 심을 찾는 시간은 `O(wh)`입니다.

### 제거와 반복
찾은 심의 각 픽셀 오른쪽을 한 칸씩 왼쪽으로 이동하면 이미지 폭이 1 줄어듭니다. 원문의 구현은 마지막 열을 실제로 삭제하지 않고 새 폭 밖의 픽셀을 렌더링하지 않습니다. 원하는 폭이 될 때까지 에너지 계산·경로 탐색·제거를 반복합니다.

브라우저의 `ImageData`는 RGBA를 1차원 `Uint8ClampedArray`에 저장하므로 좌표와 배열 위치를 바꾸는 보조 함수가 필요합니다. 아래 TypeScript 코드는 자료형·픽셀 접근·에너지 계산·동적 계획법·제거 과정을 보여 줍니다. 전체 지도를 매번 다시 계산하는 대신 제거된 심 주변의 에너지만 갱신하는 최적화도 가능합니다.

### 높이 변경과 물체 제거
높이를 줄일 때는 위아래 이웃으로 에너지를 계산하고 왼쪽에서 오른쪽으로 심을 찾습니다. 특정 영역의 에너지를 인위적으로 낮추면 그 영역을 먼저 제거할 수 있으며, 원문은 알파 채널을 마스크로 사용해 물체 제거를 설명합니다.

이미지 확대, 물체 제거 뒤 원래 크기로 복원하기, 실시간 처리도 확장 방향이지만 원문의 예제는 실험용 축소 구현입니다. 동작 예제와 코드·수식·이미지 출처는 아래 자료와 영문 설명에 보존했습니다.

## 예제·수식·시각 자료

![내용을 보존하는 이미지 크기 조절 (심 카빙) 자료](https://raw.githubusercontent.com/trekhleb/trekhleb.github.io/master/src/posts/2021/content-aware-image-resizing-in-javascript/assets/01-cover-02.png)

![내용을 보존하는 이미지 크기 조절 (심 카빙) 자료](https://raw.githubusercontent.com/trekhleb/trekhleb.github.io/master/src/posts/2021/content-aware-image-resizing-in-javascript/assets/01-resizing-options.png)

![내용을 보존하는 이미지 크기 조절 (심 카빙) 자료](https://raw.githubusercontent.com/trekhleb/trekhleb.github.io/master/src/posts/2021/content-aware-image-resizing-in-javascript/assets/10-demo-01.gif)

![내용을 보존하는 이미지 크기 조절 (심 카빙) 자료](https://raw.githubusercontent.com/trekhleb/trekhleb.github.io/master/src/posts/2021/content-aware-image-resizing-in-javascript/assets/10-demo-02.gif)

![내용을 보존하는 이미지 크기 조절 (심 카빙) 자료](https://raw.githubusercontent.com/trekhleb/trekhleb.github.io/master/src/posts/2021/content-aware-image-resizing-in-javascript/assets/11-demo-01.png)

![내용을 보존하는 이미지 크기 조절 (심 카빙) 자료](https://raw.githubusercontent.com/trekhleb/trekhleb.github.io/master/src/posts/2021/content-aware-image-resizing-in-javascript/assets/11-demo-02.png)

![내용을 보존하는 이미지 크기 조절 (심 카빙) 자료](https://raw.githubusercontent.com/trekhleb/trekhleb.github.io/master/src/posts/2021/content-aware-image-resizing-in-javascript/assets/12-demo-01.png)

![내용을 보존하는 이미지 크기 조절 (심 카빙) 자료](https://raw.githubusercontent.com/trekhleb/trekhleb.github.io/master/src/posts/2021/content-aware-image-resizing-in-javascript/assets/30-pixel-energy-comparison.png)

![내용을 보존하는 이미지 크기 조절 (심 카빙) 자료](https://raw.githubusercontent.com/trekhleb/trekhleb.github.io/master/src/posts/2021/content-aware-image-resizing-in-javascript/assets/20-energy-formula.png)

![내용을 보존하는 이미지 크기 조절 (심 카빙) 자료](https://raw.githubusercontent.com/trekhleb/trekhleb.github.io/master/src/posts/2021/content-aware-image-resizing-in-javascript/assets/30-pixel-energy-calculation-example.png)

![내용을 보존하는 이미지 크기 조절 (심 카빙) 자료](https://raw.githubusercontent.com/trekhleb/trekhleb.github.io/master/src/posts/2021/content-aware-image-resizing-in-javascript/assets/30-energy-map-padding.png)

![내용을 보존하는 이미지 크기 조절 (심 카빙) 자료](https://raw.githubusercontent.com/trekhleb/trekhleb.github.io/master/src/posts/2021/content-aware-image-resizing-in-javascript/assets/40-energy-map.png)

![내용을 보존하는 이미지 크기 조절 (심 카빙) 자료](https://raw.githubusercontent.com/trekhleb/trekhleb.github.io/master/src/posts/2021/content-aware-image-resizing-in-javascript/assets/41-seam-search.png)

![내용을 보존하는 이미지 크기 조절 (심 카빙) 자료](https://raw.githubusercontent.com/trekhleb/trekhleb.github.io/master/src/posts/2021/content-aware-image-resizing-in-javascript/assets/40-energy-map-with-seam.png)

```typescript
// Type that describes the image size (width and height).
type ImageSize = { w: number, h: number };

// The coordinate of the pixel.
type Coordinate = { x: number, y: number };

// The seam is a sequence of pixels (coordinates).
type Seam = Coordinate[];

// Energy map is a 2D array that has the same width and height
// as the image the map is being calculated for.
type EnergyMap = number[][];

// Type that describes the image pixel's RGBA color.
type Color = [
  r: number, // Red
  g: number, // Green
  b: number, // Blue
  a: number, // Alpha (transparency)
] | Uint8ClampedArray;
```

```typescript
type ResizeImageWidthArgs = {
  img: ImageData, // Image data we want to resize.
  toWidth: number, // Final image width we want the image to shrink to.
};

type ResizeImageWidthResult = {
  img: ImageData, // Resized image data.
  size: ImageSize, // Resized image size (w x h).
};

// Performs the content-aware image width resizing using the seam carving method.
export const resizeImageWidth = (
  { img, toWidth }: ResizeImageWidthArgs,
): ResizeImageWidthResult => {
  // For performance reasons we want to avoid changing the img data array size.
  // Instead we'll just keep the record of the resized image width and height separately.
  const size: ImageSize = { w: img.width, h: img.height };

  // Calculating the number of pixels to remove.
  const pxToRemove = img.width - toWidth;
  if (pxToRemove < 0) {
    throw new Error('Upsizing is not supported for now');
  }

  let energyMap: EnergyMap | null = null;
  let seam: Seam | null = null;

  // Removing the lowest energy seams one by one.
  for (let i = 0; i < pxToRemove; i += 1) {
    // 1. Calculate the energy map for the current version of the image.
    energyMap = calculateEnergyMap(img, size);

    // 2. Find the seam with the lowest energy based on the energy map.
    seam = findLowEnergySeam(energyMap, size);

    // 3. Delete the seam with the lowest energy seam from the image.
    deleteSeam(img, seam, size);

    // Reduce the image width, and continue iterations.
    size.w -= 1;
  }

  // Returning the resized image and its final size.
  // The img is actually a reference to the ImageData, so technically
  // the caller of the function already has this pointer. But let's
  // still return it for better code readability.
  return { img, size };
};
```

```javascript
const ctx = canvas.getContext('2d');
const imgData = ctx.getImageData(0, 0, imgWidth, imgHeight);
```

```typescript
// Calculates the energy of a pixel.
const getPixelEnergy = (left: Color | null, middle: Color, right: Color | null): number => {
  // Middle pixel is the pixel we're calculating the energy for.
  const [mR, mG, mB] = middle;

  // Energy from the left pixel (if it exists).
  let lEnergy = 0;
  if (left) {
    const [lR, lG, lB] = left;
    lEnergy = (lR - mR) ** 2 + (lG - mG) ** 2 + (lB - mB) ** 2;
  }

  // Energy from the right pixel (if it exists).
  let rEnergy = 0;
  if (right) {
    const [rR, rG, rB] = right;
    rEnergy = (rR - mR) ** 2 + (rG - mG) ** 2 + (rB - mB) ** 2;
  }

  // Resulting pixel energy.
  return Math.sqrt(lEnergy + rEnergy);
};
```

```typescript
// Helper function that returns the color of the pixel.
const getPixel = (img: ImageData, { x, y }: Coordinate): Color => {
  // The ImageData data array is a flat 1D array.
  // Thus we need to convert x and y coordinates to the linear index.
  const i = y * img.width + x;
  const cellsPerColor = 4; // RGBA
  // For better efficiency, instead of creating a new sub-array we return
  // a pointer to the part of the ImageData array.
  return img.data.subarray(i * cellsPerColor, i * cellsPerColor + cellsPerColor);
};

// Helper function that sets the color of the pixel.
const setPixel = (img: ImageData, { x, y }: Coordinate, color: Color): void => {
  // The ImageData data array is a flat 1D array.
  // Thus we need to convert x and y coordinates to the linear index.
  const i = y * img.width + x;
  const cellsPerColor = 4; // RGBA
  img.data.set(color, i * cellsPerColor);
};
```

```typescript
// Helper function that creates a matrix (2D array) of specific
// size (w x h) and fills it with specified value.
const matrix = <T>(w: number, h: number, filler: T): T[][] => {
  return new Array(h)
    .fill(null)
    .map(() => {
      return new Array(w).fill(filler);
    });
};

// Calculates the energy of each pixel of the image.
const calculateEnergyMap = (img: ImageData, { w, h }: ImageSize): EnergyMap => {
  // Create an empty energy map where each pixel has infinitely high energy.
  // We will update the energy of each pixel.
  const energyMap: number[][] = matrix<number>(w, h, Infinity);
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      // Left pixel might not exist if we're on the very left edge of the image.
      const left = (x - 1) >= 0 ? getPixel(img, { x: x - 1, y }) : null;
      // The color of the middle pixel that we're calculating the energy for.
      const middle = getPixel(img, { x, y });
      // Right pixel might not exist if we're on the very right edge of the image.
      const right = (x + 1) < w ? getPixel(img, { x: x + 1, y }) : null;
      energyMap[y][x] = getPixelEnergy(left, middle, right);
    }
  }
  return energyMap;
};
```

![내용을 보존하는 이미지 크기 조절 (심 카빙) 자료](https://raw.githubusercontent.com/trekhleb/trekhleb.github.io/master/src/posts/2021/content-aware-image-resizing-in-javascript/assets/50-naive-approach.png)

![내용을 보존하는 이미지 크기 조절 (심 카빙) 자료](https://raw.githubusercontent.com/trekhleb/trekhleb.github.io/master/src/posts/2021/content-aware-image-resizing-in-javascript/assets/51-greedy-approach.png)

![내용을 보존하는 이미지 크기 조절 (심 카빙) 자료](https://raw.githubusercontent.com/trekhleb/trekhleb.github.io/master/src/posts/2021/content-aware-image-resizing-in-javascript/assets/52-dp-repeated-problems.png)

![내용을 보존하는 이미지 크기 조절 (심 카빙) 자료](https://raw.githubusercontent.com/trekhleb/trekhleb.github.io/master/src/posts/2021/content-aware-image-resizing-in-javascript/assets/53-dp-what-to-choose.png)

![내용을 보존하는 이미지 크기 조절 (심 카빙) 자료](https://raw.githubusercontent.com/trekhleb/trekhleb.github.io/master/src/posts/2021/content-aware-image-resizing-in-javascript/assets/56-dp-seams-energies-example.png)

![내용을 보존하는 이미지 크기 조절 (심 카빙) 자료](https://raw.githubusercontent.com/trekhleb/trekhleb.github.io/master/src/posts/2021/content-aware-image-resizing-in-javascript/assets/55-dp-three-options.png)

![내용을 보존하는 이미지 크기 조절 (심 카빙) 자료](https://raw.githubusercontent.com/trekhleb/trekhleb.github.io/master/src/posts/2021/content-aware-image-resizing-in-javascript/assets/57-dp-seams-energies-traversal.png)

```typescript
// The metadata for the pixels in the seam.
type SeamPixelMeta = {
  energy: number, // The energy of the pixel.
  coordinate: Coordinate, // The coordinate of the pixel.
  previous: Coordinate | null, // The previous pixel in a seam.
};

// Finds the seam (the sequence of pixels from top to bottom) that has the
// lowest resulting energy using the Dynamic Programming approach.
const findLowEnergySeam = (energyMap: EnergyMap, { w, h }: ImageSize): Seam => {
  // The 2D array of the size of w and h, where each pixel contains the
  // seam metadata (pixel energy, pixel coordinate and previous pixel from
  // the lowest energy seam at this point).
  const seamsEnergies: (SeamPixelMeta | null)[][] = matrix<SeamPixelMeta | null>(w, h, null);

  // Populate the first row of the map by just copying the energies
  // from the energy map.
  for (let x = 0; x < w; x += 1) {
    const y = 0;
    seamsEnergies[y][x] = {
      energy: energyMap[y][x],
      coordinate: { x, y },
      previous: null,
    };
  }

  // Populate the rest of the rows.
  for (let y = 1; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      // Find the top adjacent cell with minimum energy.
      // This cell would be the tail of a seam with lowest energy at this point.
      // It doesn't mean that this seam (path) has lowest energy globally.
      // Instead, it means that we found a path with the lowest energy that may lead
      // us to the current pixel with the coordinates x and y.
      let minPrevEnergy = Infinity;
      let minPrevX: number = x;
      for (let i = (x - 1); i <= (x + 1); i += 1) {
        if (i >= 0 && i < w && seamsEnergies[y - 1][i].energy < minPrevEnergy) {
          minPrevEnergy = seamsEnergies[y - 1][i].energy;
          minPrevX = i;
        }
      }

      // Update the current cell.
      seamsEnergies[y][x] = {
        energy: minPrevEnergy + energyMap[y][x],
        coordinate: { x, y },
        previous: { x: minPrevX, y: y - 1 },
      };
    }
  }

  // Find where the minimum energy seam ends.
  // We need to find the tail of the lowest energy seam to start
  // traversing it from its tail to its head (from the bottom to the top).
  let lastMinCoordinate: Coordinate | null = null;
  let minSeamEnergy = Infinity;
  for (let x = 0; x < w; x += 1) {
    const y = h - 1;
    if (seamsEnergies[y][x].energy < minSeamEnergy) {
      minSeamEnergy = seamsEnergies[y][x].energy;
      lastMinCoordinate = { x, y };
    }
  }

  // Find the lowest energy seam.
  // Once we know where the tail is we may traverse and assemble the lowest
  // energy seam based on the "previous" value of the seam pixel metadata.
  const seam: Seam = [];
  if (!lastMinCoordinate) {
    return seam;
  }

  const { x: lastMinX, y: lastMinY } = lastMinCoordinate;

  // Adding new pixel to the seam path one by one until we reach the top.
  let currentSeam = seamsEnergies[lastMinY][lastMinX];
  while (currentSeam) {
    seam.push(currentSeam.coordinate);
    const prevMinCoordinates = currentSeam.previous;
    if (!prevMinCoordinates) {
      currentSeam = null;
    } else {
      const { x: prevMinX, y: prevMinY } = prevMinCoordinates;
      currentSeam = seamsEnergies[prevMinY][prevMinX];
    }
  }

  return seam;
};
```

![내용을 보존하는 이미지 크기 조절 (심 카빙) 자료](https://raw.githubusercontent.com/trekhleb/trekhleb.github.io/master/src/posts/2021/content-aware-image-resizing-in-javascript/assets/60-deleting-example.png)

```typescript
// Deletes the seam from the image data.
// We delete the pixel in each row and then shift the rest of the row pixels to the left.
const deleteSeam = (img: ImageData, seam: Seam, { w }: ImageSize): void => {
  seam.forEach(({ x: seamX, y: seamY }: Coordinate) => {
    for (let x = seamX; x < (w - 1); x += 1) {
      const nextPixel = getPixel(img, { x: x + 1, y: seamY });
      setPixel(img, { x, y: seamY }, nextPixel);
    }
  });
};
```

![내용을 보존하는 이미지 크기 조절 (심 카빙) 자료](https://raw.githubusercontent.com/trekhleb/trekhleb.github.io/master/src/posts/2021/content-aware-image-resizing-in-javascript/assets/10-demo-02.gif)

## 구현과 참고 자료

- [interactive version of this post](https://trekhleb.dev/blog/2021/content-aware-image-resizing-in-javascript/)
- [javascript-algorithms](https://github.com/trekhleb/javascript-algorithms)
- [Seam Carving algorithm](https://perso.crans.org/frenoy/matlab2012/seamcarving.pdf)
- [JS IMAGE CARVER](https://trekhleb.dev/js-image-carver/)
- [open-sourced it on GitHub](https://github.com/trekhleb/js-image-carver)
- [interactive version of the post](https://trekhleb.dev/blog/2021/content-aware-image-resizing-in-javascript/)
- [js-image-carver](https://github.com/trekhleb/js-image-carver)
- [ImageData](https://developer.mozilla.org/en-US/docs/Web/API/ImageData)
- [Uint8ClampedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray)
- [Dynamic Programming vs Divide-and-Conquer](https://trekhleb.dev/blog/2018/dynamic-programming-vs-divide-and-conquer/)
- [it is a sign](https://trekhleb.dev/blog/2018/dynamic-programming-vs-divide-and-conquer/)
- [source-code of the energy function](https://github.com/trekhleb/js-image-carver/blob/main/src/utils/contentAwareResizer.ts#L54)
- [JS IMAGE CARVER](https://github.com/trekhleb/js-image-carver)
- [original paper](https://perso.crans.org/frenoy/matlab2012/seamcarving.pdf)
