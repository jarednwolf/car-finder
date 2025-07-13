import React from 'react'
import styled, { keyframes } from '@emotion/styled'

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`

const SkeletonBase = styled.div`
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0.05) 25%, 
    rgba(255, 255, 255, 0.1) 50%, 
    rgba(255, 255, 255, 0.05) 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
`

const SkeletonText = styled(SkeletonBase)`
  height: ${props => props.height || '1rem'};
  width: ${props => props.width || '100%'};
  margin: ${props => props.margin || '0.5rem 0'};
`

const SkeletonCircle = styled(SkeletonBase)`
  width: ${props => props.size || '40px'};
  height: ${props => props.size || '40px'};
  border-radius: 50%;
`

const SkeletonRectangle = styled(SkeletonBase)`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '120px'};
  border-radius: ${props => props.borderRadius || '8px'};
`

const SkeletonCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  margin: 1rem 0;
`

const SkeletonMessage = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin: 1rem 0;
`

const SkeletonChat = () => (
  <div>
    {[1, 2, 3].map(i => (
      <SkeletonMessage key={i}>
        <SkeletonCircle size="40px" />
        <div style={{ flex: 1 }}>
          <SkeletonText width="60%" height="1rem" />
          <SkeletonText width="80%" height="0.8rem" />
          <SkeletonText width="40%" height="0.8rem" />
        </div>
      </SkeletonMessage>
    ))}
  </div>
)

const SkeletonCarCard = () => (
  <SkeletonCard>
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
      <SkeletonRectangle width="80px" height="80px" />
      <div style={{ flex: 1 }}>
        <SkeletonText width="70%" height="1.2rem" />
        <SkeletonText width="40%" height="1rem" />
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
      <SkeletonText height="0.8rem" />
      <SkeletonText height="0.8rem" />
      <SkeletonText height="0.8rem" />
      <SkeletonText height="0.8rem" />
    </div>
  </SkeletonCard>
)

const SkeletonCarGrid = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
    {[1, 2, 3, 4].map(i => (
      <SkeletonCarCard key={i} />
    ))}
  </div>
)

const SkeletonAlert = () => (
  <SkeletonCard>
    <SkeletonRectangle height="200px" />
    <div style={{ padding: '1rem' }}>
      <SkeletonText width="80%" height="1.2rem" />
      <SkeletonText width="60%" height="0.9rem" />
      <SkeletonText width="40%" height="1.1rem" />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <SkeletonText width="30%" height="0.8rem" />
        <SkeletonText width="20%" height="0.8rem" />
      </div>
    </div>
  </SkeletonCard>
)

const SkeletonAlerts = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
    {[1, 2, 3, 4, 5, 6].map(i => (
      <SkeletonAlert key={i} />
    ))}
  </div>
)

const SkeletonRecommendations = () => (
  <div>
    <SkeletonText width="200px" height="1.5rem" margin="0 0 1rem 0" />
    <SkeletonCarGrid />
  </div>
)

const SkeletonLanding = () => (
  <div style={{ minHeight: '100vh', background: '#000' }}>
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <SkeletonText width="300px" height="3rem" margin="0 0 1rem 0" />
      <SkeletonText width="500px" height="1.2rem" margin="0 0 2rem 0" />
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <SkeletonText width="150px" height="3rem" />
        <SkeletonText width="150px" height="3rem" />
      </div>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {[1, 2, 3, 4].map(i => (
          <SkeletonText key={i} width="120px" height="2.5rem" />
        ))}
      </div>
    </div>
  </div>
)

const SkeletonNav = () => (
  <div style={{ 
    background: 'rgba(26, 26, 46, 0.95)', 
    padding: '1rem 2rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <SkeletonText width="150px" height="1.5rem" />
      <div style={{ display: 'flex', gap: '2rem' }}>
        <SkeletonText width="80px" height="1rem" />
        <SkeletonText width="80px" height="1rem" />
        <SkeletonText width="80px" height="1rem" />
      </div>
    </div>
  </div>
)

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #4facfe;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const LoadingDots = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;
  
  &::after {
    content: '';
    width: 4px;
    height: 4px;
    background: #4facfe;
    border-radius: 50%;
    animation: dots 1.5s infinite;
  }
  
  @keyframes dots {
    0%, 20% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
  }
`

const OptimisticUpdate = styled.div`
  opacity: ${props => props.confirmed ? '1' : '0.6'};
  transition: opacity 0.3s ease;
`

export {
  SkeletonText,
  SkeletonCircle,
  SkeletonRectangle,
  SkeletonCard,
  SkeletonChat,
  SkeletonCarCard,
  SkeletonCarGrid,
  SkeletonAlert,
  SkeletonAlerts,
  SkeletonRecommendations,
  SkeletonLanding,
  SkeletonNav,
  LoadingSpinner,
  LoadingDots,
  OptimisticUpdate
}