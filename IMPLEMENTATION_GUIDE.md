# Implementation Guide: Patient-Doctor System

## Quick Start

### 1. Build and Run Services

```bash
# Start all services with Docker Compose
docker-compose up --build

# Services will start in this order:
# - RabbitMQ (5672, 15672)
# - Eureka Server (8761)
# - Config Server (8888)
# - Alerts Service (8084)
# - Patient Service (8081)
# - Doctor Service (8082)
# - API Gateway (8080)
# - Frontend (5173)
```

### 2. Access the Application

- **Frontend**: http://localhost:5173
- **API Gateway**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761

## Integration with Frontend

### Add Routes for New Pages

Update your Next.js routing structure:

```
app/
  (dashboard)/
    patients/
      page.tsx          # Patient dashboard
      questionnaire/
        page.tsx        # Fill questionnaire
      vital-signs/
        page.tsx        # Record vital signs
    doctors/
      page.tsx          # Doctor dashboard
      pending/
        page.tsx        # View pending patients
      reviews/
        page.tsx        # Review vital signs
```

### Example: Patient Questionnaire Page

`app/(dashboard)/patients/questionnaire/page.tsx`:

```tsx
import { PatientSignupQuestionnaire } from '@/components/patient/questionnaire-form';

export default function QuestionnaireePage() {
  return (
    <div className="container mx-auto py-8">
      <PatientSignupQuestionnaire />
    </div>
  );
}
```

### Example: Doctor Pending Patients Page

`app/(dashboard)/doctors/pending/page.tsx`:

```tsx
'use client';

import { useSession } from 'next-auth/react';
import { DoctorPendingPatients } from '@/components/doctor/pending-patients';

export default function PendingPatientsPage() {
  const { data: session } = useSession();
  
  // You'll need to store doctor ID in session after authentication
  const doctorId = (session?.user as any)?.doctorId;

  if (!doctorId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <DoctorPendingPatients doctorId={doctorId} />
    </div>
  );
}
```

## Authentication Integration

### Setup Auth Endpoints

You need to integrate authentication in your auth flow:

1. **After Patient Signup**: Return patient ID
2. **After Doctor Signup**: Return doctor ID + specialty

### Modify Auth Callback (NextAuth or your auth provider)

```typescript
// Store user type and ID in session
const signupResponse = await fetch('/api/patients/register', {
  method: 'POST',
  body: JSON.stringify(formData),
});

const userData = await signupResponse.json();

// Store in session
session.user.type = 'patient';
session.user.patientId = userData.id;
```

## Testing the System

### Test Patient Flow

1. **Register Patient**
   ```bash
   curl -X POST "http://localhost:8080/api/patients/register?email=patient@example.com&firstName=John&lastName=Doe&phone=555-1234"
   ```

2. **Complete Questionnaire**
   ```bash
   curl -X POST "http://localhost:8080/api/patients/1/questionnaire" \
     -H "Content-Type: application/json" \
     -d '{
       "specialty": "Cardiology",
       "symptoms": "Chest pain",
       "medicalHistory": "None",
       "currentMedications": "None"
     }'
   ```

3. **Register Doctor**
   ```bash
   curl -X POST "http://localhost:8080/api/doctors/register?email=doctor@example.com&firstName=Jane&lastName=Smith&phone=555-5678&specialty=Cardiology&licenseNumber=LIC123"
   ```

4. **Doctor Approves Patient**
   ```bash
   curl -X PUT "http://localhost:8080/api/patient-approvals/1/approve" \
     -H "Content-Type: application/json" \
     -d '{"notes": "Approved"}'
   ```

5. **Patient Records Vital Signs**
   ```bash
   curl -X POST "http://localhost:8080/api/vital-signs/record" \
     -H "Content-Type: application/json" \
     -d '{
       "patientId": 1,
       "bloodPressureSystolic": 120,
       "bloodPressureDiastolic": 80,
       "heartRate": 72,
       "temperature": 37.5,
       "respiratoryRate": 16,
       "weight": 75,
       "height": 180,
       "notes": "Feeling better"
     }'
   ```

## Database Configuration

### Development (H2)
Services already configured with H2. No additional setup needed.

### Production (PostgreSQL)

Update each service's `application.yaml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/medisuiv_patient
    username: postgres
    password: your_password
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQL10Dialect
```

Add PostgreSQL driver to `pom.xml`:

```xml
<dependency>
  <groupId>org.postgresql</groupId>
  <artifactId>postgresql</artifactId>
  <version>42.7.1</version>
  <scope>runtime</scope>
</dependency>
```

## Common Issues & Solutions

### Issue: Services not discovering each other

**Solution**: Ensure Eureka server is running and services can reach it

```yaml
eureka:
  client:
    service-url:
      defaultZone: http://eureka-server:8761/eureka/
```

### Issue: API Gateway returns 503 Service Unavailable

**Solution**: Check if services are registered in Eureka

- Visit: http://localhost:8761
- Look for `patient-service` and `doctor-service` in the instances list

### Issue: CORS errors from frontend

**Solution**: Add CORS configuration to API Gateway

Create file: `api-gateway/src/main/java/com/medisuiv/gateway/config/CorsConfig.java`

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowCredentials(true);
        corsConfig.addAllowedOriginPattern("*");
        corsConfig.addAllowedHeader("*");
        corsConfig.addAllowedMethod("*");
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);
        
        return new CorsWebFilter(source);
    }
}
```

### Issue: Patients not appearing in doctor's pending list

**Solution**: Verify questionnaire was created with matching specialty

```bash
# Check patient's questionnaire
curl http://localhost:8080/api/patients/1/questionnaire
```

## Performance Optimization

### Enable Caching

Add to `application.yaml`:

```yaml
spring:
  cache:
    type: simple
```

Add `@Cacheable` to frequently accessed methods:

```java
@Cacheable("doctors")
public DoctorDTO getDoctorById(Long id) { ... }
```

### Connection Pooling

Configure in `pom.xml`:

```xml
<dependency>
  <groupId>com.zaxxer</groupId>
  <artifactId>HikariCP</artifactId>
  <version>5.1.0</version>
</dependency>
```

## Monitoring

### Health Check Endpoints

```bash
curl http://localhost:8081/actuator/health    # Patient Service
curl http://localhost:8082/actuator/health    # Doctor Service
```

### Metrics

```bash
curl http://localhost:8081/actuator/metrics   # Patient Service Metrics
curl http://localhost:8082/actuator/metrics   # Doctor Service Metrics
```

## Next Steps

1. **Integrate Authentication**: Connect to your auth system
2. **Setup Notifications**: Add email/SMS notifications for approvals
3. **Add Real-time Updates**: Implement WebSockets
4. **Setup Production Database**: Configure PostgreSQL
5. **Add Logging**: Centralized logging with ELK stack
6. **Setup Monitoring**: Prometheus + Grafana
7. **Implement API Documentation**: Swagger/OpenAPI

## Support Resources

- Spring Boot Documentation: https://spring.io/projects/spring-boot
- Spring Cloud Gateway: https://spring.io/projects/spring-cloud-gateway
- Spring Data JPA: https://spring.io/projects/spring-data-jpa
- Eureka: https://github.com/spring-cloud/spring-cloud-netflix/wiki/Eureka-at-a-glance
