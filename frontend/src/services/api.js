const API_ROOT = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
const API_BASE = `${API_ROOT.replace(/\/$/, '')}/tasks`;

const handleErrors = async (response) => {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(data?.error || data?.message || 'Request failed');
  }
  return data;
};

export const fetchTasks = (status) => {
  const suffix = status ? `?status=${status}` : '';
  return fetch(`${API_BASE}${suffix}`).then(handleErrors);
};

export const createTask = (payload) => {
  return fetch(`${API_BASE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(handleErrors);
};

export const approveTask = (taskId, comment) => {
  return fetch(`${API_BASE}/${taskId}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comment })
  }).then(handleErrors);
};

export const rejectTask = (taskId, comment) => {
  return fetch(`${API_BASE}/${taskId}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comment })
  }).then(handleErrors);
};

export const blockTask = (taskId, comment) => {
  return fetch(`${API_BASE}/${taskId}/block`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comment })
  }).then(handleErrors);
};
