
# 📦 Product Management System

A modern web application for managing products, built with **FastAPI** (backend) and **Next.js** (frontend). This project includes QR code generation for each product and supports dynamic product assignment between employees and locations.

---

## 📁 Project Structure

```
Product-Management/
├── backend/             # FastAPI app (REST API, DB, QR)
├── frontend/            # Next.js app (UI)
├── docker-compose.yml   # Container orchestration
├── .gitignore
└── README.md
```

---

## 🚀 Features

- 📦 Create, update, delete products
- 🏷️ Assign products to employees or locations
- 🔍 Filter/search products
- 📸 QR code generation for each product
- 🧑‍💻 API-first architecture with FastAPI
- 🌐 Beautiful frontend with Next.js & TailwindCSS
- 🐳 Fully containerized with Docker

---

## 🛠 Tech Stack

| Layer     | Technology             |
|-----------|------------------------|
| Frontend  | Next.js, React, TailwindCSS, ShadCN UI |
| Backend   | FastAPI, Postgresql, Pydantic, SQLAlchemy |
| Database  | Postgres               |
| Docker    | Docker, Docker Compose |

---

## 🐳 Local Setup with Docker

### 1. Clone the Repository

```bash
git clone https://github.com/salemovic99/Product-Management.git
cd Product-Management
```

### 🔧 Environment Variables Setup

To run the project securely and properly in **production** (or when using Docker), you need to create a `.env` file at the **root of the project** (`Product-Management/.env`) and define the following environment variables:

### 📄 .env (in the root)

```env
# Clerk authentication secret key (from your Clerk dashboard)
CLERK_SECRET_KEY=your-clerk-secret-key

# PostgreSQL database settings
POSTGRES_USER=your_postgres_username
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=your_database_name
```

### 2. Run with Docker Compose

```bash
docker-compose up --build
```

- Frontend: <http://localhost:3000>  
- Backend API: <http://localhost:8000/docs>

---

## 💻 Manual Setup (Without Docker)

### 🛠️ Backend Environment Variables

In addition to the root `.env` file used by Docker, the **FastAPI backend** also requires a separate `.env` file located inside the `backend/` folder when running manually (without Docker).

### 📄 `backend/.env`

Create a `.env` file in the `backend/` directory with the following content:

```env
# PostgreSQL async connection string
DATABASE_URL=postgresql+asyncpg://username:your_password@localhost:5432/your_database

```

### Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend (Next.js)

### 🌐 Frontend Environment Variables

The Next.js frontend uses a `.env.local` file to store environment-specific variables such as API URLs and Clerk credentials.

### 📄 `frontend/.env.local`

Create a `.env.local` file inside the `frontend/` directory with the following content:

```env
# Public Clerk key (used in the browser)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key

# Backend API URL (used by frontend to make API calls)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Clerk secret key (only used during server-side rendering if needed)
CLERK_SECRET_KEY=your-clerk-secret-key
```

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 API Endpoints

The FastAPI backend exposes a RESTful API for managing products, employees, positions, locations, and QR code generation.

You can explore and test the API using the interactive Swagger UI:

📄 **Swagger UI:**  
`http://localhost:8000/docs`

---

### 📦 Product Endpoints

| Method | Endpoint            | Description                         |
|--------|---------------------|-------------------------------------|
| `GET`  | `/products/`        | Get a paginated list of products    |
| `GET`  | `/products/{id}`    | Get a single product by ID          |
| `POST` | `/products/`        | Create a new product                |
| `PUT`  | `/products/{id}`    | Update an existing product          |
| `DELETE` | `/products/{id}`  | Delete a product by ID              |

---
