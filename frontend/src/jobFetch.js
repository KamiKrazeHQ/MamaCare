import { useCallback, useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

function useApiFetch(endpoint, params = {}, enabled = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const paramsKey = useMemo(() => JSON.stringify(params), [params]);

  const buildUrl = useCallback(() => {
    const url = new URL(`${API_BASE}${endpoint}`);
    Object.entries(JSON.parse(paramsKey)).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        url.searchParams.set(k, v);
      }
    });
    return url.toString();
  }, [endpoint, paramsKey]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(buildUrl());
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `HTTP ${res.status}`);
      }
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [buildUrl]);

  useEffect(() => {
    if (enabled) fetchData();
  }, [enabled, fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useJobs({
  keyword = "remote flexible jobs for mothers",
  maxItems = 20,
  filterTag = "",
  enabled = true,
} = {}) {
  const { data, loading, error, refetch } = useApiFetch(
    "/api/jobs",
    { keyword, max_items: maxItems, filter_tag: filterTag || undefined },
    enabled,
  );

  return {
    jobs: data?.jobs ?? [],
    count: data?.count ?? 0,
    meta: { source: data?.source, fetched_at: data?.fetched_at },
    loading,
    error,
    refetch,
  };
}

export function useGroceries({
  keyword = "",
  category = "",
  maxItems = 24,
  enabled = true,
} = {}) {
  const { data, loading, error, refetch } = useApiFetch(
    "/api/groceries",
    {
      keyword: keyword || undefined,
      category: category || undefined,
      max_items: maxItems,
    },
    enabled,
  );

  return {
    groceries: data?.groceries ?? [],
    count: data?.count ?? 0,
    meta: { source: data?.source, fetched_at: data?.fetched_at, keyword: data?.keyword },
    loading,
    error,
    refetch,
  };
}
