# 🏥 MediSuiv — Plateforme de Suivi Médical Intelligent

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-green?logo=springboot)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://nextjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue?logo=docker)](https://docs.docker.com/compose/)
[![Azure OpenAI](https://img.shields.io/badge/Azure%20OpenAI-GPT--4o-purple?logo=openai)](https://azure.microsoft.com/en-us/products/ai-services/openai-service)

**MediSuiv** est une plateforme de télésanté basée sur une architecture **microservices** qui permet le suivi médical continu entre patients et médecins. Elle intègre l'**intelligence artificielle (GPT-4o)** pour l'analyse automatique des signes vitaux et la génération de recommandations personnalisées.

---

## 📋 Table des Matières

- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Stack Technologique](#-stack-technologique)
- [Prérequis](#-prérequis)
- [Installation & Lancement](#-installation--lancement)
- [Utilisation](#-utilisation)
- [API Endpoints](#-api-endpoints)
- [Structure du Projet](#-structure-du-projet)
- [Intelligence Artificielle](#-intelligence-artificielle)

---

## ✨ Fonctionnalités

### 👤 Espace Patient
- Inscription et authentification sécurisée (BCrypt)
- Questionnaire médical initial (spécialité, symptômes, historique)
- Suivi du statut d'approbation par un médecin
- Soumission quotidienne des signes vitaux (tension, fréquence cardiaque, température, etc.)
- Historique complet des consultations avec notes du médecin
- 🤖 **Recommandations IA personnalisées** basées sur les notes du docteur

### 👨‍⚕️ Espace Médecin
- Inscription avec vérification de spécialité et numéro de licence
- Tableau de bord des patients en attente d'approbation
- Gestion des patients approuvés
- Examen des signes vitaux soumis par les patients
- 🤖 **Analyse IA automatique** des signes vitaux avec GPT-4o
- Ajout de notes cliniques et validation des reviews

### 🔧 Technique
- Architecture microservices avec découverte automatique (Eureka)
- API Gateway centralisée avec routage intelligent
- Communication asynchrone via RabbitMQ
- Conteneurisation complète avec Docker Compose
- Base de données par service (isolation des données)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                    │
│                    Port: 5173                            │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────────┐  │
│  │ Patient  │  │ Doctor   │  │ API Routes (IA)       │  │
│  │Dashboard │  │Dashboard │  │ /api/ai/analyze-vitals│  │
│  └──────────┘  └──────────┘  │ /api/ai/patient-reco  │  │
│                               └───────────────────────┘  │
└───────────────────────┬─────────────────┬────────────────┘
                        │ /api/*          │ Direct
                        ▼                 ▼
              ┌──────────────────┐  ┌──────────────┐
              │   API Gateway    │  │ Azure OpenAI │
              │   Port: 8090     │  │   GPT-4o     │
              └────────┬─────────┘  └──────────────┘
                       │
            ┌──────────┼──────────────────┐
            │          │                  │
            ▼          ▼                  ▼
     ┌────────────┐ ┌────────────┐ ┌────────────┐
     │   User     │ │  Patient   │ │  Doctor    │
     │  Service   │ │  Service   │ │  Service   │
     │  :8083     │ │  :8081     │ │  :8082     │
     │  H2 DB    │ │  H2 DB    │ │  H2 DB    │
     └────────────┘ └────────────┘ └────────────┘
                                          
     ┌────────────┐ ┌────────────┐ ┌────────────┐
     │  Alertes   │ │  Eureka    │ │  Config    │
     │  Service   │ │  Server    │ │  Server    │
     │  :8084     │ │  :8761     │ │  :8888     │
     └──────┬─────┘ └────────────┘ └────────────┘
            │
     ┌──────▼─────┐
     │  RabbitMQ  │
     │  :5672     │
     └────────────┘
```

---

## 🛠️ Stack Technologique

| Composant | Technologie |
|-----------|------------|
| Frontend | Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Spring Boot 3.5, Spring Cloud Gateway, Spring Data JPA |
| Service Discovery | Netflix Eureka |
| Base de données | H2 (in-memory, par service) |
| Messaging | RabbitMQ |
| Sécurité | BCrypt (spring-security-crypto) |
| IA | Azure OpenAI GPT-4o |
| Conteneurisation | Docker, Docker Compose |
| Build | Maven (backend), npm (frontend) |
| Java | JDK 21 |
| Node.js | 20 (Alpine) |

---

## 📦 Prérequis

- **Docker Desktop** (avec Docker Compose)
- **Git**
- (Optionnel) **Postman** pour tester les APIs
- (Optionnel) **Clé API Azure OpenAI** pour les fonctionnalités IA

---

## 🚀 Installation & Lancement

### 1. Cloner le projet
```bash
git clone https://github.com/votre-repo/medisuiv.git
cd medisuiv
```

### 2. Configurer l'IA (optionnel)
Créez un fichier `.env.local` à la racine du projet :
```env
AZURE_OPENAI_API_KEY=votre_clé_api
AZURE_OPENAI_ENDPOINT=https://votre-endpoint.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT=gpt-4o
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

Et ajoutez ces mêmes variables dans `docker-compose.yml` sous le service `frontend > environment`.

### 3. Lancer tous les services
```bash
docker compose up -d --build
```

### 4. Vérifier que tout est opérationnel
```bash
docker compose ps
```

> ⚠️ **Important** : Après le lancement, attendez environ **60 secondes** pour que tous les services s'enregistrent auprès d'Eureka et que l'API Gateway synchronise ses routes.

### 5. Accéder à l'application

| Service | URL |
|---------|-----|
| 🌐 Application Web | http://localhost:5173 |
| 🔌 API Gateway (Postman) | http://localhost:8090 |
| 📡 Eureka Dashboard | http://localhost:8761 |
| 🐰 RabbitMQ Dashboard | http://localhost:15672 (guest/guest) |

---

## 📱 Utilisation

### Flux Patient
1. Accédez à http://localhost:5173 → Cliquez sur **Patient**
2. Remplissez le **questionnaire médical** (infos personnelles + symptômes + spécialité)
3. Attendez l'**approbation** d'un médecin (onglet Status)
4. Une fois approuvé, soumettez vos **signes vitaux** quotidiennement
5. Consultez l'**historique** et les notes du médecin
6. Cliquez sur **💡 Recommandations IA** pour des conseils personnalisés

### Flux Médecin
1. Accédez à http://localhost:5173 → Cliquez sur **Doctor**
2. Enregistrez votre profil médecin (spécialité + licence)
3. Consultez les **patients en attente** → Approuvez ceux qui correspondent à votre spécialité
4. Examinez les **signes vitaux** soumis dans l'onglet Vital Signs Review
5. Cliquez sur **🤖 Générer Analyse IA** pour une analyse automatique
6. Ajoutez vos **notes cliniques** → Cliquez sur Complete Review

---

## 🔌 API Endpoints

### User Service (`/api/users`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Inscription utilisateur |
| POST | `/api/users/login` | Connexion |
| GET | `/api/users/{id}` | Obtenir un utilisateur par ID |
| GET | `/api/users/email/{email}` | Obtenir un utilisateur par email |

### Patient Service (`/api/patients`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/patients/register` | Créer un profil patient |
| POST | `/api/patients/{id}/questionnaire` | Soumettre un questionnaire |
| GET | `/api/patients/{id}` | Obtenir un patient par ID |
| GET | `/api/patients/pending/all` | Lister les patients en attente |
| GET | `/api/patients/{id}/approve?doctorId=X` | Approuver un patient |
| GET | `/api/patients/doctor/{doctorId}/approved` | Patients approuvés d'un docteur |

### Vital Signs (`/api/vital-signs`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/vital-signs/record?params...` | Enregistrer des signes vitaux |
| GET | `/api/vital-signs/patient/{patientId}` | Historique des signes vitaux |
| GET | `/api/vital-signs/patient/{patientId}/latest` | Derniers signes vitaux |

### Doctor Service (`/api/doctors`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/doctors/register` | Créer un profil docteur |
| GET | `/api/doctors/{id}` | Obtenir un docteur par ID |
| GET | `/api/doctors/specialty/{specialty}` | Docteurs par spécialité |

### Vital Signs Review (`/api/vital-signs-review`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/vital-signs-review/create?params...` | Créer une review |
| GET | `/api/vital-signs-review/doctor/{doctorId}/unreviewed` | Reviews en attente |
| PUT | `/api/vital-signs-review/{id}/review?doctorNotes=...` | Soumettre une review |
| GET | `/api/vital-signs-review/patient/{patientId}` | Historique reviews patient |

---

## 📁 Structure du Projet

```
Medisuiv/
├── app/                          # Pages Next.js (Frontend)
│   ├── (auth)/                   # Pages d'authentification
│   │   ├── signin/page.tsx
│   │   └── signup/page.tsx
│   ├── patient/page.tsx          # Dashboard Patient
│   ├── doctor/page.tsx           # Dashboard Docteur
│   └── api/ai/                   # Routes API IA (server-side)
│       ├── analyze-vitals/route.ts
│       └── patient-recommendations/route.ts
│
├── components/                   # Composants React
│   ├── patient/
│   │   ├── questionnaire-form.tsx
│   │   ├── vital-signs-form.tsx
│   │   ├── vital-signs-history.tsx
│   │   └── approval-status.tsx
│   ├── doctor/
│   │   ├── pending-patients.tsx
│   │   ├── vital-signs-review.tsx
│   │   └── approved-patients.tsx
│   └── ui/                       # Composants shadcn/ui
│
├── user-service/                 # Microservice Authentification
│   └── src/main/java/com/medisuiv/user/
│
├── patient-service/              # Microservice Patient
│   └── src/main/java/com/medisuiv/patient/
│
├── doctor-service/               # Microservice Docteur
│   └── src/main/java/com/medisuiv/doctor/
│
├── alertes-service/              # Microservice Alertes
│   └── src/main/java/com/medisuiv/alertes/
│
├── api-gateway/                  # API Gateway (Spring Cloud)
│   └── src/main/resources/application.yaml
│
├── eureka-server/                # Service Discovery
├── config-server/                # Configuration centralisée
│
├── docker-compose.yml            # Orchestration Docker
├── dockerfile                    # Build frontend
├── next.config.mjs               # Configuration Next.js (rewrites)
├── .env.local                    # Variables d'environnement IA
└── README.md                     # Ce fichier
```

---

## 🤖 Intelligence Artificielle

MediSuiv intègre **Azure OpenAI GPT-4o** pour deux fonctionnalités clés :

### Analyse des Signes Vitaux (Docteur)
Le docteur peut générer une analyse clinique automatique qui comprend :
- **Résumé général** de l'état du patient
- **Analyse détaillée** de chaque signe vital vs normes
- **Points d'attention** pour les valeurs anormales
- **Suggestions cliniques** pour les prochaines étapes

### Recommandations Personnalisées (Patient)
Le patient peut obtenir des conseils basés sur la note de son docteur :
- **Explication simplifiée** de la note du médecin
- **Recommandations quotidiennes** (alimentation, exercice, sommeil)
- **Points de vigilance** et quand consulter
- **Encouragements** motivants

> Les appels à Azure OpenAI transitent par des **API Routes Next.js côté serveur**, ce qui garantit que la clé API n'est jamais exposée au navigateur.

---

## 👥 Auteurs

Développé dans le cadre d'un projet académique de suivi médical intelligent.

---

## 📄 Licence

Ce projet est à usage académique.
