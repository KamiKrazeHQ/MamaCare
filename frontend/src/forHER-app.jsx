import { useEffect, useState } from "react";
import ComingSoon from "./components/forHER/ComingSoon";
import Dashboard from "./components/forHER/Dashboard";
import GroceryList from "./components/forHER/GroceryList";
import Header from "./components/forHER/Header";
import JobBoard from "./components/forHER/JobBoard";
import ProfileHub from "./components/forHER/ProfileHub";
import Calendar from "./components/forHER/Calendar";
import ChatRoom from "./components/forHER/ChatRoom";
import DoctorAssistant from "./components/forHER/DoctorAssistant";
import { C, ensureForHerFonts, styles } from "./components/forHER/theme";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [savedJobs, setSavedJobs] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [calendarAddPromptToken, setCalendarAddPromptToken] = useState(0);

  const profile = {
    name: "Ida Wells",
    city: "UChicago Medicine OB/GYN - Chicago, IL",
    dueWeek: "Week 24",
  };

  const jobKey = (job) => `${job?.title || ""}|${job?.company || ""}|${job?.apply_link || ""}`;
  const groceryKey = (item) => `${item?.name || ""}|${item?.store || ""}|${item?.unit || ""}`;

  const isJobSaved = (job) => savedJobs.some((saved) => jobKey(saved) === jobKey(job));
  const isInCart = (item) => cartItems.some((cart) => groceryKey(cart) === groceryKey(item));

  const toggleSavedJob = (job) => {
    const key = jobKey(job);
    setSavedJobs((prev) => {
      const exists = prev.some((saved) => jobKey(saved) === key);
      if (exists) return prev.filter((saved) => jobKey(saved) !== key);
      return [job, ...prev];
    });
  };

  const toggleCartItem = (item) => {
    const key = groceryKey(item);
    setCartItems((prev) => {
      const exists = prev.some((cart) => groceryKey(cart) === key);
      if (exists) return prev.filter((cart) => groceryKey(cart) !== key);
      return [item, ...prev];
    });
  };

  useEffect(() => {
    ensureForHerFonts();
  }, []);

  const render = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            setActiveTab={setActiveTab}
            onRequestAddAppointment={() => setCalendarAddPromptToken((value) => value + 1)}
          />
        );
      case "jobs":
        return <JobBoard onToggleSaveJob={toggleSavedJob} isJobSaved={isJobSaved} />;
      case "groceries":
        return <GroceryList onToggleCartItem={toggleCartItem} isInCart={isInCart} />;
      case "doctor":
        return <DoctorAssistant />;
      case "chat":
        return <ChatRoom />;
      case "profile":
        return (
          <ProfileHub
            profile={profile}
            savedJobs={savedJobs}
            cartItems={cartItems}
            onToggleSaveJob={toggleSavedJob}
            onToggleCartItem={toggleCartItem}
          />
        );
      case "midwife":
        return (
          <ComingSoon
            icon="MW"
            title="Midwife Connect"
            color={C.mint}
            subtitle="Connect with certified midwives for holistic prenatal care - coming soon."
          />
        );
      case "calendar":
        return <Calendar addPromptToken={calendarAddPromptToken} />;
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
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          savedJobsCount={savedJobs.length}
          cartItemsCount={cartItems.length}
        />
        <main>{render()}</main>
      </div>
    </>
  );
}
