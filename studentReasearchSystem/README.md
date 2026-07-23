# 🎓 Student Research Management System (SRMS)

<p align="center">
  A web-based platform designed to simplify and automate university research project management.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-blue?logo=react">
  <img src="https://img.shields.io/badge/Backend-Node.js-green?logo=node.js">
  <img src="https://img.shields.io/badge/Database-MySQL-orange?logo=mysql">
  <img src="https://img.shields.io/badge/License-MIT-yellow">
</p>

The Student Research Management System (SRMS) is a web-based application designed to streamline the management of student research projects within a university. The system enables students to submit research topics, lecturers to review and approve them, supervisors to monitor research progress and provide feedback, and administrators to manage users and oversee the entire research process.

The project was developed using React for the frontend, Node.js and Express for the backend, and MySQL as the database.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [User Roles](#user-roles)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)s
- [Project Structure](#project-structure)
- [Installation and Setup](#installation-and-setup)
- [Running the Application](#running-the-application)
- [Database Setup](#database-setup)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)
- [Author](#author)
- [License](#license)


## Project Overview

The Student Research Management System (SRMS) is a web-based application developed to streamline and automate the management of university student research projects.

The system provides a centralized platform where students can submit research topics, lecturers can review and approve or reject submissions, supervisors can monitor research progress and provide feedback, and administrators can manage users and oversee research activities.

The main goal of SRMS is to improve efficiency, transparency, and communication between students, lecturers, supervisors, and administrators throughout the research lifecycle.

The system was developed using modern web technologies including React.js for the frontend, Node.js and Express.js for the backend, and MySQL for database management.

## Features

### 🔐 Authentication and User Management

- User registration and login system
- Role-based access control for students, lecturers, supervisors, and administrators
- Secure password encryption using bcrypt
- JWT-based authentication for protected routes

### 🎓 Student Research Management

- Students can submit up to three research topics for review
- Students can track topic approval status
- Students can view assigned supervisors
- Students can receive supervisor feedback
- Students can upload final research submissions

### 👨‍🏫 Lecturer Management

- Review submitted research topics
- Approve or reject research proposals
- Provide feedback on submitted topics
- Assign supervisors to approved research projects

### 👨‍💼 Supervisor Management

- View assigned students
- Monitor student research progress
- Provide research guidance and feedback

### 🛠️ Administrator Management

- Manage system users
- Monitor research activities
- View system statistics through the dashboard
- Manage final research submissions

### 📊 System Features

- Centralized research data management
- Responsive user interface
- Secure database operations
- Dashboard analytics


## Technology Stack

### Frontend

- **React.js** - Building the interactive user interface
- **React Router** - Managing navigation between pages
- **Axios** - Communicating with backend APIs
- **CSS / Bootstrap** - Styling and responsive design

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Backend API framework
- **JWT (JSON Web Token)** - User authentication and authorization
- **bcrypt** - Password encryption
- **Multer** - File upload handling

### Database

- **MySQL** - Relational database management system
- **mysql2** - Node.js MySQL database driver

### Development Tools

- **Visual Studio Code** - Code editor
- **Git & GitHub** - Version control and source code management
- **XAMPP** - Local MySQL database environment
- **Postman** - API testing

## System Architecture

The Student Research Management System follows a three-tier client-server architecture consisting of:

### 1. Presentation Layer (Frontend)

The frontend is developed using React.js and provides the user interface for all system users:

- Students
- Lecturers
- Supervisors
- Administrators

The frontend communicates with the backend through RESTful API requests.

### 2. Application Layer (Backend)

The backend is built using Node.js and Express.js. It handles:

- User authentication and authorization
- Business logic processing
- Research topic management
- Supervisor assignment
- Feedback management
- File uploads
- Communication between frontend and database

### 3. Data Layer (Database)

The system uses MySQL as the database management system for storing:

- User information
- Research topics
- Supervisor assignments
- Feedback records
- Final research submissions

### System Flow

```
User
 |
 v
React Frontend
 |
 v
Express.js REST API
 |
 v
Node.js Backend
 |
 v
MySQL Database
```

This architecture provides separation of concerns, improved maintainability, scalability, and secure management of research information.

## Project Structure

The project is organized into separate frontend, backend, database, and documentation components.

```text
student_reseaarch_project/
│
├── client/                         # React frontend application
│   ├── public/                     # Static files
│   ├── src/                        # React components and pages
│   │   ├── components/             # Reusable UI components
│   │   ├── pages/                  # Application pages
│   │   ├── services/               # API communication services
│   │   └── App.js                  # Main React application
│   └── package.json                # Frontend dependencies
│
├── server/                         # Node.js backend application
│   ├── controllers/                # Request handling logic
│   ├── routes/                     # API routes
│   ├── middleware/                 # Authentication middleware
│   ├── config/                     # Database configuration
│   ├── uploads/                    # Uploaded research files
│   ├── server.js                   # Backend entry point
│   └── package.json                # Backend dependencies
│
├── database/                       # Database files
│   └── student_research_management.sql
│
├── screenshots/                    # Application screenshots
│
├── README.md                       # Project documentation
└── .gitignore                      # Ignored files configuration
```

## Installation and Setup

Follow these steps to run the Student Research Management System locally.

### Prerequisites

Ensure you have the following installed:

- Node.js and npm
- MySQL Server or XAMPP
- Git
- Visual Studio Code (recommended)

---

### 1. Clone the Repository

```bash
git clone https://github.com/Brian035tech/student_reseaarch_project.git
```

Navigate into the project folder:

```bash
cd student_reseaarch_project
```

---

### 2. Database Setup

1. Open XAMPP and start **MySQL**.
2. Open phpMyAdmin.
3. Create a database named:

```sql
student_research_management
```

4. Import the database file located in:

```
database/student_research_management.sql
```

---

### 3. Backend Setup

Navigate to the server folder:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the server folder:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=student_research_management
JWT_SECRET=your_secret_key
```

Start the backend server:

```bash
npm start
```

The backend will run on:

```
http://localhost:5000
```

---

### 4. Frontend Setup

Open another terminal and navigate to the client folder:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm start
```

The frontend will run on:

```
http://localhost:3000
```

---

The system is now ready to use.


## Database Setup

The Student Research Management System uses **MySQL** as the database management system.

The database contains tables responsible for managing:

- User accounts and roles
- Research topics
- Supervisor assignments
- Research feedback
- Final research submissions

### Importing the Database

1. Start **MySQL** using XAMPP or your preferred MySQL server.
2. Open **phpMyAdmin**.
3. Create a new database:

```sql
student_research_management
```

4. Select the created database.
5. Import the SQL file located at:

```
database/student_research_management.sql
```

After successful import, the system will be ready to communicate with the database.

### Main Database Tables

| Table | Description |
|---|---|
| users | Stores students, lecturers, supervisors, and administrators |
| research_topics | Stores submitted research topics and approval status |
| final_submissions | Stores uploaded final research documents |
| feedback | Stores supervisor and lecturer feedback records |


## Screenshots

The following screenshots demonstrate the main interfaces of the Student Research Management System.

### Login Page

![Login Page](screenshots/login-page.png)

---

### Student Dashboard

![Student Dashboard](screenshots/student-dashboard.png)

---

### Lecturer Dashboard

![Lecturer Dashboard](screenshots/lecturer-dashboard.png)

---

### Supervisor Dashboard

![Supervisor Dashboard](screenshots/supervisor-dashboard.png)

---

### Administrator Dashboard

![Administrator Dashboard](screenshots/admin-dashboard.png)


## Future Enhancements

The following improvements can be considered in future versions of the Student Research Management System:

- Email notifications for topic approval, rejection, and feedback updates
- Real-time communication between students and supervisors
- Mobile application support
- AI-assisted research topic recommendations
- Plagiarism detection integration
- Advanced research progress tracking
- Research analytics and reporting dashboards
- Document version control for research submissions

## Author

**Kipkoech Brian**

Software Engineering Student

Developed as a Student Research Management System project.

GitHub:
https://github.com/Brian035tech

## License

This project is licensed under the MIT License.

The source code may be used, modified, and distributed for educational and research purposes.