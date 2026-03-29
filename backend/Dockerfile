# On part d'un version minimale de Python
FROM python:3.11-slim

# Installation des outils système
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl wget git bash \
    && curl -sSL https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh \
       -o /usr/local/bin/wait-for-it \
    && chmod +x /usr/local/bin/wait-for-it \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Installer uv
RUN curl -LsSf https://astral.sh/uv/install.sh | sh

# Ajouter uv au Path
ENV PATH="/root/.local/bin:$PATH"

# Dossier de travail
WORKDIR /app

# On copie les fichiers de dépendances d'abord
COPY pyproject.toml uv.lock* ./

# On installe les dépendances via uv
RUN uv sync --frozen || uv pip install

# On copie le reste du code
COPY . .

# wait-for-it pour PostgreSQL
RUN curl -sSL https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh \
    -o /usr/local/bin/wait-for-it \
    && chmod +x /usr/local/bin/wait-for-it

#  entrypoint
RUN chmod +x entrypoint.sh

EXPOSE 8000

ENTRYPOINT [ "./entrypoint.sh" ]

