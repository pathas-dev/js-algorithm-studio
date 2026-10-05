import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
let pairs = 0;

function check(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'coverage', 'dist'].includes(entry.name)) continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      check(path);
      continue;
    }
    if (!/^README(?:\..+)?\.md$/.test(entry.name)) continue;
    if (!['README.md', 'README.ko-KR.md'].includes(entry.name)) {
      errors.push(`${path}: unexpected language`);
      continue;
    }
    const text = readFileSync(path, 'utf8');
    const projectDoc = directory === root;
    if (entry.name === 'README.md') {
      if (!projectDoc) pairs += 1;
      if (!existsSync(resolve(directory, 'README.ko-KR.md'))) {
        errors.push(`${path}: missing Korean explanation`);
      }
    }
    if ((projectDoc || entry.name === 'README.ko-KR.md') && !/[가-힣]/.test(text)) {
      errors.push(`${path}: missing Korean content`);
    }
    const selector = projectDoc
      ? '[프로젝트 소개](README.md) | [알고리즘 설명 목록](README.ko-KR.md)'
      : '[English](README.md) | [한국어](README.ko-KR.md)';
    if (!text.includes(selector)) {
      errors.push(`${path}: missing language selector`);
    }
    const prose = text.replace(/^```[^\n]*\n[\s\S]*?^```\s*$/gm, '');
    const links = prose.matchAll(/!?\[[^\]\n]*\]\((<[^>]+>|(?:[^()]|\([^()]*\))*)\)/g);
    for (const [, destination] of links) {
      const url = destination.replace(/^<|>$/g, '').split(/\s+"/)[0];
      if (/^(?:https?:|mailto:|#)/i.test(url)) continue;
      const local = decodeURIComponent(url.split(/[?#]/)[0]);
      if (local && !existsSync(resolve(directory, local))) {
        errors.push(`${path}: missing ${url}`);
      }
    }
  }
}

check(root);
assert.equal(errors.length, 0, errors.join('\n'));
console.log(`Documentation OK: ${pairs} algorithm English/Korean pairs; Korean project docs; local links and images exist.`);
