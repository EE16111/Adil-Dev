import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, activeSection, onSectionChange }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar activeSection={activeSection} onSectionChange={onSectionChange} />
      <main style={{ 
        flex: 1, 
        marginLeft: '280px', 
        padding: 'var(--space-8)',
        backgroundColor: 'var(--color-bg)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
