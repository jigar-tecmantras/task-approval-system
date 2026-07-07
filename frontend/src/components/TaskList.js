import React, { useEffect, useState } from 'react';
import TaskCard from './TaskCard';
import { fetchTasks, createTask, approveTask, rejectTask, blockTask } from '../services/api';
import './TaskList.css';

const TaskList = ({ statusFilter }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', description: '' });
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');

  const loadTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchTasks(statusFilter);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [statusFilter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!form.title || !form.description) {
      setError('Title and description are required to create a task.');
      return;
    }
    setCreating(true);
    try {
      await createTask(form);
      setForm({ title: '', description: '' });
      setMessage('Task created successfully.');
      loadTasks();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleApprove = async (taskId) => {
    setError('');
    setMessage('');
    try {
      await approveTask(taskId);
      setMessage('Task approved.');
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReject = async (taskId, comment) => {
    setError('');
    setMessage('');
    try {
      await rejectTask(taskId, comment);
      setMessage('Task rejected.');
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBlock = async (taskId, comment) => {
    setError('');
    setMessage('');
    try {
      await blockTask(taskId, comment);
      setMessage('Task blocked.');
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className='task-list'>
      <form className='task-form' onSubmit={handleCreate}>
        <h2>Create a new task</h2>
        <label>
          Title
          <input
            type='text'
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder='What needs approval?'
            maxLength={150}
          />
        </label>
        <label>
          Description
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            placeholder='Summarize the deliverable or request in a few sentences.'
          />
        </label>
        <button type='submit' disabled={creating}>
          {creating ? 'Creating…' : 'Submit task'}
        </button>
      </form>

      {(error || message) && (
        <div className='task-list__message'>
          {error && <p className='error'>{error}</p>}
          {message && <p className='success'>{message}</p>}
        </div>
      )}

      <div className='task-gallery'>
        {loading ? (
          <p className='muted'>Loading tasks…</p>
        ) : tasks.length ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onApprove={handleApprove}
              onReject={handleReject}
              onBlock={handleBlock}
            />
          ))
        ) : (
          <p className='muted'>No tasks found for this filter.</p>
        )}
      </div>
    </section>
  );
};

export default TaskList;
