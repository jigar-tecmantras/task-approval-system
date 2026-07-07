# Task Approval System

A lightweight approval/rejection workflow with an Express/Prisma backend and a React frontend.

## Features
- Create tasks via API or UI.
- List tasks filtered by status (Pending, Approved, Rejected, Blocked).
- Approve or reject tasks with optional reviewer comments.
- Block tasks that need more information with a mandatory blocker note.
- Simple frontend dashboard for reviewers and task creators.

## Getting started

### Backend
1. Navigate to the backend directory: `cd backend`.
2. Install dependencies: `npm install`.
3. Copy `.env.example` to `.env` and adjust settings if needed.
4. Run Prisma migrations to create the SQLite database: `npx prisma migrate dev --name init`.
5. Start the server in development mode: `npm run dev`.

The API will be available at `http://localhost:4000/api/tasks` by default.

### Frontend
1. In a second terminal, switch to the frontend directory: `cd frontend`.
2. Install dependencies: `npm install`.
3. Start the React development server: `npm start`.

The dashboard runs on `http://localhost:3000` and communicates with the backend.

### Workflow
- Create a new task using the form on the dashboard.
- Use the buttons to approve or reject pending tasks.
- Rejected tasks require a reviewer comment for auditing.
- Blocked tasks require a blocker comment and show up under the "Blocked" filter.
- Refresh the list automatically after each action.
