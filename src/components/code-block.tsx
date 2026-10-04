import { useEffect, useState } from 'react';
import { type CodeLang, highlight } from '@/lib/highlight';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  value: string;
  lang: CodeLang;
  /** The package tab gives its longer snippets more room; `full` never cuts them (docs examples). */
  size?: 'default' | 'tall' | 'full';
  className?: string;
}

/** Read-only snippet, highlighted by shiki once it loads; plain text until then. Wraps, never scrolls sideways. */
export function CodeBlock({ value, lang, size = 'default', className }: CodeBlockProps) {
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
    <div className={cn('shiki-block', size !== 'default' && `shiki-block-${size}`, className)}>
      {highlighted ? <div dangerouslySetInnerHTML={{ __html: highlighted }} /> : <pre>{value}</pre>}
    </div>
  );
}
