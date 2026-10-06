import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MantineProvider } from '@mantine/core';
import { createServer } from 'vite';

const server = await createServer({
  configFile: 'web/vite.config.mts',
  server: { middlewareMode: true, watch: null },
});
try {
  const { default: Landing } = await server.ssrLoadModule('/Landing.tsx');
  const { default: App } = await server.ssrLoadModule('/App.tsx');
  const { algorithms } = await server.ssrLoadModule('/algorithms.ts');
  const render = (Component) => renderToStaticMarkup(
    React.createElement(MantineProvider, {}, React.createElement(Component)),
  );
  for (const language of ['ko', 'en']) {
    globalThis.location = new URL(`http://localhost/?lang=${language}`);
    const landing = render(Landing);
    assert(landing.includes('496'), 'Default n=32 must show 496 pair comparisons');
    const ids = [...new Set([...landing.matchAll(/\?lesson=([^&"]+)/g)].map((match) => match[1]))];
    assert.equal(ids.length, 5, 'All five landing destinations must be present');
    for (const id of ids) {
      const algorithm = algorithms.find((entry) => entry.id === id);
      assert(algorithm, `Unknown landing destination ${id}`);
      globalThis.location = new URL(`http://localhost/?lesson=${id}&lang=${language}`);
      const studio = render(App);
      assert(studio.includes(`>${algorithm.name[language]}</h1>`), `${id}: wrong direct-entry lesson or language`);
    }
  }
  console.log('Checked bilingual landing models and all five direct lesson entries.');
} finally {
  delete globalThis.location;
  await server.close();
}
