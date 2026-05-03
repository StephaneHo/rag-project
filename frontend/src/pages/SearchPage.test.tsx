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
    describe('rendu initial', () => {
        it('affiche un champ de recherche et un bouton', () => {
            renderWithProviders(<SearchPage />, { route: '/search', path: '/search' })

            expect(screen.queryByPlaceholderText(/Votre question/)).toBeInTheDocument()
            expect(screen.queryByRole('button', { name: /rechercher/i })).toBeInTheDocument()
        })

    })



    describe('validation', () => {
        it('affiche une erreur si moins de 3 caractères', async () => {
            const user = userEvent.setup()
            renderWithProviders(<SearchPage />, { route: '/search', path: '/search' })

            const input = screen.getByPlaceholderText(/Votre question/i)
            const button = screen.getByRole('button', { name: /rechercher/i })


            await user.type(input, 'ab')
            await user.click(button)
            expect(await screen.findByText(/minimum 3 caractères/i)).toBeInTheDocument()
        })
    })

    describe('soumission', () => {
        it('appelle searchRag avec le bon payload quand le form est valide', async () => {
            const user = userEvent.setup()
            renderWithProviders(<SearchPage />, { route: '/search', path: '/search' })

            const QUERY = "What is the state of ML today ?"
            const input = screen.getByPlaceholderText(/Votre question/i)
            await user.type(input, QUERY)

            const button = screen.getByRole('button', { name: /rechercher/i })
            await user.click(button);
            await waitFor(() => expect(searchRagMock).toHaveBeenCalledWith({ query: QUERY }, expect.anything()))
        })

        it('affiche la réponse quand la recherche réussit', async () => {
            const user = userEvent.setup()
            renderWithProviders(<SearchPage />, { route: '/search', path: '/search' })

            const input = screen.getByPlaceholderText(/Votre question/i)
            const button = screen.getByRole('button', { name: /rechercher/i })

            await user.type(input, 'What are transformers?')
            await user.click(button)

            expect(await screen.findByText('test answer')).toBeInTheDocument()

        })


        it('désactive le bouton pendant le submit', async () => {
            const user = userEvent.setup()

            searchRagMock.mockImplementationOnce(() => new Promise(() => { }))

            renderWithProviders(<SearchPage />, { route: '/search', path: '/search' })

            const input = screen.getByPlaceholderText(/Votre question/i)
            const button = screen.getByRole('button', { name: /rechercher/i })

            await user.type(input, 'What is the state of ML today ?')
            await user.click(button)

            expect(button).toBeDisabled()
            expect(await screen.findByText(/Recherche en cours/i)).toBeInTheDocument()

        })


        it('affiche un message d\'erreur si la recherche échoue', async () => {
            const user = userEvent.setup()
            searchRagMock.mockRejectedValueOnce(new Error('Backend indisponible'))

            renderWithProviders(<SearchPage />, { route: '/search', path: '/search' })

            const input = screen.getByPlaceholderText(/Votre question/i)
            const button = screen.getByRole('button', { name: /rechercher/i })

            await user.type(input, 'What is the state of ML today ?')
            await user.click(button)

            expect(await screen.findByText(/Backend indisponible/i)).toBeInTheDocument()

        })
    })


})