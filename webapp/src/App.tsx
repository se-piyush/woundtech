import { useState } from 'react';
import './App.css';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import ClinicianList from './components/ClinicianList';
import PatientList from './components/PatientList';
import CreateVisitForm from './components/CreateVisitForm';
import VisitsTable from './components/VisitsTable';

function App() {
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('clinicians');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleVisitCreated = () => {
    // Trigger refresh of visits table
    setRefreshTrigger((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="loading" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <>
      <header className="header">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>WoundTech - Patient Visit Tracker</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {user && (
              <span style={{ fontSize: '14px', opacity: 0.9 }}>
                {user.email}
              </span>
            )}
            <button
              onClick={() => logout()}
              className="button button-secondary"
              style={{ padding: '8px 16px' }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container">
        {/* Tabs Navigation */}
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'clinicians' ? 'active' : ''}`}
            onClick={() => setActiveTab('clinicians')}
          >
            Clinicians
          </button>
          <button
            className={`tab-button ${activeTab === 'patients' ? 'active' : ''}`}
            onClick={() => setActiveTab('patients')}
          >
            Patients
          </button>
          <button
            className={`tab-button ${activeTab === 'visits' ? 'active' : ''}`}
            onClick={() => setActiveTab('visits')}
          >
            Visits
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'clinicians' && (
            <section className="section">
              <h2 className="section-title">Clinicians</h2>
              <ClinicianList />
            </section>
          )}

          {activeTab === 'patients' && (
            <section className="section">
              <h2 className="section-title">Patients</h2>
              <PatientList />
            </section>
          )}

          {activeTab === 'visits' && (
            <>
              <section className="section">
                <h2 className="section-title">Create New Visit</h2>
                <CreateVisitForm onSuccess={handleVisitCreated} />
              </section>

              <section className="section">
                <h2 className="section-title">View Visits</h2>
                <VisitsTable refreshTrigger={refreshTrigger} />
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default App;
