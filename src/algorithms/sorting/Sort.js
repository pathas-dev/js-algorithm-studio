import recordStep from '../../utils/trace/recordStep';
import Comparator from '../../utils/comparator/Comparator';

/**
 * @typedef {Object} SorterCallbacks
 * @property {function(a: *, b: *)} compareCallback - If provided then all elements comparisons
 *  will be done through this callback.
 * @property {function(a: *)} visitingCallback - If provided it will be called each time the sorting
 *  function is visiting the next element.
 * @property {function(step: Object): void} [stepCallback] - Optional execution snapshots.
 */

export default class Sort {
  constructor(originalCallbacks) {
    this.callbacks = Sort.initSortingCallbacks(originalCallbacks);
    this.comparator = new Comparator(this.callbacks.compareCallback);
  }

  /**
   * @param {SorterCallbacks} originalCallbacks
   * @returns {SorterCallbacks}
   */
  static initSortingCallbacks(originalCallbacks) {
    const callbacks = originalCallbacks || {};
    const stubCallback = () => {};

    callbacks.compareCallback = callbacks.compareCallback || undefined;
    callbacks.visitingCallback = callbacks.visitingCallback || stubCallback;

    return callbacks;
  }

  sort() {
    throw new Error('sort method must be implemented');
  }

  recordStep(type, array, indices = [], variables = {}, code = '') {
    recordStep(this.callbacks.stepCallback, type, array, indices, variables, code);
  }
}
