import React, { useMemo, useState } from 'react';
import './TaskList.css';

const statusStyles = {
  PENDING: 'status-pending',
  APPROVED: 'status-approved',
  REJECTED: 'status-rejected',
  BLOCKED: 'status-blocked'
};

const TaskCard = ({ task, onApprove, onReject, onBlock }) => {
  const [rejectComment, setRejectComment] = useState('');
  const [blockReason, setBlockReason] = useState('');
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
    if (!canTakeAction || !rejectComment.trim()) return;
    setBusy(true);
    try {
      await onReject(task.id, rejectComment.trim());
      setRejectComment('');
    } finally {
      setBusy(false);
    }
  };

  const handleBlock = async (event) => {
    event.preventDefault();
    if (!canTakeAction || !blockReason.trim()) return;
    setBusy(true);
    try {
      await onBlock(task.id, blockReason.trim());
      setBlockReason('');
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
      {task.blockerComment && (
        <p className='task-card__blocker'>Blocker note: {task.blockerComment}</p>
      )}
      <div className='task-actions'>
        <button type='button' onClick={handleApprove} disabled={busy || !canTakeAction}>
          Approve
        </button>
        <form onSubmit={handleReject} className='reject-form'>
          <textarea
            placeholder='Add reviewer comment to reject'
            value={rejectComment}
            onChange={(event) => setRejectComment(event.target.value)}
            disabled={busy || !canTakeAction}
            rows={2}
          />
          <button type='submit' disabled={busy || !canTakeAction}>
            Reject
          </button>
        </form>
        <form onSubmit={handleBlock} className='block-form'>
          <textarea
            placeholder='Add blocker comment to block'
            value={blockReason}
            onChange={(event) => setBlockReason(event.target.value)}
            disabled={busy || !canTakeAction}
            rows={2}
          />
          <button type='submit' disabled={busy || !canTakeAction}>
            Block
          </button>
        </form>
      </div>
    </article>
  );
};

export default TaskCard;
