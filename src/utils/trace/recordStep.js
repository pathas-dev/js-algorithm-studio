// Materialize snapshots only when requested, preserving normal algorithm complexity.
export default function recordStep(callback, type, array, indices = [], variables = {}, code = '') {
  if (callback) {
    callback({
      type,
      array: [...(typeof array === 'function' ? array() : array)],
      indices: [...indices],
      variables: { ...(typeof variables === 'function' ? variables() : variables) },
      code,
    });
  }
}
