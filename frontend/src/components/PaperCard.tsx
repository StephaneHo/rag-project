import type { Paper } from "../types/paper";

type PaperCardProps = {
    paper: Paper
}

 export const PaperCard = ({paper}: PaperCardProps) => (
             <article>
                <h2>titre:{paper.title}</h2>
                <time>date: {paper.published_at}</time>
                <p>abstract : {paper.abstract}</p>
                {paper.venue && <p>conférence: {paper.venue}</p>}
                {paper.citation_count != null && <p>nombre de citations: {paper.citation_count}</p>}
            </article>    
        )