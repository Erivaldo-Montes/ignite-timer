import { Route, Routes } from 'react-router-dom'
import { DefaultLayout } from './layouts/defaultLayout'
import { History } from './pages/history'
import { Home } from './pages/home/index'

export function Router() {
  return (
    <Routes>
      {/* aplica o layout para as rotas emglobadas */}
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
      </Route>
    </Routes>
  )
}
