# MOUFlow

A full-stack MOU (Memorandum of Understanding) licensing platform built with **React + Vite** (frontend) and **Express.js + MongoDB Atlas** (backend).

## Features

- 🔐 **User Authentication** — Signup, Login with JWT
- 📝 **MOU Templates** — Admin creates document templates
- ✍️ **Digital Signing** — Users select and sign MOUs
- 📊 **Admin Dashboard** — Real-time stats, user management
- 👤 **User Dashboard** — View and manage signed documents

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, Tailwind CSS v4, Framer Motion |
| Backend | Express.js, Mongoose, JWT, bcryptjs |
| Database | MongoDB Atlas |

## Getting Started

```bash
# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Setup environment
cp backend/.env.example backend/.env
# Edit .env with your MongoDB URI and JWT secret

# Run both servers
cd backend && npm run dev   # Port 5001
cd frontend && npm run dev  # Port 5173
```

## Admin Login

```
Email: admin@mouflow.com
Password: admin123
```

## Project Structure

```
├── frontend/          # React + Vite app
│   └── src/
│       ├── pages/     # Signup, Login, Dashboard, Admin, Signing
│       ├── App.jsx    # Routes
│       └── index.css  # Tailwind + theme
├── backend/           # Express.js API
│   ├── models/        # User, Mou, MouTemplate
│   ├── routes/        # auth, mou, admin, templates, user
│   ├── middleware/     # JWT auth
│   ├── config/        # DB connection
│   └── server.js      # Entry point
```
