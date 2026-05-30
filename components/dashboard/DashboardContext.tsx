"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface DashboardContextValue {
  openAddModal: boolean;
  setOpenAddModal: (open: boolean) => void;
  refreshKey: number;
  triggerRefresh: () => void;
}

const DashboardContext = createContext<DashboardContextValue>({
  openAddModal: false,
  setOpenAddModal: () => {},
  refreshKey: 0,
  triggerRefresh: () => {},
});

export function useDashboard() {
  return useContext(DashboardContext);
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <DashboardContext.Provider
      value={{ openAddModal, setOpenAddModal, refreshKey, triggerRefresh }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
