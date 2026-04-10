import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Timeline from './components/Timeline';
import DocumentVault from './components/DocumentVault';
import TaskManager from './components/TaskManager';
import BroadcastCenter from './components/BroadcastCenter';
import Login from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './styles/global.css';

const AppContent = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('Dashboard');

  if (!user) {
    return <Login />;
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'Dashboard': return <Dashboard />;
      case 'Timeline': return <Timeline />;
      case 'Vault': return <DocumentVault />;
      case 'Tasks': return <TaskManager />;
      case 'Broadcast': return <BroadcastCenter />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activeSection={activeSection} setActiveSection={setActiveSection}>
      {renderSection()}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
