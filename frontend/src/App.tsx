

import { Route, Routes } from 'react-router'

import { lazy, Suspense } from 'react'
import NavBar from './shared/ui/NavBar'



const PapersListPage = lazy(() => import('./features/papers/ui/PapersListPage'))
const PaperDetailPage = lazy(() => import('./features/papers/ui/PaperDetailPage'))
const SearchPage = lazy(() => import('./features/rag/ui/SearchPage'))

function App() {
  return (
    <>
      <NavBar />
      <Suspense fallback={<p className="p-4">Chargement...</p>}>
        <Routes>
          <Route path="/" element={<PapersListPage />} />
          <Route path="/papers/:arxiv_id" element={<PaperDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </Suspense>
    </>
  )
}


export default App
