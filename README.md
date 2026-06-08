# Task Manager Application

A full-stack Task Management application built with Next.js, PostgreSQL, Drizzle ORM, and JWT Authentication.

## Features

### Authentication
- User Registration
- User Login
- JWT-based Authentication
- Protected Routes
- Secure Password Hashing

### Task Management
- Create Tasks
- View Tasks
- Update Tasks
- Delete Tasks
- User-specific Tasks

### Technical Features
- RESTful API Design
- PostgreSQL Database
- Drizzle ORM
- Docker Support
- Responsive UI
- TypeScript Support

---

## Tech Stack

### Frontend
- Next.js 16
- React
- TypeScript
- Tailwind CSS

### Backend
- Next.js API Routes
- JWT Authentication
- bcrypt

### Database
- PostgreSQL
- Neon Database
- Drizzle ORM

### DevOps
- Docker

---

## Project Structure

```bash
task-manager/
│
├── app/
│   ├── api/
│   │   ├── auth/
│   │   └── tasks/
│   │
│   ├── login/
│   ├── register/
│   └── dashboard/
│
├── db/
│   ├── schema.ts
│   └── index.ts
│
├── drizzle/
│
├── public/
│
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
```

---

## API Endpoints

### Authentication

#### Register User

```http
POST /api/auth/register
```

Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response

```json
{
  "message": "User registered successfully"
}
```

---

#### Login User

```http
POST /api/auth/login
```

Request Body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response

```json
{
  "token": "jwt_token"
}
```

---

### Tasks

#### Get All Tasks

```http
GET /api/tasks
```

#### Create Task

```http
POST /api/tasks
```

Request Body

```json
{
  "title": "Complete Assignment",
  "description": "Finish internship task"
}
```

#### Update Task

```http
PUT /api/tasks/:id
```

#### Delete Task

```http
DELETE /api/tasks/:id
```

---

## Environment Variables

Create a `.env` file in the root directory.

```env
DATABASE_URL=your_database_url

JWT_SECRET=your_secret_key

NODE_ENV=development
```

---

## Local Installation

Clone the repository

```bash
git clone https://github.com/yourusername/task-manager.git
```

Navigate to project

```bash
cd task-manager
```

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

Application runs at

```bash
http://localhost:3000
```

---

## Database Setup

Generate migration

```bash
npx drizzle-kit generate
```

Run migration

```bash
npx drizzle-kit migrate
```

---

## Docker Setup

Build Docker Image

```bash
docker build -t task-manager .
```

Run Docker Container

```bash
docker run -p 3000:3000 --env-file .env task-manager
```

Verify Running Containers

```bash
docker ps
```

---

## Security

- Passwords are hashed using bcrypt
- JWT Authentication implemented
- Protected API Routes
- Environment Variables for secrets
- User-specific data access

---

## Future Improvements

- Task Status Tracking
- Task Categories
- Due Dates
- Email Notifications
- Refresh Tokens
- Role-Based Access Control
- Pagination
- Search and Filtering

---

## Assignment Requirements Covered

- User Authentication
- CRUD Operations
- PostgreSQL Integration
- REST API Development
- Frontend UI
- Secure Backend Design
- Dockerization
- TypeScript Usage

---

## Author

Rajat Kumar

B.Tech Computer Science Engineering

Full Stack Developer

GitHub: https://github.com/yourusername
LinkedIn: https://linkedin.com/in/yourprofile
