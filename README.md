# 🎓 EduNexus

A full-stack faculty collaboration and academic management platform designed to enhance communication, content sharing, scheduling, analytics, and innovation within educational institutions.

## 🚀 Overview

EduNexus provides a centralized digital workspace where faculty members can collaborate, manage academic content, schedule lectures, analyze performance trends, and engage in institutional innovation initiatives.

The platform combines modern web technologies with an intuitive user experience to streamline academic operations and improve productivity.

## Local Setup

Requirements: Node.js 20.19+ or 22.12+, MongoDB, and a Gemini API key for AI content generation.

1. Copy `backend/.env.example` to `backend/.env`, set a unique `JWT_SECRET` (at least 32 characters), your MongoDB connection string, and `GEMINI_API_KEY`. If Node cannot resolve an Atlas SRV record while your operating system can, set `MONGO_DNS_SERVERS` to comma-separated DNS resolver IP addresses from your system configuration.
2. Copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL` if the backend is not running at `http://localhost:5000/api`.
3. In `backend/`, run `npm install` and `npm run dev`.
4. In `frontend/`, run `npm install`, then `npm run dev`.
5. Open the Vite URL shown in the frontend terminal and create a faculty account.

The backend exposes `GET /health` for a database-aware readiness check. Production deployments must use HTTPS, a managed MongoDB deployment with backups, a unique high-entropy JWT secret, restricted `CLIENT_ORIGINS`, and a server-side Gemini API key. Never commit `.env` files. Revoke and replace any API key that has previously been committed or shared.

## Backend API

All resource endpoints require `Authorization: Bearer <token>`. Lecture and saved-content reads and mutations are scoped to the signed-in faculty member. The API supports:

* Lectures: `GET`/`POST /api/lectures`, `PATCH`/`DELETE /api/lectures/:id`
* Saved content: `GET /api/content`, `POST /api/content/save`, `PATCH`/`DELETE /api/content/:id`
* Faculty posts: `GET`/`POST /api/posts`, `PATCH`/`DELETE /api/posts/:id`; likes and comments use `PUT /api/posts/:id/like` and `POST /api/posts/:id/comment`

## ✨ Key Features

### 🔐 Authentication & User Management

* Secure registration and login
* Protected routes
* User profile management

### 📚 Content Studio

* Academic content creation
* Resource management
* Content sharing

### 💡 Innovation Hub

* Collaborative idea sharing
* Faculty engagement
* Innovation initiatives

### 📅 Smart Scheduler

* Lecture scheduling
* Academic planning
* Time management

### 📊 Analytics Dashboard

* Performance monitoring
* Academic insights
* Data visualization

### 📈 Trends & Results

* Trend analysis
* Result tracking
* Performance evaluation

## 🛠 Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Development Tools

* Git
* GitHub
* VS Code

## 📂 Project Structure

EduNexus
├── frontend/
├── backend/
├── assets/
└── README.md

## 🎯 Future Enhancements

* Real-time notifications
* AI-powered academic insights
* Role-based access control
* Mobile application
* Advanced analytics
* Institution-wide reporting

## 👩‍💻 Author

Sakshi Raut

GitHub: https://github.com/SakshiRaut004
