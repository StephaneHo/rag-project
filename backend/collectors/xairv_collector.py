import arxiv
from typing import Generator
from config import settings


class ArxivCollector:
    _DELAY_SECONDS = 3.0

    def __init__(self) -> None:
        # configuration d'un objet client
        self.client: arxiv.Client(
            page_size=100, delay_seconds=self._DELAY_SECONDS, num_retries=5
        )

    def collect(
        self,
        categories: list[str] | None = None,
        days_back: int = 7,
        max_results: int | None = None,
    ) -> Generator[dict, None, None]:
        cats = categories or settings.ARXIV_CATEGORIES
        # arrête dès que les articles sont plus vieux que tant de jours
        since = datetime.now(timezone.utc) - timedelta(days=days_back)
        limit = max_results or settings.ARXIV_MAX_RESULTS

        for cat in cats:
            logger.info(f"[ArXiv] collecte {cat} depuis {since.date()}")

            search = arxiv.Search(
                query=f"cat:{cat}",
                max_results=limit,
                sort_by=arxiv.SortCriterion.SubmittedDate,
                sort_order=arxiv.SortOrder.Descending,
            )
