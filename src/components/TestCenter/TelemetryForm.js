import React, { useState } from 'react';
import { sendTelemetryData } from '../../services/api';
import { useAppContext } from '../../context/AppContext';

const TelemetryForm = () => {
  const [formData, setFormData] = useState({
    patient_id: '',
    heart_rate: '',
    oxygen_level: '',
    status: 'active'
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const { refreshData, patients } = useAppContext();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      console.log('Sending telemetry data:', {
        patient_id: formData.patient_id,
        heart_rate: parseInt(formData.heart_rate),
        oxygen_level: parseInt(formData.oxygen_level)
      });

      const response = await sendTelemetryData({
        patient_id: formData.patient_id,
        heart_rate: parseInt(formData.heart_rate),
        oxygen_level: parseInt(formData.oxygen_level)
      });

      console.log('Telemetry response:', response);

      setMessage({
        type: 'success',
        text: response.alert_triggered 
          ? `Data sent successfully! Alert triggered: ${response.issue}`
          : 'Telemetry data sent successfully!'
      });
      
      setFormData({
        patient_id: '',
        heart_rate: '',
        oxygen_level: '',
        status: 'active'
      });

      setTimeout(() => {
        refreshData();
      }, 1000);

    } catch (error) {
      console.error('Telemetry error:', error);
      setMessage({
        type: 'error',
        text: `Error: ${error.message}`
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="telemetry-form-container">
      {/* ===== Styles scoped to this component only (UI changes only) ===== */}
      <style>{`
        :root{
          --glass: rgba(255,255,255,0.06);
          --border: rgba(255,255,255,0.14);
          --muted: #d9d7ff;
          --success: #8ef0a5;
          --warn: #ffb84d;
          --danger: #ff6b6b;
          --primary1:#c084fc;
          --primary2:#7c5cff;
        }

        .telemetry-form-container{
          margin: 14px 0 18px;
          border: 1px solid var(--border);
          background: var(--glass);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.45);
          padding: 16px;
        }

        .telemetry-form-container h3{
          margin: 0 0 6px 0;
          letter-spacing: .3px;
          font-size: 20px;
        }

        .form-description{
          margin: 0 0 12px 0;
          color: var(--muted);
          font-size: 14px;
        }

        .telemetry-form{
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .form-row{
          display: grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 12px;
        }
        @media (max-width: 640px){
          .form-row{ grid-template-columns: 1fr; }
        }

        .form-group{
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group label{
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: .35px;
          color: var(--muted);
          font-weight: 800;
        }

        .form-control{
          appearance: none;
          background: rgba(255,255,255,0.08);
          border: 1px solid var(--border);
          color: #fff;
          border-radius: 12px;
          padding: 10px 12px;
          font-size: 14px;
          outline: none;
          transition: border-color .15s ease, box-shadow .15s ease, background .2s ease, transform .08s ease;
        }
        .form-control:focus{
          border-color: rgba(192,132,252,0.9);
          box-shadow: 0 0 0 4px rgba(124,92,255,0.18);
          background: rgba(255,255,255,0.12);
        }
        .form-control::placeholder{ color: #d7d4ff88; }

        .form-text{
          color: var(--muted);
          font-size: 12px;
        }

        /* Alert triggers panel */
        .alert-triggers-info{
          border: 1px dashed var(--border);
          border-radius: 12px;
          padding: 12px;
          background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.03));
        }
        .alert-triggers-info h4{
          margin: 0 0 6px 0;
          font-size: 14px;
          letter-spacing: .3px;
          text-transform: uppercase;
        }
        .alert-triggers-info ul{
          margin: 0; padding-left: 18px;
        }
        .alert-triggers-info li{
          margin: 4px 0;
          font-size: 14px;
        }
        .alert-triggers-info strong{
          font-weight: 900;
        }

        /* Success / error message */
        .form-message{
          border-radius: 12px;
          padding: 12px;
          font-weight: 800;
          border: 1px solid var(--border);
        }
        .form-message.success{
          background: rgba(142,240,165,0.14);
          color: var(--success);
          border-color: rgba(142,240,165,0.5);
        }
        .form-message.error{
          background: rgba(255,107,107,0.14);
          color: var(--danger);
          border-color: rgba(255,107,107,0.5);
        }

        /* Submit button with loading state */
        .submit-btn{
          position: relative;
          align-self: flex-start;
          background: linear-gradient(90deg, var(--primary1), var(--primary2));
          color: #0b0d1d;
          border: none;
          border-radius: 12px;
          padding: 12px 16px;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 10px 28px rgba(124,92,255,.32);
          transition: transform .12s ease, filter .2s ease, box-shadow .2s ease;
        }
        .submit-btn:hover{
          transform: translateY(-2px);
          filter: brightness(1.05);
          box-shadow: 0 14px 36px rgba(124,92,255,.5);
        }
        .submit-btn:disabled{
          opacity: .8;
          cursor: not-allowed;
          filter: grayscale(.15);
        }
        .submit-btn:disabled::before{
          content: "";
          position: absolute;
          left: 10px; top: 50%;
          width: 16px; height: 16px;
          transform: translateY(-50%);
          border: 2px solid rgba(0,0,0,0.35);
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin .9s linear infinite;
        }

        @keyframes spin{ to { transform: translateY(-50%) rotate(360deg); } }
      `}</style>

      <h3>Send Live Telemetry Data</h3>
      <p className="form-description">
        Simulate sending health data from wearable devices. Critical values will trigger email alerts.
      </p>

      <form onSubmit={handleSubmit} className="telemetry-form">
        <div className="form-group">
          <label htmlFor="patient_id">Patient ID</label>
          <select
            id="patient_id"
            name="patient_id"
            value={formData.patient_id}
            onChange={handleChange}
            required
            className="form-control"
          >
            <option value="">Select Patient</option>
            {patients && patients.length > 0 ? (
              patients.map(patient => (
                <option key={patient.patient_id} value={patient.patient_id}>
                  {patient.patient_id} - {patient.name}
                </option>
              ))
            ) : (
              <option disabled>No patients available</option>
            )}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="heart_rate">Heart Rate (bpm)</label>
            <input
              type="number"
              id="heart_rate"
              name="heart_rate"
              value={formData.heart_rate}
              onChange={handleChange}
              min="30"
              max="200"
              required
              className="form-control"
              placeholder="e.g., 75"
            />
            <small className="form-text">Normal: 60-100 bpm</small>
          </div>

          <div className="form-group">
            <label htmlFor="oxygen_level">Oxygen Level (%)</label>
            <input
              type="number"
              id="oxygen_level"
              name="oxygen_level"
              value={formData.oxygen_level}
              onChange={handleChange}
              min="70"
              max="100"
              required
              className="form-control"
              placeholder="e.g., 98"
            />
            <small className="form-text">Normal: 95-100%</small>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="status">Device Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-control"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        <div className="alert-triggers-info">
          <h4>Alert Triggers:</h4>
          <ul>
            <li><strong>High Priority:</strong> Heart Rate &lt;50 or &gt;120 bpm</li>
            <li><strong>High Priority:</strong> Oxygen Level &lt;90%</li>
            <li><strong>Medium Priority:</strong> Oxygen Level 90-94%</li>
          </ul>
        </div>

        {message && (
          <div className={`form-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <button 
          type="submit" 
          className="submit-btn"
          disabled={submitting}
        >
          {submitting ? 'Sending...' : 'Send Telemetry Data'}
        </button>
      </form>
    </div>
  );
};

export default TelemetryForm;
