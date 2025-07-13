import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import Onboarding from '../components/Onboarding'
import ConversionOptimizer from '../components/ConversionOptimizer'

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`

const Container = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: #000;
`

const HeroSection = styled.section`
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/luxury-car-hero.jpg') center/cover no-repeat;
    filter: brightness(0.4);
    z-index: 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0.3) 0%,
      rgba(0,0,0,0.7) 100%
    );
    z-index: 1;
  }
`

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  max-width: 1200px;
  padding: 0 2rem;
  animation: ${fadeIn} 1.5s ease-out;
`

const Headline = styled.h1`
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 200;
  letter-spacing: -0.02em;
  margin: 0 0 1rem;
  line-height: 1.1;
  
  span {
    font-weight: 700;
    display: block;
  }
`

const Subheadline = styled.p`
  font-size: clamp(1.1rem, 2vw, 1.5rem);
  font-weight: 300;
  opacity: 0.9;
  margin: 0 0 3rem;
  letter-spacing: 0.02em;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`

const CTAContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  animation: ${slideUp} 1s ease-out 0.5s both;
`

const PrimaryButton = styled.button`
  background: white;
  color: black;
  border: none;
  padding: 1rem 3rem;
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(255,255,255,0.2);
  }
`

const SecondaryButton = styled.button`
  background: transparent;
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  padding: 1rem 3rem;
  font-size: 1.1rem;
  font-weight: 400;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.5);
  }
`

const QuickFilters = styled.div`
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  gap: 2rem;
  animation: ${slideUp} 1s ease-out 0.8s both;
  
  @media (max-width: 768px) {
    bottom: 2rem;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    padding: 0 1rem;
  }
`

const FilterChip = styled.button`
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(20px);
  color: white;
  border: 1px solid rgba(255,255,255,0.2);
  padding: 0.8rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    background: rgba(255,255,255,0.2);
    transform: translateY(-2px);
  }
`

const FeaturesSection = styled.section`
  background: #0a0a0a;
  padding: 5rem 2rem;
  position: relative;
  z-index: 2;
`

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
`

const Feature = styled.div`
  text-align: center;
  color: white;
`

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  margin: 0 auto 1.5rem;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: rgba(255,255,255,0.05);
`

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 400;
  margin: 0 0 0.5rem;
  letter-spacing: 0.02em;
`

const FeatureDescription = styled.p`
  font-size: 0.95rem;
  font-weight: 300;
  opacity: 0.7;
  line-height: 1.6;
`

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  color: white;
  opacity: 0.5;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  animation: ${slideUp} 1s ease-out 1s both;
  
  &::after {
    content: '↓';
    display: block;
    margin-top: 0.5rem;
    animation: ${slideUp} 2s ease-in-out infinite;
  }
`

function Landing() {
  const navigate = useNavigate()
  const [showOnboarding, setShowOnboarding] = useState(false)

  const handleStart = () => {
    navigate('/chat')
  }

  const handleQuickFilter = (filter) => {
    navigate('/chat', { state: { initialMessage: filter } })
  }
  
  const handleSavePreferences = (car) => {
    console.log('Saving preferences for:', car)
    // Add preference saving logic
  }
  
  const handleScheduleTestDrive = (car) => {
    console.log('Scheduling test drive for:', car)
    // Add test drive scheduling logic
  }
  
  const handleGetFinancing = (car) => {
    console.log('Getting financing for:', car)
    // Add financing logic
  }

  return (
    <>
      {/* Onboarding Overlay */}
      <Onboarding 
        isVisible={showOnboarding}
        onComplete={() => setShowOnboarding(false)}
        onSkip={() => setShowOnboarding(false)}
        currentStep={0}
        userAchievements={[]}
      />
      
      <Container>
        <HeroSection>
        <HeroContent>
          <Headline>
            The Art of
            <span>Automotive Excellence</span>
          </Headline>
          <Subheadline>
            Discover your perfect vehicle through intelligent curation. 
            Our AI consultant understands luxury, performance, and exclusivity.
          </Subheadline>
          <CTAContainer>
            <PrimaryButton onClick={handleStart}>
              Begin Consultation
            </PrimaryButton>
            <SecondaryButton onClick={() => navigate('/alerts')}>
              Inventory Alerts
            </SecondaryButton>
          </CTAContainer>
        </HeroContent>
        
        <QuickFilters>
          <FilterChip onClick={() => handleQuickFilter("Show me exotic sports cars under 500k")}>
            Exotic Sports
          </FilterChip>
          <FilterChip onClick={() => handleQuickFilter("I need a luxury SUV with 7 seats")}>
            Luxury SUV
          </FilterChip>
          <FilterChip onClick={() => handleQuickFilter("Find me a classic collector car")}>
            Classic Collectors
          </FilterChip>
          <FilterChip onClick={() => handleQuickFilter("Show me electric supercars")}>
            Electric Performance
          </FilterChip>
        </QuickFilters>
        
        <ScrollIndicator>Scroll</ScrollIndicator>
      </HeroSection>
      
      <FeaturesSection>
        <FeaturesContainer>
          <Feature>
            <FeatureIcon>🎯</FeatureIcon>
            <FeatureTitle>Curated Selection</FeatureTitle>
            <FeatureDescription>
              Access to exclusive inventory from premium dealers and private collections worldwide.
            </FeatureDescription>
          </Feature>
          
          <Feature>
            <FeatureIcon>🤖</FeatureIcon>
            <FeatureTitle>Intelligent Matching</FeatureTitle>
            <FeatureDescription>
              Our AI understands nuance - from specific trim levels to rare color combinations.
            </FeatureDescription>
          </Feature>
          
          <Feature>
            <FeatureIcon>🔒</FeatureIcon>
            <FeatureTitle>Private & Secure</FeatureTitle>
            <FeatureDescription>
              Discrete consultations with verified listings and secure transaction support.
            </FeatureDescription>
          </Feature>
        </FeaturesContainer>
      </FeaturesSection>
    </Container>
    </>
  )
}

export default Landing 