import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, PlayCircle, ChevronDown, ChevronUp, Save, Loader2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';

const statusOptions = ['completed', 'current', 'upcoming'];

const statusColors = {
  completed: 'var(--color-primary)',
  current: 'var(--color-accent)',
  upcoming: 'var(--color-text-muted)'
};

const statusIcons = {
  completed: CheckCircle2,
  current: PlayCircle,
  upcoming: Circle
};

const TimelineCard = ({ stage, adminMode, onStatusChange }) => {
  const isCompleted = stage.status === 'completed';
  const isCurrent = stage.status === 'current';
  const StatusIcon = statusIcons[stage.status] || Circle;
  
  return (
    <div className="glass-panel" style={{
      display: 'flex',
      gap: 'var(--space-6)',
      padding: 'var(--space-6)',
      borderRadius: 'var(--radius-lg)',
      borderLeft: isCurrent ? '4px solid var(--color-primary)' : isCompleted ? '4px solid var(--color-primary-light)' : '1px solid var(--color-border)',
      opacity: stage.status === 'upcoming' ? 0.65 : 1,
      transition: 'all 0.3s ease'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
        <StatusIcon
          size={24}
          color={statusColors[stage.status]}
          className={isCurrent ? 'pulse-dot' : ''}
          style={isCurrent ? { borderRadius: '50%' } : {}}
        />
      </div>
      
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
          <h3 style={{ fontSize: '1.125rem', color: isCurrent ? 'var(--color-primary-dark)' : 'inherit' }}>
            Stage {stage.id}: {stage.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {isCurrent && (
              <span style={{ 
                backgroundColor: 'var(--color-primary-light)', 
                color: 'white', 
                fontSize: '0.75rem', 
                padding: '2px 8px', 
                borderRadius: 'var(--radius-full)'
              }}>
                Active
              </span>
            )}
            {adminMode && (
              <select
                value={stage.status}
                onChange={(e) => onStatusChange(stage.firestoreId, e.target.value)}
                style={{
                  backgroundColor: 'var(--color-surface-muted)',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {statusOptions.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            )}
          </div>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{stage.desc}</p>
        {stage.lastUpdated && (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', marginTop: 'var(--space-1)', fontStyle: 'italic' }}>
            Last updated: {new Date(stage.lastUpdated).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};

const Timeline = () => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminMode, setAdminMode] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'project_timeline'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const stagesData = snapshot.docs.map(d => ({
        firestoreId: d.id,
        ...d.data()
      }));
      setStages(stagesData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (firestoreId, newStatus) => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'project_timeline', firestoreId), {
        status: newStatus,
        lastUpdated: new Date().toISOString()
      });
    } catch (err) {
      console.error('Failed to update stage:', err);
      alert('Failed to update. Check console.');
    } finally {
      setSaving(false);
    }
  };

  const completedCount = stages.filter(s => s.status === 'completed').length;
  const progressPct = stages.length > 0 ? Math.round((completedCount / stages.length) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: 'var(--space-1)' }}>RIBA Project Roadmap</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>The standard UK construction framework for the MOSQUE project.</p>
        </div>
        <button
          onClick={() => setAdminMode(!adminMode)}
          className={adminMode ? 'btn-primary' : ''}
          style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
            padding: 'var(--space-2) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            border: adminMode ? 'none' : '1px solid var(--color-border)',
            backgroundColor: adminMode ? 'var(--color-primary)' : 'var(--color-surface)',
            color: adminMode ? 'white' : 'var(--color-text-muted)',
            fontSize: '0.875rem', cursor: 'pointer', transition: 'var(--transition-fast)'
          }}
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          {adminMode ? 'Exit Admin' : 'Admin Mode'}
        </button>
      </header>

      {/* Progress Summary */}
      <div className="glass-panel" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Overall Progress</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{completedCount} / {stages.length} Stages Complete</span>
        </div>
        <div style={{
          height: '8px', width: '100%', backgroundColor: 'var(--color-surface-muted)',
          borderRadius: '4px', overflow: 'hidden'
        }}>
          <div style={{
            height: '100%', width: `${progressPct}%`,
            backgroundColor: 'var(--color-primary)', borderRadius: '4px',
            transition: 'width 1s ease-in-out'
          }} />
        </div>
      </div>

      {/* Timeline Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-text-muted)' }}>
          <Loader2 className="animate-spin" style={{ margin: '0 auto' }} />
          <p>Loading timeline...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: '800px' }}>
          {stages.map((stage) => (
            <TimelineCard
              key={stage.firestoreId}
              stage={stage}
              adminMode={adminMode}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Timeline;
