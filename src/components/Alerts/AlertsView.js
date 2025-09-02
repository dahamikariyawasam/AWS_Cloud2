import React from 'react';
import { useAppContext } from '../../context/AppContext';

const AlertsView = ({ alerts }) => {
  const { loading, refreshData } = useAppContext();

  if (loading) {
    return (
      <div className="alerts-view">
        <h2>Alerts</h2>
        <div className="alerts-content">
          <p>Loading alerts...</p>
        </div>
      </div>
    );
  }

  const criticalAlerts = alerts?.filter(alert => alert.severity_level === 'high') || [];
  const unresolvedAlerts = alerts?.filter(alert => !alert.resolved) || [];

  return (
    <div className="alerts-view">
      {/* === Scoped styles for Alerts page (UI-only) === */}
      <style>{`
        .alerts-view {
          padding: 18px;
        }

        .alerts-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }
        .alerts-header h2 {
          margin: 0;
          font-size: 22px;
          letter-spacing: .3px;
        }

        /* Refresh button */
        .refresh-btn {
          border: 1px solid rgba(255,255,255,0.2);
          background: linear-gradient(90deg, rgba(255,255,255,0.16), rgba(255,255,255,0.08));
          color: #ffffff;
          border-radius: 12px;
          padding: 10px 14px;
          font-weight: 800;
          cursor: pointer;
          transition: transform .12s ease, filter .2s ease, box-shadow .15s ease;
          box-shadow: 0 8px 22px rgba(0,0,0,.25);
          backdrop-filter: blur(8px);
        }
        .refresh-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.07);
          box-shadow: 0 12px 28px rgba(0,0,0,.35);
        }
        .refresh-btn:active {
          transform: translateY(0);
        }

        /* Summary cards row */
        .alerts-summary {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 14px;
        }
        @media (max-width: 900px){
          .alerts-summary { grid-template-columns: 1fr; }
        }

        .alert-stat {
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 14px;
          box-shadow: 0 10px 26px rgba(0,0,0,.35);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .stat-label {
          color: #d7d7ff;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: .4px;
          font-weight: 700;
        }
        .stat-value {
          font-size: 26px;
          font-weight: 900;
          letter-spacing: .4px;
        }
        .stat-value.critical { color: #ff6b6b; }
        .stat-value.warning  { color: #ffb84d; }

        /* Container for list */
        .alerts-content {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 14px;
          padding: 14px;
          box-shadow: 0 10px 30px rgba(0,0,0,.45);
          backdrop-filter: blur(10px);
        }

        .no-alerts {
          text-align: center;
          padding: 24px 10px;
          color: #eee;
        }

        .alerts-list {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .alert-item {
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(15,15,30,0.35);
          border-radius: 14px;
          padding: 12px;
          box-shadow: 0 8px 22px rgba(0,0,0,.35);
          transition: transform .12s ease, background .2s ease, box-shadow .2s ease, border-color .2s ease;
        }
        .alert-item:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.18);
          box-shadow: 0 12px 28px rgba(0,0,0,.45);
        }

        /* Severity accents */
        .alert-item.high    { box-shadow: 0 8px 22px rgba(255,107,107,.25); }
        .alert-item.medium  { box-shadow: 0 8px 22px rgba(255,184,77,.20); }
        .alert-item.low     { box-shadow: 0 8px 22px rgba(124,92,255,.18); }

        .alert-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 8px;
          border-bottom: 1px dashed rgba(255,255,255,0.14);
          padding-bottom: 8px;
        }

        .alert-info {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .patient-id {
          font-weight: 800;
          font-size: 12px;
          color: #cfcfff;
          padding: 4px 8px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.06);
        }
        .patient-name {
          font-weight: 800;
          font-size: 14px;
          letter-spacing: .3px;
        }

        .severity-badge {
          font-weight: 900;
          font-size: 12px;
          padding: 6px 10px;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: .4px;
          border: 1px solid rgba(255,255,255,0.16);
        }
        .severity-badge.high   { background: rgba(255,107,107,0.18); color: #ff6b6b; }
        .severity-badge.medium { background: rgba(255,184,77,0.18); color: #ffb84d; }
        .severity-badge.low    { background: rgba(124,92,255,0.22); color: #c7b7ff; }

        .alert-time {
          color: #e8e8ff;
          font-size: 12px;
          opacity: .9;
        }

        .alert-body {
          margin-top: 6px;
          display: grid;
          gap: 6px;
        }
        .issue-detected {
          font-weight: 800;
          color: #fff;
        }
        .alert-message {
          color: #e6e6ff;
          opacity: .9;
        }

        .alert-status {
          margin-top: 10px;
        }
        .status-resolved {
          color: #8ef0a5;
          font-weight: 800;
        }
        .status-unresolved {
          color: #ffb84d;
          font-weight: 800;
        }
      `}</style>

      <div className="alerts-header">
        <h2> There are {alerts?.length || 0} alerts in total</h2>
        <button onClick={refreshData} className="refresh-btn">
          Refresh
        </button>
      </div>
      
      {/* Summary cards */}
      <div className="alerts-summary">
        <div className="alert-stat">
          <span className="stat-label">Critical</span>
          <span className="stat-value critical">{criticalAlerts.length}</span>
        </div>
        <div className="alert-stat">
          <span className="stat-label">Unresolved</span>
          <span className="stat-value warning">{unresolvedAlerts.length}</span>
        </div>
        <div className="alert-stat">
          <span className="stat-label">Total Today</span>
          <span className="stat-value">{alerts?.length || 0}</span>
        </div>
      </div>

      <div className="alerts-content">
        {!alerts || alerts.length === 0 ? (
          <div className="no-alerts">
            <p>No alerts at this time.</p>
          </div>
        ) : (
          <div className="alerts-list">
            {alerts.map(alert => (
              <div 
                key={alert.alert_id} 
                className={`alert-item ${alert.severity_level} ${alert.resolved ? 'resolved' : 'unresolved'}`}
              >
                <div className="alert-header">
                  <div className="alert-info">
                    <span className="patient-id">{alert.patient_id}</span>
                    <span className="patient-name">{alert.patient_name}</span>
                    <span className={`severity-badge ${alert.severity_level}`}>
                      {alert.severity_level}
                    </span>
                  </div>
                  <div className="alert-time">
                    {new Date(alert.datetime).toLocaleString()}
                  </div>
                </div>
                <div className="alert-body">
                  <div className="issue-detected">{alert.issue_detected}</div>
                  {alert.message && (
                    <div className="alert-message">{alert.message}</div>
                  )}
                </div>
                <div className="alert-status">
                  {alert.resolved ? (
                    <span className="status-resolved">✓ Resolved</span>
                  ) : (
                    <span className="status-unresolved">⚠ Unresolved</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsView;
