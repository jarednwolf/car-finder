import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
`

const AnalyticsContainer = styled.div`
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

const InsightCard = styled.div`
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

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`

const MetricCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  position: relative;
`

const MetricValue = styled.div`
  color: ${props => {
    if (props.trend === 'up') return '#4caf50'
    if (props.trend === 'down') return '#f44336'
    return '#4facfe'
  }};
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`

const MetricLabel = styled.div`
  color: #b0b0b0;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const TrendIndicator = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 0.8rem;
  color: ${props => props.trend === 'up' ? '#4caf50' : '#f44336'};
`

const ChartContainer = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b0b0b0;
  font-size: 0.9rem;
`

const PredictionCard = styled.div`
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%);
  border: 1px solid rgba(79, 172, 254, 0.3);
  border-radius: 12px;
  padding: 1rem;
  margin: 1rem 0;
`

const PredictionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`

const PredictionBadge = styled.div`
  background: #4facfe;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
`

const MarketAlert = styled.div`
  background: ${props => props.type === 'opportunity' ? 
    'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)' :
    'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%)'
  };
  border: 1px solid ${props => props.type === 'opportunity' ? 
    'rgba(76, 175, 80, 0.3)' : 'rgba(255, 193, 7, 0.3)'
  };
  border-radius: 12px;
  padding: 1rem;
  margin: 1rem 0;
`

const AlertIcon = styled.div`
  font-size: 1.2rem;
  margin-right: 0.5rem;
`

function AnalyticsInsights({ userPreferences, location, selectedCar }) {
  const [marketData, setMarketData] = useState({})
  const [predictions, setPredictions] = useState([])
  const [alerts, setAlerts] = useState([])
  const [userInsights, setUserInsights] = useState({})

  useEffect(() => {
    // Simulate fetching analytics data
    const mockMarketData = {
      averagePrice: 45000,
      priceTrend: 'up',
      inventoryLevel: 'medium',
      demandScore: 85,
      supplyScore: 72,
      marketVolatility: 'low',
      seasonalFactor: 'peak'
    }

    const mockPredictions = [
      {
        type: 'price',
        title: 'Price Prediction',
        description: 'Based on market trends, this model is expected to increase in value by 3-5% over the next 6 months.',
        confidence: 87,
        timeframe: '6 months'
      },
      {
        type: 'inventory',
        title: 'Inventory Forecast',
        description: 'Supply is expected to tighten in Q2, potentially driving prices up by 8-12%.',
        confidence: 92,
        timeframe: '3 months'
      },
      {
        type: 'demand',
        title: 'Demand Analysis',
        description: 'This vehicle type is experiencing 15% higher demand than last year.',
        confidence: 78,
        timeframe: 'Current'
      }
    ]

    const mockAlerts = [
      {
        type: 'opportunity',
        title: 'Great Deal Alert!',
        description: 'This car is priced 12% below market average. Similar models are selling for $3,200 more.',
        action: 'Act quickly - only 2 similar deals in your area'
      },
      {
        type: 'warning',
        title: 'Market Shift Detected',
        description: 'Luxury SUV prices in your area have increased 8% this month. Consider acting soon.',
        action: 'Prices expected to rise another 5% in next 30 days'
      }
    ]

    const mockUserInsights = {
      searchBehavior: 'You\'ve viewed 23 SUVs in the last 30 days',
      priceRange: 'Your budget has increased 15% since last month',
      preferences: 'You prefer vehicles with AWD and premium features',
      timing: 'Best time to buy: Next 2 weeks (end of month deals)',
      competition: '3 other users are looking at similar vehicles'
    }

    setMarketData(mockMarketData)
    setPredictions(mockPredictions)
    setAlerts(mockAlerts)
    setUserInsights(mockUserInsights)
  }, [userPreferences, location, selectedCar])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div>
      {/* Market Metrics */}
      <AnalyticsContainer>
        <SectionTitle>📊 Market Intelligence</SectionTitle>
        <MetricGrid>
          <MetricCard>
            <TrendIndicator trend={marketData.priceTrend}>
              {marketData.priceTrend === 'up' ? '↗' : '↘'}
            </TrendIndicator>
            <MetricValue trend={marketData.priceTrend}>
              {formatCurrency(marketData.averagePrice)}
            </MetricValue>
            <MetricLabel>Average Price</MetricLabel>
          </MetricCard>
          
          <MetricCard>
            <MetricValue>
              {marketData.demandScore}%
            </MetricValue>
            <MetricLabel>Demand Score</MetricLabel>
          </MetricCard>
          
          <MetricCard>
            <MetricValue>
              {marketData.supplyScore}%
            </MetricValue>
            <MetricLabel>Supply Score</MetricLabel>
          </MetricCard>
          
          <MetricCard>
            <MetricValue>
              {marketData.marketVolatility}
            </MetricValue>
            <MetricLabel>Volatility</MetricLabel>
          </MetricCard>
        </MetricGrid>
      </AnalyticsContainer>

      {/* AI Predictions */}
      <AnalyticsContainer>
        <SectionTitle>🔮 AI Predictions</SectionTitle>
        {predictions.map((prediction, index) => (
          <PredictionCard key={index}>
            <PredictionHeader>
              <PredictionBadge>AI Prediction</PredictionBadge>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'white', fontWeight: 600 }}>{prediction.title}</div>
                <div style={{ color: '#b0b0b0', fontSize: '0.8rem' }}>
                  {prediction.confidence}% confidence • {prediction.timeframe}
                </div>
              </div>
            </PredictionHeader>
            <p style={{ color: '#e0e0e0', fontSize: '0.9rem', lineHeight: '1.5' }}>
              {prediction.description}
            </p>
          </PredictionCard>
        ))}
      </AnalyticsContainer>

      {/* Market Alerts */}
      <AnalyticsContainer>
        <SectionTitle>🚨 Market Alerts</SectionTitle>
        {alerts.map((alert, index) => (
          <MarketAlert key={index} type={alert.type}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <AlertIcon>
                {alert.type === 'opportunity' ? '💰' : '⚠️'}
              </AlertIcon>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'white', fontWeight: 600, marginBottom: '0.25rem' }}>
                  {alert.title}
                </div>
                <div style={{ color: '#e0e0e0', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '0.5rem' }}>
                  {alert.description}
                </div>
                <div style={{ 
                  color: alert.type === 'opportunity' ? '#4caf50' : '#ffc107',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}>
                  {alert.action}
                </div>
              </div>
            </div>
          </MarketAlert>
        ))}
      </AnalyticsContainer>

      {/* User Insights */}
      <AnalyticsContainer>
        <SectionTitle>👤 Your Insights</SectionTitle>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <InsightCard>
            <div style={{ color: '#4facfe', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Search Behavior</div>
            <div style={{ color: 'white', fontSize: '0.9rem' }}>{userInsights.searchBehavior}</div>
          </InsightCard>
          
          <InsightCard>
            <div style={{ color: '#4facfe', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Budget Analysis</div>
            <div style={{ color: 'white', fontSize: '0.9rem' }}>{userInsights.priceRange}</div>
          </InsightCard>
          
          <InsightCard>
            <div style={{ color: '#4facfe', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Preferences</div>
            <div style={{ color: 'white', fontSize: '0.9rem' }}>{userInsights.preferences}</div>
          </InsightCard>
          
          <InsightCard>
            <div style={{ color: '#4facfe', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Optimal Timing</div>
            <div style={{ color: 'white', fontSize: '0.9rem' }}>{userInsights.timing}</div>
          </InsightCard>
          
          <InsightCard>
            <div style={{ color: '#4facfe', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Competition</div>
            <div style={{ color: 'white', fontSize: '0.9rem' }}>{userInsights.competition}</div>
          </InsightCard>
        </div>
      </AnalyticsContainer>

      {/* Price History Chart */}
      <AnalyticsContainer>
        <SectionTitle>📈 Price History</SectionTitle>
        <ChartContainer>
          📊 Interactive price history chart would be displayed here
          <br />
          <small>Showing 12-month price trends for selected vehicle</small>
        </ChartContainer>
      </AnalyticsContainer>
    </div>
  )
}

export default AnalyticsInsights