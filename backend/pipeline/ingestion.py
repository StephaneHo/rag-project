from loguru import logger
from sqlalchemy.orm import Session
from config import settings
from sqlalchemy.dialects.postgresql import insert
from collectors.arxiv_collector import ArxivCollector
from sentence_transformers import SentenceTransformer

from typing import Optional
from database.models import Paper


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

    def run(self, categories: Optional[list[str]] = None, days_back: int = 7) -> int:
        """Lance la collecte complète. Retourne le nombre d'articles traités."""
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

    def _embed(self, text: str) -> list[float]:
        """
        Génère un vecteur normalisé
        """
        return self.embedder.encode(
            text[:1024], normalize_embeddings=True, show_progress_bar=False
        ).tolist()

    def _insert_or_update_paper(self, raw: dict, embedding: list[float]) -> Paper:
        """
        raw[quelque chose] => accès strict (erreur si non présent),
        raw.get(quelque chose) => accès flexible, retourne None si la clé n'existe pas
        """
        statement = (
            insert(Paper)
            .values(
                arxiv_id=raw["arxiv_id"],
                title=raw["title"],
                abstract=raw.get("abstract"),
                pdf_url=raw.get("pdf_url"),
                html_url=raw.get("html_url"),
                doi=raw.get("doi"),
                published_at=raw.get("published_at"),
                updated_at=raw.get("updated_at"),
                embedding=embedding,
            )
            .on_conflict_do_update(
                index_elements=["arxiv_id"],
                set_={
                    "title": raw["title"],
                    "abstract": raw.get("abstract") or "",
                    "updated_at": raw.get("updated_at"),
                    "embedding": raw.get("embedding"),
                },
            )
        )
        self.session.execute(statement)
        return self.session.get(Paper, raw["arxiv_id"])

    def _process_paper(self, raw: dict) -> None:
        abstract = raw.get("abstract")
        """ On va mettre dans l'embedding à la fois le titre et l'abstract"""
        embedding = self._embed(raw["title"] + " " + abstract)

        paper = self._insert_or_update_paper(raw, embedding)
        # self._insert_or_update_authors(paper, raw.get("authors", []))
        # self._insert_or_update_categories(paper, raw.get("categories", []))
