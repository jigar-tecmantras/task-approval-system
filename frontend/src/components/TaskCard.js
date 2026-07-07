import React, { useMemo, useState } from 'react';
import './TaskList.css';

const statusStyles = {
  PENDING: 'status-pending',
  APPROVED: 'status-approved',
  REJECTED: 'status-rejected'
};

const TaskCard = ({ task, onApprove, onReject }) => {
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const canTakeAction = task.status === 'PENDING';

  const handleApprove = async () => {
    if (!canTakeAction) return;
    setBusy(true);
    try {
      await onApprove(task.id);
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async (event) => {
    event.preventDefault();
    if (!canTakeAction || !comment.trim()) return;
    setBusy(true);
    try {
      await onReject(task.id, comment.trim());
      setComment('');
    } finally {
      setBusy(false);
    }
  };

  const createdAt = useMemo(() => new Date(task.createdAt).toLocaleString(), [task.createdAt]);

  return (
    <article className={`task-card ${statusStyles[task.status]}`}>
      <header>
        <p className='muted'>{createdAt}</p>
        <span className='status-label'>{task.status}</span>
      </header>
      <h3>{task.title}</h3>
      <p className='task-card__description'>{task.description}</p>
      {task.reviewerComment && (
        <p className='task-card__reviewer'>Reviewer note: {task.reviewerComment}</p>
      )}
      <div className='task-actions'>
        <button type='button' onClick={handleApprove} disabled={busy || !canTakeAction}>
          Approve
        </button>
        <form onSubmit={handleReject} className='reject-form'>
          <textarea
            placeholder='Add reviewer comment to reject'
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            disabled={busy || !canTakeAction}
            rows={2}
          />
          <button type='submit' disabled={busy || !canTakeAction}>
            Reject
          </button>
        </form>
      </div>
    </article>
  );
};

export default TaskCard;
