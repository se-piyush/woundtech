import { useState, useEffect } from 'react';
import { getClinicians, getPatients, createVisit } from '../api';
import Combobox from './Combobox';

export default function CreateVisitForm({ onSuccess }: CreateVisitFormProps) {
  const [clinicians, setClinicians] = useState<Clinician[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<CreateVisitInput>({
    clinicianId: '',
    patientId: '',
    visitDate: new Date().toISOString().split('T')[0] + 'T10:00',
    notes: '',
    diagnosis: '',
    treatment: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cliniciansData, patientsData] = await Promise.all([
        getClinicians({ limit: 100 }),
        getPatients({ limit: 100 }),
      ]);
      setClinicians(cliniciansData.data);
      setPatients(patientsData.data);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(false);
      
      // Convert visitDate to ISO format
      const visitData = {
        ...formData,
        visitDate: new Date(formData.visitDate).toISOString(),
      };
      
      await createVisit(visitData);
      
      // Show success message
      setSuccess(true);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
      // Reset form
      setFormData({
        clinicianId: '',
        patientId: '',
        visitDate: new Date().toISOString().split('T')[0] + 'T10:00',
        notes: '',
        diagnosis: '',
        treatment: '',
      });
      
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create visit');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    label: `${patient.firstName} ${patient.lastName} - DOB: ${
      new Date(patient.dateOfBirth).toLocaleDateString()
    }`,
  }));

  if (loading) return <div className="loading">Loading form data...</div>;

  return (
    <form className="form" onSubmit={handleSubmit}>
      {success && <div className="success">✓ Visit created successfully!</div>}
      {error && <div className="error">{error}</div>}

      <Combobox
        id="clinicianId"
        label="Clinician"
        options={clinicianOptions}
        value={formData.clinicianId}
        onChange={(value) => setFormData((prev) => ({ ...prev, clinicianId: value }))}
        placeholder="Search or select clinician..."
        required
      />

      <Combobox
        id="patientId"
        label="Patient"
        options={patientOptions}
        value={formData.patientId}
        onChange={(value) => setFormData((prev) => ({ ...prev, patientId: value }))}
        placeholder="Search or select patient..."
        required
      />

      <div className="form-group">
        <label htmlFor="visitDate" className="form-label">
          Visit Date & Time *
        </label>
        <input
          type="datetime-local"
          id="visitDate"
          name="visitDate"
          className="form-input"
          value={formData.visitDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="notes" className="form-label">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          className="form-textarea"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Enter visit notes..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="diagnosis" className="form-label">
          Diagnosis
        </label>
        <input
          type="text"
          id="diagnosis"
          name="diagnosis"
          className="form-input"
          value={formData.diagnosis}
          onChange={handleChange}
          placeholder="Enter diagnosis..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="treatment" className="form-label">
          Treatment
        </label>
        <textarea
          id="treatment"
          name="treatment"
          className="form-textarea"
          value={formData.treatment}
          onChange={handleChange}
          placeholder="Enter treatment plan..."
        />
      </div>

      <button type="submit" className="button" disabled={submitting}>
        {submitting ? 'Creating...' : 'Create Visit'}
      </button>
    </form>
  );
}
