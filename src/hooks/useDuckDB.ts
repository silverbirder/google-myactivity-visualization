import { useEffect, useState, useCallback, useRef } from "react";
import * as duckdb from "@duckdb/duckdb-wasm";

const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
  mvp: {
    mainModule: "/duckdb-mvp.wasm",
    mainWorker: "/duckdb-browser-mvp.worker.js",
  },
};

export interface UseDuckDBReturn {
  isLoading: boolean;
  error: string | null;
  runQuery: (
    query: string,
  ) => Promise<Record<string, string | number | boolean | null>[]>;
}

export function useDuckDB(): UseDuckDBReturn {
  const dbRef = useRef<duckdb.AsyncDuckDB | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initDuckDB = async () => {
      if (dbRef.current) return;
      try {
        setIsLoading(true);
        setError(null);
        const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
        const worker = new Worker(bundle.mainWorker!);
        const logger = new duckdb.ConsoleLogger();
        const dbInstance = new duckdb.AsyncDuckDB(logger, worker);
        await dbInstance.instantiate(bundle.mainModule, bundle.pthreadWorker);
        await dbInstance.open({
          path: "opfs://google-myactivity-visualization.db",
          accessMode: duckdb.DuckDBAccessMode.READ_WRITE,
        });
        dbRef.current = dbInstance;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(`Failed to initialize DuckDB: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    void initDuckDB();
  }, []);

  const runQuery = useCallback(
    async (
      query: string,
    ): Promise<Record<string, string | number | boolean | null>[]> => {
      if (!dbRef.current) {
        throw new Error("DuckDB is not initialized");
      }
      try {
        const conn = await dbRef.current.connect();
        const result = await conn.query(query);
        const data = result.toArray() as Record<
          string,
          string | number | boolean | null
        >[];
        await conn.close();
        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        throw new Error(`Query failed: ${errorMessage}`);
      }
    },
    [],
  );

  return {
    isLoading,
    error,
    runQuery,
  } as const;
}
