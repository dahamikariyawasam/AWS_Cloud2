import React from 'react';

const DashboardView = ({ stats, alerts, onNavigate, patients }) => {
  // Calculate stats from patients data as fallback (UNCHANGED)
  const totalPatients = patients?.length || 0;
  const activePatients = patients?.filter(p => p.connection_status === 'Online').length || 0;
  const criticalAlertsToday = patients?.filter(
    p => p.heart_rate < 50 || p.heart_rate > 120 || p.oxygen_level < 90
  ).length || 0;
  const unresolvedAlerts = alerts?.filter(alert => !alert.resolved).length || 0;

  const avgHeartRate =
    patients?.length > 0
      ? Math.round(
          patients.reduce((sum, p) => sum + (p.heart_rate || 0), 0) / patients.length
        )
      : 0;

  const avgOxygenLevel =
    patients?.length > 0
      ? Math.round(
          patients.reduce((sum, p) => sum + (p.oxygen_level || 0), 0) / patients.length
        )
      : 0;

  return (
    <div className="dashboard-view ui-modern">
      {/* ===== Inline styles scoped to this component (no external CSS file) ===== */}
      <style>{`
        :root {
          --bg: #0f1226;
          --bg-soft: rgba(255,255,255,0.06);
          --card: rgba(255,255,255,0.08);
          --card-hover: rgba(255,255,255,0.14);
          --text: #e9ecff;
          --muted: #b8bde6;
          --accent1: #7c5cff;
          --accent2: #00d6d1;
          --success: #3bd671;
          --warning: #ffb84d;
          --danger:  #ff6b6b;
          --shadow: 0 10px 30px rgba(0,0,0,0.35);
          --glass: blur(10px) saturate(140%);
        }

        .ui-modern {
          min-height: 100%;
          padding: 24px;
          background:
            radial-gradient(1200px 600px at 10% -10%, rgba(124,92,255,0.25), transparent 55%),
            radial-gradient(1000px 800px at 90% 0%, rgba(0,214,209,0.18), transparent 55%),
            linear-gradient(180deg, #0b0d1d, #0f1226 40%);
          color: var(--text);
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial;
        }

        .ui-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 18px;
        }

        .ui-title {
          margin: 0;
          font-size: 26px;
          letter-spacing: 0.3px;
          font-weight: 700;
        }

        .ui-accent-pill {
          padding: 8px 12px;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--accent1), var(--accent2));
          color: #0b0d1d;
          font-weight: 700;
          font-size: 12px;
          box-shadow: var(--shadow);
          white-space: nowrap;
        }

        .ui-content {
          margin-top: 12px;
          border-radius: 18px;
          background: var(--bg-soft);
          -webkit-backdrop-filter: var(--glass);
          backdrop-filter: var(--glass);
          padding: 18px;
          box-shadow: var(--shadow);
          border: 1px solid rgba(255,255,255,0.07);
        }

        .ui-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }
        @media (max-width: 1100px) {
          .ui-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
        }
        @media (max-width: 640px) {
          .ui-grid { grid-template-columns: 1fr; }
        }

        .ui-card {
          border-radius: 16px;
          padding: 16px;
          background: var(--card);
          transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
          box-shadow: var(--shadow);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .ui-card:hover {
          transform: translateY(-4px);
          background: var(--card-hover);
          box-shadow: 0 16px 40px rgba(0,0,0,0.45);
        }
        .clickable { cursor: pointer; }

        .ui-card-title {
          margin: 0 0 8px 0;
          font-size: 13px;
          color: var(--muted);
          font-weight: 700;
          letter-spacing: 0.4px;
          text-transform: uppercase;
        }

        .ui-metric {
          margin: 0;
          font-size: 34px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }
        .ui-metric.success { color: var(--success); }
        .ui-metric.warning { color: var(--warning); }
        .ui-metric.danger  { color: var(--danger); }

        .ui-row { margin-top: 16px; }
        .ui-row-inner {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .ui-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-radius: 999px;
          background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04));
          border: 1px solid rgba(255,255,255,0.08);
          -webkit-backdrop-filter: var(--glass);
          backdrop-filter: var(--glass);
          color: var(--text);
          font-size: 13px;
        }

        .stat-label { color: var(--muted); }
        .stat-value { font-weight: 700; }

        .ui-critical {
          margin-top: 18px;
        }
        .ui-section-title {
          margin: 0 0 10px 0;
          font-size: 18px;
          letter-spacing: 0.3px;
        }
        .ui-critical-box {
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: space-between;
          padding: 14px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.1);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.05)),
            radial-gradient(600px 160px at 10% 0%, rgba(255,107,107,0.18), transparent 55%);
          box-shadow: var(--shadow);
        }
        .ui-critical-text {
          margin: 0;
          color: var(--danger);
          font-weight: 700;
          letter-spacing: 0.2px;
        }

        .ui-button {
          border: none;
          outline: none;
          padding: 10px 14px;
          font-weight: 800;
          border-radius: 12px;
          color: #0b0d1d;
          background: linear-gradient(90deg, var(--accent2), var(--accent1));
          box-shadow: 0 8px 24px rgba(124,92,255,0.35);
          transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.2s ease;
        }
        .ui-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(124,92,255,0.5);
          filter: brightness(1.05);
        }
      `}</style>

      {/* ===== Header ===== */}
      <div className="ui-header">
        <h2 className="ui-title">Dashboard</h2>
        <div className="ui-accent-pill">Realtime Monitoring</div>
      </div>

      {/* ===== Content Wrapper ===== */}
      <div className="dashboard-content ui-content">
        {/* ===== Stats Grid ===== */}
        <div className="stats-grid ui-grid">
          <div
            className="stat-card ui-card clickable"
            onClick={() => onNavigate && onNavigate('patients')}
          >
            <h3 className="ui-card-title">Total Patients</h3>
            <p className="ui-metric">{stats?.total_patients || totalPatients}</p>
          </div>

          <div className="stat-card ui-card">
            <h3 className="ui-card-title">Active Patients</h3>
            <p className="ui-metric success">{stats?.active_patients || activePatients}</p>
          </div>

          <div
            className="stat-card ui-card clickable"
            onClick={() => onNavigate && onNavigate('alerts')}
          >
            <h3 className="ui-card-title">Critical Alerts Today</h3>
            <p className="ui-metric danger">
              {stats?.critical_alerts_today || criticalAlertsToday}
            </p>
          </div>

          <div className="stat-card ui-card">
            <h3 className="ui-card-title">Unresolved Alerts</h3>
            <p className="ui-metric warning">
              {stats?.unresolved_alerts || unresolvedAlerts}
            </p>
          </div>
        </div>

        {/* ===== Chip Row ===== */}
        <div className="additional-stats ui-row">
          <div className="stat-row ui-row-inner">
            <div className="stat-item ui-chip">
              <span className="stat-label">Avg Heart Rate Today:</span>
              <span className="stat-value">
                {stats?.avg_heart_rate_today || avgHeartRate} bpm
              </span>
            </div>
            <div className="stat-item ui-chip">
              <span className="stat-label">Avg Oxygen Level Today:</span>
              <span className="stat-value">
                {stats?.avg_oxygen_level_today || avgOxygenLevel}%
              </span>
            </div>
            <div className="stat-item ui-chip">
              <span className="stat-label">Total Alerts Today:</span>
              <span className="stat-value">
                {stats?.total_alerts_today || alerts?.length || 0}
              </span>
            </div>
          </div>
        </div>

        {/* ===== Conditional Critical Section ===== */}
        {stats?.critical_alerts_today > 0 && (
          <div className="critical-alerts-section ui-critical">
            <h3 className="ui-section-title">⚠️ Critical Alerts Today</h3>
            <div className="alert-summary ui-critical-box">
              <p className="ui-critical-text">
                {stats.critical_alerts_today} critical alert(s) detected today
              </p>
              <button
                className="view-alerts-btn ui-button"
                onClick={() => onNavigate && onNavigate('alerts')}
              >
                View All Alerts
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardView;
