import fs from 'fs';
import path from 'path';
import HashTable from '../../data-structures/hash-table/HashTable';
import { algorithmCode } from '../playback';
import traceHashTable from '../hash';

describe('hash table lessons', () => {
  it('records collisions, key comparisons and value updates without changing prior states', () => {
    const steps = traceHashTable(['ab', 'ba', 'ac'], 'get ba, set ab updated, set cb new, delete ba, get ba, has ab, delete absent, has absent');
    expect(steps.filter((step) => 'result' in step.variables).map((step) => step.variables.result))
      .toEqual(['1', '1', 'undefined', true, 'null', false]);
    const initial = steps.find((step) => step.type === 'set-new' && step.variables.key === 'ba');
    expect(JSON.parse(initial.variables.hashTable)[3]).toEqual([{ key: 'ab', value: '0' }, { key: 'ba', value: '1' }]);
    expect(JSON.parse(steps.at(-1).variables.hashTable)[3]).toEqual([{ key: 'ab', value: 'updated' }]);
    expect(steps.some((step) => step.type === 'probe' && step.variables.key === 'ba' && step.variables.candidate === 'ab')).toBe(true);
    const source = algorithmCode(fs.readFileSync(path.resolve(__dirname, '../../data-structures/hash-table/HashTable.js'), 'utf8'));
    steps.forEach((step) => expect(source).toContain(step.code));
    expect(traceHashTable([])).toHaveLength(2);
    expect(() => traceHashTable(Array(13).fill('a'))).toThrow('word-limit');
    const keys = Array.from({ length: 12 }, (_, index) => `a${index}`);
    expect(() => traceHashTable(keys, 'set b new')).toThrow('word-limit');
    expect(traceHashTable(keys, 'set a0 changed').at(-1).variables.keys.split(', ')).toHaveLength(12);
    expect(() => traceHashTable([], 'set a')).toThrow('operations');
  });

  it('uses safe dictionary keys while preserving the existing hash table contract', () => {
    const table = new HashTable();
    table.set('__proto__', 'safe');
    table.set('constructor', 'also safe');
    expect(table.has('__proto__')).toBe(true);
    expect(table.get('__proto__')).toBe('safe');
    expect(table.getKeys()).toEqual(['__proto__', 'constructor']);
    table.delete('__proto__');
    expect(table.has('__proto__')).toBe(false);
    expect(table.get('constructor')).toBe('also safe');
    const steps = traceHashTable([], 'set __proto__ safe, get __proto__, has __proto__, delete __proto__, has __proto__');
    expect(steps.filter((step) => 'result' in step.variables).map((step) => step.variables.result))
      .toEqual(['safe', true, 'safe', false]);
  });
});
