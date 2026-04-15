# Frontend Testing Guide

## ✅ Navigation & Routing

Your frontend is now fully set up with:

### Pages Available:
- **`/` (Home)** - Welcome page with feature overview and navigation
- **`/patient`** - Patient dashboard with:
  - Questionnaire form (health info + specialty selection)
  - Approval status checker
  - Vital signs submission form
  - Help/FAQ section
- **`/doctor`** - Doctor dashboard with:
  - Pending patients list
  - Vital signs review interface
  - Doctor registration form
  - Guidelines & help section

### Navigation Bar:
- **Logo**: "MediSuiv" (clickable, returns home)
- **Links**: Home | Patient | Doctor
- **Active State**: Highlights current page
- **Sign In Button**: Placeholder for auth integration

## 🚀 Quick Start

### 1. Start the Frontend
```bash
cd c:\Users\arijm\Downloads\Medisuiv-ons-frontend
npm run dev
# or
pnpm dev
```

Then open: **http://localhost:3000**

### 2. Navigate to Patient Section
- Click "I'm a Patient" button on welcome page
- Or use navbar: Home → Patient

### 3. Fill Patient Questionnaire
- Enter personal information
- Select medical specialty (Cardiology, Neurology, etc.)
- Describe symptoms
- Add medical history and medications

### 4. Navigate to Doctor Section
- Click "I'm a Doctor" button on welcome page
- Or use navbar: Home → Doctor

### 5. Register as Doctor
- Click "Register as Doctor" button
- Fill in doctor details:
  - Name, email, phone
  - Select your specialty (must match patient specialty for approval)
  - License number
  - Click "Register"

## 📊 End-to-End Testing Flow

### Patient Workflow:
1. Open `/patient`
2. Fill questionnaire (e.g., specialty: "Cardiology")
3. Check status in "Status" tab
4. Once approved by a doctor, submit vital signs (BP, HR, Temp, RR)

### Doctor Workflow:
1. Open `/doctor`
2. Register doctor account with matching specialty
3. Check "Pending Patients" tab to see patient requests
4. Review and approve/reject patient
5. Check "Vital Signs Review" tab to monitor approved patients' health data

## 🔌 API Integration

All forms are connected to your microservices via the API Gateway:

### Base URL: `http://localhost:8080/api`

**Patient Endpoints:**
- `POST /patients/register` - Submit patient questionnaire
- `GET /patients/{id}/approval-status` - Check approval status
- `POST /patients/{id}/vital-signs` - Submit vital signs

**Doctor Endpoints:**
- `POST /doctors/register` - Register doctor
- `GET /doctors/{id}/pending-patients` - Get pending patient approvals
- `POST /doctors/{id}/approve-patient` - Approve patient request
- `GET /doctors/{id}/patient-vital-signs` - Review vital signs

## 🎨 UI Components Used

- **Radix UI Components**: Button, Card, Tabs, Input, Select, Dialog, etc.
- **Tailwind CSS**: Gradient backgrounds, responsive grid layouts
- **Lucide React**: Icons (Heart, Users, Stethoscope, Clock, ArrowRight)
- **Next.js 14**: App Router with file-based routing

## 🐳 Running the Complete Stack

### Start All Services:
```bash
docker compose up --build
```

This starts:
- **Frontend** (3000) - Next.js UI
- **API Gateway** (8080) - Route requests to microservices
- **Patient Service** (8081) - Patient management
- **Doctor Service** (8082) - Doctor management
- **Eureka Server** (8761) - Service discovery
- **Config Server** (8888) - Configuration management
- **Alerts Service** (8084) - Alert management

### Access Points:
- Frontend: http://localhost:3000
- API Gateway: http://localhost:8080
- Eureka Dashboard: http://localhost:8761

## ✨ Features Implemented

✅ Welcome page with overview
✅ Navigation bar with active state tracking
✅ Patient registration with questionnaire
✅ Doctor registration with specialty matching
✅ Approval status checking
✅ Vital signs submission
✅ Responsive design (mobile, tablet, desktop)
✅ Dark/Light theme support
✅ Icons and visual indicators
✅ Help sections and guidelines
✅ Demo state management

## 📝 Testing Checklist

- [ ] Welcome page loads correctly
- [ ] Navigation links work
- [ ] Patient page accessible
- [ ] Doctor page accessible
- [ ] Patient form submits successfully
- [ ] Doctor form submits successfully
- [ ] Approval status updates
- [ ] Vital signs form works
- [ ] Responsive design on mobile
- [ ] Dark mode toggle works
- [ ] All API calls complete

## 🔧 Troubleshooting

**Port 3000 already in use?**
```bash
pnpm dev -- -p 3001
```

**API Calls Failing?**
- Check if API Gateway is running: `http://localhost:8080/health`
- Check if microservices are running: `docker ps`
- Check browser console for error details

**Styling Issues?**
```bash
pnpm install
pnpm build
```

## 📞 Support

For microservices setup, see:
- `SETUP_SUMMARY.md` - Infrastructure overview
- `MICROSERVICES_GUIDE.md` - Service details
- `IMPLEMENTATION_GUIDE.md` - Complete implementation guide
