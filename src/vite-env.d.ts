/// <reference types="vite/client" />

interface Window {
  electronAPI: {
    query: (sql: string, params?: any[]) => Promise<any[]>;
    run: (sql: string, params?: any[]) => Promise<{ lastID: number; changes: number }>;
  };
}