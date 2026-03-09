import { useState, useEffect } from 'react';
import { getClinicians, getPatients, getVisits } from '../api';
import type { Clinician, Patient, Visit } from '../types';
import Combobox from './Combobox';

interface VisitsTableProps {
  refreshTrigger?: number;
}

export default function VisitsTable({ refreshTrigger }: VisitsTableProps) {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [clinicians, setClinicians] = useState<Clinician[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [clinicianFilter, setClinicianFilter] = useState('');
  const [patientFilter, setPatientFilter] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (refreshTrigger) {
      loadVisits();
    }
  }, [refreshTrigger]);

  useEffect(() => {
    loadVisits();
  }, [clinicianFilter, patientFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cliniciansData, patientsData] = await Promise.all([
        getClinicians({ limit: 100 }),
        getPatients({ limit: 100 }),
      ]);
      setClinicians(cliniciansData.data);
      setPatients(patientsData.data);
      await loadVisits();
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadVisits = async () => {
    try {
      setError(null);
      const params: any = {};
      if (clinicianFilter) params.clinicianId = clinicianFilter;
      if (patientFilter) params.patientId = patientFilter;

      const data = await getVisits(params);
      setVisits(data.data);
    } catch (err) {
      setError('Failed to load visits');
      console.error(err);
    }
  };

  const handleClearFilters = () => {
    setClinicianFilter('');
    setPatientFilter('');
  };

  // Prepare options for combobox
  const clinicianOptions = clinicians.map((clinician) => ({
    value: clinician.id,
    label: `${clinician.firstName} ${clinician.lastName}${
      clinician.specialty ? ` - ${clinician.specialty}` : ''
    }`,
  }));

  const patientOptions = patients.map((patient) => ({
    value: patient.id,
    label: `${patient.firstName} ${patient.lastName}`,
  }));

  if (loading) return <div className="loading">Loading visits...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="filter-bar">
        <Combobox
          id="clinicianFilter"
          label="Filter by Clinician"
          options={clinicianOptions}
          value={clinicianFilter}
          onChange={setClinicianFilter}
          placeholder="Search or select clinician..."
        />

        <Combobox
          id="patientFilter"
          label="Filter by Patient"
          options={patientOptions}
          value={patientFilter}
          onChange={setPatientFilter}
          placeholder="Search or select patient..."
        />

        {(clinicianFilter || patientFilter) && (
          <button
            type="button"
            className="button button-secondary"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        )}
      </div>

      {visits.length === 0 ? (
        <div className="empty">No visits found</div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Visit Date</th>
                <th>Clinician</th>
                <th>Patient</th>
                <th>Diagnosis</th>
                <th>Treatment</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((visit) => (
                <tr key={visit.id}>
                  <td>
                    {new Date(visit.visitDate).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </td>
                  <td>
                    {visit.clinician.firstName} {visit.clinician.lastName}
                  </td>
                  <td>
                    {visit.patient.firstName} {visit.patient.lastName}
                  </td>
                  <td>{visit.diagnosis || '-'}</td>
                  <td>{visit.treatment || '-'}</td>
                  <td>{visit.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
