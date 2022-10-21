import { HeaderContainer } from './style'
import logoIgnite from '../../assets/logo.svg'
import { Timer, Scroll } from 'phosphor-react'
import { NavLink } from 'react-router-dom'

export function Header() {
  return (
    <HeaderContainer>
      <img src={logoIgnite} alt="" />
      <nav>
        {/* navLink leva o outras paginas com router dom */}
        <NavLink to="/" title="timer" end>
          <Timer size={24} />
        </NavLink>
        <NavLink to="/history" title="histórico" end>
          <Scroll size={24} />
        </NavLink>
      </nav>
    </HeaderContainer>
  )
}
