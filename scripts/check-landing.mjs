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
  const { lessonTaglines } = await server.ssrLoadModule('/lesson-copy.ts');
  assert.deepEqual(Object.keys(lessonTaglines).sort(), algorithms.map((entry) => entry.id).sort(), 'Every lesson needs its own introduction');
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
    }
    for (const algorithm of algorithms) {
      const id = algorithm.id;
      globalThis.location = new URL(`http://localhost/?lesson=${id}&lang=${language}`);
      const studio = render(App);
      const name = renderToStaticMarkup(React.createElement('p', {}, algorithm.name[language])).slice(3, -4);
      assert(studio.includes(`>${name}</h1>`), `${id}: wrong direct-entry lesson or language`);
      assert(lessonTaglines[id][language]?.trim(), `${id}: missing ${language} introduction`);
      const tagline = renderToStaticMarkup(React.createElement('p', {}, lessonTaglines[id][language])).slice(3, -4);
      assert(studio.includes(tagline), `${id}: introduction not rendered`);
      assert(studio.includes('class="lesson-code"'), `${id}: missing code disclosure`);
      assert(!studio.includes('<details class="lesson-code" open'), `${id}: code starts collapsed`);
      assert(studio.includes(language === 'ko' ? '그냥 구경하기' : 'Just watch'), `${id}: missing watch action`);
    }
  }
  console.log(`Checked bilingual landing models, five links, and ${algorithms.length} lesson introductions and code disclosures.`);
} finally {
  delete globalThis.location;
  await server.close();
}
