import { useMemo, useState } from "react";
import { useGroceries } from "../../jobFetch.js";
import { ErrorBanner, LoadingSpinner } from "../../jobFetch.jsx";
import { C } from "./theme";

function GroceryCard({ item }) {
  const [inCart, setInCart] = useState(false);

  return (
    <div className="card grocery-card" style={{ opacity: inCart ? 0.65 : 1, transition: "opacity 0.25s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 13,
              background: `${C.mint}66`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.4rem",
            }}
          >
            {item.emoji || "G"}
          </div>
          <div>
            <h3 style={{ fontSize: "0.92rem", fontWeight: 700, color: C.textDark, marginBottom: 2 }}>{item.name}</h3>
            <p style={{ fontSize: "0.76rem", color: C.textMid }}>{item.unit || ""} {item.store ? `- ${item.store}` : ""}</p>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <p style={{ fontWeight: 700, color: C.textDark }}>{item.price}</p>
          <p style={{ fontSize: "0.7rem", color: C.textMid }}>Rating {item.rating}</p>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, gap: 8 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span className="pill" style={{ background: `${C.mint}66`, color: "#3a7a5a" }}>{item.benefit}</span>
          <span className="pill" style={{ background: `${C.lavender}44`, color: C.textDark }}>{item.category}</span>
        </div>

        <button
          className={inCart ? "btn-ghost" : "btn-primary"}
          style={{ fontSize: "0.76rem", padding: "6px 14px" }}
          onClick={() => setInCart((s) => !s)}
        >
          {inCart ? "Added" : "Add"}
        </button>
      </div>
    </div>
  );
}

export default function GroceryList() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [keywordInput, setKeywordInput] = useState("");
  const [maxItemsInput, setMaxItemsInput] = useState(16);
  const [query, setQuery] = useState({ keyword: "prenatal groceries", maxItems: 16 });
  const [hasRequested, setHasRequested] = useState(false);

  const { groceries, count, loading, error, refetch, meta } = useGroceries({
    keyword: query.keyword,
    maxItems: query.maxItems,
    enabled: hasRequested,
  });

  const categories = useMemo(() => {
    const unique = new Set(groceries.map((item) => item.category).filter(Boolean));
    return ["All", ...Array.from(unique).sort()];
  }, [groceries]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return groceries.filter((item) => {
      const matchesSearch = !q || (item.name || "").toLowerCase().includes(q);
      const matchesCat = activeCategory === "All" || item.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [groceries, search, activeCategory]);

  const handleScrape = (event) => {
    event.preventDefault();
    const maxItems = Math.max(1, Math.min(100, Number(maxItemsInput) || 16));
    setQuery({ keyword: keywordInput.trim() || "prenatal groceries", maxItems });
    setHasRequested(true);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      <div className="ai" style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Dancing Script', cursive", fontSize: "2rem", color: C.textDark, marginBottom: 4 }}>
          Prenatal Groceries
        </h1>
      </div>

      <form onSubmit={handleScrape} className="card" style={{ marginBottom: 18, display: "grid", gap: 12 }}>
        <label style={{ fontSize: "0.82rem", color: C.textMid, fontWeight: 700 }}>Grocery keyword</label>
        <input
          className="search-input"
          value={keywordInput}
          onChange={(event) => setKeywordInput(event.target.value)}
          placeholder="e.g. organic prenatal essentials"
        />

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <label style={{ fontSize: "0.82rem", color: C.textMid, fontWeight: 700 }}>Max items</label>
          <input
            type="number"
            min={1}
            max={100}
            value={maxItemsInput}
            onChange={(event) => setMaxItemsInput(event.target.value)}
            style={{ width: 90, padding: "8px 10px", borderRadius: 12, border: `2px solid ${C.mint}66`, outline: "none" }}
          />
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Scraping..." : "Scrape Groceries"}
          </button>
          {hasRequested && (
            <button className="btn-ghost" type="button" onClick={refetch} disabled={loading}>
              Refresh
            </button>
          )}
        </div>
      </form>

      {error && <ErrorBanner message={error} onRetry={refetch} />}
      {loading && <LoadingSpinner message="Scraping groceries from Apify..." />}

      {hasRequested && !loading && !error && (
        <p style={{ color: C.textMid, fontSize: "0.82rem", marginBottom: 10 }}>
          {count} groceries fetched for "{query.keyword}" {meta?.source ? `- ${meta.source}` : ""}
        </p>
      )}

      <div style={{ position: "relative", marginBottom: 14 }}>
        <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: "1rem" }}>S</span>
        <input
          className="search-input"
          placeholder="Filter fetched groceries..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 20 }}>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`filter-chip ${activeCategory === cat ? "active" : ""}`}
            style={{ background: activeCategory === cat ? undefined : `${C.mint}33` }}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {!hasRequested && !loading && (
          <div className="card" style={{ color: C.textMid }}>
            Enter a keyword and click "Scrape Groceries" to load live data.
          </div>
        )}

        {hasRequested && !loading && !error && filtered.length === 0 && (
          <div className="card" style={{ color: C.textMid }}>
            No groceries matched your current search/filter.
          </div>
        )}

        {filtered.map((item) => (
          <GroceryCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
