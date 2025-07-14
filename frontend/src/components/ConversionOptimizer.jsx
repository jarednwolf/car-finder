import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`

const slideIn = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`

const UrgencyBanner = styled.div`
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: ${slideIn} 0.5s ease-out;
  
  .urgency-text {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
  }
  
  .timer {
    background: rgba(255, 255, 255, 0.2);
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-weight: 700;
    animation: ${pulse} 2s infinite;
  }
`

const CTACard = styled.div`
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%);
  border: 2px solid rgba(79, 172, 254, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  margin: 1rem 0;
  text-align: center;
  animation: ${slideIn} 0.5s ease-out;
`

const PrimaryCTA = styled.button`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(79, 172, 254, 0.4);
  }
  
  &:active {
    transform: translateY(-1px);
  }
`

const SecondaryCTA = styled.button`
  background: transparent;
  color: #4facfe;
  border: 2px solid rgba(79, 172, 254, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0.5rem;
  
  &:hover {
    background: rgba(79, 172, 254, 0.1);
    border-color: rgba(79, 172, 254, 0.5);
  }
`

const ScarcityIndicator = styled.div`
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: #ffc107;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
`

const PriceChangeAlert = styled.div`
  background: ${props => props.direction === 'up' ? 
    'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'};
  border: 1px solid ${props => props.direction === 'up' ? 
    'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'};
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: ${props => props.direction === 'up' ? '#4caf50' : '#f44336'};
  font-weight: 600;
  margin: 0.5rem 0;
`

const SocialProof = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  margin: 1rem 0;
  
  .proof-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem 0;
    color: #b0b0b0;
    font-size: 0.9rem;
  }
`

const ConversionTracker = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  color: white;
  font-size: 0.8rem;
  z-index: 1000;
  
  .progress-bar {
    width: 200px;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    margin: 0.5rem 0;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
    border-radius: 2px;
    transition: width 0.3s ease;
  }
`

function ConversionOptimizer({ 
  car, 
  onSavePreferences, 
  onScheduleTestDrive, 
  onGetFinancing,
  onContactDealer 
}) {
  const [timeLeft, setTimeLeft] = useState(3600) // 1 hour in seconds
  const [conversionProgress, setConversionProgress] = useState(0)
  const [showUrgency, setShowUrgency] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setShowUrgency(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Track conversion progress based on user actions
    const progress = Math.min(conversionProgress + 25, 100)
    setConversionProgress(progress)
  }, [car])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleCTAClick = (action) => {
    // Track conversion event
    console.log('Conversion event:', action)
    
    switch (action) {
      case 'save_preferences':
        onSavePreferences?.(car)
        break
      case 'schedule_test_drive':
        onScheduleTestDrive?.(car)
        break
      case 'get_financing':
        onGetFinancing?.(car)
        break
      case 'contact_dealer':
        onContactDealer?.(car)
        break
    }
  }

  return (
    <div>
      {/* Urgency Banner */}
      {showUrgency && (
        <UrgencyBanner>
          <div className="urgency-text">
            ⚡ Limited Time Offer
          </div>
          <div className="timer">
            {formatTime(timeLeft)}
          </div>
        </UrgencyBanner>
      )}

      {/* Scarcity Indicators */}
      {car?.inventory && car.inventory < 5 && (
        <ScarcityIndicator>
          ⚠️ Only {car.inventory} left in stock
        </ScarcityIndicator>
      )}

      {/* Price Change Alerts */}
      {car?.priceChange && (
        <PriceChangeAlert direction={car.priceChange > 0 ? 'up' : 'down'}>
          {car.priceChange > 0 ? '📈' : '📉'} Price {car.priceChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(car.priceChange)}
        </PriceChangeAlert>
      )}

      {/* Primary CTA */}
      <CTACard>
        <h3 style={{ color: 'white', marginBottom: '1rem' }}>
          Ready to find your perfect car?
        </h3>
        <p style={{ color: '#b0b0b0', marginBottom: '1.5rem' }}>
          Save your preferences and get notified when matching cars become available.
        </p>
        <PrimaryCTA onClick={() => handleCTAClick('save_preferences')}>
          💾 Save My Preferences
        </PrimaryCTA>
        <br />
        <SecondaryCTA onClick={() => handleCTAClick('schedule_test_drive')}>
          🚗 Schedule Test Drive
        </SecondaryCTA>
        <SecondaryCTA onClick={() => handleCTAClick('get_financing')}>
          💰 Get Financing
        </SecondaryCTA>
      </CTACard>

      {/* Social Proof */}
      <SocialProof>
        <h4 style={{ color: 'white', marginBottom: '1rem' }}>Recent Success Stories</h4>
        <div className="proof-item">
          ✅ "Found my dream car in 2 days!" - Sarah M.
        </div>
        <div className="proof-item">
          ✅ "Saved $3,000 with their financing" - Mike R.
        </div>
        <div className="proof-item">
          ✅ "Perfect match for my budget" - Lisa K.
        </div>
      </SocialProof>

      {/* Conversion Tracker */}
      <ConversionTracker>
        <div>Finding your perfect car...</div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${conversionProgress}%` }}
          />
        </div>
        <div>{conversionProgress}% complete</div>
      </ConversionTracker>
    </div>
  )
}

export default ConversionOptimizer