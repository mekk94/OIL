import { Injectable, signal, computed, effect } from '@angular/core';

export type Lang = 'en' | 'ar';

type NestedRecord = { [key: string]: string | string[] | NestedRecord | NestedRecord[] };

export function resolveAssetPath(path: string, baseHref: string | null | undefined): string {
  if (!path || /^https?:\/\//i.test(path) || path.startsWith('data:')) {
    return path;
  }

  const normalizedBase = (baseHref ?? '/').replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

  if (!normalizedBase || normalizedBase === '/') {
    return `/${normalizedPath}`;
  }

  return `${normalizedBase}/${normalizedPath}`;
}

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly currentLang = signal<Lang>('en');
  private translations: Record<Lang, NestedRecord> = { en: {}, ar: {} };
  private loaded = signal(false);

  readonly isArabic = computed(() => this.currentLang() === 'ar');
  readonly dir = computed(() => (this.currentLang() === 'ar' ? 'rtl' : 'ltr'));
  readonly isLoaded = computed(() => this.loaded());

  constructor() {
    this.loadTranslations();

    // Persist language preference
    const saved = localStorage.getItem('oil-lang') as Lang | null;
    if (saved === 'ar' || saved === 'en') {
      this.currentLang.set(saved);
    }

    // Apply html lang + dir attributes
    effect(() => {
      const lang = this.currentLang();
      document.documentElement.lang = lang;
      // Layout direction stays LTR; only text nodes use RTL
      document.documentElement.setAttribute('data-lang', lang);
    });
  }

  private async loadTranslations(): Promise<void> {
    const baseHref = document.baseURI || document.location.href;
    const [en, ar] = await Promise.all([
      fetch(resolveAssetPath('/i18n/en.json', new URL(baseHref, window.location.href).pathname)).then((r) => r.json()),
      fetch(resolveAssetPath('/i18n/ar.json', new URL(baseHref, window.location.href).pathname)).then((r) => r.json()),
    ]);
    this.translations = { en, ar };
    this.loaded.set(true);
  }

  toggleLang(): void {
    const next: Lang = this.currentLang() === 'en' ? 'ar' : 'en';
    this.currentLang.set(next);
    localStorage.setItem('oil-lang', next);
  }

  /**
   * Translate a dot-separated key, e.g. t('hero.headline')
   */
  t(key: string): string {
    const lang = this.currentLang();
    const parts = key.split('.');
    let node: NestedRecord | string | string[] | NestedRecord[] = this.translations[lang];

    for (const part of parts) {
      if (node === null || typeof node !== 'object' || Array.isArray(node)) {
        return key;
      }
      node = (node as NestedRecord)[part];
    }

    if (typeof node === 'string') return node;
    return key;
  }

  /**
   * Fetch a value explicitly from the English translation.
   * Useful for getting non-translated asset names or keys.
   */
  tEn(key: string): any {
    const parts = key.split('.');
    let node: NestedRecord | string | string[] | NestedRecord[] = this.translations['en'];

    for (const part of parts) {
      if (node === null || typeof node !== 'object' || Array.isArray(node)) {
        return key;
      }
      node = (node as NestedRecord)[part];
    }
    return node;
  }

  /**
   * Translate a key that returns a string array.
   */
  tArr(key: string): string[] {
    const lang = this.currentLang();
    const parts = key.split('.');
    let node: NestedRecord | string | string[] | NestedRecord[] = this.translations[lang];

    for (const part of parts) {
      if (node === null || typeof node !== 'object' || Array.isArray(node)) {
        return [];
      }
      node = (node as NestedRecord)[part];
    }

    if (Array.isArray(node) && node.every((n) => typeof n === 'string')) {
      return node as string[];
    }
    return [];
  }

  /**
   * Translate a key that returns an array of objects.
   */
  tObjArr(key: string): any[] {
    const lang = this.currentLang();
    const parts = key.split('.');
    let node: NestedRecord | string | string[] | NestedRecord[] = this.translations[lang];

    for (const part of parts) {
      if (node === null || typeof node !== 'object' || Array.isArray(node)) {
        return [];
      }
      node = (node as NestedRecord)[part];
    }

    if (Array.isArray(node)) {
      return node as any[];
    }
    return [];
  }
}
