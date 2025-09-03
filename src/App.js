import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Common/Header';
import Navigation from './components/Common/Navigation';
import LoadingSpinner from './components/Common/LoadingSpinner';
import ErrorAlert from './components/Common/ErrorAlert';
import DashboardView from './components/Dashboard/DashboardView';
import { useAppContext } from './context/AppContext';

// Import other views
const PatientsView = React.lazy(() => import('./components/Patients/PatientsView'));
const AlertsView = React.lazy(() => import('./components/Alerts/AlertsView'));
const TestCenter = React.lazy(() => import('./components/TestCenter/TestCenter'));

const MainContent = () => {
  const { patients, alerts, stats, loading, error, clearError } = useAppContext();
  const [activeTab, setActiveTab] = useState('dashboard');

  // === NEW: burger/drawer state ===
  const [menuOpen, setMenuOpen] = useState(false);
  const handleNavigate = (tab) => {
    setActiveTab(tab);
    setMenuOpen(false); // close drawer after navigation
  };

  const renderContent = () => {
    if (loading && patients.length === 0 && alerts.length === 0 && Object.keys(stats).length === 0) {
      return (
        <div className="loading-container">
          <LoadingSpinner />
        </div>
      );
    }

    return (
      <React.Suspense fallback={<LoadingSpinner />}>
        {activeTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            alerts={alerts}
            patients={patients}
            onNavigate={handleNavigate}
          />
        )}
        {activeTab === 'patients' && <PatientsView patients={patients} />}
        {activeTab === 'alerts' && <AlertsView alerts={alerts} />}
        {activeTab === 'test' && <TestCenter patients={patients} />}
      </React.Suspense>
    );
  };

  return (
    <div className="app purple-theme">
      {/* === Scoped styles (white nav burger + animated right drawer) === */}
      <style>{`
        :root{
          --bg1:#2d0a4e; --bg2:#1a0029;
          --card:rgba(255,255,255,0.06);
          --border:rgba(255,255,255,0.12);
          --text:#ffffff;
          --muted:#e6e6e6;
          --accent:#ffffff;
        }

        body, .app {
          font-family: 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(180deg, var(--bg1), var(--bg2));
          color: var(--text);
          margin: 0;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 16px;
          position: relative;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
        }

        .content-area {
          flex: 1;
          padding: 16px;
          border-radius: 12px;
          background: var(--card);
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          border: 1px solid var(--border);
        }

        /* ===== Original top Navigation kept but visually hidden (not removed) ===== */
        .top-nav-hidden { height: 0; overflow: hidden; }
        .top-nav-hidden nav { display: none !important; }

        /* ===== Burger button (top-right) in WHITE ===== */
        .burger-wrap{
          position: fixed;
          top: 18px;
          right: 18px;
          z-index: 1100;
        }
        .burger{
          width: 46px; height: 46px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.12);
          display: inline-flex; align-items: center; justify-content: center;
          cursor: pointer;
          box-shadow: 0 10px 28px rgba(0,0,0,0.45);
          transition: transform .2s ease, box-shadow .2s ease, filter .2s ease, background .2s ease;
          backdrop-filter: blur(8px);
        }
        .burger:hover{ transform: translateY(-2px); filter: brightness(1.05); background: rgba(255,255,255,0.18); }
        .burger:active{ transform: translateY(0); }

        .lines{ position: relative; width: 24px; height: 16px; }
        .line{
          position: absolute; left:0; right:0; height: 2px; border-radius: 999px;
          background: var(--accent);
          transition: transform .35s cubic-bezier(.2,.9,.2,1), opacity .25s ease, top .35s cubic-bezier(.2,.9,.2,1), bottom .35s cubic-bezier(.2,.9,.2,1);
        }
        .line.top{ top: 0; }
        .line.mid{ top: 7px; }
        .line.bot{ bottom: 0; }

        /* morph to X */
        .burger.open .line.top{ top: 7px; transform: rotate(45deg); }
        .burger.open .line.mid{ opacity: 0; transform: translateX(6px); }
        .burger.open .line.bot{ bottom: 7px; transform: rotate(-45deg); }

        /* ===== Right Drawer (WHITE text) ===== */
        .drawer{
          position: fixed; top: 0; right: 0;
          width: min(86vw, 340px); height: 100vh;
          background: rgba(20,0,40,0.96);
          color: var(--text);
          transform: translateX(100%);
          transition: transform .38s cubic-bezier(.2,.9,.2,1);
          z-index: 1090;
          box-shadow: -18px 0 40px rgba(0,0,0,0.55), inset 1px 0 0 var(--border);
          backdrop-filter: blur(12px);
          display: flex; flex-direction: column;
        }
        .drawer.open{ transform: translateX(0); }

        .drawer-header{
          display:flex; align-items:center; justify-content:space-between;
          padding: 16px 16px 12px 16px;
          border-bottom: 1px solid var(--border);
          background: rgba(255,255,255,0.06);
        }
        .drawer-title{ margin:0; font-weight:800; letter-spacing:.4px; font-size:16px; color:#fff; }
        .close-btn{
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.12);
          color: #fff;
          padding: 8px 10px; border-radius: 10px; cursor: pointer;
          transition: filter .2s ease, transform .2s ease, background .2s ease;
        }
        .close-btn:hover{ filter: brightness(1.1); transform: translateY(-1px); background: rgba(255,255,255,0.18); }

        .drawer-body{ padding: 14px; overflow-y:auto; flex:1; }

        /* Vertical nav inside drawer */
        .drawer-body nav, .drawer-body .nav{
          display:flex; flex-direction:column; gap:8px;
        }
        .drawer-body button{
          text-align:left;
          padding:12px 14px; border-radius:12px;
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.08);
          color:#fff; cursor:pointer; font-weight:700;
          transition: transform .15s ease, background .2s ease, border-color .2s ease;
        }
        .drawer-body button:hover{
          transform: translateX(-2px);
          background: rgba(255,255,255,0.18);
          border-color: rgba(255,255,255,0.6);
        }
        .drawer-body button.active{
          background: rgba(255,255,255,0.24);
          border-color: rgba(255,255,255,0.85);
          box-shadow: 0 10px 24px rgba(0,0,0,0.25) inset, 0 8px 20px rgba(0,0,0,0.35);
        }

        /* Overlay */
        .overlay{
          position: fixed; inset: 0; background: rgba(0,0,0,0.5);
          opacity: 0; pointer-events: none; transition: opacity .25s ease; z-index: 1080;
        }
        .overlay.show{ opacity:1; pointer-events:auto; }

        /* Footer (kept exactly as you provided) */
        .footer {
          background: #210036;
          padding: 24px 16px;
          margin-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .footer-content {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .footer-section { flex: 1 1 200px; }
        .footer h6 { margin: 0 0 10px; font-size: 16px; font-weight: 700; color: #ffffff; }
        .footer p, .footer li, .footer a {
          margin: 4px 0; font-size: 14px; color: #ffffff; text-decoration: none;
        }
        .footer a:hover { color: #ffffff; text-decoration: underline; }
        .system-status { color: #8ef0a5; font-weight: 700; }
        .footer-bottom {
          margin-top: 18px; text-align: center; font-size: 13px; color: #ffffff;
          border-top: 1px solid rgba(255,255,255,0.25); padding-top: 12px;
        }
      `}</style>

      {/* === Top-right burger (WHITE) === */}
      <div className="burger-wrap">
        <button
          aria-label="Open menu"
          aria-expanded={menuOpen}
          className={`burger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="lines" aria-hidden="true">
            <span className="line top"></span>
            <span className="line mid"></span>
            <span className="line bot"></span>
          </div>
        </button>
      </div>

      <Header />

      <main className="main-content">
        {error && <ErrorAlert message={error} onClose={clearError} />}

        {/* ==== Keep the original Navigation in the DOM (not removed), but hidden ==== */}
        <div className="top-nav-hidden">
          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* ==== Animated right-side drawer that shows Navigation ==== */}
        <aside className={`drawer ${menuOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
          <div className="drawer-header">
            <h4 className="drawer-title">Menu</h4>
            <button className="close-btn" onClick={() => setMenuOpen(false)}>Close</button>
          </div>
          <div className="drawer-body">
            <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </aside>

        {/* Clickable overlay */}
        <div className={`overlay ${menuOpen ? 'show' : ''}`} onClick={() => setMenuOpen(false)} />

        {/* Main Content */}
        <div className="content-area">{renderContent()}</div>

        {/* Footer (unchanged structure) */}
        <footer className="footer">
          <div className="footer-content">
            {/* Company Info */}
            <div className="footer-section">
              <h6>MediSys Diagnostics Ltd.</h6>
              <p>Health Analytics and Monitoring Dashboard</p>
              <p>This dashboard provides a continuous overview of patient health, 
                ensuring that vital signs and clinical data are updated in real time.</p>
              <p><span className="system-status">Online System </span></p>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h6>Quick Links</h6>
              <ul style={{listStyle: 'none', padding: 0}}>
                <li><a href="#">Dashboard</a></li>
                <li><a href="#">Patients</a></li>
                <li><a href="#">Alerts</a></li>
                <li><a href="#">Test Center</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-section">
              <h6>Contact Us</h6>
              <p>Email: support@medisys.com</p>
              <p>Tel: +94 11 234 5678</p>
              <p>Address: Colombo, Sri Lanka</p>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2025 MediSys Diagnostics Ltd. | All Rights Reserved</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

const App = () => (
  <AppProvider>
    <MainContent />
  </AppProvider>
);

export default App;
