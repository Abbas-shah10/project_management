# Project Management

A modern project management application built to help teams plan work, track progress, collaborate efficiently, and deliver projects on time.

This project is designed to be easy to understand for beginners while still being structured in a way that experienced developers can evaluate, extend, and deploy confidently. It is a strong portfolio project because it demonstrates real-world software engineering practices, product thinking, and a clean full-stack architecture.

## Table of Contents

- [Overview](#overview)
- [Why this project](#why-this-project)
- [Core features](#core-features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Running the project](#running-the-project)
- [Deploying to Vercel](#deploying-to-vercel)
- [Usage flow](#usage-flow)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Overview

This project is a full-stack productivity and project tracking system where users can:

- Create projects and assign tasks
- Track progress and deadlines
- Manage team members and responsibilities
- Monitor project status through dashboards
- Communicate updates and maintain visibility across the workflow

From a business perspective, the app solves a common issue: teams often use disconnected tools for planning, communication, and tracking. This project centralizes that process into one platform.

## Why this project

This project is valuable because it combines product design, user experience, and software engineering in a single solution.

It demonstrates:

- Task and workflow management
- Database design and data relationships
- Authentication and authorization
- API development and integration
- Frontend dashboard and responsive UI
- Deployment readiness and project structure

For a portfolio, this is a strong choice because it shows that you can build something real, scalable, and useful beyond a basic tutorial.

## Core features

- User authentication and project-level role access
- Project creation, editing, deletion, and member management
- Task creation, editing, assignment, priorities, statuses, and due dates
- Subtask creation, completion tracking, and deletion
- Dashboard statistics and project/task progress summaries
- Search and filtering for projects, tasks, and team members
- Project team directory and member invitations
- Responsive web interface

## Tech stack

This project is structured as a modern full-stack app. A typical stack for this type of project could be:

- Frontend: React, Vite, TypeScript, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB or PostgreSQL
- Authentication: JWT / OAuth
- State management: Redux Toolkit or Context API
- Deployment: Vercel / Netlify / Render / Railway / Docker

If your project uses a different stack, update the names below to match your implementation.

## Architecture

The application is designed around a simple and scalable architecture:

- Frontend handles user interaction and dashboard UI
- API layer manages requests and business logic
- Database stores users, projects, tasks, and related data
- Authentication ensures secure access to protected resources
- Client and server communicate through REST APIs or GraphQL

This structure makes the application easier to scale and maintain as the project grows.

## Project structure

```bash
project_management/
├── client/                  # Frontend application
│   ├── src/
│   ├── public/
│   └── package.json
├── server/                  # Backend API
│   ├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── package.json
├── database/                # Migrations, seeds, SQL/JSON scripts
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── docker-compose.yml       # Optional for local development
```

If your repository is organized differently, this is only a recommended structure.

## Getting started

### Prerequisites

Before running the project, make sure you have the following installed:

- Node.js (v18 or newer recommended)
- npm or yarn or pnpm
- Git
- A database service such as MongoDB or PostgreSQL

### Clone the repository

```bash
git clone https://github.com/your-username/project_management.git
cd project_management
```

### Install dependencies

```bash
npm install
```

If the project is split into frontend and backend, install separately:

```bash
cd frontend && npm install
cd ../backend && npm install
```

## Environment variables

Create a `.env` file in the `backend` folder for local development. The backend reads these variables:

```env
PORT=8080
MONGO_URI=mongodb://localhost:27017/project_management
ACCESS_TOKEN_SECRET=replace_with_a_long_random_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=replace_with_a_different_long_random_secret
REFRESH_TOKEN_EXPIRY=10d
FRONTEND_URL=http://localhost:5173
SERVER_URL=http://localhost:8080
FORGOT_PASSWORD_REDIRECT_URL=http://localhost:5173/reset-password
MAILTRAP_SMTP_HOST=
MAILTRAP_SMTP_PORT=
MAILTRAP_SMTP_USER=
MAILTRAP_SMTP_PASS=
```

The four `MAILTRAP_SMTP_*` values are needed for email verification and password reset emails.

## Running the project

### Development mode

```bash
npm run dev
```

If using separate frontend/backend services:

```bash
cd server && npm run dev
cd client && npm run dev
```

### Deploying to Vercel

The root `vercel.json` builds the Vite frontend, serves its static output, and routes `/api/*` requests to the Express function. In Vercel, import this repository and leave the project root directory set to the repository root.

Add the following environment variables in the Vercel project settings for Production and Preview deployments:

- `MONGO_URI`
- `ACCESS_TOKEN_SECRET`
- `ACCESS_TOKEN_EXPIRY`
- `REFRESH_TOKEN_SECRET`
- `REFRESH_TOKEN_EXPIRY`
- `SERVER_URL` (the deployed site's origin, such as `https://your-project.vercel.app`)
- `FORGOT_PASSWORD_REDIRECT_URL` (the deployed frontend password-reset URL)
- `MAILTRAP_SMTP_HOST`, `MAILTRAP_SMTP_PORT`, `MAILTRAP_SMTP_USER`, and `MAILTRAP_SMTP_PASS` for email features

`FRONTEND_URL` is optional for this same-domain deployment; set it only if the browser frontend is hosted on a different origin. `VITE_API_URL` is also optional and defaults to `/api/v1`.

After setting variables, deploy from the Vercel dashboard or run `npx vercel` from the repository root. Vercel Functions have ephemeral filesystems, so the current task attachment upload implementation, which writes to local disk, is not suitable for production. Configure durable object storage for attachments before relying on that feature.

### Production build

```bash
npm run build
npm run start
```

## Usage flow

A typical user journey in this app looks like this:

1. Sign up or log in
2. Create a new project
3. Add team members
4. Create tasks with due dates and priorities
5. Update task statuses as work progresses
6. Review dashboard analytics and project health
7. Communicate updates and meet deadlines

This flow makes the app easy to explain in interviews, demos, and portfolio presentations.

## Features for portfolio impact

To make this project stand out in a portfolio, it helps to highlight:

- Clear, production-like architecture
- Real-world problem solving
- Good naming conventions and maintainable code
- Authentication and security practices
- Clean UI/UX and responsive design
- Performance-aware implementation
- Deployment pipeline and environment management

## Roadmap

### Implemented in this version

- Live dashboard statistics for projects, tasks, members, and task progress
- Searchable task directory with project/status filters and task deletion
- Task creation and editing with assignment, priority, due dates, and status
- Subtask creation, completion updates, and deletion
- Searchable team directory with project membership and invitations

### Remaining improvements

- Add a drag-and-drop kanban board
- Add real-time collaboration with websockets
- Complete the file-attachment UI and add comments or activity tracking
- Add team notifications and reminders
- Add richer reporting and historical charts
- Add admin panel and advanced permissions
- Continue improving the mobile experience
- Add CI/CD workflow and automated tests

## Contributing

Contributions are welcome.

### Steps to contribute

1. Fork the repository
2. Create a feature branch
3. Commit your changes clearly
4. Open a pull request with a proper description

Example:

```bash
git checkout -b feature/task-dashboard
git commit -m "Add dashboard analytics for project overview"
git push origin feature/task-dashboard
```

## License

This project is licensed under the MIT License.

```text
MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## Contact

For questions, collaboration, or portfolio discussion:

- GitHub: [https://github.com/Abbas-shah10]

## Final note

This project is a strong example of a real-world application because it goes beyond a small demo and demonstrates problem solving, architecture thinking, and product value. It is suitable for both beginner-level understanding and senior-level code review.

If you want, this README can later be customized further for:

- a Node.js + React app
- a MERN stack app
- a SaaS dashboard product
