import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
`

const RecommendationsContainer = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  margin: 1rem 0;
  animation: ${slideIn} 0.5s ease-out;
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

const CarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`

const CarCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(79, 172, 254, 0.3);
  }
`

const CarImage = styled.div`
  height: 120px;
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 0.75rem;
`

const CarTitle = styled.h4`
  color: white;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`

const CarDetails = styled.div`
  color: #b0b0b0;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
`

const CarPrice = styled.div`
  color: #4facfe;
  font-weight: 600;
  font-size: 1.1rem;
`

const MatchScore = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #4caf50;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`

const InsightBadge = styled.div`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(79, 172, 254, 0.1);
  border: 1px solid rgba(79, 172, 254, 0.3);
  border-radius: 12px;
  color: #4facfe;
  font-size: 0.8rem;
  margin: 0.25rem;
`

const SeasonalBadge = styled.div`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 12px;
  color: #ffc107;
  font-size: 0.8rem;
  margin: 0.25rem;
`

const LocationBadge = styled.div`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 12px;
  color: #4caf50;
  font-size: 0.8rem;
  margin: 0.25rem;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #b0b0b0;
  
  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
`

function SmartRecommendations({ userPreferences, browsingHistory, location }) {
  const [recommendations, setRecommendations] = useState([])
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    generateRecommendations()
  }, [userPreferences, browsingHistory])

  const generateRecommendations = async () => {
    setLoading(true)
    
    // Simulate API call for recommendations
    setTimeout(() => {
      const mockRecommendations = [
        {
          id: 1,
          name: "2024 BMW X5",
          price: "$65,000",
          matchScore: 95,
          image: "🚗",
          details: "Luxury SUV • 7 seats • AWD",
          type: "seasonal",
          reason: "Perfect for winter driving"
        },
        {
          id: 2,
          name: "2023 Tesla Model Y",
          price: "$48,000",
          matchScore: 88,
          image: "⚡",
          details: "Electric • 5 seats • Long Range",
          type: "trending",
          reason: "Popular in your area"
        },
        {
          id: 3,
          name: "2024 Mercedes C-Class",
          price: "$52,000",
          matchScore: 82,
          image: "🏎️",
          details: "Luxury Sedan • 5 seats • Premium",
          type: "budget",
          reason: "Fits your budget range"
        }
      ]
      
      const mockInsights = [
        "You've viewed 15 SUVs - consider this sedan for variety",
        "Your budget increased 20% - here are premium options",
        "Based on your area, electric vehicles are trending"
      ]
      
      setRecommendations(mockRecommendations)
      setInsights(mockInsights)
      setLoading(false)
    }, 1000)
  }

  const getSeasonalRecommendations = () => {
    const month = new Date().getMonth()
    const isWinter = month >= 11 || month <= 2
    const isSummer = month >= 5 && month <= 8
    
    if (isWinter) {
      return "SUVs and AWD vehicles for winter safety"
    } else if (isSummer) {
      return "Convertibles and sporty options for summer fun"
    }
    return "Great time to buy with current incentives"
  }

  const handleCarClick = (car) => {
    // Navigate to car details or add to chat
    console.log('Selected car:', car)
  }

  if (loading) {
    return (
      <RecommendationsContainer>
        <SectionTitle>🤖 Loading Smart Recommendations...</SectionTitle>
      </RecommendationsContainer>
    )
  }

  return (
    <div>
      {/* Smart Insights */}
      {insights.length > 0 && (
        <RecommendationsContainer>
          <SectionTitle>💡 Smart Insights</SectionTitle>
          {insights.map((insight, index) => (
            <InsightBadge key={index}>{insight}</InsightBadge>
          ))}
        </RecommendationsContainer>
      )}

      {/* Seasonal Recommendations */}
      <RecommendationsContainer>
        <SectionTitle>🌤️ {getSeasonalRecommendations()}</SectionTitle>
        <CarGrid>
          {recommendations.filter(car => car.type === 'seasonal').map(car => (
            <CarCard key={car.id} onClick={() => handleCarClick(car)}>
              <MatchScore>{car.matchScore}% Match</MatchScore>
              <CarImage>{car.image}</CarImage>
              <CarTitle>{car.name}</CarTitle>
              <CarDetails>{car.details}</CarDetails>
              <CarPrice>{car.price}</CarPrice>
              <SeasonalBadge>{car.reason}</SeasonalBadge>
            </CarCard>
          ))}
        </CarGrid>
      </RecommendationsContainer>

      {/* Trending in Your Area */}
      <RecommendationsContainer>
        <SectionTitle>📍 Trending in Your Area</SectionTitle>
        <CarGrid>
          {recommendations.filter(car => car.type === 'trending').map(car => (
            <CarCard key={car.id} onClick={() => handleCarClick(car)}>
              <MatchScore>{car.matchScore}% Match</MatchScore>
              <CarImage>{car.image}</CarImage>
              <CarTitle>{car.name}</CarTitle>
              <CarDetails>{car.details}</CarDetails>
              <CarPrice>{car.price}</CarPrice>
              <LocationBadge>{car.reason}</LocationBadge>
            </CarCard>
          ))}
        </CarGrid>
      </RecommendationsContainer>

      {/* Budget-Friendly Options */}
      <RecommendationsContainer>
        <SectionTitle>💰 Budget-Friendly Options</SectionTitle>
        <CarGrid>
          {recommendations.filter(car => car.type === 'budget').map(car => (
            <CarCard key={car.id} onClick={() => handleCarClick(car)}>
              <MatchScore>{car.matchScore}% Match</MatchScore>
              <CarImage>{car.image}</CarImage>
              <CarTitle>{car.name}</CarTitle>
              <CarDetails>{car.details}</CarDetails>
              <CarPrice>{car.price}</CarPrice>
            </CarCard>
          ))}
        </CarGrid>
      </RecommendationsContainer>
    </div>
  )
}

export default SmartRecommendations