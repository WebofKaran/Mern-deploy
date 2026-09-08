# MERN Deploy Lab

An interactive MERN Stack project demonstrating MongoDB Atlas, Express, React, Node.js, Docker, and Jenkins.

## Project structure

- `client/` — React frontend
- `server/` — Express API connected to MongoDB Atlas
- `docker-compose.yml` — Container orchestration
- `Jenkinsfile` — CI/CD pipeline
- `.env.example` — Environment variable template

## MongoDB Atlas setup

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Add your deployment machine IP address to the Atlas Network Access list.
4. Copy the Atlas connection string.
5. Create a `.env` file in the project root:

```bash
cp .env.example .env
```

6. Replace the `MONGO_URI` value with your real Atlas connection string.

Example:

```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/mern_deploy_lab?retryWrites=true&w=majority
PORT=5000
```

Never commit your real `.env` file or MongoDB password to GitHub.

## Run with Docker

```bash
docker compose up --build
```

Frontend: `http://localhost:5173`

API health check: `http://localhost:5000/api/health`

## Jenkins deployment

The included `Jenkinsfile` performs:

1. Source checkout
2. Docker build
3. Server syntax check
4. Docker Compose deployment

Before running Jenkins, make sure the Jenkins environment can access the `MONGO_URI` value securely. For production, use Jenkins credentials rather than storing the real connection string in the repository.
