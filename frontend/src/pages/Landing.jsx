import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { keyframes } from '@emotion/styled'

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`

const LandingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
  color: white;
  overflow-x: hidden;
`

const Hero = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 2rem;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grid)"/></svg>');
    pointer-events: none;
  }
`

const HeroContent = styled.div`
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  z-index: 1;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`

const HeroText = styled.div`
  animation: ${fadeIn} 1s ease-out;
`

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #fff 0%, #4facfe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: #b0b0b0;
  margin-bottom: 3rem;
  line-height: 1.6;
`

const CTASection = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border: none;
  padding: 1.25rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(79, 172, 254, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(79, 172, 254, 0.4);
  }
`

const SecondaryButton = styled.button`
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.2);
  padding: 1.25rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.05);
  }
`

const QuickStartSection = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`

const QuickOption = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
`

const HeroVisual = styled.div`
  position: relative;
  animation: ${float} 6s ease-in-out infinite;
  
  @media (max-width: 768px) {
    display: none;
  }
`

const CarGraphic = styled.div`
  width: 500px;
  height: 300px;
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transform: rotate(45deg);
    animation: shine 3s infinite;
  }
  
  @keyframes shine {
    0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
    100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
  }
`

const Features = styled.section`
  padding: 5rem 2rem;
  background: rgba(255, 255, 255, 0.02);
`

const FeaturesGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 16px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-5px);
  }
`

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`

const FeatureDesc = styled.p`
  color: #b0b0b0;
  line-height: 1.6;
`

const TrustBadges = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 3rem;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`

const Badge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #b0b0b0;
  font-size: 0.9rem;
  
  span {
    color: #4facfe;
  }
`

function Landing() {
  const navigate = useNavigate()
  const [hoveredQuick, setHoveredQuick] = useState(null)

  const quickOptions = [
    { id: 1, label: "First-time buyer", query: "I'm a first-time car buyer" },
    { id: 2, label: "Family SUV", query: "I need a family-friendly SUV" },
    { id: 3, label: "Fuel efficient", query: "I want the best fuel economy" },
    { id: 4, label: "Under $30k", query: "Show me reliable cars under $30,000" },
    { id: 5, label: "Electric", query: "I'm interested in electric vehicles" },
  ]

  const handleQuickStart = (query) => {
    // Navigate to chat with pre-filled query
    navigate('/chat', { state: { initialMessage: query } })
  }

  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Recommendations",
      desc: "Our smart assistant understands your needs and suggests perfect matches based on your lifestyle"
    },
    {
      icon: "🔍",
      title: "Real-Time Inventory",
      desc: "Access to thousands of listings updated daily from trusted dealerships nationwide"
    },
    {
      icon: "🎯",
      title: "Option-Level Matching",
      desc: "We match specific features you want, from heated seats to advanced safety systems"
    },
    {
      icon: "🔔",
      title: "Smart Alerts",
      desc: "Get notified instantly when cars matching your exact preferences become available"
    },
    {
      icon: "💰",
      title: "Price Intelligence",
      desc: "Know if you're getting a fair deal with market analysis and pricing insights"
    },
    {
      icon: "🛡️",
      title: "Trusted & Secure",
      desc: "Your data is protected and we never share your information with dealers without permission"
    }
  ]

  return (
    <LandingContainer>
      <Hero>
        <HeroContent>
          <HeroText>
            <Title>Find Your Perfect Car in Minutes</Title>
            <Subtitle>
              Skip the endless searching. Tell our AI assistant what you need, 
              and we'll match you with the ideal vehicle from thousands of options.
            </Subtitle>
            
            <CTASection>
              <PrimaryButton onClick={() => navigate('/chat')}>
                Start Free Consultation
              </PrimaryButton>
              <SecondaryButton onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
                How It Works
              </SecondaryButton>
            </CTASection>
            
            <div style={{ marginBottom: '1rem', color: '#b0b0b0' }}>
              Quick start:
            </div>
            <QuickStartSection>
              {quickOptions.map(option => (
                <QuickOption
                  key={option.id}
                  onClick={() => handleQuickStart(option.query)}
                  onMouseEnter={() => setHoveredQuick(option.id)}
                  onMouseLeave={() => setHoveredQuick(null)}
                  style={{
                    transform: hoveredQuick === option.id ? 'translateY(-2px)' : 'none',
                  }}
                >
                  {option.label}
                </QuickOption>
              ))}
            </QuickStartSection>
            
            <TrustBadges>
              <Badge>
                <span>✓</span> No dealer spam
              </Badge>
              <Badge>
                <span>✓</span> 100% free
              </Badge>
              <Badge>
                <span>✓</span> Unbiased advice
              </Badge>
              <Badge>
                <span>🔒</span> Your data is secure
              </Badge>
            </TrustBadges>
          </HeroText>
          
          <HeroVisual>
            <CarGraphic>
              🚗
            </CarGraphic>
          </HeroVisual>
        </HeroContent>
      </Hero>
      
      <Features id="features">
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index} style={{ animationDelay: `${index * 0.1}s` }}>
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDesc>{feature.desc}</FeatureDesc>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </Features>
    </LandingContainer>
  )
}

export default Landing 