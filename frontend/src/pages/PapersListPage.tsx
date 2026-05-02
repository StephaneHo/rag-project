import { useQuery } from "@tanstack/react-query";
import { fetchPapers } from "../api/papers";
import { PaperCard } from "../components/PaperCard";
import type { Paper } from "../types/paper";

export default function PapersListPage(){

    const {data, isPending, isError, error} = useQuery({
        queryKey: ['papers'],
        queryFn: fetchPapers
    })

    if (isPending) return <p>Chargement...</p>
    if (isError) return <p>Erreur: {error?.message}</p>

    return (
        <>
        <h1 className="text-2xl font-bold p-4">Papers</h1>
        <div className="max-w-3xl mx-auto p-4 space-y-4">{data.map((paper: Paper) => 
            
                <PaperCard key={paper.arxiv_id} paper={paper}/> 
            
        )}
        </div>
        </>)
}