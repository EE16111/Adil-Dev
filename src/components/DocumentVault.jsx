import React, { useState, useEffect, useRef } from 'react';
import { FileText, Search, Upload, Loader2, Trash2, X, FileImage, FileSpreadsheet, File, AlertTriangle } from 'lucide-react';
import { db, storage } from '../firebase';
import { collection, onSnapshot, query, addDoc, deleteDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const getFileIcon = (name) => {
  if (!name) return File;
  const ext = name.split('.').pop().toLowerCase();
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) return FileImage;
  if (['xls', 'xlsx', 'csv'].includes(ext)) return FileSpreadsheet;
  return FileText;
};

const UploadDialog = ({ open, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [category, setCategory] = useState('Planning');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const categories = ['Planning', 'Engineering', 'Legal', 'Health & Safety', 'Financial'];

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setError(`File too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum is 50MB.`);
      setSelectedFile(null);
      return;
    }
    setError('');
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError('');

    try {
      const storageRef = ref(storage, `documents/${Date.now()}_${selectedFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on('state_changed',
        (snapshot) => {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(pct);
        },
        (err) => {
          setError('Upload failed: ' + err.message);
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, 'mosque_documents'), {
            name: selectedFile.name,
            url: downloadURL,
            storagePath: storageRef.fullPath,
            category: category,
            date: new Date().toISOString().split('T')[0],
            size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
            createdAt: serverTimestamp()
          });
          setUploading(false);
          setSelectedFile(null);
          setProgress(0);
          onClose();
        }
      );
    } catch (err) {
      setError('Upload failed: ' + err.message);
      setUploading(false);
    }
  };

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div className="glass-panel" style={{
        padding: 'var(--space-8)', borderRadius: 'var(--radius-lg)',
        width: '480px', maxWidth: '90vw', position: 'relative'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--color-text-muted)' }}>
          <X size={20} />
        </button>

        <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-6)' }}>Upload Document</h2>

        {/* File Drop Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-md)',
            padding: 'var(--space-8)', textAlign: 'center', cursor: 'pointer',
            backgroundColor: selectedFile ? 'rgba(76,175,80,0.05)' : 'transparent',
            transition: 'var(--transition-fast)', marginBottom: 'var(--space-6)'
          }}
        >
          <input ref={fileInputRef} type="file" onChange={handleFileSelect} style={{ display: 'none' }} />
          {selectedFile ? (
            <div>
              <FileText size={32} style={{ margin: '0 auto var(--space-2)', color: 'var(--color-primary)' }} />
              <p style={{ fontWeight: 600 }}>{selectedFile.name}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
              </p>
            </div>
          ) : (
            <div>
              <Upload size={32} style={{ margin: '0 auto var(--space-2)', color: 'var(--color-text-muted)' }} />
              <p style={{ color: 'var(--color-text-muted)' }}>Click to select a file</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Max 50MB</p>
            </div>
          )}
        </div>

        {/* Category Selector */}
        <label style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)', display: 'block' }}>Category</label>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)',
                backgroundColor: category === cat ? 'var(--color-primary)' : 'var(--color-surface)',
                color: category === cat ? 'white' : 'var(--color-text-muted)',
                border: `1px solid ${category === cat ? 'var(--color-primary)' : 'var(--color-border)'}`,
                fontSize: '0.8rem', cursor: 'pointer', transition: 'var(--transition-fast)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
            backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444',
            padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-4)', fontSize: '0.875rem'
          }}>
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        {/* Progress Bar */}
        {uploading && (
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{
              height: '6px', width: '100%', backgroundColor: 'var(--color-surface-muted)',
              borderRadius: '3px', overflow: 'hidden'
            }}>
              <div style={{
                height: '100%', width: `${progress}%`, backgroundColor: 'var(--color-primary)',
                borderRadius: '3px', transition: 'width 0.3s ease'
              }} />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)', textAlign: 'right' }}>
              {progress}%
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!selectedFile || uploading}
          className="btn-primary"
          style={{
            width: '100%', justifyContent: 'center', gap: 'var(--space-2)',
            opacity: (!selectedFile || uploading) ? 0.5 : 1,
            pointerEvents: (!selectedFile || uploading) ? 'none' : 'auto'
          }}
        >
          {uploading ? <><Loader2 size={18} className="animate-spin" /> Uploading...</> : <><Upload size={18} /> Upload Document</>}
        </button>
      </div>
    </div>
  );
};

const DocumentVault = () => {
  const [filter, setFilter] = useState('All');
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  const categories = ['All', 'Planning', 'Engineering', 'Legal', 'Health & Safety', 'Financial'];

  useEffect(() => {
    const q = query(collection(db, 'mosque_documents'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docsData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setDocs(docsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (docItem) => {
    if (!confirm(`Delete "${docItem.name}"? This cannot be undone.`)) return;
    setDeleting(docItem.id);
    try {
      if (docItem.storagePath) {
        const storageRef = ref(storage, docItem.storagePath);
        await deleteObject(storageRef);
      }
      await deleteDoc(doc(db, 'mosque_documents', docItem.id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete document.');
    } finally {
      setDeleting(null);
    }
  };

  const filteredDocs = docs
    .filter(d => filter === 'All' || d.category === filter)
    .filter(d => !search || d.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <UploadDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: 'var(--space-1)' }}>Document Vault</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Secure repository for all MOSQUE construction documents.</p>
        </div>
        <button onClick={() => setDialogOpen(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Upload size={20} /> Upload New File
        </button>
      </header>

      {/* Search + Filter Bar */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
          backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)', padding: '0.5rem 0.75rem', flex: '0 1 280px'
        }}>
          <Search size={16} color="var(--color-text-muted)" />
          <input
            type="text" placeholder="Search documents..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            style={{
              border: 'none', outline: 'none', backgroundColor: 'transparent',
              color: 'var(--color-text)', width: '100%', fontSize: '0.875rem'
            }}
          />
        </div>
        {categories.map(cat => (
          <button 
            key={cat} onClick={() => setFilter(cat)}
            style={{
              padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)',
              backgroundColor: filter === cat ? 'var(--color-primary)' : 'var(--color-surface)',
              color: filter === cat ? 'white' : 'var(--color-text-muted)',
              border: `1px solid ${filter === cat ? 'var(--color-primary)' : 'var(--color-border)'}`,
              fontSize: '0.875rem', whiteSpace: 'nowrap', transition: 'var(--transition-fast)',
              cursor: 'pointer'
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
          {filteredDocs.map(docItem => {
            const IconComponent = getFileIcon(docItem.name);
            return (
              <div
                key={docItem.id}
                className="glass-panel"
                style={{
                  padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)',
                  display: 'flex', flexDirection: 'column', gap: 'var(--space-4)',
                  transition: 'var(--transition-normal)', position: 'relative',
                  opacity: deleting === docItem.id ? 0.4 : 1
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{
                    color: 'var(--color-primary)', backgroundColor: 'var(--color-surface-muted)',
                    padding: 'var(--space-2)', borderRadius: 'var(--radius-md)'
                  }}>
                    <IconComponent size={24} />
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(docItem); }}
                    title="Delete document"
                    style={{ color: 'var(--color-text-muted)', transition: 'var(--transition-fast)', cursor: 'pointer' }}
                    onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--color-text-muted)'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{docItem.name}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{docItem.category} • {docItem.date}</p>
                </div>

                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginTop: 'auto', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--color-border)'
                }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{docItem.size}</span>
                  <a
                    href={docItem.url} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: '0.75rem', color: 'var(--color-primary-light)', fontWeight: 600, textDecoration: 'none' }}
                  >
                    Open File →
                  </a>
                </div>
              </div>
            );
          })}
          {filteredDocs.length === 0 && (
            <div style={{ textAlign: 'center', padding: 'var(--space-12)', gridColumn: '1 / -1', color: 'var(--color-text-muted)' }}>
              {search ? `No documents matching "${search}"` : 'No documents found in this category. Upload one to get started.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentVault;
