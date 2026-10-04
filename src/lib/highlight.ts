import type { HighlighterCore } from 'shiki/core';

export type CodeLang =
  'bash' | 'html' | 'json' | 'markdown' | 'tsx' | 'vue' | 'svelte' | 'astro' | 'text';

let highlighter: Promise<HighlighterCore> | undefined;

// Loaded on demand, so the highlighter stays out of the initial bundle.
function load() {
  highlighter ??= (async () => {
    const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] = await Promise.all([
      import('shiki/core'),
      import('shiki/engine/javascript'),
    ]);
    return createHighlighterCore({
      engine: createJavaScriptRegexEngine(),
      themes: [import('shiki/themes/github-light.mjs'), import('shiki/themes/github-dark.mjs')],
      langs: [
        import('shiki/langs/bash.mjs'),
        import('shiki/langs/html.mjs'),
        import('shiki/langs/json.mjs'),
        import('shiki/langs/markdown.mjs'),
        import('shiki/langs/tsx.mjs'),
        import('shiki/langs/vue.mjs'),
        import('shiki/langs/svelte.mjs'),
        import('shiki/langs/astro.mjs'),
      ],
    });
  })();
  return highlighter;
}

/** Highlighted HTML with both themes as CSS variables, so the site theme picks one. */
export async function highlight(code: string, lang: CodeLang): Promise<string> {
  const shiki = await load();
  return shiki.codeToHtml(code, {
    lang,
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false,
  });
}
