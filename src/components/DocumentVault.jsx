import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter, Folder, ExternalLink, Upload, Loader2 } from 'lucide-react';
import { db, storage } from '../firebase';
import { collection, onSnapshot, query, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const DocumentVault = () => {
  const [filter, setFilter] = useState('All');
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const categories = ['All', 'Planning', 'Engineering', 'Legal', 'Health & Safety'];

  useEffect(() => {
    const q = query(collection(db, 'mosque_documents'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDocs(docsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `documents/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'mosque_documents'), {
        name: file.name,
        url: downloadURL,
        category: 'Planning', // Default for now
        date: new Date().toISOString().split('T')[0],
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  const filteredDocs = filter === 'All' ? docs : docs.filter(d => d.category === filter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: 'var(--space-1)' }}>Document Vault</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Secure repository for all MOSQUE construction documents.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <input
            type="file"
            id="file-upload"
            onChange={handleUpload}
            style={{ display: 'none' }}
          />
          <label 
            htmlFor="file-upload" 
            className="btn-primary" 
            style={{ 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-2)',
              pointerEvents: uploading ? 'none' : 'auto',
              opacity: uploading ? 0.7 : 1
            }}
          >
            {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
            {uploading ? 'Uploading...' : 'Upload New File'}
          </label>
        </div>
      </header>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', overflowX: 'auto', paddingBottom: 'var(--space-2)' }}>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: filter === cat ? 'var(--color-primary)' : 'var(--color-surface)',
              color: filter === cat ? 'white' : 'var(--color-text-muted)',
              border: `1px solid ${filter === cat ? 'var(--color-primary)' : 'var(--color-border)'}`,
              fontSize: '0.875rem',
              whiteSpace: 'nowrap',
              transition: 'var(--transition-fast)'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Docs Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-text-muted)' }}>
          <Loader2 className="animate-spin" style={{ margin: '0 auto' }} />
          <p>Loading documents...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
          {filteredDocs.map(doc => (
            <a 
              key={doc.id} 
              href={doc.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="glass-panel" 
              style={{ 
                padding: 'var(--space-6)', 
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)',
                transition: 'var(--transition-normal)',
                cursor: 'pointer',
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ color: 'var(--color-primary)', backgroundColor: 'var(--color-surface-muted)', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)' }}>
                  <FileText size={24} />
                </div>
                <ExternalLink size={16} color="var(--color-text-muted)" />
              </div>
              
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '2px' }}>{doc.name}</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{doc.category} • {doc.date}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{doc.size}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-primary-light)', fontWeight: 600 }}>Open File</span>
              </div>
            </a>
          ))}
          {filteredDocs.length === 0 && (
            <div style={{ textAlign: 'center', padding: 'var(--space-12)', gridColumn: '1 / -1', color: 'var(--color-text-muted)' }}>
               No documents found in this category.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentVault;

