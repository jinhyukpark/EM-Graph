import { useState, useCallback } from 'react';

export interface Tab {
  id: string;
  name: string;
  [key: string]: unknown;
}

export interface UseTabStateReturn<T extends Tab> {
  tabs: T[];
  activeTab: string;
  setActiveTab: (id: string) => void;
  addTab: (tab: T) => void;
  removeTab: (id: string) => void;
  updateTab: (id: string, updates: Partial<T>) => void;
  getActiveTabData: () => T | undefined;
}

/**
 * Hook for managing tab state (add, remove, activate)
 * @param initialTabs - Initial tabs array
 * @param initialActiveTab - Initial active tab ID
 * @returns Tab state and control functions
 */
export function useTabState<T extends Tab>(
  initialTabs: T[],
  initialActiveTab?: string
): UseTabStateReturn<T> {
  const [tabs, setTabs] = useState<T[]>(initialTabs);
  const [activeTab, setActiveTab] = useState<string>(
    initialActiveTab || (initialTabs.length > 0 ? initialTabs[0].id : '')
  );

  const addTab = useCallback((tab: T) => {
    setTabs(prev => [...prev, tab]);
    setActiveTab(tab.id);
  }, []);

  const removeTab = useCallback((id: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(t => t.id !== id);
      if (activeTab === id && newTabs.length > 0) {
        setActiveTab(newTabs[newTabs.length - 1].id);
      }
      return newTabs;
    });
  }, [activeTab]);

  const updateTab = useCallback((id: string, updates: Partial<T>) => {
    setTabs(prev => prev.map(tab =>
      tab.id === id ? { ...tab, ...updates } : tab
    ));
  }, []);

  const getActiveTabData = useCallback(() => {
    return tabs.find(t => t.id === activeTab);
  }, [tabs, activeTab]);

  return {
    tabs,
    activeTab,
    setActiveTab,
    addTab,
    removeTab,
    updateTab,
    getActiveTabData,
  };
}

export default useTabState;
