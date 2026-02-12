# Scalability and Architecture Note

## 1. Microservices Architecture
Currently, the application is a monolithic REST API. To scale horizontally, we can decouple services:
- **Auth Service**: Handle user registration, login, and token generation.
- **Task Service**: Handle task CRUD operations.
- **Notification Service**: (Optional) Send emails/alerts on task updates.

Communication between services can be handled via REST or a message queue like RabbitMQ/Kafka.

## 2. Caching Strategy (Redis)
To reduce database load and improve read latency:
- **Cache User Profiles**: Store user details/roles in Redis with an expiry matching the JWT.
- **Cache Task Lists**: Store the result of `GET /api/tasks` in Redis. Invalidate cache on Create/Update/Delete operations.
- **Rate Limiting**: Use Redis to count requests per user/IP and enforce limits (e.g., 100 req/min).

## 3. Database Scaling
- **Read Replicas**: Use a primary DB for writes and multiple read replicas for `GET` requests.
- **Sharding**: If task volume grows massively, shard the `tasks` table by `userId` to distribute data across nodes.

## 4. Containerization (Docker)
Dockerizing the application ensures consistency across environments.
- Create a `Dockerfile` for the Node.js app.
- Use `docker-compose` to spin up the App, Postgres, and Redis together locally.
- In production, deploy containers to a cluster (Kubernetes/AWS ECS) for auto-scaling based on CPU/Memory usage.

## 5. Load Balancing
Deploy multiple instances of the API behind a Load Balancer (Nginx/AWS ALB).
- The LB distributes incoming traffic across instances.
- Since we use stateless JWT auth, any instance can handle any request without sticky sessions.
