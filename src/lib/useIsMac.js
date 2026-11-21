import { useEffect, useState } from 'react';

// Resolved after mount so server and client markup match.
export function useIsMac() {
  const [isMac, setIsMac] = useState(false);
  useEffect(() => { setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)); }, []);
  return isMac;
}
