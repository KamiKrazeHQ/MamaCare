import { useState, useEffect, useCallback, useMemo } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

function useApiFetch(endpoint, params = {}, enabled = true) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
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
  }, [fetchData, enabled]);

  return { data, loading, error, refetch: fetchData };
}


// ── Jobs hook ──────────────────────────────────────────────────────────────
/**
 * @param {object} options
 * @param {string} [options.keyword]   - Search keyword (default: "remote flexible jobs for mothers")
 * @param {number} [options.maxItems]  - Max items to return (default: 20)
 * @param {string} [options.filterTag] - Tag filter e.g. "Remote", "Part-time"
 * @param {boolean} [options.enabled]  - Whether to auto-fetch on mount
 *
 * @returns {{ jobs: Array, loading: boolean, error: string|null, refetch: Function, meta: object }}
 */
export function useJobs({
  keyword   = "remote flexible jobs for mothers",
  maxItems  = 20,
  filterTag = "",
  enabled   = true,
} = {}) {
  const { data, loading, error, refetch } = useApiFetch(
    "/api/jobs",
    { keyword, max_items: maxItems, filter_tag: filterTag || undefined },
    enabled,
  );

  return {
    jobs:    data?.jobs    ?? [],
    count:   data?.count   ?? 0,
    meta:    { source: data?.source, fetched_at: data?.fetched_at },
    loading,
    error,
    refetch,
  };
}


// ── Groceries hook ─────────────────────────────────────────────────────────
/**
 * @param {object} options
 * @param {string} [options.category]  - Category filter e.g. "Produce"
 * @param {number} [options.maxItems]  - Max items to return (default: 24)
 * @param {boolean} [options.enabled]  - Whether to auto-fetch on mount
 *
 * @returns {{ groceries: Array, loading: boolean, error: string|null, refetch: Function, meta: object }}
 */
export function useGroceries({
  category = "",
  maxItems = 24,
  enabled  = true,
} = {}) {
  const { data, loading, error, refetch } = useApiFetch(
    "/api/groceries",
    { category: category || undefined, max_items: maxItems },
    enabled,
  );

  return {
    groceries: data?.groceries ?? [],
    count:     data?.count     ?? 0,
    meta:      { source: data?.source, fetched_at: data?.fetched_at },
    loading,
    error,
    refetch,
  };
}


// ── Loading Spinner component (pastel-themed) ──────────────────────────────
export function LoadingSpinner({ message = "Loading…" }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      minHeight: 300, gap: 16,
    }}>
      <div style={{
        width: 48, height: 48, border: "4px solid #D7C5FF",
        borderTopColor: "#b89fe8", borderRadius: "50%",
        animation: "spin 0.9s linear infinite",
      }} />
      <p style={{ color: "#8a7a9a", fontSize: "0.9rem" }}>{message}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}


// ── Error banner component ─────────────────────────────────────────────────
export function ErrorBanner({ message, onRetry }) {
  return (
    <div style={{
      background: "#FFCAD455", border: "1px solid #FFCAD4",
      borderRadius: 16, padding: "24px 28px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 16, margin: "24px 0",
    }}>
      <div>
        <p style={{ fontWeight: 700, color: "#5a4a6a", marginBottom: 4 }}>⚠️ Couldn't load data</p>
        <p style={{ fontSize: "0.85rem", color: "#8a7a9a" }}>{message}</p>
        <p style={{ fontSize: "0.8rem", color: "#8a7a9a", marginTop: 4 }}>
          Make sure your Python backend is running on <code>localhost:8000</code> and your Apify token is set.
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: "#FFCAD4", border: "none", borderRadius: 16,
            padding: "10px 20px", fontWeight: 700, cursor: "pointer",
            fontSize: "0.82rem", color: "#5a4a6a", whiteSpace: "nowrap",
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
