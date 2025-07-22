# 🎓 School API – Node.js, Express & Objection.js

A simple RESTful API for managing a school system, featuring authentication, RBAC (Role-Based Access Control), Swagger documentation, and more.

---

## 🚀 Main Features

- 🔐 JWT-based authentication (access + refresh tokens)
- 🎭 Role-Based Access Control (RBAC) with  permissions
- 👤 User system with roles: admin, teacher, student, etc.
- 📚 Models wih objection
- 📘 Interactive documentation using Swagger OpenApi
- ⚙️ Database migrations  with Knex

---

## 🛠️ Built With

- Node.js
- Express
- Objection.js
- Knex.js
- PostgreSQL
- JSON Web Token (JWT)
- Swagger UI

---

## 📦 Installation

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
npm install
```

---

## ⚙️ Configuration

Copy the `.env.example` file, rename it to `.env`, and fill in the required values:

```env
PORT=
ADMIN_PASS=            # Password for the initial admin user created during seeding
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
NODE_ENV=              # e.g: development, production
```

## ▶️ Start the Server

```bash
npm run start
```

---

## 📄 Swagger Documentation

Once the server is running, visit:

```
http://localhost:/api-docs
```

To view the interactive API documentation.

---

## 📁 Project Structure

```
├── models/         → Objection.js models (User, Role, etc.)
├── routes/         → Express route definitions
├── repositories/   → Data access layer using Objection models
├── middlewares/    → Authentication, validation, etc.
├── docs/           → Swagger config
├── migrations/     → Database schema definitions
├── seeds/          → Initial data (roles, admin user, etc.)
├── index.js        → Main entry point
├── .env.example    → Example environment config
```

---

## 📌 Upcoming Features

- [ ] Front-end dashboard for users

---
