/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest';
import { resolveAssetPath } from './i18n.service';

describe('resolveAssetPath', () => {
  it('resolves JSON files against the app base path for GitHub Pages deployments', () => {
    expect(resolveAssetPath('/i18n/en.json', 'https://example.com/OIL/')).toBe(
      'https://example.com/OIL/i18n/en.json'
    );
  });

  it('keeps absolute URLs unchanged', () => {
    expect(resolveAssetPath('https://cdn.example.com/logo.png', 'https://example.com/OIL/')).toBe(
      'https://cdn.example.com/logo.png'
    );
  });
});
