import React, { useState } from 'react'
import styled from '@emotion/styled'
import Onboarding from '../components/Onboarding'
import SmartRecommendations from '../components/SmartRecommendations'
import RichChatMessage from '../components/RichChatMessage'
import ConversionOptimizer from '../components/ConversionOptimizer'
import MobileOptimized from '../components/MobileOptimized'
import { SkeletonChat, SkeletonCarGrid } from '../components/SkeletonLoader'

const DemoContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
  padding: 2rem;
  color: white;
`

const Section = styled.div`
  margin: 2rem 0;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
`

const SectionTitle = styled.h2`
  color: white;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const DemoButton = styled.button`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(79, 172, 254, 0.3);
  }
`

function Demo() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [showRichChat, setShowRichChat] = useState(false)
  const [showConversion, setShowConversion] = useState(false)
  const [showMobile, setShowMobile] = useState(false)
  const [showSkeletons, setShowSkeletons] = useState(false)

  const mockUserPreferences = {
    budget: 50000,
    bodyStyle: 'SUV',
    features: ['AWD', 'Leather', 'Sunroof']
  }

  const mockBrowsingHistory = [
    { action: 'search', content: 'luxury SUV', timestamp: Date.now() - 3600000 },
    { action: 'view', content: 'BMW X5', timestamp: Date.now() - 1800000 },
    { action: 'message', content: 'I need a family car', timestamp: Date.now() - 900000 }
  ]

  const mockRichMessage = {
    content: "Here are some great options that match your preferences:",
    cars: [
      {
        id: 1,
        name: "2024 BMW X5",
        price: "$65,000",
        image: "🚗",
        mileage: "15,000 mi",
        year: "2024",
        engine: "3.0L I6",
        transmission: "8-speed Auto"
      },
      {
        id: 2,
        name: "2023 Mercedes GLE",
        price: "$58,000",
        image: "🏎️",
        mileage: "22,000 mi",
        year: "2023",
        engine: "2.5L I4",
        transmission: "9-speed Auto"
      }
    ]
  }

  const mockCar = {
    name: "2024 BMW X5",
    price: "$65,000",
    inventory: 3,
    priceChange: -2000
  }

  return (
    <DemoContainer>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        🚗 Car Finder - Engagement Features Demo
      </h1>

      <Section>
        <SectionTitle>🎯 1. Enhanced Onboarding & Gamification</SectionTitle>
        <p style={{ color: '#b0b0b0', marginBottom: '1rem' }}>
          Interactive onboarding with progress tracking and achievement badges.
        </p>
        <DemoButton onClick={() => setShowOnboarding(true)}>
          Show Onboarding
        </DemoButton>
      </Section>

      <Section>
        <SectionTitle>🤖 2. Smart Recommendations</SectionTitle>
        <p style={{ color: '#b0b0b0', marginBottom: '1rem' }}>
          AI-powered recommendations based on user behavior and preferences.
        </p>
        <DemoButton onClick={() => setShowRecommendations(!showRecommendations)}>
          {showRecommendations ? 'Hide' : 'Show'} Recommendations
        </DemoButton>
        {showRecommendations && (
          <SmartRecommendations 
            userPreferences={mockUserPreferences}
            browsingHistory={mockBrowsingHistory}
            location="auto"
          />
        )}
      </Section>

      <Section>
        <SectionTitle>💬 3. Rich Chat Experience</SectionTitle>
        <p style={{ color: '#b0b0b0', marginBottom: '1rem' }}>
          Enhanced chat with car cards, comparison tables, and quick actions.
        </p>
        <DemoButton onClick={() => setShowRichChat(!showRichChat)}>
          {showRichChat ? 'Hide' : 'Show'} Rich Chat Message
        </DemoButton>
        {showRichChat && (
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '12px' }}>
            <RichChatMessage 
              message={mockRichMessage}
              onAction={(action, data) => console.log('Action:', action, data)}
            />
          </div>
        )}
      </Section>

      <Section>
        <SectionTitle>📱 4. Mobile Optimization</SectionTitle>
        <p style={{ color: '#b0b0b0', marginBottom: '1rem' }}>
          Touch-optimized interface with pull-to-refresh and gesture support.
        </p>
        <DemoButton onClick={() => setShowMobile(!showMobile)}>
          {showMobile ? 'Hide' : 'Show'} Mobile Features
        </DemoButton>
        {showMobile && (
          <MobileOptimized onPullToRefresh={() => console.log('Refreshing...')}>
            <div style={{ padding: '1rem', color: 'white' }}>
              <h3>Mobile Optimized Content</h3>
              <p>This content is optimized for mobile with touch gestures and pull-to-refresh.</p>
            </div>
          </MobileOptimized>
        )}
      </Section>

      <Section>
        <SectionTitle>⚡ 5. Performance & UX</SectionTitle>
        <p style={{ color: '#b0b0b0', marginBottom: '1rem' }}>
          Skeleton loading states and optimistic updates for better perceived performance.
        </p>
        <DemoButton onClick={() => setShowSkeletons(!showSkeletons)}>
          {showSkeletons ? 'Hide' : 'Show'} Skeleton Loaders
        </DemoButton>
        {showSkeletons && (
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Chat Skeleton:</h4>
            <SkeletonChat />
            <h4 style={{ marginBottom: '1rem', marginTop: '2rem' }}>Car Grid Skeleton:</h4>
            <SkeletonCarGrid />
          </div>
        )}
      </Section>

      <Section>
        <SectionTitle>🎯 6. Conversion Optimization</SectionTitle>
        <p style={{ color: '#b0b0b0', marginBottom: '1rem' }}>
          Clear CTAs, urgency indicators, and social proof to drive conversions.
        </p>
        <DemoButton onClick={() => setShowConversion(!showConversion)}>
          {showConversion ? 'Hide' : 'Show'} Conversion Features
        </DemoButton>
        {showConversion && (
          <ConversionOptimizer 
            car={mockCar}
            onSavePreferences={(car) => console.log('Saving preferences:', car)}
            onScheduleTestDrive={(car) => console.log('Scheduling test drive:', car)}
            onGetFinancing={(car) => console.log('Getting financing:', car)}
          />
        )}
      </Section>

      {/* Onboarding Overlay */}
      <Onboarding 
        isVisible={showOnboarding}
        onComplete={() => setShowOnboarding(false)}
        onSkip={() => setShowOnboarding(false)}
        currentStep={0}
        userAchievements={[]}
      />
    </DemoContainer>
  )
}

export default Demo