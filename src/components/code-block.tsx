import { useEffect, useState } from 'react';
import { type CodeLang, highlight } from '@/lib/highlight';

interface CodeBlockProps {
  value: string;
  lang: CodeLang;
  /** The package tab gives its longer snippets more room. */
  tall?: boolean;
}

/** Read-only snippet, highlighted by shiki once it loads; plain text until then. Wraps, never scrolls sideways. */
export function CodeBlock({ value, lang, tall }: CodeBlockProps) {
  const [html, setHtml] = useState<{ value: string; lang: CodeLang; html: string }>();

  useEffect(() => {
    if (lang === 'text') return;
    let stale = false;
    highlight(value, lang)
      .then(result => !stale && setHtml({ value, lang, html: result }))
      .catch(() => {});
    return () => {
      stale = true;
    };
  }, [value, lang]);

  const highlighted = html?.value === value && html.lang === lang ? html.html : undefined;

  return (
    <div className={tall ? 'shiki-block shiki-block-tall' : 'shiki-block'}>
      {highlighted ? <div dangerouslySetInnerHTML={{ __html: highlighted }} /> : <pre>{value}</pre>}
    </div>
  );
}
