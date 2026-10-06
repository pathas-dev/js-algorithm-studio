import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({
  configFile: 'web/vite.config.mts',
  server: { middlewareMode: true, watch: null },
});
try {
  const { algorithms } = await server.ssrLoadModule('/algorithms.ts');
  const { default: action } = await server.ssrLoadModule('/@fs/' + process.cwd() + '/src/visualization/step-action.js');
  let checked = 0;
  for (const algorithm of algorithms) {
    const steps = algorithm.run(algorithm.example, algorithm.target, algorithm.graphEdges, algorithm.graphDirected, algorithm.operations);
    for (const language of ['ko', 'en']) {
      for (const [index, step] of steps.entries()) {
        const [title] = algorithm.explain(step, language);
        const parts = action(algorithm, step, language, title, index, steps.length);
        assert.equal(parts.length, 3);
        assert(parts.every((part) => typeof part === 'string' && part.length), `${algorithm.id}: ${step.type}`);
        assert(!parts.some((part) => /NaN|target = undefined|node = undefined|index = undefined/.test(part)), `${algorithm.id}: ${parts}`);
        if (step.variables.result === undefined) assert(!parts[1].includes('undefined'), `${algorithm.id}: absent result`);
        if (algorithm.category === 'dp') assert(!parts[1].includes('[-1'), `${algorithm.id}: inactive cell`);
        checked += 1;
      }
    }
  }
  const make = (id, category, type, variables, array = [], indices = []) => action({ id, category }, { type, variables, array, indices }, 'en', 'Detail', 0, 2);
  assert.equal(make('bloom-filter', 'structure', 'mayContain', { result: true, falsePositive: true })[2], 'Possibly present · not proof');
  assert.equal(make('priority-queue', 'structure', 'compare-up', { priorities: '{"42":-1,"3":3}' }, [{ value: 42 }, { value: 3 }], [0, 1])[2], 'Swap parent and child next');
  assert.equal(make('dijkstra', 'graph', 'compare', { candidate: 8, next: 2, current: 1, distances: '{"2":3}' })[2], 'Keep the current distance');
  console.log(`Checked ${checked} bilingual actions across ${algorithms.length} lessons.`);
} finally {
  await server.close();
}
