import recordStep from '../../../utils/trace/recordStep';
import ComplexNumber from '../complex-number/ComplexNumber';

const CLOSE_TO_ZERO_THRESHOLD = 1e-10;

/**
 * Discrete Fourier Transform (DFT): time to frequencies.
 *
 * Time complexity: O(N^2)
 *
 * @param {number[]} inputAmplitudes - Input signal amplitudes over time (complex
 * numbers with real parts only).
 * @param {number} zeroThreshold - Threshold that is used to convert real and imaginary numbers
 * to zero in case if they are smaller then this.
 *
 * @param {function} [stepCallback]
 * @return {ComplexNumber[]} - Array of complex number. Each of the number represents the frequency
 * or signal. All signals together will form input signal over discrete time periods. Each signal's
 * complex number has radius (amplitude) and phase (angle) in polar form that describes the signal.
 *
 * @see https://gist.github.com/anonymous/129d477ddb1c8025c9ac
 * @see https://betterexplained.com/articles/an-interactive-guide-to-the-fourier-transform/
 */
export default function dft(
  inputAmplitudes,
  zeroThreshold = CLOSE_TO_ZERO_THRESHOLD,
  stepCallback = undefined,
) {
  const N = inputAmplitudes.length;
  const signals = [];

  const state = (frequency = -1, timer = -1, partial = new ComplexNumber()) => ({
    frequency,
    timer,
    N,
    input: JSON.stringify(inputAmplitudes),
    coefficients: JSON.stringify(signals.map((signal) => [signal.re, signal.im])),
    partialRe: partial.re,
    partialIm: partial.im,
    result: '—',
    expression: frequency < 0 ? `N = ${N}` : `F[${frequency}] · sample ${timer}`,
  });
  recordStep(stepCallback, 'start', [], [], () => state(), 'const signals = [];');

  // Go through every discrete frequency.
  for (let frequency = 0; frequency < N; frequency += 1) {
    // Compound signal at current frequency that will ultimately
    // take part in forming input amplitudes.
    let frequencySignal = new ComplexNumber();

    // Go through every discrete point in time.
    for (let timer = 0; timer < N; timer += 1) {
      const currentAmplitude = inputAmplitudes[timer];

      // Calculate rotation angle.
      const rotationAngle = -1 * (2 * Math.PI) * frequency * (timer / N);

      // Remember that e^ix = cos(x) + i * sin(x);
      const dataPointContribution = new ComplexNumber({
        re: Math.cos(rotationAngle),
        im: Math.sin(rotationAngle),
      }).multiply(currentAmplitude);

      // Add this data point's contribution.
      frequencySignal = frequencySignal.add(dataPointContribution);
      recordStep(
        stepCallback,
        'contribution',
        [],
        [],
        () => ({
          ...state(frequency, timer, frequencySignal),
          rotationAngle,
          expression: `F[${frequency}] += ${currentAmplitude} × e^(i × ${rotationAngle.toFixed(3)})`,
        }),
        'frequencySignal = frequencySignal.add(dataPointContribution);',
      );
    }

    // Close to zero? You're zero.
    if (Math.abs(frequencySignal.re) < zeroThreshold) {
      frequencySignal.re = 0;
    }

    if (Math.abs(frequencySignal.im) < zeroThreshold) {
      frequencySignal.im = 0;
    }

    // Average contribution at this frequency.
    // The 1/N factor is usually moved to the reverse transform (going from frequencies
    // back to time). This is allowed, though it would be nice to have 1/N in the forward
    // transform since it gives the actual sizes for the time spikes.
    frequencySignal = frequencySignal.divide(N);

    // Add current frequency signal to the list of compound signals.
    signals[frequency] = frequencySignal;
    recordStep(
      stepCallback,
      'frequency',
      [],
      [],
      () => ({
        ...state(frequency, N - 1, frequencySignal),
        expression: `F[${frequency}] = ${frequencySignal.re.toPrecision(6)} + (${frequencySignal.im.toPrecision(6)})i`,
      }),
      'frequencySignal = frequencySignal.divide(N);',
    );
  }

  recordStep(stepCallback, 'done', [], [], () => ({
    ...state(),
    result: signals.map((signal) => signal.getRadius().toPrecision(4)).join(', '),
    expression: 'F[k] = Σ x[t] × e^(-i2πkt/N) ÷ N',
  }), 'return signals;');
  return signals;
}
