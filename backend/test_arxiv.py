from collectors.arxiv_collector import ArxivCollector

collector = ArxivCollector()

print("Test 1, collecte cs.AI sur 2 jours")
papers = list(collector.collect(categories=["cs.AI"], days_back=2))
print(f"articles collectés: {len(papers)}")
