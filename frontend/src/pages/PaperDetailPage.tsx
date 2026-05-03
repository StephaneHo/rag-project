import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router"
import { fetchPaper } from "../api/papers"
import { PaperCard } from "../components/PaperCard"




export default function PaperDetailPage(){
    const {arxiv_id} = useParams<{arxiv_id: string}>();

    const {data, isPending, isError, error} = useQuery({
        queryKey: ['paper', arxiv_id],   
        enabled: !!arxiv_id,
        queryFn: () => fetchPaper(arxiv_id!),
     
    }) 
    if (isPending){
        return (<p>Chargement ...</p>)
    }
    if (isError){
        return <p>Erreur: {error.message}</p>
    }
    return (
        <PaperCard paper={data}/>
    )
}