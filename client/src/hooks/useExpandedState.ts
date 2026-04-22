import { useState, useCallback } from 'react';

export interface UseExpandedStateReturn {
  expanded: string[];
  isExpanded: (key: string) => boolean;
  toggle: (key: string) => void;
  expand: (key: string) => void;
  collapse: (key: string) => void;
  expandAll: (keys: string[]) => void;
  collapseAll: () => void;
  setExpanded: (keys: string[]) => void;
}

/**
 * Hook for managing expandable/collapsible state (categories, accordion, etc.)
 * @param initialExpanded - Initial array of expanded keys
 * @returns Expansion state and control functions
 */
export function useExpandedState(initialExpanded: string[] = []): UseExpandedStateReturn {
  const [expanded, setExpanded] = useState<string[]>(initialExpanded);

  const isExpanded = useCallback((key: string) => {
    return expanded.includes(key);
  }, [expanded]);

  const toggle = useCallback((key: string) => {
    setExpanded(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  }, []);

  const expand = useCallback((key: string) => {
    setExpanded(prev =>
      prev.includes(key) ? prev : [...prev, key]
    );
  }, []);

  const collapse = useCallback((key: string) => {
    setExpanded(prev => prev.filter(k => k !== key));
  }, []);

  const expandAll = useCallback((keys: string[]) => {
    setExpanded(keys);
  }, []);

  const collapseAll = useCallback(() => {
    setExpanded([]);
  }, []);

  return {
    expanded,
    isExpanded,
    toggle,
    expand,
    collapse,
    expandAll,
    collapseAll,
    setExpanded,
  };
}

export default useExpandedState;
