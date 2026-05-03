
import NavBar from './components/NavBar'

import { Route, Routes } from 'react-router'

import { lazy, Suspense } from 'react'



const PapersListPage = lazy(() => import('./pages/PapersListPage'))
const PaperDetailPage = lazy(() => import('./pages/PaperDetailPage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))

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
