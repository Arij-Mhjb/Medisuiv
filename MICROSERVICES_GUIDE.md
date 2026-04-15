# Patient & Doctor Microservices Architecture

## Overview

This document describes the Patient and Doctor microservices that have been added to the Medisuiv-ons healthcare platform. These services implement a complete patient-doctor workflow where patients can fill questionnaires, get matched with doctors by specialty, and share vital signs data.

## Architecture

### Microservices

1. **Patient Service** (Port 8081)
   - Manages patient registration and profiles
   - Handles patient questionnaires with specialty selection
   - Stores vital signs data
   - Tracks doctor approvals

2. **Doctor Service** (Port 8082)
   - Manages doctor registration and profiles
   - Tracks patient approval requests by specialty
   - Reviews and tags vital signs data
   - Manages doctor-patient relationships

### Service Discovery

Both microservices register with **Eureka Service Discovery** (Port 8761) for dynamic service location.

### API Gateway

The **API Gateway** (Port 8080) routes all requests to appropriate microservices:
- `/api/patients/**` → Patient Service
- `/api/vital-signs/**` → Patient Service
- `/api/doctors/**` → Doctor Service
- `/api/patient-approvals/**` → Doctor Service
- `/api/vital-signs-review/**` → Doctor Service

## Data Models

### Patient Service

#### Patient
```
{
  id: Long,
  email: String (unique),
  firstName: String,
  lastName: String,
  phone: String,
  createdAt: LocalDateTime,
  isApproved: Boolean,
  approvedByDoctorId: Long,
  assignedDoctorId: Long,
  approvedAt: LocalDateTime
}
```

#### Questionnaire
```
{
  id: Long,
  patientId: Long (FK),
  specialty: String,
  symptoms: String,
  medicalHistory: String,
  currentMedications: String,
  completedAt: LocalDateTime,
  isVisibleToDoctors: Boolean
}
```

#### VitalSigns
```
{
  id: Long,
  patientId: Long,
  bloodPressureSystolic: Integer,
  bloodPressureDiastolic: Integer,
  heartRate: Integer,
  temperature: Double,
  respiratoryRate: Integer,
  weight: Double,
  height: Double,
  notes: String,
  recordedAt: LocalDateTime,
  submittedToDoctor: Boolean,
  submittedAt: LocalDateTime
}
```

### Doctor Service

#### Doctor
```
{
  id: Long,
  email: String (unique),
  firstName: String,
  lastName: String,
  phone: String,
  specialty: String,
  licenseNumber: String,
  isVerified: Boolean,
  createdAt: LocalDateTime
}
```

#### PatientApproval
```
{
  id: Long,
  patientId: Long,
  patientEmail: String,
  patientFirstName: String,
  patientLastName: String,
  doctorId: Long,
  specialty: String,
  symptoms: String,
  medicalHistory: String,
  currentMedications: String,
  status: String (PENDING, APPROVED, REJECTED),
  createdAt: LocalDateTime,
  approvedAt: LocalDateTime,
  notes: String
}
```

#### PatientVitalSignsReview
```
{
  id: Long,
  patientId: Long,
  vitalSignsId: Long,
  doctorId: Long,
  bloodPressureSystolic: Integer,
  bloodPressureDiastolic: Integer,
  heartRate: Integer,
  temperature: Double,
  respiratoryRate: Integer,
  weight: Double,
  height: Double,
  recordedAt: LocalDateTime,
  doctorNotes: String,
  isReviewed: Boolean,
  reviewedAt: LocalDateTime
}
```

## Workflow

### Patient Flow

1. **Sign Up & Questionnaire**
   - Patient registers with personal information
   - Completes health questionnaire (specialty, symptoms, medical history, medications)
   - Data stored and visible to doctors in that specialty

2. **Wait for Approval**
   - Patient can view approval status
   - Doctor reviews questionnaire and approves/rejects
   - Patient notified once approved

3. **Submit Vital Signs**
   - Once approved, patient can record vital signs
   - Vitals include: blood pressure, heart rate, temperature, respiratory rate, weight, height
   - Patient can submit vitals to doctor for review

### Doctor Flow

1. **Registration**
   - Doctor registers with credentials (name, email, specialty, license number)
   - Account must be verified by admin

2. **Review Pending Patients**
   - Doctor sees all pending patients in their specialty
   - Reviews patient questionnaire and medical history
   - Approves or rejects patient request

3. **Review Vital Signs**
   - Doctor views vital signs submitted by approved patients
   - Adds clinical notes/observations
   - Marks as reviewed

## API Endpoints

### Patient Endpoints

#### Registration & Profile
- `POST /api/patients/register` - Register new patient
- `GET /api/patients/{id}` - Get patient by ID
- `GET /api/patients/email/{email}` - Get patient by email

#### Questionnaire Management
- `POST /api/patients/{patientId}/questionnaire` - Complete questionnaire
- `GET /api/patients/{patientId}/questionnaire` - Get patient's questionnaire
- `GET /api/patients/questionnaires/specialty/{specialty}` - Get all questionnaires for a specialty

#### Patient Status
- `GET /api/patients/pending/all` - Get all pending patients
- `GET /api/patients/doctor/{doctorId}/approved` - Get approved patients for a doctor
- `PUT /api/patients/{patientId}/approve?doctorId={doctorId}` - Approve patient
- `DELETE /api/patients/{patientId}/reject` - Reject patient

### Vital Signs Endpoints

#### Recording & Management
- `POST /api/vital-signs/record` - Record new vital signs
- `GET /api/vital-signs/patient/{patientId}` - Get all vital signs for patient
- `GET /api/vital-signs/patient/{patientId}/latest` - Get latest vital signs
- `PUT /api/vital-signs/{vitalSignsId}/submit-to-doctor` - Submit vitals to doctor

### Doctor Endpoints

#### Registration & Profile
- `POST /api/doctors/register` - Register new doctor
- `GET /api/doctors/{id}` - Get doctor by ID
- `GET /api/doctors/email/{email}` - Get doctor by email
- `GET /api/doctors/specialty/{specialty}` - Get doctors by specialty
- `GET /api/doctors/verified/all` - Get all verified doctors
- `PUT /api/doctors/{doctorId}/verify` - Verify doctor account

### Patient Approval Endpoints

- `POST /api/patient-approvals/create` - Create approval request
- `GET /api/patient-approvals/doctor/{doctorId}/pending` - Get pending approvals for doctor
- `GET /api/patient-approvals/specialty/{specialty}/pending` - Get pending approvals for specialty
- `GET /api/patient-approvals/doctor/{doctorId}/approved` - Get approved patients for doctor
- `PUT /api/patient-approvals/{approvalId}/approve` - Approve patient
- `PUT /api/patient-approvals/{approvalId}/reject` - Reject patient

### Vital Signs Review Endpoints

- `POST /api/vital-signs-review/create` - Create vital signs review
- `GET /api/vital-signs-review/doctor/{doctorId}` - Get all reviews for doctor
- `GET /api/vital-signs-review/doctor/{doctorId}/unreviewed` - Get unreviewed vitals
- `GET /api/vital-signs-review/patient/{patientId}` - Get reviews for patient
- `GET /api/vital-signs-review/patient/{patientId}/doctor/{doctorId}` - Get reviews for patient by doctor
- `PUT /api/vital-signs-review/{reviewId}/review` - Complete review with notes

## Frontend Components

### Patient Components

#### `PatientSignupQuestionnaire`
Complete registration and health questionnaire form for new patients
- Location: `components/patient/questionnaire-form.tsx`
- Includes personal info and detailed health questions

#### `VitalSignsForm`
Form for recording vital signs (only available after doctor approval)
- Location: `components/patient/vital-signs-form.tsx`
- Records BP, heart rate, temperature, respiratory rate, weight, height

#### `PatientApprovalStatus`
Shows patient's approval status with doctor
- Location: `components/patient/approval-status.tsx`
- Displays pending/approved status and timeline

### Doctor Components

#### `DoctorPendingPatients`
List of pending patients awaiting doctors approval
- Location: `components/doctor/pending-patients.tsx`
- Shows patient questionnaire details
- Approve/reject buttons

#### `DoctorVitalSignsReview`
Review and annotate patient vital signs
- Location: `components/doctor/vital-signs-review.tsx`
- Display vital signs data
- Add clinical notes

## Deployment

### Build Services

```bash
# Patient Service
cd patient-service
mvn clean package

# Doctor Service
cd doctor-service
mvn clean package
```

### Docker Compose

```bash
# Start all services
docker-compose up --build

# Stop services
docker-compose down
```

Services will be available at:
- Patient Service: http://localhost:8081
- Doctor Service: http://localhost:8082
- API Gateway: http://localhost:8080
- Eureka: http://localhost:8761

## Database

Both services use **H2 in-memory database** for development:
- Patient Service: `jdbc:h2:mem:patientdb`
- Doctor Service: `jdbc:h2:mem:doctordb`

For production, replace with:
- PostgreSQL
- MySQL
- Oracle

Update `application.yaml` configuration accordingly.

## Future Enhancements

1. **Message Queue Integration**
   - Add RabbitMQ for async notifications when patients get approved
   - Send notifications when doctors review vital signs

2. **Authentication & Authorization**
   - JWT token-based auth for patient and doctor roles
   - Role-based access control (RBAC)

3. **Persistence**
   - Replace H2 with production database
   - Add database migrations with Flyway

4. **Real-time Notifications**
   - WebSocket support for real-time updates
   - Push notifications for approvals and reviews

5. **Advanced Filtering**
   - Full-text search for patient/doctor queries
   - Advanced filtering and sorting capabilities

6. **Audit Logging**
   - Track all approvals, reviews, and data access
   - Compliance and audit trail

7. **Error Handling**
   - Centralized error handling with custom exceptions
   - Global exception handler across services

## Troubleshooting

### Services not starting
- Ensure a Eureka server is running on port 8761
- Check if ports 8081 and 8082 are available

### Patients not visible to doctors
- Verify questionnaire is completed and marked as visible
- Check that doctor's specialty matches patient's request

### Database issues
- H2 database resets on service restart
- Data is not persisted between runs

## Support

For issues or questions, please refer to the API documentation in each service or create an issue in the repository.
