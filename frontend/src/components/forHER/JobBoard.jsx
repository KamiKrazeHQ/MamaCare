import { useMemo, useState } from "react";
import { useJobs } from "../../jobFetch.js";
import { ErrorBanner, LoadingSpinner } from "../../jobFetch.jsx";
import { JOB_FILTERS } from "./data";
import { C } from "./theme";

function JobCard({ job }) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="card job-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 13,
              background: `${C.lavender}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              flexShrink: 0,
            }}
          >
            {job.logo}
          </div>
          <div>
            <h3 style={{ fontSize: "0.96rem", fontWeight: 700, color: C.textDark, marginBottom: 2 }}>{job.title}</h3>
            <p style={{ fontSize: "0.8rem", color: C.textMid }}>{job.company} - {job.location}</p>
          </div>
        </div>
        <button
          onClick={() => setSaved(!saved)}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", flexShrink: 0 }}
        >
          {saved ? "?" : "??"}
        </button>
      </div>

      <p style={{ margin: "12px 0 10px", fontSize: "0.84rem", color: C.textMid, lineHeight: 1.6 }}>{job.description}</p>

      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 12 }}>
        {(job.tags || []).map((tag) => (
          <span key={tag} className="pill" style={{ background: `${C.lavender}44`, color: C.textDark }}>
            {tag}
          </span>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontWeight: 700, color: C.textDark, fontSize: "0.88rem" }}>{job.salary}</span>
          <span className="pill" style={{ background: C.mint, color: "#3a7a5a", marginLeft: 8 }}>
            {job.type}
          </span>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: "0.72rem", color: C.textMid }}>{job.posted}</span>
          <a
            className="btn-primary"
            href={job.apply_link || "#"}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "none", display: "inline-block" }}
          >
            Apply -&gt;
          </a>
        </div>
      </div>
    </div>
  );
}

export default function JobBoard() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [keywordInput, setKeywordInput] = useState("");
  const [maxItemsInput, setMaxItemsInput] = useState(10);
  const [query, setQuery] = useState({ keyword: "remote jobs for mothers", maxItems: 10 });
  const [hasRequested, setHasRequested] = useState(false);

  const { jobs, count, loading, error, refetch, meta } = useJobs({
    keyword: query.keyword,
    maxItems: query.maxItems,
    enabled: hasRequested,
  });

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q || (job.title || "").toLowerCase().includes(q) || (job.company || "").toLowerCase().includes(q);
      const matchesTag = activeFilter === "All" || (job.tags || []).includes(activeFilter);
      return matchesSearch && matchesTag;
    });
  }, [jobs, search, activeFilter]);

  const handleScrape = (event) => {
    event.preventDefault();
    const maxItems = Math.max(1, Math.min(100, Number(maxItemsInput) || 10));
    setQuery({ keyword: keywordInput.trim() || "remote jobs for mothers", maxItems });
    setHasRequested(true);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      <div className="ai" style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Dancing Script', cursive", fontSize: "2rem", color: C.textDark, marginBottom: 4 }}>
          Mother-Friendly Jobs
        </h1>
      </div>

      <form onSubmit={handleScrape} className="card" style={{ marginBottom: 18, display: "grid", gap: 12 }}>
        <label style={{ fontSize: "0.82rem", color: C.textMid, fontWeight: 700 }}>Job keyword</label>
        <input
          className="search-input"
          value={keywordInput}
          onChange={(event) => setKeywordInput(event.target.value)}
          placeholder="e.g. remote customer support for mothers"
        />

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ fontSize: "0.82rem", color: C.textMid, fontWeight: 700 }}>Max items</label>
          <input
            type="number"
            min={1}
            max={100}
            value={maxItemsInput}
            onChange={(event) => setMaxItemsInput(event.target.value)}
            style={{ width: 90, padding: "8px 10px", borderRadius: 12, border: `2px solid ${C.lavender}66`, outline: "none" }}
          />
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Scraping..." : "Scrape Jobs"}
          </button>
          {hasRequested && (
            <button className="btn-ghost" type="button" onClick={refetch} disabled={loading}>
              Refresh
            </button>
          )}
        </div>
      </form>

      {error && <ErrorBanner message={error} onRetry={refetch} />}
      {loading && <LoadingSpinner message="Scraping jobs from Apify..." />}

      {hasRequested && !loading && !error && (
        <p style={{ color: C.textMid, fontSize: "0.82rem", marginBottom: 10 }}>
          {count} jobs fetched for "{query.keyword}" {meta?.source ? `- ${meta.source}` : ""}
        </p>
      )}

      <div style={{ position: "relative", marginBottom: 14 }}>
        <input
          className="search-input"
          placeholder="Filter fetched jobs..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 20 }}>
        {JOB_FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            className={`filter-chip ${activeFilter === filter ? "active" : ""}`}
            style={{ background: activeFilter === filter ? undefined : `${C.lavender}22` }}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {!hasRequested && !loading && (
          <div className="card" style={{ color: C.textMid }}>
            Enter a keyword and click "Scrape Jobs" to load live data.
          </div>
        )}

        {hasRequested && !loading && !error && filteredJobs.length === 0 && (
          <div className="card" style={{ color: C.textMid }}>
            No jobs matched your current search/filter.
          </div>
        )}

        {filteredJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
