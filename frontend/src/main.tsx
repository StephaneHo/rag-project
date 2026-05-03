import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from './components/ErrorFallback.tsx'

const queryClient = new QueryClient()
import { lazy, Suspense } from 'react'

const PapersListPage = lazy(() => import('./pages/PapersListPage'))
const PaperDetailPage = lazy(() => import('./pages/PaperDetailPage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
