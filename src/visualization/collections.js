import cartesianProduct from '../algorithms/sets/cartesian-product/cartesianProduct';

export default function traceCartesian(inputs) {
  const sets = inputs.map((input) => [...new Set(input.trim().split(/[\s,]+/).filter(Boolean))]);
  if (sets.length !== 2 || sets.some((set) => set.length > 6
    || set.some((value) => Array.from(value).length > 12))) throw new Error('cartesian-input');
  const steps = [];
  cartesianProduct(...sets, (step) => steps.push({
    ...step,
    variables: {
      ...step.variables, mode: 'cartesian', inputs: JSON.stringify(sets),
    },
  }));
  return steps;
}
