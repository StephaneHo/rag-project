import { mockPapers } from "../api/mocks/mockData";
import { PaperCard } from "../components/PaperCard";
import type { Paper } from "../types/paper";

export default function PapersListPage(){
    return (
        <>
        <h1 className="text-2xl font-bold p-4">Papers</h1>
        <div className="max-w-3xl mx-auto p-4 space-y-4">{mockPapers.map((paper: Paper) => 
            
                <PaperCard key={paper.arxiv_id} paper={paper}/> 
            
        )}
        </div>
        </>)
}