import { useEffect, useState } from "react";
import ComingSoon from "./components/forHER/ComingSoon";
import Dashboard from "./components/forHER/Dashboard";
import GroceryList from "./components/forHER/GroceryList";
import Header from "./components/forHER/Header";
import JobBoard from "./components/forHER/JobBoard";
import { C, ensureForHerFonts, styles } from "./components/forHER/theme";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    ensureForHerFonts();
  }, []);

  const render = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard setActiveTab={setActiveTab} />;
      case "jobs":
        return <JobBoard />;
      case "groceries":
        return <GroceryList />;
      case "doctor":
        return (
          <ComingSoon
            icon="👩‍⚕️"
            title="Doctor Finder"
            color={C.peach}
            subtitle="Search and book prenatal specialist appointments near you - coming soon."
          />
        );
      case "chat":
        return (
          <ComingSoon
            icon="💬"
            title="Support Chat"
            color={C.sky}
            subtitle="Talk to certified doulas, nurses, and other mamas 24/7 - launching soon."
          />
        );
      case "midwife":
        return (
          <ComingSoon
            icon="🌿"
            title="Midwife Connect"
            color={C.mint}
            subtitle="Connect with certified midwives for holistic prenatal care - coming soon."
          />
        );
      case "calendar":
        return (
          <ComingSoon
            icon="📅"
            title="Pregnancy Calendar"
            color={C.yellow}
            subtitle="Track appointments, milestones, and baby's growth week by week - coming soon."
          />
        );
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="floating-blob" style={{ width: 500, height: 500, background: C.lavender, top: -120, right: -100 }} />
      <div className="floating-blob" style={{ width: 400, height: 400, background: C.peach, bottom: -60, left: -80 }} />
      <div className="floating-blob" style={{ width: 300, height: 300, background: C.mint, top: "45%", left: "28%" }} />
      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <main>{render()}</main>
      </div>
    </>
  );
}
