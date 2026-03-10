import { describe, it, expect } from 'vitest';
import {
  slugify,
  truncate,
  camelCase,
  kebabCase,
  titleCase,
  wordWrap,
  stripHtml,
  escapeRegex,
  pluralize,
  levenshteinDistance,
} from '../../src/lib/main.js';

describe('string-utils core functions', () => {
  it('slugify basic', () => {
    expect(slugify('Hello World!')).toBe('hello-world');
  });

  it('truncate without breaking words', () => {
    expect(truncate('Hello World', 8)).toBe('Hello…');
  });

  it('camelCase basic', () => {
    expect(camelCase('foo-bar-baz')).toBe('fooBarBaz');
    expect(camelCase('FOO BAR')).toBe('fooBar');
  });

  it('kebabCase basic', () => {
    expect(kebabCase('Hello World')).toBe('hello-world');
    expect(kebabCase('Áccent Test')).toBe('accent-test');
  });

  it('titleCase basic', () => {
    expect(titleCase('hello world')).toBe('Hello World');
  });

  it('wordWrap respects width', () => {
    const input = 'The quick brown fox jumps over the lazy dog';
    const wrapped = wordWrap(input, 10);
    // each line should be at most 10 chars
    for (const line of wrapped.split('\n')) {
      expect(line.length).toBeLessThanOrEqual(10);
    }
  });

  it('stripHtml and decode entities', () => {
    expect(stripHtml('<p>Hello &amp; &lt;world&gt; &#33;</p>')).toBe('Hello & <world> !');
  });

  it('escapeRegex', () => {
    expect(escapeRegex('^abc$')).toBe('\\^abc\\$');
  });

  it('pluralize rules', () => {
    expect(pluralize('cat', 2)).toBe('cats');
    expect(pluralize('bus', 2)).toBe('buses');
    expect(pluralize('box', 2)).toBe('boxes');
    expect(pluralize('baby', 2)).toBe('babies');
    expect(pluralize('knife', 2)).toBe('knives');
    expect(pluralize('leaf', 2)).toBe('leaves');
    expect(pluralize('sheep', 2)).toBe('sheeps'); // basic rule-based
    expect(pluralize('person', 1)).toBe('person');
  });

  it('levenshteinDistance example', () => {
    expect(levenshteinDistance('kitten', 'sitting')).toBe(3);
  });

  it('handles empty and null inputs gracefully', () => {
    expect(slugify('')).toBe('');
    expect(slugify(null)).toBe('');
    expect(truncate(null, 5)).toBe('');
    expect(levenshteinDistance('', '')).toBe(0);
    expect(levenshteinDistance(null, 'abc')).toBe(3);
  });
});
