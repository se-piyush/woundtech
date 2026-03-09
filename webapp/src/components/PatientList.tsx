import { useState, useEffect } from 'react';
import { getPatients } from '../api';

export default function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const limit = 10;

  useEffect(() => {
    loadPatients();
  }, [page, search]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPatients({ page, limit, search });
      setPatients(data.data);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      setError('Failed to load patients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  if (loading && patients.length === 0) return <div className="loading">Loading patients...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by name, email, or phone..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="button">
            Search
          </button>
          {search && (
            <button
              type="button"
              className="button button-secondary"
              onClick={handleClearSearch}
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Results Info */}
      <div style={{ marginBottom: '12px', color: '#7f8c8d', fontSize: '14px' }}>
        Showing {patients.length} of {total} patients
        {search && ` for "${search}"`}
      </div>

      {patients.length === 0 ? (
        <div className="empty">No patients found</div>
      ) : (
        <>
          <div className="list">
            {patients.map((patient) => (
              <div key={patient.id} className="list-item">
                <div className="list-item-title">
                  {patient.firstName} {patient.lastName}
                </div>
                <div className="list-item-subtitle">
                  DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
                  {patient.email && ` • ${patient.email}`}
                  {patient.phone && ` • ${patient.phone}`}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="button button-secondary"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {page} of {totalPages}
              </span>
              <button
                className="button button-secondary"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
