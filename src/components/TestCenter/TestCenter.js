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

        /* TABLE STYLES */
        .table-responsive{
          width: 100%;
          overflow: auto;
          border-radius: 12px;
        }
        .patients-table{
          width: 100%;
          min-width: 820px;
          border-collapse: separate;
          border-spacing: 0;
          background: rgba(10,10,20,0.25);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 12px;
          overflow: hidden;
        }
        .patients-table thead th{
          position: sticky;
          top: 0;
          background: rgba(255,255,255,0.08);
          color: #e9e9ff;
          text-align: left;
          padding: 12px;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: .35px;
          border-bottom: 1px solid rgba(255,255,255,0.12);
        }
        .patients-table tbody td{
          padding: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          font-size: 14px;
        }
        .patients-table tbody tr:hover{
          background: rgba(255,255,255,0.06);
        }

        /* Status badge (reuse existing classes) */
        .status-indicator{
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.18);
          font-size: 12px;
          font-weight: 900;
        }
        .status-indicator.online{
          background: rgba(142,240,165,0.16);
          color:#8ef0a5;
        }
        .status-indicator.offline{
          background: rgba(255,107,107,0.14);
          color:#ff6b6b;
        }

        /* Vital chips reused for cell values */
        .vital{
          display:inline-flex;
          align-items:center;
          gap:6px;
          padding:6px 10px;
          border-radius:10px;
          border:1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06);
        }
        .vital-label{
          font-size:12px;
          text-transform:uppercase;
          letter-spacing:.3px;
          color:#e6e6ff;
          font-weight:800;
        }
        .vital-value{ font-weight:900; }
        .vital-value.normal{ color:#8ef0a5; }
        .vital-value.warning{ color:#ffb84d; }
        .vital-value.critical{ color:#ff6b6b; }

        .patient-id {
          font-size: 12px;
          letter-spacing: .3px;
          font-weight: 900;
          color: #dcd6ff;
        }
        .patient-name {
          font-size: 15px;
          font-weight: 800;
        }
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

        {/* Current Patients section (now displayed as a table) */}
        <div className="current-patients">
          <h3>Current Patients</h3>

          <div className="table-responsive">
            {patients && patients.length > 0 ? (
              <table className="patients-table">
                <thead>
                  <tr>
                    <th>Patient ID</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Heart Rate</th>
                    <th>Oxygen Level</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(patient => (
                    <tr key={patient.patient_id}>
                      <td><span className="patient-id">{patient.patient_id}</span></td>
                      <td><span className="patient-name">{patient.name}</span></td>
                      <td>
                        <span className={`status-indicator ${patient.connection_status.toLowerCase()}`}>
                          {patient.connection_status}
                        </span>
                      </td>
                      <td>
                        <span className="vital">
                          <span className="vital-label">HR</span>
                          <span className={`vital-value ${
                            patient.heart_rate > 100
                              ? 'critical'
                              : patient.heart_rate < 60
                              ? 'warning'
                              : 'normal'
                          }`}>
                            {patient.heart_rate || '--'} {patient.heart_rate ? 'bpm' : ''}
                          </span>
                        </span>
                      </td>
                      <td>
                        <span className="vital">
                          <span className="vital-label">O2</span>
                          <span className={`vital-value ${
                            patient.oxygen_level < 90
                              ? 'critical'
                              : patient.oxygen_level < 95
                              ? 'warning'
                              : 'normal'
                          }`}>
                            {patient.oxygen_level || '--'}{patient.oxygen_level ? '%' : ''}
                          </span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
