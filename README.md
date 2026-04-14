# MediSuiv Backend

Backend microservices for the `Questionnaires & Dashboards` domain of MediSuiv.

## Services

- `eureka-server`: service discovery
- `config-server`: centralized configuration with native files
- `api-gateway`: single exposed entry point
- `questionnaires-service`: MySQL service for questionnaires, questions, responses, update, and delete
- `dashboards-service`: MongoDB analytics service with OpenFeign calls to `questionnaires-service`

## Architecture rules covered

- All services are configured to register in Eureka
- Routing is exposed through `api-gateway`
- `dashboards-service` communicates with `questionnaires-service` through OpenFeign

## Default ports

- `8761`: Eureka
- `8888`: Config Server
- `8080`: API Gateway
- `8085`: Questionnaires Service
- `8086`: Dashboards Service

## Run order

1. Start MySQL and MongoDB
2. Start `eureka-server`
3. Start `config-server`
4. Start `questionnaires-service`
5. Start `dashboards-service`
6. Start `api-gateway`

## Example gateway URLs

- `GET /questionnaires/api/questionnaires`
- `POST /questionnaires/api/questionnaires`
- `PUT /questionnaires/api/questionnaires/{id}`
- `DELETE /questionnaires/api/questionnaires/{id}`
- `POST /questionnaires/api/questionnaires/{id}/responses`
- `GET /dashboards/api/dashboards/overview`
- `POST /dashboards/api/dashboards/snapshots`

## Databases

Use the included `docker-compose.yml` to bootstrap local MySQL and MongoDB.

## Postman

Import `MediSuiv-Validation.postman_collection.json` and execute every request through the API Gateway only.
