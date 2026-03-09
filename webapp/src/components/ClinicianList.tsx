import { useState, useEffect } from 'react';
import { getClinicians } from '../api';
import type { Clinician } from '../types';

export default function ClinicianList() {
  const [clinicians, setClinicians] = useState<Clinician[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const limit = 10;

  useEffect(() => {
    loadClinicians();
  }, [page, search]);

  const loadClinicians = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getClinicians({ page, limit, search });
      setClinicians(data.data);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      setError('Failed to load clinicians');
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

  if (loading && clinicians.length === 0) return <div className="loading">Loading clinicians...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by name, email, or specialty..."
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
        Showing {clinicians.length} of {total} clinicians
        {search && ` for "${search}"`}
      </div>

      {clinicians.length === 0 ? (
        <div className="empty">No clinicians found</div>
      ) : (
        <>
          <div className="list">
            {clinicians.map((clinician) => (
              <div key={clinician.id} className="list-item">
                <div className="list-item-title">
                  {clinician.firstName} {clinician.lastName}
                </div>
                <div className="list-item-subtitle">
                  {clinician.email}
                  {clinician.specialty && ` • ${clinician.specialty}`}
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
