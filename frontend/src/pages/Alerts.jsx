import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import axios from 'axios'

const AlertsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: calc(100vh - 70px);
`

const Header = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    color: white;
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #b0b0b0;
    font-size: 1.1rem;
  }
`

const AlertGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`

const AlertCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
`

const AlertImage = styled.div`
  height: 200px;
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: rgba(255, 255, 255, 0.2);
`

const AlertContent = styled.div`
  padding: 1.5rem;
`

const VehicleTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: white;
  font-size: 1.25rem;
`

const VehicleDetails = styled.div`
  color: #b0b0b0;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`

const Price = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #4facfe;
  margin-bottom: 1rem;
`

const DealerInfo = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #b0b0b0;
`

const ViewButton = styled.a`
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(79, 172, 254, 0.3);
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  color: white;
  
  h2 {
    color: white;
    margin-bottom: 1rem;
  }
  
  p {
    color: #b0b0b0;
  }
`

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`

const LoadingState = styled.div`
  text-align: center;
  padding: 4rem;
  color: #b0b0b0;
  font-size: 1.1rem;
`

const MatchScore = styled.div`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #4caf50;
  color: white;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`

function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAlerts()
    // Poll for new alerts every 30 seconds
    const interval = setInterval(fetchAlerts, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('/api/alerts/feed')
      setAlerts(response.data)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const formatMileage = (mileage) => {
    return new Intl.NumberFormat('en-US').format(mileage)
  }

  if (loading) {
    return (
      <AlertsContainer>
        <LoadingState>
          <div>Loading your alerts...</div>
        </LoadingState>
      </AlertsContainer>
    )
  }

  if (error) {
    return (
      <AlertsContainer>
        <EmptyState>
          <EmptyIcon>❌</EmptyIcon>
          <h2>Error loading alerts</h2>
          <p>{error}</p>
        </EmptyState>
      </AlertsContainer>
    )
  }

  if (alerts.length === 0) {
    return (
      <AlertsContainer>
        <Header>
          <h1>My Alerts</h1>
          <p>Vehicles matching your saved preferences</p>
        </Header>
        <EmptyState>
          <EmptyIcon>📭</EmptyIcon>
          <h2>No alerts yet</h2>
          <p>When vehicles matching your preferences become available, they'll appear here.</p>
          <p>Make sure to save your preferences in the chat!</p>
        </EmptyState>
      </AlertsContainer>
    )
  }

  return (
    <AlertsContainer>
      <Header>
        <h1>My Alerts</h1>
        <p>Found {alerts.length} vehicles matching your preferences</p>
      </Header>
      
      <AlertGrid>
        {alerts.map((alert) => {
          const listing = alert.listing
          return (
            <AlertCard key={alert.id}>
              <AlertImage>
                🚗
              </AlertImage>
              <AlertContent>
                <MatchScore>
                  {Math.round(alert.similarity_score * 100)}% Match
                </MatchScore>
                <VehicleTitle>
                  {listing.year} {listing.make} {listing.model}
                </VehicleTitle>
                <VehicleDetails>
                  {listing.trim && <div>{listing.trim}</div>}
                  <div>{formatMileage(listing.mileage)} miles</div>
                  {listing.exterior_color && <div>{listing.exterior_color}</div>}
                </VehicleDetails>
                <Price>{formatPrice(listing.price)}</Price>
                <DealerInfo>
                  <div><strong>{listing.dealer.name}</strong></div>
                  <div>{listing.dealer.city}, {listing.dealer.state}</div>
                </DealerInfo>
                <ViewButton href={listing.listing_url} target="_blank" rel="noopener noreferrer">
                  View Details
                </ViewButton>
              </AlertContent>
            </AlertCard>
          )
        })}
      </AlertGrid>
    </AlertsContainer>
  )
}

export default Alerts 