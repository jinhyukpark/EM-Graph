import { useEffect, useState } from "react";

export type PurposeId = "enterprise" | "research" | "archive" | "exploring";

const STORAGE_KEY = "em-graph-purpose";
const EVENT = "em-graph-purpose-change";

const VALID: PurposeId[] = ["enterprise", "research", "archive", "exploring"];

function isPurposeId(value: unknown): value is PurposeId {
  return typeof value === "string" && (VALID as string[]).includes(value);
}

export function getPurpose(): PurposeId | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return isPurposeId(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function setPurpose(purpose: PurposeId | null) {
  try {
    if (purpose) localStorage.setItem(STORAGE_KEY, purpose);
    else localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(EVENT, { detail: purpose }));
  } catch {
    /* noop */
  }
}

export function usePurpose(): [PurposeId | null, (v: PurposeId | null) => void] {
  const [purpose, setPurposeState] = useState<PurposeId | null>(() => getPurpose());

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as PurposeId | null | undefined;
      setPurposeState(detail ?? getPurpose());
    };
    const storageHandler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setPurposeState(isPurposeId(e.newValue) ? e.newValue : null);
    };
    window.addEventListener(EVENT, handler);
    window.addEventListener("storage", storageHandler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener("storage", storageHandler);
    };
  }, []);

  return [purpose, setPurpose];
}
