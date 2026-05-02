import { PaperCard } from "./PaperCard"
import { render, screen } from '@testing-library/react'
import type { Paper } from '../types/paper'

describe('PaperCard',() => {
    it('affiche le titre du paper', () => {
        const fakePaper: Paper = {
            arxiv_id : 'test-123',
            title: 'ML par la pratique',
            abstract: 'Comment pratiquer le ML efficacement',
            citation_count: 123
        }

        render(<PaperCard paper={fakePaper}/>)

        expect(screen.getByText('ML par la pratique'))
        expect(screen.getByText('Comment pratiquer le ML efficacement'))
    
    })
})