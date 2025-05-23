# Billeasy_Mini_Assignment

## 📚 Book Review System (Backend)

This is the backend server for the **Book Review System**, developed as part of the **Billeasy Mini Assignment**.  
It allows users to review books, update or delete their reviews, and automatically calculates the average rating for each book.

---

## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**

---

## 📦 Project Setup Instructions

### 1. Clone the repository:

```bash
git clone <your-repo-url>

---

### 2. Navigate to the project folder:
```bash
cd Billeasy_Mini_Assignment

---

### 3. Install dependencies:
```bash
npm install or npm ci

---

### 4. Start the server (with auto reload):
```bash
nodemon app.js

---

### 5. Project Structure
````

BILLEASY ASSIGNMENT/
│
├── dbConnect/
│ └── dbConnect.js
│
├── module/
│ ├── controller/
│ │ ├── BookController.js
│ │ ├── ReviewController.js
│ │ └── UserController.js
│ │
│ ├── model/
│ │ ├── bookSchema.js
│ │ ├── reviewSchema.js
│ │ └── userSchema.js
│ │
│ └── route/
│ ├── bookRoute.js
│ ├── reviewRoute.js
│ └── userRoute.js
│
├── service/
│ └── utils/
│ | ├── rating.js
│ ├── generateId.js
│ └── token.js
│
├── .env
├── .gitignore
├── app.js
├── package.json
├── package-lock.json
└── README.md

### 6. API Access Point

```
 Access the API endpoints at `http://localhost:3000`.
   example = `http://localhost:3000/user/login`

## API Endpoints

### 1. Get the User FeedBacks

- **Endpoint**: `/feedback/get`
- **Method**: GET
- **Response**: `{ "data": feedBacks }` (In JSON Format)

### 2. Save the User FeedBack

- **Endpoint**: `/feedback/save`
- **Method**: POST
- **Response**: `{ "data": "Data Saved Successfully" }` (In JSON Format)
```
