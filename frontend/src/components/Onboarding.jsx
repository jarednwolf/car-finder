import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`

const OnboardingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.3s ease-out;
`

const OnboardingCard = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  text-align: center;
  color: white;
  position: relative;
  animation: ${fadeIn} 0.5s ease-out;
`

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin: 1rem 0;
  overflow: hidden;
`

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 3px;
  transition: width 0.5s ease;
  width: ${props => props.progress}%;
`

const StepTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const StepDescription = styled.p`
  color: #b0b0b0;
  line-height: 1.6;
  margin-bottom: 2rem;
`

const AchievementBadge = styled.div`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(79, 172, 254, 0.1);
  border: 1px solid rgba(79, 172, 254, 0.3);
  border-radius: 20px;
  color: #4facfe;
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0.5rem;
  animation: ${pulse} 2s infinite;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`

const Button = styled.button`
  padding: 0.75rem 2rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  
  &.primary {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(79, 172, 254, 0.3);
    }
  }
  
  &.secondary {
    background: transparent;
    color: #b0b0b0;
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }
  }
`

const SkipButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: #b0b0b0;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    color: white;
  }
`

const steps = [
  {
    title: "Welcome to Car Finder! 🚗",
    description: "I'm your AI assistant that will help you find the perfect car. Let me guide you through the process.",
    achievements: ["First Time User"]
  },
  {
    title: "Tell Me About Your Needs",
    description: "I'll ask you about your budget, preferences, and lifestyle to find cars that match perfectly.",
    achievements: ["Preferences Set"]
  },
  {
    title: "Get Personalized Matches",
    description: "Based on your preferences, I'll show you curated vehicles and set up alerts for new matches.",
    achievements: ["First Match Found"]
  },
  {
    title: "Stay Updated",
    description: "Get notified when new cars match your criteria, and track price changes on your favorites.",
    achievements: ["Alert System Active"]
  }
]

const achievements = [
  { id: "first_search", name: "First Search", icon: "🔍" },
  { id: "budget_set", name: "Budget Setter", icon: "💰" },
  { id: "preferences_saved", name: "Preferences Saved", icon: "💾" },
  { id: "first_match", name: "First Match", icon: "🎯" },
  { id: "alert_created", name: "Alert Creator", icon: "🔔" },
  { id: "chat_expert", name: "Chat Expert", icon: "💬" }
]

function Onboarding({ isVisible, onComplete, onSkip, currentStep = 0, userAchievements = [] }) {
  const [step, setStep] = useState(currentStep)
  const [achievements, setAchievements] = useState(userAchievements)

  const progress = ((step + 1) / steps.length) * 100

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onSkip()
  }

  const addAchievement = (achievementId) => {
    if (!achievements.includes(achievementId)) {
      setAchievements([...achievements, achievementId])
    }
  }

  if (!isVisible) return null

  return (
    <OnboardingOverlay>
      <OnboardingCard>
        <SkipButton onClick={handleSkip}>Skip</SkipButton>
        
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
        
        <StepTitle>{steps[step].title}</StepTitle>
        <StepDescription>{steps[step].description}</StepDescription>
        
        {steps[step].achievements && (
          <div>
            {steps[step].achievements.map((achievement, index) => (
              <AchievementBadge key={index}>
                {achievement}
              </AchievementBadge>
            ))}
          </div>
        )}
        
        <ButtonGroup>
          {step > 0 && (
            <Button 
              className="secondary" 
              onClick={() => setStep(step - 1)}
            >
              Previous
            </Button>
          )}
          <Button 
            className="primary" 
            onClick={handleNext}
          >
            {step === steps.length - 1 ? 'Get Started' : 'Next'}
          </Button>
        </ButtonGroup>
      </OnboardingCard>
    </OnboardingOverlay>
  )
}

export default Onboarding