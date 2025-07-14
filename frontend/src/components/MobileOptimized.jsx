import React, { useState, useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const MobileContainer = styled.div`
  @media (max-width: 768px) {
    padding: 0;
    margin: 0;
  }
`

const TouchOptimizedButton = styled.button`
  min-height: 44px;
  min-width: 44px;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  
  &:active {
    transform: scale(0.95);
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(79, 172, 254, 0.3);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    margin: 0.5rem 0;
  }
`

const SwipeableCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  margin: 1rem 0;
  cursor: grab;
  user-select: none;
  transition: all 0.3s ease;
  transform: translateX(${props => props.offset}px);
  
  &:active {
    cursor: grabbing;
  }
  
  &.swiping {
    transition: none;
  }
`

const PullToRefreshContainer = styled.div`
  position: relative;
  overflow: hidden;
`

const RefreshIndicator = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(79, 172, 254, 0.1);
  color: #4facfe;
  font-weight: 600;
  transform: translateY(${props => props.visible ? '0' : '-100%'});
  transition: transform 0.3s ease;
`

const BottomSheet = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px 20px 0 0;
  padding: 1.5rem;
  transform: translateY(${props => props.isOpen ? '0' : '100%'});
  transition: transform 0.3s ease;
  z-index: 1000;
  max-height: 80vh;
  overflow-y: auto;
  
  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }
`

const FloatingActionButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(79, 172, 254, 0.3);
  transition: all 0.3s ease;
  z-index: 100;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 35px rgba(79, 172, 254, 0.4);
  }
  
  &:active {
    transform: scale(0.95);
  }
`

const MobileNav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.5rem;
  z-index: 1000;
  
  @media (min-width: 769px) {
    display: none;
  }
`

const NavItems = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  color: ${props => props.active ? '#4facfe' : '#b0b0b0'};
  font-size: 0.8rem;
  cursor: pointer;
  transition: color 0.3s ease;
  
  .icon {
    font-size: 1.5rem;
    margin-bottom: 0.25rem;
  }
  
  &:hover {
    color: ${props => props.active ? '#4facfe' : 'white'};
  }
`

const GestureArea = styled.div`
  position: relative;
  overflow: hidden;
  touch-action: pan-y;
`

const Carousel = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  -ms-overflow-style: none;
  scrollbar-width: none;
`

const CarouselItem = styled.div`
  flex: 0 0 280px;
  scroll-snap-align: start;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-4px);
  }
`

const VibrationFeedback = {
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
  },
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(100)
    }
  },
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(200)
    }
  }
}

function MobileOptimized({ children, onRefresh, onSwipe, onPullToRefresh }) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('chat')
  
  const pullThreshold = 80
  const touchStart = useRef({ x: 0, y: 0 })
  const isPulling = useRef(false)

  const handleTouchStart = (e) => {
    const touch = e.touches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY }
    isPulling.current = false
  }

  const handleTouchMove = (e) => {
    const touch = e.touches[0]
    const deltaY = touch.clientY - touchStart.current.y
    
    if (deltaY > 0 && window.scrollY === 0) {
      isPulling.current = true
      setPullDistance(Math.min(deltaY * 0.5, pullThreshold))
      e.preventDefault()
    }
  }

  const handleTouchEnd = () => {
    if (isPulling.current && pullDistance >= pullThreshold) {
      handleRefresh()
    }
    setPullDistance(0)
    isPulling.current = false
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    VibrationFeedback.medium()
    
    try {
      await onPullToRefresh()
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleSwipe = (direction, element) => {
    VibrationFeedback.light()
    onSwipe?.(direction, element)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    VibrationFeedback.light()
  }

  return (
    <MobileContainer>
      <PullToRefreshContainer
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <RefreshIndicator visible={pullDistance > 0}>
          {pullDistance >= pullThreshold ? 'Release to refresh' : 'Pull to refresh'}
        </RefreshIndicator>
        
        {children}
      </PullToRefreshContainer>

      {/* Mobile Navigation */}
      <MobileNav>
        <NavItems>
          <NavItem 
            active={activeTab === 'home'} 
            onClick={() => handleTabChange('home')}
          >
            <div className="icon">🏠</div>
            <div>Home</div>
          </NavItem>
          <NavItem 
            active={activeTab === 'chat'} 
            onClick={() => handleTabChange('chat')}
          >
            <div className="icon">💬</div>
            <div>Chat</div>
          </NavItem>
          <NavItem 
            active={activeTab === 'alerts'} 
            onClick={() => handleTabChange('alerts')}
          >
            <div className="icon">🔔</div>
            <div>Alerts</div>
          </NavItem>
          <NavItem 
            active={activeTab === 'profile'} 
            onClick={() => handleTabChange('profile')}
          >
            <div className="icon">👤</div>
            <div>Profile</div>
          </NavItem>
        </NavItems>
      </MobileNav>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => setBottomSheetOpen(true)}>
        +
      </FloatingActionButton>

      {/* Bottom Sheet */}
      <BottomSheet isOpen={bottomSheetOpen}>
        <h3 style={{ color: 'white', marginBottom: '1rem' }}>Quick Actions</h3>
        <TouchOptimizedButton onClick={() => {
          setBottomSheetOpen(false)
          // Add quick action logic
        }}>
          🚗 Schedule Test Drive
        </TouchOptimizedButton>
        <TouchOptimizedButton onClick={() => {
          setBottomSheetOpen(false)
          // Add quick action logic
        }}>
          💰 Get Financing
        </TouchOptimizedButton>
        <TouchOptimizedButton onClick={() => {
          setBottomSheetOpen(false)
          // Add quick action logic
        }}>
          📞 Contact Dealer
        </TouchOptimizedButton>
      </BottomSheet>
    </MobileContainer>
  )
}

export default MobileOptimized