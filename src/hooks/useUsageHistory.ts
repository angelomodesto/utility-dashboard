import { useState, useEffect } from 'react';

interface UsageData {
  id: string;
  timestamp: string;
  filename: string;
  data: any[];
}

export function useUsageHistory() {
  const [usageHistory, setUsageHistory] = useState<UsageData[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const storedHistory = localStorage.getItem('usageHistory');
    if (storedHistory) {
      setUsageHistory(JSON.parse(storedHistory));
    }
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    localStorage.setItem('usageHistory', JSON.stringify(usageHistory));
  }, [usageHistory]);

  const isDuplicate = (filename: string) => {
    return usageHistory.some(entry => entry.filename === filename);
  };

  const addUsageData = (data: any[], filename: string) => {
    const newEntry: UsageData = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      filename,
      data,
    };

    // If it's a duplicate, replace the existing entry
    if (isDuplicate(filename)) {
      setUsageHistory(prev => 
        prev.map(entry => 
          entry.filename === filename ? newEntry : entry
        )
      );
    } else {
      setUsageHistory(prev => [...prev, newEntry]);
    }
  };

  const deleteEntry = (id: string) => {
    setUsageHistory(prev => prev.filter(entry => entry.id !== id));
  };

  const clearHistory = () => {
    setUsageHistory([]);
    localStorage.removeItem('usageHistory');
  };

  return {
    usageHistory,
    addUsageData,
    clearHistory,
    isDuplicate,
    deleteEntry,
  };
} 