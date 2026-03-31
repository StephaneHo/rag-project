from loguru import logger
from sqlalchemy.orm import Session
from sqlalchemy import settings
from collectors.arxiv_collector import ArxivCollector
from sentence_transformers import SentenceTransformer

from config import settings
from typing import Optional


class PaperIngestionPipeline:
    """
    On injecte une session DB (SQLAlchemy) dans le pipeline
    """

    def __init__(self, session: Session) -> None:
        self.session = session  # on stocke la session pour pouvoir l'utiliser partout
        self.arxiv = ArxivCollector()  # on crée le collector arXiv une seule fois
        logger.info(f"Pipeline: chargement du modèle: {settings.EMBEDDING_MODEL}")
        self.embedder = SentenceTransformer(settings.EMBEDDING_MODEL)
        logger.info("[Pipeline] Modèle chargé")

    """Lance la collecte complète. Retourne le nombre d'articles traités."""

    def run(self, categories: Optional[list[str]] = None, days_back: int = 7) -> int:
        logger.info(
            f"[Démarrage de la pipeline] - categories={categories} jours={days_back}"
        )
        total = 0

        for raw in self.arxiv.collect(categories=categories, days_back=days_back):
            try:
                self._process_paper(raw)
                total += 1
                # commit tous les 20 articles pour ne pas perdre trop de travail
                if total % 20 == 0:
                    self.session.commit()
                    logger.info(f"[Pipeline] {total} articles traités")
            except Exception as ex:
                logger.warning(f"[Pipeline] Erreur sur {raw.get('arxiv_id')} : {ex}")
                self.session.rollback()

        self.session.commit()
        logger.info(f"[Pipeline] terminé - {total} articles ingérés")
        return total

    def _process_paper(self, raw: dict) -> None:
        pass
