import React from 'react';
import { CheckCircle2, Circle, PlayCircle, Lock } from 'lucide-react';

const stages = [
  { id: 0, name: 'Strategic Definition', desc: 'Identify needs and initial feasibility.', status: 'completed' },
  { id: 1, name: 'Preparation and Brief', desc: 'Core team assembly and site surveys.', status: 'completed' },
  { id: 2, name: 'Concept Design', desc: 'Architectural sketches and basic layouts.', status: 'completed' },
  { id: 3, name: 'Spatial Coordination', desc: 'Planning Permission submitted & accepted.', status: 'current' },
  { id: 4, name: 'Technical Design', desc: 'Construction-ready technical specs.', status: 'upcoming' },
  { id: 5, name: 'Construction', desc: 'Physical building works on site.', status: 'upcoming' },
  { id: 6, name: 'Handover', desc: 'Inspections and building delivery.', status: 'upcoming' },
  { id: 7, name: 'Use', desc: 'Operational maintenance & evaluation.', status: 'upcoming' },
];

const TimelineCard = ({ stage }) => {
  const isCompleted = stage.status === 'completed';
  const isCurrent = stage.status === 'current';
  
  return (
    <div className="glass-panel" style={{
      display: 'flex',
      gap: 'var(--space-6)',
      padding: 'var(--space-6)',
      borderRadius: 'var(--radius-lg)',
      borderLeft: isCurrent ? '4px solid var(--color-primary)' : '1px solid var(--color-border)',
      opacity: stage.status === 'upcoming' ? 0.7 : 1,
      transition: 'var(--transition-normal)'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {isCompleted && <CheckCircle2 size={24} color="var(--color-primary)" />}
        {isCurrent && <PlayCircle size={24} color="var(--color-primary)" className="pulse-animation" />}
        {stage.status === 'upcoming' && <Circle size={24} color="var(--color-text-muted)" />}
      </div>
      
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
          <h3 style={{ fontSize: '1.125rem', color: isCurrent ? 'var(--color-primary-dark)' : 'inherit' }}>
            Stage {stage.id}: {stage.name}
          </h3>
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
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{stage.desc}</p>
      </div>
    </div>
  );
};

const Timeline = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <header>
        <h1 style={{ fontSize: '1.875rem', marginBottom: 'var(--space-1)' }}>RIBA Project Roadmap</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>The standard UK construction framework for the MOSQUE project.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: '800px' }}>
        {stages.map((stage) => (
          <TimelineCard key={stage.id} stage={stage} />
        ))}
      </div>
    </div>
  );
};

export default Timeline;
