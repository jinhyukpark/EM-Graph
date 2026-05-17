import { useEffect, useState } from "react";

const STORAGE_KEY = "em-graph-org-logo";
const EVENT = "em-graph-org-logo-change";

export function getOrgLogo(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setOrgLogo(dataUrl: string | null) {
  try {
    if (dataUrl) localStorage.setItem(STORAGE_KEY, dataUrl);
    else localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(EVENT, { detail: dataUrl }));
  } catch {
    /* noop */
  }
}

export function useOrgLogo(): [string | null, (v: string | null) => void] {
  const [logo, setLogoState] = useState<string | null>(() => getOrgLogo());

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as string | null | undefined;
      setLogoState(detail ?? getOrgLogo());
    };
    const storageHandler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setLogoState(e.newValue);
    };
    window.addEventListener(EVENT, handler);
    window.addEventListener("storage", storageHandler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener("storage", storageHandler);
    };
  }, []);

  return [logo, setOrgLogo];
}
