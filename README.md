# docker compose up
V"rifier que :database system is ready to accept connections



#  Initalisation de la BDD Postgres
init-db/01-init.sql est monté dans /docker-entrypoint-initdb.d/


# Ordre des opérations
Docker démarre container backend
        
entrypoint.sh
        
wait-for-it (DB ready)
        
alembic upgrade head
        
CREATE TABLE + INDEX + EXTENSIONS
        
uvicorn FastAPI


# Validation de l'architecture

## Docker Compose PostgreSQL + pgvector
docker compose up db -d
docker compose ps   # db doit être "healthy"

Test 1 — Connexion PostgreSQL
docker compose exec db psql -U postgres -d rag -c "\conninfo"

Test 2 — Extension pgvector active
docker compose exec db psql -U postgres -d rag -c "SELECT extname FROM pg_extension WHERE extname='vector';"

## Migraations Alembic - création des tables