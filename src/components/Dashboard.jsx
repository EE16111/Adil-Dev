import React, { useEffect, useState } from 'react';
import { TrendingUp, FileText, CheckCircle2, AlertCircle, Clock, Users } from 'lucide-react';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const StatCard = ({ icon: Icon, label, value, color, subtext }) => (
  <div className="glass-panel" style={{ 
    padding: 'var(--space-6)', 
    borderRadius: 'var(--radius-lg)',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)'
  }}>
    <div style={{ color, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Icon size={24} />
      {subtext && (
        <div style={{ 
          fontSize: '0.75rem', 
          padding: '0.25rem 0.5rem', 
          borderRadius: 'var(--radius-full)', 
          backgroundColor: `${color}10`,
          color: color 
        }}>
          {subtext}
        </div>
      )}
    </div>
    <div style={{ marginTop: 'var(--space-2)' }}>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{label}</p>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    buildProgress: 0,
    stakeholderQueries: 0,
    daysToMilestone: 0,
    currentPhase: "Loading...",
    planningStatus: "..."
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'mosque_stats', 'current'), (doc) => {
      if (doc.exists()) {
        setStats(doc.data());
      }
    });
    return unsub;
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <header>
        <h1 style={{ fontSize: '1.875rem', marginBottom: 'var(--space-1)' }}>Project Status</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Real-time coordination for the Ealing Mosque Development.</p>
      </header>

      {/* Stats Grid */}
      <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
        <StatCard 
          icon={TrendingUp} 
          label="Build Phase" 
          value={`${stats.buildProgress}%`} 
          color="var(--color-primary)" 
          subtext="On Track"
        />
        <StatCard 
          icon={Users} 
          label="Stakeholder Queries" 
          value={stats.stakeholderQueries} 
          color="var(--color-accent)" 
          subtext="Active"
        />
        <StatCard 
          icon={Clock} 
          label="Days to Milestone" 
          value={stats.daysToMilestone} 
          color="var(--color-primary-light)" 
          subtext="Next: RIBA Stage 4"
        />
        <StatCard 
          icon={AlertCircle} 
          label="Planning Status" 
          value={stats.planningStatus} 
          color="#ef4444" 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-8)' }}>
        {/* Progress Timeline Block */}
          <div className="glass-panel" style={{ padding: 'var(--space-8)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <h2 style={{ fontSize: '1.25rem' }}>{stats.currentPhase}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div className="pulse-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></div>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.875rem' }}>Live Feed</span>
              </div>
            </div>

          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              Current Focus: Refining structural specifications and coordinating with local authorities.
            </p>
            <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--color-surface-muted)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${stats.buildProgress}%`, backgroundColor: 'var(--color-primary)', borderRadius: '4px', transition: 'width 1s ease-in-out' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              <span>Conceptual Approval</span>
              <span>{stats.buildProgress}% Completed</span>
              <span>Technical Design</span>
            </div>
          </div>
        </div>

        {/* Quick Actions / Recent activity */}
        <div className="glass-panel" style={{ padding: 'var(--space-8)', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-6)' }}>Coordination</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>New Broadcast</button>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', backgroundColor: 'var(--color-accent)' }}>Log Query</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

