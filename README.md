# 🩺 MediSuiv

**MediSuiv** is an intelligent **post-hospitalization patient monitoring platform** built with a **microservices architecture**.
The platform enables healthcare providers to **remotely monitor patients after hospital discharge** through the continuous collection of vital signs using connected medical devices.

The system helps doctors detect potential health risks early and ensures continuous medical follow-up.

---

# 📌 Project Repository

GitHub:
https://github.com/Arij-Mhjb/Medisuiv.git

---

# 🎯 Project Objectives

* Monitor patients remotely after hospital discharge
* Collect and analyze patient vital signs continuously
* Improve communication between doctors and patients
* Detect abnormal health indicators and trigger alerts
* Provide doctors with dashboards and reports for decision making

---

# 🏗 System Architecture

MediSuiv is built using a **microservices architecture** to ensure scalability, flexibility, and independent service management.

Main technologies used:

* **Frontend:** React
* **Backend:** Node.js
* **Reporting & Analysis:** MongoDB
* **Databases:** MySQL & H2

Each service manages a specific domain of the platform.

---

# ⚙️ Microservices

## 1️⃣ User Management Service

**Database:** MySQL

Responsible for authentication and role management.

Entities:

* Utilisateur (User)
* Rôle (Role)

Features:

* User registration and authentication
* Role management (Admin, Doctor, Patient)
* Access control

---

## 2️⃣ Patient Monitoring Service

**Database:** H2

Handles patient medical monitoring.

Entities:

* Patient
* DossierMedical (Medical Record)

Features:

* Patient registration
* Medical record management
* Patient follow-up after hospital discharge

---

## 3️⃣ Vital Signs & Medical Services

**Database:** H2

Responsible for collecting and managing patient vital signs.

Entities:

* ParametreVital (Vital Sign)
* Symptome (Symptom)

Examples of tracked parameters:

* Blood pressure
* Heart rate
* Temperature
* Blood glucose
* Oxygen saturation
* Weight

---

## 4️⃣ Alerts & Notifications Service

**Database:** H2

Detects abnormal values and notifies healthcare professionals.

Entities:

* Alerte
* Notification

Features:

* Automatic alerts for abnormal vital signs
* Notification system for doctors and patients

---

## 5️⃣ Questionnaires & Dashboards

**Database:** MySQL

Provides reporting and medical evaluation tools.

Entities:

* Questionnaire
* Question
* Réponse

Features:

* Patient health questionnaires
* Medical surveys
* Monitoring dashboards

---

# 📊 Global Analysis & Reporting

MediSuiv integrates **MongoDB** for advanced analytics and reporting:

* Patient health data analysis
* Medical dashboards
* Trend visualization
* Population health insights

---

# 🖥 Frontend

**Technology:** React

Main interfaces include:

* Patient dashboard
* Doctor monitoring panel
* Vital signs tracking
* Alerts and notifications
* Health questionnaires

---

# 🔐 Security Features

* Role-based authentication
* Secure API communication
* Protected medical data access
* Controlled doctor–patient assignment

---

# 🚀 Future Improvements

* Integration with wearable health devices
* AI-based health prediction
* Telemedicine video consultations
* Mobile application (React Native / Flutter)
* Advanced analytics and machine learning

---

# 👩‍⚕️ Target Users

* Hospitals
* Doctors
* Post-hospitalization patients
* Telemedicine platforms
* Healthcare monitoring services

---

# 📄 License

This project is intended for **research and educational purposes** in healthcare technology.

---

# 💡 Project Name Meaning

**MediSuiv** =
**Medical + Suivi (French for monitoring / follow-up)**

The platform focuses on **continuous patient follow-up after hospitalization**.
