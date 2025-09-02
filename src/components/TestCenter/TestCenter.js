import React from 'react';
import TelemetryForm from './TelemetryForm';

const TestCenter = ({ patients }) => {
  return (
    <div className="test-center">
      {/* ===== Scoped styles (UI only, no functional changes) ===== */}
      <style>{`
        .test-center {
          padding: 18px;
        }

        .test-center h2 {
          margin: 0 0 10px 0;
          font-size: 24px;
          letter-spacing: .3px;
        }

        .test-center-content {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.45);
          backdrop-filter: blur(10px);
        }

        /* Top description / hero */
        .test-description {
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 14px;
          padding: 14px;
          margin-bottom: 14px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.05)),
            radial-gradient(600px 160px at 6% 0%, rgba(124,92,255,0.16), transparent 60%);
        }
        .test-title {
          margin: 0 0 6px 0;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: .3px;
        }
        .test-subtitle {
          margin: 0;
          color: #e9e9ff;
          font-size: 14px;
        }

        /* Current patients */
        .current-patients {
          margin-top: 18px;
        }
        .current-patients h3 {
          margin: 0 0 10px 0;
          font-size: 18px;
          letter-spacing: .3px;
        }

        .patients-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0,1fr));
          gap: 12px;
        }
        @media (max-width: 1200px) {
          .patients-grid { grid-template-columns: repeat(3, minmax(0,1fr)); }
        }
        @media (max-width: 900px) {
          .patients-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
        }
        @media (max-width: 560px) {
          .patients-grid { grid-template-columns: 1fr; }
        }

        .patient-card {
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 14px;
          padding: 12px;
          background: rgba(10,10,20,0.28);
          box-shadow: 0 12px 30px rgba(0,0,0,0.45);
          transition: transform .12s ease, background .2s ease, border-color .2s ease;
        }
        .patient-card:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.2);
        }

        .patient-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 6px;
        }
        .patient-id {
          font-size: 12px;
          letter-spacing: .3px;
          font-weight: 900;
          color: #dcd6ff;
        }
        .status-indicator {
          padding: 4px 8px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.2);
          font-size: 12px;
          font-weight: 800;
        }
        .status-indicator.online {
          background: rgba(142,240,165,0.16);
          color: #8ef0a5;
        }
        .status-indicator.offline {
          background: rgba(255,107,107,0.14);
          color: #ff6b6b;
        }

        .patient-name {
          font-size: 16px;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .patient-vitals {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .vital {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 10px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06);
        }
        .vital-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: .3px;
          color: #e6e6ff;
          font-weight: 800;
        }
        .vital-value {
          font-weight: 900;
        }
        .vital-value.normal  { color: #8ef0a5; }
        .vital-value.warning { color: #ffb84d; }
        .vital-value.critical{ color: #ff6b6b; }
      `}</style>

      {/* Headline & description (text changed as requested) */}
      <h2>Send Live Telemetry Data</h2>
      <div className="test-center-content">
        <div className="test-description">
          <p className="test-title">Simulate sending health data from wearable devices</p>
          <p className="test-subtitle">
            Critical values will trigger email alerts via AWS SNS.
          </p>
        </div>

        {/* Form unchanged (functional) */}
        <TelemetryForm />

        {/* Current Patients section (styled only) */}
        <div className="current-patients">
          <h3>Current Patients</h3>
          <div className="patients-grid">
            {patients && patients.length > 0 ? (
              patients.map(patient => (
                <div key={patient.patient_id} className="patient-card">
                  <div className="patient-header">
                    <span className="patient-id">{patient.patient_id}</span>
                    <span className={`status-indicator ${patient.connection_status.toLowerCase()}`}>
                      {patient.connection_status}
                    </span>
                  </div>
                  <div className="patient-name">{patient.name}</div>
                  <div className="patient-vitals">
                    <div className="vital">
                      <span className="vital-label">HR:</span>
                      <span
                        className={`vital-value ${
                          patient.heart_rate > 100
                            ? 'critical'
                            : patient.heart_rate < 60
                            ? 'warning'
                            : 'normal'
                        }`}
                      >
                        {patient.heart_rate || '--'} bpm
                      </span>
                    </div>
                    <div className="vital">
                      <span className="vital-label">O2:</span>
                      <span
                        className={`vital-value ${
                          patient.oxygen_level < 90
                            ? 'critical'
                            : patient.oxygen_level < 95
                            ? 'warning'
                            : 'normal'
                        }`}
                      >
                        {patient.oxygen_level || '--'}%
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No patients available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCenter;
