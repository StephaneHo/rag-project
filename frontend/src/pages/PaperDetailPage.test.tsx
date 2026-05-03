import { screen } from '@testing-library/react'
import { vi } from 'vitest'
import { mockPapers } from "../mocks/mockData"
import { renderWithProviders } from '../test/renderWithProviders'
import PaperDetailPage from './PaperDetailPage';

vi.mock('../api/papers', () => ({
    fetchPaper: vi.fn().mockResolvedValue(mockPapers[0])
}))

describe('PaperDetailsPage', () =>{
    it ('affiche le titre du papier récupéré', async () => {
        renderWithProviders(<PaperDetailPage/>, {
            route: '/papers/1234',
            path: '/papers/:arxiv_id'
        })  
        expect(await screen.findByText('ML on Graphs')).toBeInTheDocument()
    })
})