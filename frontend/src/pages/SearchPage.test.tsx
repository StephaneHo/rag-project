import { screen } from '@testing-library/react'
import { renderWithProviders } from '../test/renderWithProviders'
import SearchPage from './SearchPage'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { waitFor } from '@testing-library/react'
import { searchRag } from '../api/rag'

vi.mock('../api/rag', () => ({
  searchRag: vi.fn().mockResolvedValue({
    answer: 'test answer',
    references: [],
    tokens_used: 0,
  }),
}))

const searchRagMock = vi.mocked(searchRag)

beforeEach(() => {
  searchRagMock.mockClear()
})

describe('SearchPage', () => {
  it('affiche un champ de recherche et un bouton', () => {
    renderWithProviders(<SearchPage />, { route: '/search', path: '/search' })

    expect(screen.queryByPlaceholderText(/Votre question/)).toBeInTheDocument()
    expect(screen.queryByRole('button', {name: /rechercher/i})).toBeInTheDocument()
  })

  it('affiche une erreur si moins de 3 caractères', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SearchPage />, { route: '/search', path: '/search' })

    const input = screen.getByPlaceholderText(/Votre question/i)
    const button = screen.getByRole('button', { name: /rechercher/i })


    await user.type(input, 'ab')
    await user.click(button)
    expect(await screen.findByText(/minimum 3 caractères/i)).toBeInTheDocument()
    })

    it('appelle searchRag avec le bon payload quand le form est valide', async () => {
        const user = userEvent.setup()
        renderWithProviders(<SearchPage />, { route: '/search', path: '/search' })

        const QUERY = "What is the state of ML today ?"
        const input = screen.getByPlaceholderText(/Votre question/i)
        await user.type(input, QUERY)
        
        const button = screen.getByRole('button', { name: /rechercher/i })
        await user.click(button);
        await waitFor(() => expect(searchRagMock).toHaveBeenCalledWith({ query: QUERY},  expect.anything()   ))
    })

})