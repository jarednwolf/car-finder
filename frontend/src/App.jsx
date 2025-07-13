import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import styled from '@emotion/styled'
import Landing from './pages/Landing'
import Chat from './pages/Chat'
import Alerts from './pages/Alerts'

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.isLanding ? 'transparent' : 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)'};
`

const Nav = styled.nav`
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  box-shadow: 0 2px 20px rgba(0,0,0,0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 2rem;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`

const NavItem = styled.li`
  color: white;
  
  a {
    color: white;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    
    &.active {
      background: rgba(79, 172, 254, 0.2);
      color: #4facfe;
    }
  }
`

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  margin-right: auto;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  span {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`

const ContentWrapper = styled.div`
  ${props => props.showNav ? 'padding-top: 70px;' : ''}
`

function Navigation() {
  const location = useLocation()
  
  return (
    <Nav>
      <NavList>
        <NavItem>
          <Link to="/">
            <Logo>
              🚗 <span>Car Finder</span>
            </Logo>
          </Link>
        </NavItem>
        <NavItem>
          <Link 
            to="/chat" 
            className={location.pathname === '/chat' ? 'active' : ''}
          >
            AI Assistant
          </Link>
        </NavItem>
        <NavItem>
          <Link 
            to="/alerts" 
            className={location.pathname === '/alerts' ? 'active' : ''}
          >
            My Alerts
          </Link>
        </NavItem>
      </NavList>
    </Nav>
  )
}

function AppContent() {
  const location = useLocation()
  const isLanding = location.pathname === '/'
  const showNav = !isLanding
  
  return (
    <AppContainer isLanding={isLanding}>
      {showNav && <Navigation />}
      <ContentWrapper showNav={showNav}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/alerts" element={<Alerts />} />
        </Routes>
      </ContentWrapper>
    </AppContainer>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App 