import React from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  FileText, 
  CheckSquare, 
  Calendar, 
  Settings,
  Building2,
  Share2
} from 'lucide-react';
import '../styles/global.css';

const Sidebar = ({ activeSection, onSectionChange }) => {
  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { name: 'Timeline', icon: <Calendar size={20} />, label: 'RIBA Timeline' },
    { name: 'Vault', icon: <FileText size={20} />, label: 'Document Vault' },
    { name: 'Tasks', icon: <CheckSquare size={20} />, label: 'Tasks' },
    { name: 'Broadcast', icon: <Share2 size={20} />, label: 'Community' },
    { name: 'Site', icon: <MapPin size={20} />, label: 'Site Visits' },
  ];


  return (
    <div style={{
      width: '280px',
      height: '100vh',
      backgroundColor: 'var(--color-surface)',
      borderRight: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--space-6)',
      position: 'fixed',
      left: 0,
      top: 0
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 'var(--space-3)', 
        marginBottom: 'var(--space-8)',
        padding: '0 var(--space-2)'
      }}>
        <div style={{
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          padding: 'var(--space-2)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Building2 size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, letterSpacing: '0.05em' }}>MOSQUE</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>Community Project Manager</p>
        </div>
      </div>

      <nav style={{ flex: 1 }}>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          {navItems.map((item, index) => (
            <li key={index}>
              <button 
                onClick={() => onSectionChange(item.name)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  color: activeSection === item.name ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  backgroundColor: activeSection === item.name ? 'var(--color-surface-muted)' : 'transparent',
                  fontWeight: activeSection === item.name ? 600 : 400,
                  transition: 'var(--transition-fast)'
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
        <a href="#" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          padding: 'var(--space-3) var(--space-4)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-text-muted)',
          transition: 'var(--transition-fast)'
        }}>
          <Settings size={20} />
          <span>Settings</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
