# 🚀 SkillStack – Skill Management System

SkillStack is a full-stack web application designed to help users organize, manage, and analyze their skills through a clean UI, secure authentication, and structured dashboards.  
It follows a modular architecture with a **React.js frontend**, a **Flask backend**, and a **SQLite database**.

---

## 🏷️ Badges

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Frontend](https://img.shields.io/badge/Frontend-React-blue)
![Backend](https://img.shields.io/badge/Backend-Flask-lightgrey)
![Database](https://img.shields.io/badge/Database-SQLite-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

# ✨ Features

- 🔐 **Secure Authentication** using JWT  
- ➕ **Add New Skills** with title, description, and category  
- 📄 **Skill Details Page** for deeper insights  
- 📊 **Dashboard Analytics** (Total skills + category breakdown)  
- 📁 **Organized Folder Structure** (frontend + backend separation)  
- 🔄 **API-based architecture** for smooth data flow  
- 🧭 **Protected Routes** using React Context API  
- 🎨 **Clean UI & simple navigation**  

---

# 🛠️ Tech Stack

### **Frontend**
- React.js  
- React Router  
- Context API  
- Axios  
- CSS  

### **Backend**
- Python Flask  
- Flask-JWT-Extended  
- SQLite  
- MVC-style controller structure  

---

# 📁 Project Structure
SkillStack/
├── SkillStack_Backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── utils/
│ ├── app.py
│
├── skillstack_frontend/
│ ├── src/
│ ├── components/
│ ├── services/
│ ├── contexts/
│ ├── App.jsx
│ ├── index.js


---

# 🧪 API Documentation

### **🔐 Authentication**
#### POST `/auth/register`
Registers a new user.  
Body:
```json
{
  "name": "John",
  "email": "john@gmail.com",
  "password": "123456"
}

POST /auth/login

Returns JWT on successful login.
Body:

{
  "email": "john@gmail.com",
  "password": "123456"
}

📚 Skills API
POST /skills/add

Add a new skill.

{
  "title": "React",
  "category": "Frontend",
  "description": "Component-based UI library"
}

GET /skills/list

Get all skills of the logged-in user.

GET /skills/<id>

Fetch specific skill details.

DELETE /skills/<id>

Delete a skill.

📊 Dashboard API
GET /dashboard/summary

Returns:

{
  "total_skills": 12,
  "categories": {
    "Frontend": 5,
    "Backend": 4,
    "Database": 3
  }
}

⚙️ Setup Steps
Backend Setup (Flask)
1. Navigate to backend folder
cd SkillStack_Backend

2. Create virtual environment
python -m venv venv


Activate:
Windows:

venv\Scripts\activate


Mac/Linux:

source venv/bin/activate

3. Install backend dependencies
pip install -r requirements.txt

4. Run backend
python app.py


Backend runs at:

http://127.0.0.1:5000/

Frontend Setup (React)
1. Navigate to frontend folder
cd skillstack_frontend

2. Install dependencies
npm install

3. Start React app
npm start


Frontend runs at:

http://localhost:3000/

🚧 Future Enhancements

SkillStack will be improved with features like skill progress charts, subtopics progress tracking, certificate uploads, notifications, cloud database migration using PostgreSQL/MongoDB, advanced analytics for deeper insights, and a mobile application built using React Native.

