import { useRef, useState } from 'react';

export function useCopy(timeout = 1800) {
  const [copied, setCopied] = useState(false);
  const timer = useRef();
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), timeout);
      return true;
    } catch {
      return false;
    }
  };
  return { copied, copy };
}
