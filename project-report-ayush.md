# Project Report: Doctor Appointment System

This document provides a descriptive report of the "Doctor Appointment System" project, outlining its architecture, technologies, and core functionalities. The project consists of a client-side React application and a server-side Node.js/Express application, designed to facilitate appointment booking and management for patients, doctors, and administrators.

## 1. Project Overview

The Doctor Appointment System is a full-stack web application that allows:
*   **Patients** to register, log in, view available doctors, book appointments, and see their past and upcoming appointments and prescriptions.
*   **Doctors** to register (pending admin approval), log in, view their scheduled appointments, update appointment statuses, issue prescriptions, and manage their patient list.
*   **Administrators** to register, log in, manage users (patients and doctors), approve doctor accounts, delete user accounts, and view system statistics.

## 2. Client-Side Application

The client application is a modern Single Page Application (SPA) built with React.

### 2.1. Technologies Used
*   **Framework:** React 19
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **Routing:** React Router DOM v6
*   **HTTP Client:** Axios
*   **Animations:** Framer Motion
*   **State Management:** React Context API (for authentication)
*   **Other:** `clsx`, `tailwind-merge`, `lucide-react` (icons)

### 2.2. Architecture and Structure
*   **Entry Point:** `client/src/main.jsx` initializes the React application, sets up `StrictMode` and `BrowserRouter`.
*   **Main Application Component:** `client/src/App.jsx` defines the core routing structure for the entire application, including public and protected routes.
*   **Authentication Context:** `client/src/context/AuthContext.jsx` provides global authentication state and functions (`login`, `register`, `logout`) using React Context API. It manages user sessions by storing user data (including JWT token) in `localStorage` and validates tokens upon application load via a backend API call.
*   **Routing:**
    *   Uses `react-router-dom` for declarative client-side navigation.
    *   Features `ProtectedRoute` component (`client/src/components/Layout/ProtectedRoute.jsx`) to guard routes based on user roles (`patient`, `doctor`, `admin`).
    *   Separate dashboard layouts (`client/src/components/Layout/Dashboard/DashboardLayout.jsx`) are used for authenticated users, providing role-specific navigation (e.g., `Sidebar.jsx`).
*   **UI Components:** The project utilizes reusable UI components, including `Navbar`, `Footer`, `Button`, and specialized layout components for dashboards.
*   **Pages:** The application is divided into various pages:
    *   **Public:** Home, Login, Register.
    *   **Patient Dashboard:** PatientDashboard, BookAppointment, MyAppointments, MyPrescriptions.
    *   **Doctor Dashboard:** DoctorDashboard, DoctorAppointments, MyPatients.
    *   **Admin Dashboard:** AdminDashboard, ManageDoctors, ManagePatients.
*   **API Interaction:** All HTTP requests to the backend are handled through `axios`, with a centralized `client/src/utils/api.js` for configuration.

## 3. Server-Side Application

The server application is a RESTful API built with Node.js and Express.js.

### 3.1. Technologies Used
*   **Runtime:** Node.js
*   **Web Framework:** Express.js
*   **Database:** MongoDB (via Mongoose ODM)
*   **Authentication:** JSON Web Tokens (JWT) for session management, `bcryptjs` for password hashing.
*   **Middleware:** `cookie-parser`, `cors` (configured for `http://localhost:5173`), `express.json()`.
*   **Environment Variables:** `dotenv`.
*   **Development:** `nodemon` for automatic server restarts during development.

### 3.2. Architecture and Structure
*   **Entry Point:** `server/server.js` sets up the Express application, connects to MongoDB, configures middleware, and mounts all API routes.
*   **Models:** Defined in `server/models/` directory, including `User.js`, `Appointment.js`, and `Prescription.js`. These Mongoose schemas define the structure and behavior of data stored in MongoDB.
*   **Controllers:** Located in `server/controllers/`, these modules contain the business logic for handling incoming requests and interacting with the models.
    *   `authController.js`: Handles user registration, login, and fetching user details (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`).
    *   `adminController.js`: Manages administrative tasks such as fetching all users, approving doctor accounts, deleting users, and retrieving system statistics (`/api/admin/*`).
    *   `appointmentController.js`: Manages appointment-related operations, including booking appointments by patients and fetching appointments for both patients and doctors. Also provides a list of doctors for patients.
    *   `doctorController.js`: Handles doctor-specific functionalities like fetching doctor's appointments, updating appointment status, issuing prescriptions, and listing their patients (`/api/doctor/*`).
    *   `prescriptionController.js`: Handles patient-specific functionalities like fetching their prescriptions.
*   **Routes:** Defined in `server/routes/`, these files map URL endpoints to corresponding controller functions.
    *   `authRoutes.js`
    *   `adminRoutes.js`
    *   `doctorRoutes.js`
    *   `patientRoutes.js`
*   **Middleware:** `server/middleware/authMiddleware.js` (inferred) is responsible for protecting routes by verifying JWT tokens and extracting user information from the token.

### 3.3. Key Functionalities (API Endpoints)

The API provides distinct sets of functionalities for different user roles:

*   **Authentication (`/api/auth`):**
    *   `POST /register`: Registers new users (patients, doctors, or admin). Doctors require admin approval to log in.
    *   `POST /login`: Authenticates users and returns a JWT token.
    *   `GET /me`: Retrieves the profile of the authenticated user.
*   **Patient Functionalities (`/api/patient`):**
    *   `POST /book-appointment`: Allows patients to book an appointment with a doctor.
    *   `GET /appointments`: Retrieves all appointments for the authenticated patient.
    *   `GET /prescriptions`: Retrieves all prescriptions issued to the authenticated patient.
    *   `GET /doctors`: Retrieves a list of all registered doctors.
*   **Doctor Functionalities (`/api/doctor`):**
    *   `GET /appointments`: Retrieves all appointments scheduled for the authenticated doctor.
    *   `PUT /appointments/:id`: Updates the status of a specific appointment.
    *   `POST /prescriptions`: Allows doctors to issue a prescription for a patient.
    *   `GET /patients`: Retrieves a list of patients who have had appointments with the authenticated doctor.
*   **Admin Functionalities (`/api/admin`):**
    *   `GET /users`: Retrieves a list of all users, with optional filtering by role (`?role=doctor` or `?role=patient`).
    *   `PUT /approve-doctor/:id`: Approves a doctor's account, allowing them to log in.
    *   `DELETE /users/:id`: Deletes a user account.
    *   `GET /stats`: Provides administrative statistics (e.g., total patients, total doctors, total appointments, pending doctor approvals).

## 4. Database Schema (Inferred)

Based on the model usage in controllers, the following Mongoose models are used:

*   **User:** Stores user details (name, email, hashed password, role (patient, doctor, admin), gender, phone, `isDoctorApproved` for doctors).
*   **Appointment:** Stores appointment details (patient ID, doctor ID, date, time, reason, status).
*   **Prescription:** Stores prescription details (appointment ID, patient ID, doctor ID, diagnosis, medicines, notes).

## 5. Development and Deployment

The project uses `npm` for package management.
*   **Client:** Developed with Vite, scripts include `dev` (for development server), `build` (for production build), `lint`, and `preview`.
*   **Server:** Scripts include `start` (to run `server.js` with Node) and `dev` (to run `server.js` with `nodemon` for development).

This report provides a comprehensive overview of the Doctor Appointment System, highlighting its key features, technologies, and architectural components.
