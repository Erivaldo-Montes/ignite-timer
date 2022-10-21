import { Header } from '../../components/Header'
import { Outlet } from 'react-router-dom'
import { LayoutContainer } from './style'

export function DefaultLayout() {
  return (
    <LayoutContainer>
      <Header />
      {/* espaço reservado para cada rota */}
      <Outlet />
    </LayoutContainer>
  )
}
