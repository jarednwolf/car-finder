import React, { useState } from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`

const PremiumContainer = styled.div`
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%);
  border: 2px solid rgba(255, 193, 7, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  margin: 1rem 0;
  animation: ${slideUp} 0.5s ease-out;
`

const PremiumBadge = styled.div`
  background: #ffc107;
  color: #000;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 1rem;
`

const SectionTitle = styled.h3`
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  margin: 0.5rem 0;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
  }
`

const FeatureHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`

const FeatureIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #000;
`

const FeatureTitle = styled.div`
  color: white;
  font-weight: 600;
  font-size: 1rem;
`

const FeatureDescription = styled.div`
  color: #b0b0b0;
  font-size: 0.9rem;
  line-height: 1.5;
`

const PricingCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-4px);
  }
  
  &.featured {
    border-color: rgba(255, 193, 7, 0.5);
    background: linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%);
  }
`

const PlanName = styled.div`
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`

const PlanPrice = styled.div`
  color: #ffc107;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`

const PlanPeriod = styled.div`
  color: #b0b0b0;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
  text-align: left;
`

const FeatureItem = styled.li`
  color: #e0e0e0;
  font-size: 0.9rem;
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '✓';
    color: #4caf50;
    font-weight: 600;
  }
`

const UpgradeButton = styled.button`
  background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
  color: #000;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 193, 7, 0.3);
  }
`

const LimitedOffer = styled.div`
  background: linear-gradient(135deg, #f44336 0%, #e91e63 100%);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  text-align: center;
  font-weight: 600;
  animation: ${pulse} 2s infinite;
`

const ExclusiveFeature = styled.div`
  background: linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(156, 39, 176, 0.05) 100%);
  border: 1px solid rgba(156, 39, 176, 0.3);
  border-radius: 12px;
  padding: 1rem;
  margin: 1rem 0;
`

const ExclusiveBadge = styled.div`
  background: #9c27b0;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 0.5rem;
`

function PremiumFeatures({ userTier = 'free', onUpgrade }) {
  const [selectedPlan, setSelectedPlan] = useState('pro')

  const plans = {
    free: {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Basic car search',
        '5 alerts per month',
        'Standard chat support',
        'Basic recommendations'
      ]
    },
    pro: {
      name: 'Pro',
      price: '$19',
      period: 'per month',
      features: [
        'Unlimited car search',
        'Unlimited alerts',
        'Priority chat support',
        'Advanced AI recommendations',
        'Market insights',
        'Price history charts',
        'Expert tips & advice',
        'Priority notifications'
      ]
    },
    premium: {
      name: 'Premium',
      price: '$49',
      period: 'per month',
      features: [
        'Everything in Pro',
        'Personal car advisor',
        'Exclusive dealer access',
        'Negotiation assistance',
        'Financing optimization',
        'Trade-in valuation',
        'Concierge service',
        'VIP test drive booking'
      ]
    }
  }

  const exclusiveFeatures = [
    {
      title: 'Personal Car Advisor',
      description: 'Get a dedicated expert who knows your preferences and helps you find the perfect car.',
      icon: '👨‍💼'
    },
    {
      title: 'Exclusive Dealer Access',
      description: 'Access to premium inventory and special pricing not available to the public.',
      icon: '🔐'
    },
    {
      title: 'Negotiation Assistance',
      description: 'Our experts help you get the best possible deal with proven negotiation strategies.',
      icon: '🤝'
    },
    {
      title: 'Financing Optimization',
      description: 'Find the best rates and terms from our network of preferred lenders.',
      icon: '💰'
    }
  ]

  const handleUpgrade = (plan) => {
    setSelectedPlan(plan)
    onUpgrade?.(plan)
  }

  return (
    <div>
      {/* Premium Badge */}
      <PremiumContainer>
        <PremiumBadge>PREMIUM FEATURES</PremiumBadge>
        <SectionTitle>🚀 Upgrade Your Experience</SectionTitle>
        <p style={{ color: '#e0e0e0', marginBottom: '1rem' }}>
          Unlock advanced features and get personalized assistance to find your perfect car faster.
        </p>
      </PremiumContainer>

      {/* Exclusive Features */}
      <div>
        <SectionTitle>⭐ Exclusive Premium Features</SectionTitle>
        {exclusiveFeatures.map((feature, index) => (
          <ExclusiveFeature key={index}>
            <ExclusiveBadge>EXCLUSIVE</ExclusiveBadge>
            <FeatureHeader>
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <div>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </div>
            </FeatureHeader>
          </ExclusiveFeature>
        ))}
      </div>

      {/* Pricing Plans */}
      <div>
        <SectionTitle>💎 Choose Your Plan</SectionTitle>
        
        {/* Limited Time Offer */}
        <LimitedOffer>
          ⏰ LIMITED TIME: 50% off Premium plan for first 3 months!
        </LimitedOffer>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {Object.entries(plans).map(([key, plan]) => (
            <PricingCard 
              key={key} 
              className={key === 'premium' ? 'featured' : ''}
            >
              <PlanName>{plan.name}</PlanName>
              <PlanPrice>{plan.price}</PlanPrice>
              <PlanPeriod>{plan.period}</PlanPeriod>
              
              <FeatureList>
                {plan.features.map((feature, index) => (
                  <FeatureItem key={index}>{feature}</FeatureItem>
                ))}
              </FeatureList>
              
              {key !== 'free' && (
                <UpgradeButton 
                  onClick={() => handleUpgrade(key)}
                  disabled={userTier === key}
                >
                  {userTier === key ? 'Current Plan' : `Upgrade to ${plan.name}`}
                </UpgradeButton>
              )}
            </PricingCard>
          ))}
        </div>
      </div>

      {/* Premium Benefits */}
      <div>
        <SectionTitle>🎯 Premium Benefits</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <FeatureCard>
            <FeatureHeader>
              <FeatureIcon>⚡</FeatureIcon>
              <FeatureTitle>Priority Access</FeatureTitle>
            </FeatureHeader>
            <FeatureDescription>
              Get first access to new inventory and exclusive deals before they go public.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureHeader>
              <FeatureIcon>🎯</FeatureIcon>
              <FeatureTitle>Personalized Service</FeatureTitle>
            </FeatureHeader>
            <FeatureDescription>
              Dedicated advisor who learns your preferences and finds perfect matches.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureHeader>
              <FeatureIcon>💰</FeatureIcon>
              <FeatureTitle>Save Money</FeatureTitle>
            </FeatureHeader>
            <FeatureDescription>
              Average savings of $2,500+ through our negotiation and financing services.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureHeader>
              <FeatureIcon>⏰</FeatureIcon>
              <FeatureTitle>Save Time</FeatureTitle>
            </FeatureHeader>
            <FeatureDescription>
              Find your perfect car 3x faster with our advanced AI and expert assistance.
            </FeatureDescription>
          </FeatureCard>
        </div>
      </div>

      {/* Success Stories */}
      <div>
        <SectionTitle>💬 Premium Success Stories</SectionTitle>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <FeatureCard>
            <div style={{ color: '#ffc107', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Premium Member</div>
            <div style={{ color: 'white', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              "My personal advisor found me a BMW X5 that was $8,000 below market value. The negotiation assistance saved me another $3,000!"
            </div>
            <div style={{ color: '#b0b0b0', fontSize: '0.8rem' }}>- Jennifer L., Premium Member</div>
          </FeatureCard>
          
          <FeatureCard>
            <div style={{ color: '#ffc107', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Pro Member</div>
            <div style={{ color: 'white', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              "The market insights helped me time my purchase perfectly. Saved $5,200 by waiting for the right moment!"
            </div>
            <div style={{ color: '#b0b0b0', fontSize: '0.8rem' }}>- Michael R., Pro Member</div>
          </FeatureCard>
        </div>
      </div>
    </div>
  )
}

export default PremiumFeatures