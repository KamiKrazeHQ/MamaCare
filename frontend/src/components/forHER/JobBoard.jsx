import { useState } from "react";
import { C } from "./theme";
import { JOB_FILTERS, MOCK_JOBS } from "./data";

function JobCard({ job }) {
  const [saved, setSaved] = useState(false);
  return (
    <div className="card job-card">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
          <div style={{ width:46, height:46, borderRadius:13, background:`${C.lavender}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.5rem", flexShrink:0 }}>{job.logo}</div>
          <div>
            <h3 style={{ fontSize:"0.96rem", fontWeight:700, color:C.textDark, marginBottom:2 }}>{job.title}</h3>
            <p style={{ fontSize:"0.8rem", color:C.textMid }}>{job.company} · {job.location}</p>
          </div>
        </div>
        <button onClick={() => setSaved(!saved)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"1.2rem", flexShrink:0 }}>{saved?"❤️":"🤍"}</button>
      </div>
      <p style={{ margin:"12px 0 10px", fontSize:"0.84rem", color:C.textMid, lineHeight:1.6 }}>{job.description}</p>
      <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:12 }}>
        {job.tags.map(t => <span key={t} className="pill" style={{ background:`${C.lavender}44`, color:C.textDark }}>{t}</span>)}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div><span style={{ fontWeight:700, color:C.textDark, fontSize:"0.88rem" }}>{job.salary}</span><span className="pill" style={{ background:C.mint, color:"#3a7a5a", marginLeft:8 }}>{job.type}</span></div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}><span style={{ fontSize:"0.72rem", color:C.textMid }}>{job.posted}</span><button className="btn-primary">Apply →</button></div>
      </div>
    </div>
  );
}

export default function JobBoard() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const filtered = MOCK_JOBS.filter(j => {
    const ms = j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase());
    const mf = activeFilter === "All" || j.tags.includes(activeFilter);
    return ms && mf;
  });
  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"32px 24px" }}>
      <div className="ai" style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:"'Dancing Script', cursive", fontSize:"2rem", color:C.textDark, marginBottom:4 }}>💼 Mother-Friendly Jobs</h1>
        <p style={{ color:C.textMid, fontSize:"0.88rem" }}>Curated remote & flexible opportunities — sourced via Apify's Google Jobs Scraper</p>
      </div>
      <div style={{ position:"relative", marginBottom:14 }}>
        <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", fontSize:"1rem" }}>🔍</span>
        <input className="search-input" placeholder="Search jobs…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:20 }}>
        {JOB_FILTERS.map(f => <button key={f} className={`filter-chip ${activeFilter===f?"active":""}`} style={{ background:activeFilter===f?undefined:`${C.lavender}22` }} onClick={() => setActiveFilter(f)}>{f}</button>)}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {filtered.map(job => <JobCard key={job.id} job={job} />)}
      </div>
    </div>
  );
}




