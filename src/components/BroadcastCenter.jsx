import React, { useState } from 'react';
import { Share2, MessageSquare, Image, Send, Layout, Newspaper } from 'lucide-react';

const BroadcastCenter = () => {
  const [message, setMessage] = useState('');
  const [includeStats, setIncludeStats] = useState(true);

  const statsSnippet = "\n\n📊 Build Progress: 18%\n🏘️ Phase: RIBA Stage 3\n🏗️ Status: Planning Approved";

  const handleWhatsAppShare = () => {
    const finalMessage = encodeURIComponent(message + (includeStats ? statsSnippet : ''));
    window.open(`https://wa.me/?text=${finalMessage}`, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <header>
        <h1 style={{ fontSize: '1.875rem', marginBottom: 'var(--space-1)' }}>Community Broadcast</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Draft and send project updates to your WhatsApp Community.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--space-8)' }}>
        <div className="glass-panel" style={{ padding: 'var(--space-8)', borderRadius: 'var(--radius-lg)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Newspaper size={20} className="text-primary" />
            Draft Update
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Example: Alhumdulillah, today we received formal approval for the technical structural designs..."
              style={{ 
                width: '100%', 
                height: '200px', 
                backgroundColor: 'rgba(255,255,255,0.05)', 
                border: '1px solid var(--color-border)', 
                borderRadius: 'var(--radius-md)',
                color: 'white',
                padding: 'var(--space-4)',
                fontSize: '1rem',
                resize: 'none',
                outline: 'none'
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <input 
                type="checkbox" 
                checked={includeStats} 
                onChange={(e) => setIncludeStats(e.target.checked)}
                id="includeStats"
              />
              <label htmlFor="includeStats" style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Include Live Project Stats in message
              </label>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
              <button 
                onClick={handleWhatsAppShare}
                className="btn-primary" 
                style={{ flex: 1, justifyContent: 'center', gap: 'var(--space-2)' }}
              >
                <MessageSquare size={18} />
                Share to WhatsApp
              </button>
              <button className="btn-primary" style={{ backgroundColor: 'var(--color-surface-muted)', color: 'var(--color-text)', gap: 'var(--space-2)' }}>
                <Image size={18} />
                Attach Photo
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div className="glass-panel" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-4)' }}>Live Preview</h3>
            <div style={{ 
              backgroundColor: '#075e54', 
              color: 'white', 
              padding: 'var(--space-4)', 
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              whiteSpace: 'pre-wrap',
              borderLeft: '4px solid #25d366'
            }}>
              {message || "Drafting..."}
              {includeStats && <span style={{ color: '#dcf8c6' }}>{statsSnippet}</span>}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-primary)' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>Pro Tip</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              Updates with photos receive 4x more engagement from the community. Choose an image from the <b>Document Vault</b> to accompany this text.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BroadcastCenter;
