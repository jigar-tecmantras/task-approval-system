import React, { useState } from 'react';
import TaskList from './components/TaskList';
import './App.css';

const FILTERS = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Blocked', value: 'BLOCKED' }
];

const App = () => {
  const [filter, setFilter] = useState('PENDING');
  return (
    <div className='app-shell'>
      <header className='app-header'>
        <div>
          <h1>Approval Tasks</h1>
          <p>Review and triage tasks submitted by your team.</p>
        </div>
      </header>
      <div className='filters'>
        {FILTERS.map((item) => (
          <button
            key={item.value}
            className={`filter-pill ${filter === item.value ? 'is-active' : ''}`}
            type='button'
            onClick={() => setFilter(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <TaskList statusFilter={filter} />
    </div>
  );
};

export default App;
