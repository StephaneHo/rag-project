
import PaperDetailPage from './pages/PaperDetailPage'
import PapersListPage from './pages/PapersListPage'
import SearchPage from './pages/SearchPage'

import { Route, Routes } from 'react-router'
function App() {

  return (
    <Routes>
     <Route path="/" element={<PapersListPage/>} />
     <Route path="/papers/:arxiv_id" element={<PaperDetailPage/>} />
     <Route path="/search" element={<SearchPage/>} />
    </Routes>
  )
}


export default App
