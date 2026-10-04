import { useEffect } from 'react';

/** The tab title and meta description of the current page, in the current language. */
export function useDocumentMeta({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }, [title, description]);
}
