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