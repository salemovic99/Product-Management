
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

### 2. Run with Docker Compose

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000  
- Backend API: http://localhost:8000/docs

---

## 💻 Manual Setup (Without Docker)

### Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 API Endpoints

- Swagger Docs: `http://localhost:8000/docs`
- Create Product: `POST /products/`
- Get All Products: `GET /products/`
- Generate QR: Automatically generated on creation

---