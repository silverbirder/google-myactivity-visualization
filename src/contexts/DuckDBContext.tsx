"use client";

import React, { createContext, useContext } from "react";
import { useDuckDB, type UseDuckDBReturn } from "@/hooks/useDuckDB";

type DuckDBContextValue = UseDuckDBReturn;

const DuckDBContext = createContext<DuckDBContextValue | undefined>(
  undefined,
);

export function DuckDBProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const duck = useDuckDB();
  return (
    <DuckDBContext.Provider value={duck}>{children}</DuckDBContext.Provider>
  );
}

export function useDuckDBContext(): DuckDBContextValue {
  const ctx = useContext(DuckDBContext);
  if (!ctx) {
    throw new Error("useDuckDBContext must be used within a DuckDBProvider");
  }
  return ctx;
}
