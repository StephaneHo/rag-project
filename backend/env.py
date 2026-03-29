# Permet à Alambic de connaitre toutes les tables SQLAlchemy
# c'est le runtime Alambic
from alambic import context
from config import settings

config = context.config
# Injection de URL de BN
# Surcharge l'URL avec celle .env /  Docker
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)
