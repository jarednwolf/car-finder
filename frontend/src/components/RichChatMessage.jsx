import React, { useState } from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`

const MessageContainer = styled.div`
  animation: ${fadeIn} 0.3s ease-out;
`

const CarCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  margin: 0.5rem 0;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(79, 172, 254, 0.3);
    transform: translateY(-2px);
  }
`

const CarHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
`

const CarImage = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
`

const CarInfo = styled.div`
  flex: 1;
`

const CarTitle = styled.h4`
  color: white;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
`

const CarPrice = styled.div`
  color: #4facfe;
  font-weight: 600;
  font-size: 1.1rem;
`

const CarSpecs = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5rem;
  margin-top: 0.75rem;
`

const SpecItem = styled.div`
  background: rgba(255, 255, 255, 0.03);
  padding: 0.5rem;
  border-radius: 6px;
  text-align: center;
  font-size: 0.8rem;
  
  .label {
    color: #b0b0b0;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .value {
    color: white;
    font-weight: 600;
    margin-top: 0.25rem;
  }
`

const QuickActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`

const ActionButton = styled.button`
  background: rgba(79, 172, 254, 0.1);
  border: 1px solid rgba(79, 172, 254, 0.3);
  color: #4facfe;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(79, 172, 254, 0.2);
    transform: translateY(-1px);
  }
`

const ComparisonTable = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  margin: 1rem 0;
`

const TableHeader = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  font-weight: 600;
  color: white;
`

const TableRow = styled.div`
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  &:last-child {
    border-bottom: none;
  }
  
  .feature {
    color: white;
    font-weight: 500;
  }
  
  .value {
    color: #b0b0b0;
    text-align: center;
  }
  
  .highlight {
    color: #4facfe;
    font-weight: 600;
  }
`

const VideoEmbed = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 1rem;
  margin: 0.5rem 0;
  text-align: center;
  
  .video-placeholder {
    width: 100%;
    height: 200px;
    background: linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: rgba(255, 255, 255, 0.5);
  }
`

const ExpandButton = styled.button`
  background: transparent;
  border: none;
  color: #4facfe;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`

function RichChatMessage({ message, onAction }) {
  const [expanded, setExpanded] = useState(false)

  const renderCarCard = (car) => (
    <CarCard key={car.id} onClick={() => onAction('view_car', car)}>
      <CarHeader>
        <CarImage>{car.image}</CarImage>
        <CarInfo>
          <CarTitle>{car.name}</CarTitle>
          <CarPrice>{car.price}</CarPrice>
        </CarInfo>
      </CarHeader>
      
      <CarSpecs>
        <SpecItem>
          <div className="label">Mileage</div>
          <div className="value">{car.mileage}</div>
        </SpecItem>
        <SpecItem>
          <div className="label">Year</div>
          <div className="value">{car.year}</div>
        </SpecItem>
        <SpecItem>
          <div className="label">Engine</div>
          <div className="value">{car.engine}</div>
        </SpecItem>
        <SpecItem>
          <div className="label">Transmission</div>
          <div className="value">{car.transmission}</div>
        </SpecItem>
      </CarSpecs>
      
      <QuickActions>
        <ActionButton onClick={(e) => {
          e.stopPropagation()
          onAction('save_preferences', car)
        }}>
          💾 Save Preferences
        </ActionButton>
        <ActionButton onClick={(e) => {
          e.stopPropagation()
          onAction('schedule_test_drive', car)
        }}>
          🚗 Schedule Test Drive
        </ActionButton>
        <ActionButton onClick={(e) => {
          e.stopPropagation()
          onAction('get_financing', car)
        }}>
          💰 Get Financing
        </ActionButton>
      </QuickActions>
    </CarCard>
  )

  const renderComparisonTable = (cars) => (
    <ComparisonTable>
      <TableHeader>
        <div>Feature</div>
        {cars.map(car => (
          <div key={car.id}>{car.name}</div>
        ))}
      </TableHeader>
      
      {[
        { feature: 'Price', key: 'price' },
        { feature: 'Mileage', key: 'mileage' },
        { feature: 'Engine', key: 'engine' },
        { feature: 'Fuel Economy', key: 'mpg' },
        { feature: 'Safety Rating', key: 'safety' }
      ].map(row => (
        <TableRow key={row.feature}>
          <div className="feature">{row.feature}</div>
          {cars.map(car => (
            <div key={car.id} className={`value ${car.highlight === row.key ? 'highlight' : ''}`}>
              {car[row.key]}
            </div>
          ))}
        </TableRow>
      ))}
    </ComparisonTable>
  )

  const renderVideoEmbed = (video) => (
    <VideoEmbed>
      <div className="video-placeholder">
        🎥 {video.title}
      </div>
      <p style={{ color: '#b0b0b0', marginTop: '0.5rem', fontSize: '0.9rem' }}>
        {video.description}
      </p>
    </VideoEmbed>
  )

  // Check if message contains rich content
  const hasRichContent = message.cars || message.comparison || message.video

  return (
    <MessageContainer>
      {/* Regular text content */}
      {message.content && (
        <div style={{ color: 'white', lineHeight: '1.6', marginBottom: hasRichContent ? '1rem' : 0 }}>
          {message.content}
        </div>
      )}
      
      {/* Car cards */}
      {message.cars && message.cars.map(car => renderCarCard(car))}
      
      {/* Comparison table */}
      {message.comparison && renderComparisonTable(message.comparison)}
      
      {/* Video embed */}
      {message.video && renderVideoEmbed(message.video)}
      
      {/* Expandable content */}
      {message.expandable && (
        <div>
          {!expanded && (
            <ExpandButton onClick={() => setExpanded(true)}>
              Show more details...
            </ExpandButton>
          )}
          {expanded && (
            <div style={{ marginTop: '1rem' }}>
              {message.expandable}
              <ExpandButton onClick={() => setExpanded(false)}>
                Show less
              </ExpandButton>
            </div>
          )}
        </div>
      )}
    </MessageContainer>
  )
}

export default RichChatMessage