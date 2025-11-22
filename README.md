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


POST /auth/login

Returns JWT on successful login.

📚 Skills API
POST /skills/add

Add a new skill.

GET /skills/list

Fetch all skills of the logged-in user.

GET /skills/<id>

Fetch specific skill details.

DELETE /skills/<id>

Delete a skill.

📊 Dashboard API
GET /dashboard/summary

⚙️ Setup Steps
Backend Setup (Flask)
1. Navigate to backend folder
cd SkillStack_Backend
2. Create virtual environment
python -m venv venv
3. Activate environment
venv\Scripts\activate
4. Install backend dependencies
pip install -r requirements.txt
5. Run backend
python app.py

Frontend Setup (React)
1. Navigate to frontend folder
cd skillstack_frontend
2. Install dependencies
npm install
3. Start React app
npm start


🚧 Future Enhancements

SkillStack will be enhanced with features like skill progress charts, subtopics progress tracking, certificate uploads, notifications, cloud database migration using PostgreSQL/MongoDB, advanced analytics for deeper insights, and a mobile application built using React Native.