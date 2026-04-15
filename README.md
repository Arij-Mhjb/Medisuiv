# MediSuiv Microservices Platform

Projet microservices Spring Boot prepare pour une presentation VS Code, avec securite Keycloak, communication synchrone et asynchrone, monitoring, Docker, CI/CD et Kubernetes.

## Objectifs couverts du bareme

- Microservices avec technologie avancee: Spring Cloud, API Gateway, Eureka, Config Server, OpenFeign, RabbitMQ
- Base de donnees: PostgreSQL pour `questionnaires-service` et `notifications-service`, MongoDB pour `dashboards-service`
- Securite: Gateway securise avec Keycloak/JWT, roles `ADMIN`, `DOCTOR`, `ANALYST`, theme Keycloak personnalise
- Git et documentation: structure claire, README detaille, pipeline CI GitHub Actions
- Communication:
  - Synchrone avec Feign Client
  - Asynchrone avec RabbitMQ
- Valeurs ajoutees: Docker Compose, Prometheus, Grafana, manifests Kubernetes, Swagger centralise

## Architecture

- `eureka-server`: service discovery
- `config-server`: configuration centralisee
- `api-gateway`: point d'entree unique, securite, documentation Swagger centralisee
- `questionnaires-service`: gestion des questionnaires et des reponses, PostgreSQL
- `dashboards-service`: analytique et projections, MongoDB, consommateur RabbitMQ, client Feign
- `notifications-service`: journalisation des notifications, PostgreSQL, consommateur RabbitMQ

## Technologies

- Java 21
- Spring Boot 3.5
- Spring Cloud 2025
- Spring Cloud Gateway
- Eureka Server
- Spring Config Server
- Spring Security OAuth2 Resource Server
- Keycloak
- OpenFeign
- RabbitMQ
- PostgreSQL
- MongoDB
- Springdoc OpenAPI
- Prometheus + Grafana
- Docker Compose
- Kubernetes
- GitHub Actions

## Communication synchrone avec Feign

`dashboards-service` appelle `questionnaires-service` dans au moins 3 scenarios:

1. `GET /dashboards/api/dashboards/overview`
   utilise `GET /api/questionnaires/stats/overview`
2. `GET /dashboards/api/dashboards/questionnaires/{id}/drilldown`
   utilise `GET /api/questionnaires/{id}`
3. `GET /dashboards/api/dashboards/questionnaires/published`
   utilise `GET /api/questionnaires?status=PUBLISHED`
4. `GET /dashboards/api/dashboards/trends`
   utilise `GET /api/questionnaires/stats/trends`

## Communication asynchrone avec RabbitMQ

`questionnaires-service` publie 3 types d'evenements:

1. `questionnaire.created`
2. `questionnaire.updated`
3. `questionnaire.response.submitted`

Consommation:

- `dashboards-service` stocke les projections dans MongoDB et expose `GET /dashboards/api/dashboards/events`
- `notifications-service` transforme les evenements en notifications et expose `GET /notifications/api/notifications`

## Securite et roles

- Le Gateway protege les routes par role
- Les microservices valident aussi le JWT cote service
- Les roles Keycloak sont:
  - `ADMIN`
  - `DOCTOR`
  - `ANALYST`

Comptes de demonstration Keycloak:

- `admin-ms / admin123`
- `doctor-ms / doctor123`
- `analyst-ms / analyst123`

Realm importable:

- `infra/keycloak/realm/medisuiv-realm.json`

Theme Keycloak personnalise:

- `infra/keycloak/themes/medisuiv`

## Swagger centralise

Une seule interface Swagger est exposee via le gateway:

- [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

Documents agreges:

- Gateway
- Questionnaires Service
- Dashboards Service
- Notifications Service

## Ports utiles

- `8080`: API Gateway
- `8085`: Questionnaires Service
- `8086`: Dashboards Service
- `8088`: Notifications Service
- `8761`: Eureka
- `8888`: Config Server
- `8087`: Keycloak
- `5672`: RabbitMQ AMQP
- `15672`: RabbitMQ Management
- `9090`: Prometheus
- `3000`: Grafana

## Execution locale

### 1. Pre-requis

- Java 21
- Maven 3.9+ ou wrapper Maven
- Docker Desktop

### 2. Build des services

```bash
mvn clean package -DskipTests
```

### 3. Lancement complet

```bash
docker compose up --build
```

### 4. Ordre logique si demarrage manuel

1. `postgres`, `mongo`, `rabbitmq`, `keycloak`
2. `eureka-server`
3. `config-server`
4. `questionnaires-service`
5. `dashboards-service`
6. `notifications-service`
7. `api-gateway`

## Scenarios de demonstration

### Scenario 1: securite

1. Se connecter a Keycloak avec `admin-ms`
2. Tester `POST /questionnaires/api/questionnaires`
3. Verifier qu'un role non autorise ne peut pas creer de questionnaire

### Scenario 2: Feign

1. Appeler `GET /dashboards/api/dashboards/overview`
2. Appeler `GET /dashboards/api/dashboards/questionnaires/published`
3. Appeler `GET /dashboards/api/dashboards/questionnaires/1/drilldown`

### Scenario 3: RabbitMQ

1. Creer un questionnaire
2. Modifier un questionnaire
3. Soumettre des reponses
4. Verifier `GET /dashboards/api/dashboards/events`
5. Verifier `GET /notifications/api/notifications`

### Scenario 4: monitoring

1. Ouvrir [http://localhost:9090](http://localhost:9090)
2. Ouvrir [http://localhost:3000](http://localhost:3000)
3. Observer les requetes et les services

## Docker et cloud

- `docker-compose.yml`: stack complete locale
- `Dockerfile` dans chaque service
- Les manifests `k8s/` servent de base pour KillerCoda, Minikube, EKS ou AKS

## Monitoring

- Prometheus scrape les endpoints `/actuator/prometheus`
- Grafana provisionne automatiquement une datasource Prometheus
- Un dashboard de base est fourni dans `infra/grafana/dashboards`

## CI/CD

Pipeline GitHub Actions:

- `.github/workflows/ci.yml`

Etapes:

1. Checkout
2. Setup Java 21
3. Build Maven
4. Build des images Docker

## Kubernetes

Dossier `k8s/`:

- `namespace.yaml`
- `postgres.yaml`
- `mongo.yaml`
- `rabbitmq.yaml`
- `microservices.yaml`

Les manifests montrent:

- orchestration des microservices
- replicas sur les services critiques
- load balancing via `Service`
- tolerance aux pannes par replication des services applicatifs

## Structure interessante pour la soutenance

- [docker-compose.yml](./docker-compose.yml)
- [api-gateway/src/main/resources/application.yml](./api-gateway/src/main/resources/application.yml)
- [questionnaires-service/src/main/java/com/medisuiv/questionnaire/service/QuestionnaireService.java](./questionnaires-service/src/main/java/com/medisuiv/questionnaire/service/QuestionnaireService.java)
- [dashboards-service/src/main/java/com/medisuiv/dashboard/client/QuestionnaireClient.java](./dashboards-service/src/main/java/com/medisuiv/dashboard/client/QuestionnaireClient.java)
- [dashboards-service/src/main/java/com/medisuiv/dashboard/messaging/DashboardEventConsumer.java](./dashboards-service/src/main/java/com/medisuiv/dashboard/messaging/DashboardEventConsumer.java)
- [notifications-service/src/main/java/com/medisuiv/notification/messaging/NotificationEventConsumer.java](./notifications-service/src/main/java/com/medisuiv/notification/messaging/NotificationEventConsumer.java)
- [infra/keycloak/realm/medisuiv-realm.json](./infra/keycloak/realm/medisuiv-realm.json)

## Limite actuelle

Le terminal courant ne dispose pas de Maven (`mvn` indisponible), donc le projet n'a pas pu etre compile et execute ici. La structure, le code et l'infrastructure ont ete prepares pour que tu puisses l'ouvrir dans VS Code, installer Maven ou ajouter un wrapper, puis lancer le build.
