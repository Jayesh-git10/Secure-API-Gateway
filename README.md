# Task Manager API & Dashboard

Backend Developer Intern Assignment.
A scalable REST API with JWT Authentication and a React Dashboard.

## Features
- **Authentication**: JWT-based Login & Register with BCrypt password hashing.
- **RBAC**: User and Admin roles. Admins can manage all tasks; Users only their own.
- **CRUD**: Full Create, Read, Update, Delete operations for Tasks.
- **Frontend**: Modern React dashboard built with Vite, TailwindCSS, and Shadcn UI.
- **Database**: PostgreSQL with Drizzle ORM.

## Setup & Running

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   The project is configured for PostgreSQL.
   ```bash
   npm run db:push
   ```

3. **Seed Data**
   Create initial Admin and User accounts + sample tasks.
   ```bash
   npm run seed
   ```

4. **Run Server**
   ```bash
   npm run dev
   ```
   Server starts on Port 5000.

## API Documentation
Import `postman_collection.json` into Postman to test the API.

**Environment Variables (Postman)**:
- `base_url`: `http://localhost:5000` (default)
- `token`: Automatically set by the Login test script.

## Default Credentials (from Seed)
- **Admin**: `admin` / `admin123`
- **User**: `user` / `user123`

## Project Structure
- `server/`: Express backend (Routes, Storage, DB).
- `client/`: React frontend (Pages, Components).
- `shared/`: Shared types and schema (Zod/Drizzle).
