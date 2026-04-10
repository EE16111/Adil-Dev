import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Circle, Clock, Tag, AlertTriangle, Loader2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, query, addDoc, doc, updateDoc, serverTimestamp, orderBy } from 'firebase/firestore';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState('');
  const [category, setCategory] = useState('Procurement');
  const [priority, setPriority] = useState('Medium');

  useEffect(() => {
    const q = query(collection(db, 'mosque_tasks'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(taskData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;
    
    try {
      await addDoc(collection(db, 'mosque_tasks'), {
        text: newTask,
        category: category,
        priority: priority,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setNewTask('');
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleTask = async (taskId, currentStatus) => {
    try {
      const taskRef = doc(db, 'mosque_tasks', taskId);
      await updateDoc(taskRef, {
        status: currentStatus === 'completed' ? 'pending' : 'completed'
      });
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const getPriorityColor = (p) => {
    if (p === 'High') return '#ef4444';
    if (p === 'Medium') return '#f59e0b';
    return '#10b981';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <header>
        <h1 style={{ fontSize: '1.875rem', marginBottom: 'var(--space-1)' }}>Project Tasks</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Action items for the current spatial coordination phase.</p>
      </header>

      {/* Input Area */}
      <div className="glass-panel" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <input 
            type="text" 
            placeholder="Add a new construction task..." 
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            style={{ 
              flex: 1, 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid var(--color-border)', 
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              color: 'white',
              fontSize: '1rem',
              fontFamily: 'inherit'
            }}
          />
          <button onClick={addTask} className="btn-primary" style={{ padding: '0 1.5rem' }}>
            <Plus size={20} />
            <span>Add Task</span>
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            style={{ background: 'var(--color-surface)', color: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '4px 8px', fontSize: '0.875rem' }}
          >
            <option>Procurement</option>
            <option>On-site</option>
            <option>Design</option>
            <option>Admin</option>
            <option>Legal</option>
          </select>
          
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}
            style={{ background: 'var(--color-surface)', color: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '4px 8px', fontSize: '0.875rem' }}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
          <Loader2 className="animate-spin" style={{ margin: '0 auto' }} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {tasks.map(task => (
            <div key={task.id} className="glass-panel" style={{ 
              padding: 'var(--space-4) var(--space-6)', 
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-6)',
              opacity: task.status === 'completed' ? 0.6 : 1,
              transition: 'var(--transition-fast)'
            }}>
              <button 
                onClick={() => toggleTask(task.id, task.status)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: task.status === 'completed' ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
              >
                {task.status === 'completed' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </button>

              <div style={{ flex: 1 }}>
                <p style={{ 
                  fontWeight: 500, 
                  textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                  color: task.status === 'completed' ? 'var(--color-text-muted)' : 'inherit'
                }}>
                  {task.text}
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Tag size={12} /> {task.category}
                  </span>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: getPriorityColor(task.priority), 
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <AlertTriangle size={12} /> {task.priority} Priority
                  </span>
                </div>
              </div>

              <div style={{ color: 'var(--color-text-muted)' }}>
                <Clock size={20} />
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-8)' }}>No pending tasks. Start by adding one above.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskManager;

