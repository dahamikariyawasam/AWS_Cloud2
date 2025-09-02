import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import PatientForm from './PatientForm';
import { createPatient, updatePatient, deletePatient } from '../../services/api';

const PatientsView = ({ patients }) => {
  const { loading, refreshData } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleAddPatient = () => {
    setEditingPatient(null);
    setShowForm(true);
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleDeletePatient = (patient) => {
    setDeleteConfirm(patient);
  };

  const confirmDelete = async () => {
    try {
      await deletePatient(deleteConfirm.patient_id);
      setDeleteConfirm(null);
      refreshData();
    } catch (error) {
      console.error('Delete error:', error);
      alert(`Error deleting patient: ${error.message}`);
    }
  };

  const handleSavePatient = async (patientData) => {
    try {
      if (editingPatient) {
        await updatePatient(editingPatient.patient_id, patientData);
      } else {
        await createPatient(patientData);
      }
      setShowForm(false);
      setEditingPatient(null);
      refreshData();
    } catch (error) {
      throw error;
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPatient(null);
  };

  if (loading) {
    return (
      <div className="patients-view">
        <h2>Patients</h2>
        <div className="patients-content">
          <p>Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="patients-view">
      {/* === Scoped styles for this page only === */}
      <style>{`
        .patients-view {
          padding: 18px;
        }

        .patients-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }

        .patients-header h2 {
          margin: 0;
          font-size: 22px;
          letter-spacing: .3px;
        }

        .add-patient-btn, .add-first-patient-btn {
          background: linear-gradient(90deg, #a78bfa, #7c5cff);
          color: #0b0d1d;
          border: none;
          border-radius: 10px;
          padding: 10px 14px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 8px 22px rgba(124,92,255,.32);
          transition: transform .15s ease, box-shadow .15s ease, filter .2s ease;
        }
        .add-patient-btn:hover, .add-first-patient-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.05);
          box-shadow: 0 12px 28px rgba(124,92,255,.45);
        }

        .patients-content {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 14px;
          padding: 14px;
          backdrop-filter: blur(10px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        }

        .no-patients {
          text-align: center;
          padding: 24px 10px;
        }

        .table-responsive {
          width: 100%;
          overflow: auto;
          border-radius: 10px;
        }

        .patients-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          min-width: 960px;
          background: rgba(10,10,20,0.25);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 10px;
          overflow: hidden;
        }

        .patients-table thead th {
          position: sticky;
          top: 0;
          background: rgba(255,255,255,0.08);
          color: #e9e9ff;
          text-align: left;
          padding: 12px 12px;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: .4px;
          border-bottom: 1px solid rgba(255,255,255,0.12);
        }

        .patients-table tbody td {
          padding: 12px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          font-size: 14px;
        }

        .patients-table tbody tr:hover {
          background: rgba(255,255,255,0.06);
        }

        .patient-offline {
          background: rgba(255,255,255,0.03);
        }

        /* vital coloring */
        .critical { color: #ff6b6b; font-weight: 700; }
        .warning  { color: #ffb84d; font-weight: 700; }
        .normal   { color: #8ef0a5; font-weight: 700; }

        /* status badge */
        .status-badge {
          padding: 6px 10px;
          border-radius: 999px;
          font-weight: 800;
          font-size: 12px;
          letter-spacing: .3px;
          display: inline-block;
          border: 1px solid rgba(255,255,255,0.12);
        }
        .status-badge.online  { background: rgba(56, 203, 137, 0.15); color: #8ef0a5; }
        .status-badge.offline { background: rgba(255, 107, 107, 0.12); color: #ff6b6b; }

        /* action buttons (text-only) */
        .action-buttons {
          display: flex;
          gap: 8px;
        }
        .edit-btn, .delete-btn {
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.08);
          color: #ffffff;
          border-radius: 10px;
          padding: 8px 12px;
          font-weight: 700;
          cursor: pointer;
          transition: transform .12s ease, filter .2s ease, background .2s ease, border-color .2s ease;
        }
        .edit-btn:hover {
          background: rgba(124,92,255,0.25);
          border-color: rgba(167,139,250,0.7);
          transform: translateY(-1px);
        }
        .delete-btn:hover {
          background: rgba(255,107,107,0.22);
          border-color: rgba(255,107,107,0.7);
          transform: translateY(-1px);
        }

        /* delete confirm modal */
        .delete-confirm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1200;
          padding: 16px;
        }
        .delete-confirm-modal {
          width: min(520px, 96vw);
          background: rgba(18,18,32,0.95);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 14px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.6);
          padding: 18px;
        }
        .delete-confirm-modal h3 {
          margin: 0 0 8px;
          font-size: 18px;
        }
        .warning-text {
          color: #ffb84d;
          margin-top: 6px;
          font-size: 13px;
        }
        .confirm-actions {
          margin-top: 14px;
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }
        .cancel-btn, .confirm-delete-btn {
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.08);
          color: #fff;
          border-radius: 10px;
          padding: 10px 14px;
          font-weight: 800;
          cursor: pointer;
          transition: transform .12s ease, background .2s ease, border-color .2s ease;
        }
        .cancel-btn:hover {
          background: rgba(255,255,255,0.16);
          transform: translateY(-1px);
        }
        .confirm-delete-btn {
          background: rgba(255,107,107,0.18);
          border-color: rgba(255,107,107,0.6);
        }
        .confirm-delete-btn:hover {
          background: rgba(255,107,107,0.28);
          transform: translateY(-1px);
        }
      `}</style>

      <div className="patients-header">
        <h2>Patients ({patients?.length || 0})</h2>
        <button onClick={handleAddPatient} className="add-patient-btn">
          + Add New Patient
        </button>
      </div>
      
      <div className="patients-content">
        {!patients || patients.length === 0 ? (
          <div className="no-patients">
            <p>No patients found.</p>
            <button onClick={handleAddPatient} className="add-first-patient-btn">
              Add Your First Patient
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="patients-table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Medical Conditions</th>
                  <th>Heart Rate</th>
                  <th>Oxygen Level</th>
                  <th>Last Reading</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(patient => (
                  <tr key={patient.patient_id} className={patient.connection_status === 'Offline' ? 'patient-offline' : ''}>
                    <td>{patient.patient_id}</td>
                    <td>{patient.name}</td>
                    <td>{patient.age}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.medical_conditions}</td>
                    <td className={patient.heart_rate > 100 ? 'critical' : patient.heart_rate < 60 ? 'warning' : 'normal'}>
                      {patient.heart_rate || '--'} {patient.heart_rate ? 'bpm' : ''}
                    </td>
                    <td className={patient.oxygen_level < 90 ? 'critical' : patient.oxygen_level < 95 ? 'warning' : 'normal'}>
                      {patient.oxygen_level || '--'}{patient.oxygen_level ? '%' : ''}
                    </td>
                    <td>{patient.last_reading ? new Date(patient.last_reading).toLocaleString() : 'No data'}</td>
                    <td>
                      <span className={`status-badge ${patient.connection_status.toLowerCase()}`}>
                        {patient.connection_status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleEditPatient(patient)}
                          className="edit-btn"
                          title="Edit Patient"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeletePatient(patient)}
                          className="delete-btn"
                          title="Delete Patient"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Patient Form Modal */}
      {showForm && (
        <PatientForm
          patient={editingPatient}
          onSave={handleSavePatient}
          onCancel={handleCancelForm}
          isEditing={!!editingPatient}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-modal">
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete patient <strong>{deleteConfirm.name}</strong> ({deleteConfirm.patient_id})?
            </p>
            <p className="warning-text">
              This will also delete all associated telemetry data and alerts.
            </p>
            <div className="confirm-actions">
              <button onClick={() => setDeleteConfirm(null)} className="cancel-btn">
                Cancel
              </button>
              <button onClick={confirmDelete} className="confirm-delete-btn">
                Delete Patient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientsView;
