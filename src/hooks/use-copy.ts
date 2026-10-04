import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useI18n } from '@/i18n';

const COPIED_MS = 1600;

/** Copies text and flags success for a moment; failures are the only thing that toasts. */
export function useCopy() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>(undefined);
  const { t } = useI18n();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      window.clearTimeout(timer.current);
      setCopied(true);
      timer.current = window.setTimeout(() => setCopied(false), COPIED_MS);
    } catch {
      toast.error(t.output.copyFailed);
    }
  };

  return { copied, copy };
}
