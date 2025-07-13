import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

const IntegrationContainer = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  margin: 1rem 0;
  animation: ${fadeIn} 0.5s ease-out;
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

const ServiceCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  margin: 0.5rem 0;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
    border-color: rgba(79, 172, 254, 0.3);
  }
  
  &.connected {
    border-color: rgba(76, 175, 80, 0.3);
    background: rgba(76, 175, 80, 0.05);
  }
`

const ServiceHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`

const ServiceIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
`

const ServiceInfo = styled.div`
  flex: 1;
`

const ServiceName = styled.div`
  color: white;
  font-weight: 600;
  font-size: 1rem;
`

const ServiceStatus = styled.div`
  color: ${props => props.connected ? '#4caf50' : '#b0b0b0'};
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

const ServiceDescription = styled.div`
  color: #b0b0b0;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-top: 0.5rem;
`

const ConnectButton = styled.button`
  background: ${props => props.connected ? 
    'rgba(76, 175, 80, 0.1)' : 'rgba(79, 172, 254, 0.1)'};
  border: 1px solid ${props => props.connected ? 
    'rgba(76, 175, 80, 0.3)' : 'rgba(79, 172, 254, 0.3)'};
  color: ${props => props.connected ? '#4caf50' : '#4facfe'};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  
  &:hover {
    background: ${props => props.connected ? 
      'rgba(76, 175, 80, 0.2)' : 'rgba(79, 172, 254, 0.2)'};
    transform: translateY(-1px);
  }
`

const CalendarEvent = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem;
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const EventTime = styled.div`
  color: #4facfe;
  font-weight: 600;
  font-size: 0.9rem;
  min-width: 80px;
`

const EventDetails = styled.div`
  flex: 1;
`

const EventTitle = styled.div`
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
`

const EventLocation = styled.div`
  color: #b0b0b0;
  font-size: 0.8rem;
`

const FinanceCalculator = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  margin: 1rem 0;
`

const CalculatorInput = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  font-size: 0.9rem;
  width: 100%;
  margin: 0.5rem 0;
  
  &::placeholder {
    color: #b0b0b0;
  }
  
  &:focus {
    outline: none;
    border-color: rgba(79, 172, 254, 0.5);
  }
`

const CalculatorResult = styled.div`
  background: rgba(79, 172, 254, 0.1);
  border: 1px solid rgba(79, 172, 254, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  text-align: center;
`

const ResultValue = styled.div`
  color: #4facfe;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`

const ResultLabel = styled.div`
  color: #b0b0b0;
  font-size: 0.8rem;
`

const InsuranceQuote = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  margin: 1rem 0;
`

const QuoteCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  margin: 0.5rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const QuoteInfo = styled.div`
  flex: 1;
`

const QuoteProvider = styled.div`
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
`

const QuoteDetails = styled.div`
  color: #b0b0b0;
  font-size: 0.8rem;
`

const QuotePrice = styled.div`
  color: #4facfe;
  font-weight: 700;
  font-size: 1.1rem;
`

function EcosystemIntegration({ userPreferences, selectedCar }) {
  const [connectedServices, setConnectedServices] = useState({
    calendar: false,
    finance: false,
    insurance: false,
    tradeIn: false,
    maintenance: false
  })
  
  const [calendarEvents, setCalendarEvents] = useState([])
  const [financeOptions, setFinanceOptions] = useState([])
  const [insuranceQuotes, setInsuranceQuotes] = useState([])

  useEffect(() => {
    // Simulate fetching integration data
    const mockEvents = [
      {
        time: '10:00 AM',
        title: 'Test Drive - BMW X5',
        location: 'BMW of Downtown'
      },
      {
        time: '2:00 PM',
        title: 'Financing Meeting',
        location: 'Local Credit Union'
      }
    ]

    const mockFinanceOptions = [
      {
        provider: 'Local Credit Union',
        rate: '3.2%',
        term: '60 months',
        payment: '$1,247'
      },
      {
        provider: 'BMW Financial',
        rate: '2.9%',
        term: '60 months',
        payment: '$1,198'
      }
    ]

    const mockInsuranceQuotes = [
      {
        provider: 'State Farm',
        coverage: 'Full Coverage',
        price: '$1,200/year'
      },
      {
        provider: 'Geico',
        coverage: 'Full Coverage',
        price: '$980/year'
      }
    ]

    setCalendarEvents(mockEvents)
    setFinanceOptions(mockFinanceOptions)
    setInsuranceQuotes(mockInsuranceQuotes)
  }, [selectedCar])

  const handleServiceConnect = (service) => {
    setConnectedServices(prev => ({
      ...prev,
      [service]: !prev[service]
    }))
  }

  const services = [
    {
      id: 'calendar',
      name: 'Google Calendar',
      description: 'Sync test drives, appointments, and car-related events to your calendar.',
      icon: '📅',
      connected: connectedServices.calendar
    },
    {
      id: 'finance',
      name: 'Financing Partners',
      description: 'Connect with our network of lenders for the best rates and terms.',
      icon: '💰',
      connected: connectedServices.finance
    },
    {
      id: 'insurance',
      name: 'Insurance Quotes',
      description: 'Get instant insurance quotes from multiple providers.',
      icon: '🛡️',
      connected: connectedServices.insurance
    },
    {
      id: 'tradeIn',
      name: 'Trade-In Valuation',
      description: 'Get instant trade-in value for your current vehicle.',
      icon: '🔄',
      connected: connectedServices.tradeIn
    },
    {
      id: 'maintenance',
      name: 'Maintenance Tracking',
      description: 'Track service history and schedule maintenance reminders.',
      icon: '🔧',
      connected: connectedServices.maintenance
    }
  ]

  return (
    <div>
      {/* Service Integrations */}
      <IntegrationContainer>
        <SectionTitle>🔗 Connected Services</SectionTitle>
        <p style={{ color: '#b0b0b0', marginBottom: '1rem' }}>
          Connect your accounts to streamline your car buying experience.
        </p>
        
        {services.map(service => (
          <ServiceCard 
            key={service.id}
            className={service.connected ? 'connected' : ''}
            onClick={() => handleServiceConnect(service.id)}
          >
            <ServiceHeader>
              <ServiceIcon>{service.icon}</ServiceIcon>
              <ServiceInfo>
                <ServiceName>{service.name}</ServiceName>
                <ServiceStatus connected={service.connected}>
                  {service.connected ? '✓ Connected' : '○ Not Connected'}
                </ServiceStatus>
              </ServiceInfo>
            </ServiceHeader>
            <ServiceDescription>{service.description}</ServiceDescription>
            <ConnectButton connected={service.connected}>
              {service.connected ? 'Disconnect' : 'Connect'}
            </ConnectButton>
          </ServiceCard>
        ))}
      </IntegrationContainer>

      {/* Calendar Integration */}
      {connectedServices.calendar && (
        <IntegrationContainer>
          <SectionTitle>📅 Upcoming Events</SectionTitle>
          {calendarEvents.map((event, index) => (
            <CalendarEvent key={index}>
              <EventTime>{event.time}</EventTime>
              <EventDetails>
                <EventTitle>{event.title}</EventTitle>
                <EventLocation>{event.location}</EventLocation>
              </EventDetails>
            </CalendarEvent>
          ))}
        </IntegrationContainer>
      )}

      {/* Finance Calculator */}
      {connectedServices.finance && (
        <IntegrationContainer>
          <SectionTitle>💰 Financing Calculator</SectionTitle>
          <FinanceCalculator>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ color: '#b0b0b0', fontSize: '0.8rem' }}>Car Price</label>
                <CalculatorInput 
                  type="number" 
                  placeholder="$45,000"
                  defaultValue="45000"
                />
              </div>
              <div>
                <label style={{ color: '#b0b0b0', fontSize: '0.8rem' }}>Down Payment</label>
                <CalculatorInput 
                  type="number" 
                  placeholder="$5,000"
                  defaultValue="5000"
                />
              </div>
              <div>
                <label style={{ color: '#b0b0b0', fontSize: '0.8rem' }}>Interest Rate (%)</label>
                <CalculatorInput 
                  type="number" 
                  placeholder="3.2"
                  defaultValue="3.2"
                />
              </div>
              <div>
                <label style={{ color: '#b0b0b0', fontSize: '0.8rem' }}>Loan Term (months)</label>
                <CalculatorInput 
                  type="number" 
                  placeholder="60"
                  defaultValue="60"
                />
              </div>
            </div>
            
            <CalculatorResult>
              <ResultValue>$1,247</ResultValue>
              <ResultLabel>Monthly Payment</ResultLabel>
            </CalculatorResult>
          </FinanceCalculator>
          
          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem' }}>Available Financing Options</h4>
            {financeOptions.map((option, index) => (
              <QuoteCard key={index}>
                <QuoteInfo>
                  <QuoteProvider>{option.provider}</QuoteProvider>
                  <QuoteDetails>{option.rate} • {option.term}</QuoteDetails>
                </QuoteInfo>
                <QuotePrice>{option.payment}/month</QuotePrice>
              </QuoteCard>
            ))}
          </div>
        </IntegrationContainer>
      )}

      {/* Insurance Quotes */}
      {connectedServices.insurance && (
        <IntegrationContainer>
          <SectionTitle>🛡️ Insurance Quotes</SectionTitle>
          <InsuranceQuote>
            <p style={{ color: '#b0b0b0', marginBottom: '1rem' }}>
              Get instant quotes from top insurance providers for your selected vehicle.
            </p>
            
            {insuranceQuotes.map((quote, index) => (
              <QuoteCard key={index}>
                <QuoteInfo>
                  <QuoteProvider>{quote.provider}</QuoteProvider>
                  <QuoteDetails>{quote.coverage}</QuoteDetails>
                </QuoteInfo>
                <QuotePrice>{quote.price}</QuotePrice>
              </QuoteCard>
            ))}
          </InsuranceQuote>
        </IntegrationContainer>
      )}

      {/* Trade-In Valuation */}
      {connectedServices.tradeIn && (
        <IntegrationContainer>
          <SectionTitle>🔄 Trade-In Valuation</SectionTitle>
          <div style={{ color: '#e0e0e0', fontSize: '0.9rem', lineHeight: '1.5' }}>
            <p>Get an instant trade-in value for your current vehicle:</p>
            <ul style={{ margin: '1rem 0', paddingLeft: '1.5rem' }}>
              <li>Instant online valuation</li>
              <li>Compare offers from multiple dealers</li>
              <li>Use trade-in value toward your new car</li>
              <li>No obligation to sell</li>
            </ul>
            <ConnectButton connected={false}>
              Get Trade-In Value
            </ConnectButton>
          </div>
        </IntegrationContainer>
      )}

      {/* Maintenance Tracking */}
      {connectedServices.maintenance && (
        <IntegrationContainer>
          <SectionTitle>🔧 Maintenance Tracking</SectionTitle>
          <div style={{ color: '#e0e0e0', fontSize: '0.9rem', lineHeight: '1.5' }}>
            <p>Track your vehicle's maintenance history and schedule:</p>
            <ul style={{ margin: '1rem 0', paddingLeft: '1.5rem' }}>
              <li>Service history tracking</li>
              <li>Maintenance reminders</li>
              <li>Warranty information</li>
              <li>Service appointment booking</li>
            </ul>
            <ConnectButton connected={false}>
              Set Up Maintenance Tracking
            </ConnectButton>
          </div>
        </IntegrationContainer>
      )}
    </div>
  )
}

export default EcosystemIntegration