import { useState } from "react";
import { C } from "./theme";
import { GROCERY_CATS, MOCK_GROCERIES } from "./data";

function GroceryCard2({ item }) {
  const [inCart, setInCart] = useState(false);
  return (
    <div className="card grocery-card" style={{ opacity:inCart?0.6:1, transition:"opacity 0.3s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div style={{ display:"flex", gap:11, alignItems:"center" }}>
          <div style={{ width:46, height:46, borderRadius:13, background:`${C.mint}66`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.6rem" }}>{item.emoji}</div>
          <div>
            <h3 style={{ fontSize:"0.92rem", fontWeight:700, color:C.textDark, marginBottom:2 }}>{item.name}</h3>
            <p style={{ fontSize:"0.76rem", color:C.textMid }}>{item.unit} · {item.store}</p>
          </div>
        </div>
        <div style={{ textAlign:"right" }}><p style={{ fontWeight:700, color:C.textDark }}>{item.price}</p><p style={{ fontSize:"0.7rem", color:C.textMid }}>⭐ {item.rating}</p></div>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:12 }}>
        <span className="pill" style={{ background:`${C.mint}66`, color:"#3a7a5a" }}>💚 {item.benefit}</span>
        <button className={inCart?"btn-ghost":"btn-primary"} style={{ fontSize:"0.76rem", padding:"6px 14px" }} onClick={() => setInCart(!inCart)}>{inCart?"✓ Added":"+ Add"}</button>
      </div>
    </div>
  );
}

export default function GroceryList() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const filtered = MOCK_GROCERIES.filter(g => g.name.toLowerCase().includes(search.toLowerCase()) && (cat === "All" || g.category === cat));
  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"32px 24px" }}>
      <div className="ai" style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:"'Dancing Script', cursive", fontSize:"2rem", color:C.textDark, marginBottom:4 }}>🛒 Prenatal Essentials</h1>
        <p style={{ color:C.textMid, fontSize:"0.88rem" }}>Hand-picked nutritious groceries for you and your baby</p>
      </div>
      <div style={{ position:"relative", marginBottom:14 }}>
        <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", fontSize:"1rem" }}>🔍</span>
        <input className="search-input" placeholder="Search groceries…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:20 }}>
        {GROCERY_CATS.map(c => <button key={c} className={`filter-chip ${cat===c?"active":""}`} style={{ background:cat===c?undefined:`${C.mint}33` }} onClick={() => setCat(c)}>{c}</button>)}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:14 }}>
        {filtered.map(item => <GroceryCard2 key={item.id} item={item} />)}
      </div>
    </div>
  );
}




