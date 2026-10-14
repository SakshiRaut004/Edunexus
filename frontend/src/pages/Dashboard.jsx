import { createElement, lazy, Suspense, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FiBarChart2,
  FiBookOpen,
  FiCalendar,
  FiLogOut,
  FiMenu,
  FiSearch,
  FiTrendingUp,
  FiUsers,
  FiX,
} from "react-icons/fi";

const Analytics = lazy(() => import("./analytics"));
const Scheduler = lazy(() => import("./Scheduler"));
const ContentStudio = lazy(() => import("./ContentStudio"));
const InnovationHub = lazy(() => import("./InnovationHub"));
const Trends = lazy(() => import("./Trends"));
const Profile = lazy(() => import("./Profile"));

const navigation = [
  { id: "community", label: "Faculty network", icon: FiUsers, component: InnovationHub },
  { id: "analytics", label: "Class records", icon: FiBarChart2, component: Analytics },
  { id: "scheduler", label: "Teaching schedule", icon: FiCalendar, component: Scheduler },
  { id: "content", label: "AI lesson studio", icon: FiBookOpen, component: ContentStudio },
  { id: "trends", label: "Research trends", icon: FiTrendingUp, component: Trends },
  { id: "profile", label: "My profile", icon: FiUsers, component: Profile },
];

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
}

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [feedSearch, setFeedSearch] = useState("");
  const activeId = navigation.some(({ id }) => id === searchParams.get("view"))
    ? searchParams.get("view")
    : "community";
  const activePage = navigation.find(({ id }) => id === activeId);
  const ActiveIcon = activePage.icon;
  const ActiveComponent = activePage.component;
  const user = getUser();
  const initials = (user.name || "Faculty")
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const selectPage = (id) => {
    setSearchParams(id === "community" ? {} : { view: id });
    setMobileMenuOpen(false);
  };

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.assign("/");
  };

  return (
    <div className="edu-shell">
      <aside className={`edu-sidebar ${mobileMenuOpen ? "is-open" : ""}`}>
        <a className="edu-brand" href="/dashboard" aria-label="EduNexus home">
          <span className="edu-brand-mark">e</span>
          <span>EduNexus<small>Faculty collective</small></span>
        </a>

        <div className="edu-nav-caption">YOUR WORKSPACE</div>
        <nav className="edu-navigation" aria-label="Workspace">
          {navigation.map(({ id, label, icon }) => (
            <button
              className={`edu-nav-item ${activeId === id ? "is-active" : ""}`}
              key={id}
              onClick={() => selectPage(id)}
              aria-current={activeId === id ? "page" : undefined}
            >
              {createElement(icon, { "aria-hidden": true })}
              <span>{label}</span>
              {id === "community" && <span className="edu-nav-indicator" />}
            </button>
          ))}
        </nav>

        <div className="edu-sidebar-bottom">
          <div className="edu-sidebar-note">
            <span className="edu-note-mark">✳</span>
            <strong>Good teaching travels.</strong>
            <span>Share what works with colleagues everywhere.</span>
          </div>
          <button className="edu-signout" onClick={signOut}>
            <FiLogOut aria-hidden="true" /> Sign out
          </button>
          <div className="edu-profile-mini">
            <span className="edu-avatar">{initials}</span>
            <span className="edu-profile-name">{user.name || "Faculty member"}<small>{user.email || "Your profile"}</small></span>
          </div>
        </div>
      </aside>

      {mobileMenuOpen && (
        <button
          className="edu-menu-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <main className="edu-main">
        <header className="edu-topbar">
          <button
            className="edu-icon-button edu-mobile-menu"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
          <div className="edu-breadcrumb"><span>Workspace</span><b>/</b><strong>{activePage.label}</strong></div>
          <div className="edu-topbar-right">
            {activeId === "community" && <label className="edu-topbar-search"><FiSearch aria-hidden="true" /><input aria-label="Search the faculty network" placeholder="Search the network" value={feedSearch} onChange={(event) => setFeedSearch(event.target.value)} /></label>}
            <span className="edu-network-status"><i /> Faculty network</span>
            <span className="edu-avatar edu-avatar-small">{initials}</span>
          </div>
        </header>

        <div className="edu-page-heading">
          <div>
            <div className="edu-eyebrow"><ActiveIcon aria-hidden="true" /> FACULTY COLLECTIVE</div>
            <h1>{activeId === "community" ? `Welcome${user.name ? `, ${user.name.split(" ")[0]}` : " to your network"}` : activePage.label}</h1>
            <p>{activeId === "community" ? "Ideas, milestones and classroom practice, shared across disciplines." : "Your teaching workspace, all in one place."}</p>
          </div>
          {activeId === "community" && (
            <button
              className="edu-primary-button"
              onClick={() => document.getElementById("community-composer")?.focus()}
            >
              <span>+</span> Share an idea
            </button>
          )}
        </div>

        <div className="edu-content-grid">
          <section className="edu-content-main" aria-label={activePage.label}>
            <Suspense fallback={<div className="edu-section-loading">Opening your workspace...</div>}>
              <ActiveComponent searchQuery={feedSearch} />
            </Suspense>
          </section>
          {activeId === "community" && (
            <aside className="edu-right-rail" aria-label="Workspace shortcuts">
              <div className="edu-rail-card edu-rail-highlight">
                <span className="edu-rail-icon">✳</span>
                <span className="edu-rail-label">TEACHING, REIMAGINED</span>
                <h2>Make a complex idea click.</h2>
                <p>Turn your next topic into structured, level-aware lesson material with AI.</p>
                <button onClick={() => selectPage("content")}>Open AI lesson studio <span>↗</span></button>
              </div>
              <div className="edu-rail-card edu-shortcuts">
                <h2>Pick up where you left off</h2>
                <button onClick={() => selectPage("scheduler")}><FiCalendar /> Plan a class <span>→</span></button>
                <button onClick={() => selectPage("analytics")}><FiBarChart2 /> Review class records <span>→</span></button>
                <button onClick={() => selectPage("trends")}><FiTrendingUp /> Explore research trends <span>→</span></button>
              </div>
              <p className="edu-rail-footnote">A shared space for better teaching.</p>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}