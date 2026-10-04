import { useEffect, useState } from 'react';
import { type CodeLang, highlight } from '@/lib/highlight';

/** Read-only snippet, highlighted by shiki once it loads; plain text until then. */
export function CodeBlock({ value, lang }: { value: string; lang: CodeLang }) {
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
    <div className="shiki-block">
      {highlighted ? <div dangerouslySetInnerHTML={{ __html: highlighted }} /> : <pre>{value}</pre>}
    </div>
  );
}
