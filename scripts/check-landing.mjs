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
  const { default: LoadingScreen } = await server.ssrLoadModule('/LoadingScreen.tsx');
  const { default: App } = await server.ssrLoadModule('/App.tsx');
  const { algorithms } = await server.ssrLoadModule('/algorithms.ts');
  const { lessonTaglines } = await server.ssrLoadModule('/lesson-copy.ts');
  assert.deepEqual(Object.keys(lessonTaglines).sort(), algorithms.map((entry) => entry.id).sort(), 'Every lesson needs its own introduction');
  const render = (Component) => renderToStaticMarkup(
    React.createElement(MantineProvider, {}, React.createElement(Component)),
  );
  for (const language of ['ko', 'en']) {
    globalThis.location = new URL(`http://localhost/?lang=${language}`);
    const loading = render(LoadingScreen);
    assert(loading.includes('role="status"'), 'Loading status stays accessible');
    assert(loading.includes(language === 'ko' ? '작은 우주를 모으는 중' : 'Gathering a little universe'), 'Loading follows the selected language');
    const landing = render(Landing);
    assert(landing.includes('data-sky="ambient"'), 'Landing retains its ambient cloud sky');
    assert(landing.includes(language === 'ko' ? '같은 크기의 별 하나' : 'Each identically sized star'), 'Explain the star model honestly');
    assert(landing.includes('496'), 'Default n=32 must show 496 pair comparisons');
    assert(landing.includes(language === 'ko' ? '정렬 멈추기' : 'Pause sorting'), 'Landing sorting starts automatically with a separate pause control');
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
      assert(studio.includes('data-sky="observatory"'), `${id}: lesson page has its own observatory sky`);
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
