import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled, { keyframes } from '@emotion/styled'
import axios from 'axios'

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`

const slideUp = keyframes`
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`

const ChatContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
  display: flex;
  flex-direction: column;
`

const ChatHeader = styled.div`
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: #b0b0b0;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: white;
  }
`

const HeaderTitle = styled.h2`
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4facfe;
  font-size: 0.9rem;
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: #4facfe;
    border-radius: 50%;
    animation: ${pulse} 2s infinite;
  }
`

const ChatMain = styled.div`
  flex: 1;
  display: flex;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
  }
`

const ConversationArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
`

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
`

const Message = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  animation: ${slideUp} 0.3s ease-out;
  ${props => props.fromUser ? 'flex-direction: row-reverse;' : ''}
`

const MessageAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${props => props.fromUser ? 
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' : 
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
`

const MessageContent = styled.div`
  max-width: 70%;
  padding: 1rem 1.25rem;
  border-radius: 16px;
  background: ${props => props.fromUser ? 
    'rgba(79, 172, 254, 0.1)' : 
    'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.fromUser ? 
    'rgba(79, 172, 254, 0.3)' : 
    'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.fromUser ? '#e0e0e0' : '#ffffff'};
  line-height: 1.6;
`

const InputArea = styled.form`
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 1rem;
`

const Input = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(79, 172, 254, 0.5);
  }
`

const SendButton = styled.button`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(79, 172, 254, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const SidePanel = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`

const QuickActions = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
`

const SectionTitle = styled.h3`
  color: white;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const QuickButton = styled.button`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(79, 172, 254, 0.5);
    transform: translateX(5px);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`

const ProgressCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
`

const ProgressStep = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  opacity: ${props => props.completed ? '1' : '0.5'};
  
  &:last-child {
    margin-bottom: 0;
  }
`

const StepIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.completed ? 
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' : 
    'rgba(255, 255, 255, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
`

const StepText = styled.div`
  color: ${props => props.completed ? '#ffffff' : '#b0b0b0'};
  font-size: 0.9rem;
`

const WelcomeMessage = styled.div`
  text-align: center;
  padding: 3rem;
  animation: ${slideUp} 0.5s ease-out;
`

const WelcomeTitle = styled.h2`
  color: white;
  font-size: 2rem;
  margin-bottom: 1rem;
`

const WelcomeSubtitle = styled.p`
  color: #b0b0b0;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
`

const ConversationStarters = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
`

const StarterCard = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.25rem;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(79, 172, 254, 0.5);
    transform: translateY(-2px);
  }
  
  .icon {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  .title {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
  
  .desc {
    font-size: 0.85rem;
    color: #b0b0b0;
  }
`

const LoadingDots = styled.span`
  &::after {
    content: '...';
    display: inline-block;
    animation: ${pulse} 1.5s infinite;
  }
`

function Chat() {
  const location = useLocation()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const [progress, setProgress] = useState({
    preferences: false,
    budget: false,
    features: false,
    saved: false
  })
  const messagesEndRef = useRef(null)
  
  const conversationStarters = [
    { icon: '🚗', title: 'First Car', desc: 'Help me find my first car' },
    { icon: '👨‍👩‍👧‍👦', title: 'Family Vehicle', desc: 'I need a family-friendly option' },
    { icon: '⚡', title: 'Electric', desc: 'Show me electric vehicles' },
    { icon: '💰', title: 'Budget Friendly', desc: 'Best value under $30k' },
  ]
  
  const quickActions = [
    "What's popular in my area?",
    "Compare SUVs vs Sedans",
    "Best fuel-efficient cars",
    "Most reliable brands",
    "Save my preferences"
  ]

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Check if we have an initial message from navigation
    if (location.state?.initialMessage) {
      handleSubmit(null, location.state.initialMessage)
      // Clear the state to prevent re-sending on refresh
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = async (e, messageOverride = null) => {
    if (e) e.preventDefault()
    const messageToSend = messageOverride || input
    if (!messageToSend.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      content: messageToSend,
      fromUser: true
    }
    
    setMessages(prev => [...prev, userMessage])
    if (!messageOverride) setInput('')
    setIsLoading(true)

    // Update progress based on message content
    if (messageToSend.toLowerCase().includes('suv') || messageToSend.toLowerCase().includes('sedan')) {
      setProgress(prev => ({ ...prev, preferences: true }))
    }
    if (messageToSend.match(/\$|budget|under|price/i)) {
      setProgress(prev => ({ ...prev, budget: true }))
    }
    if (messageToSend.match(/leather|heated|sunroof|awd|feature/i)) {
      setProgress(prev => ({ ...prev, features: true }))
    }

    // Create assistant message placeholder
    const assistantMessageId = Date.now().toString() + '-assistant'
    setMessages(prev => [...prev, {
      id: assistantMessageId,
      content: '',
      fromUser: false
    }])

    try {
      const response = await fetch('/api/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          conversation_id: conversationId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const convId = response.headers.get('X-Conversation-ID')
      if (convId) {
        setConversationId(convId)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data) {
              try {
                const parsed = JSON.parse(data)
                
                if (parsed.content) {
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId 
                      ? { ...msg, content: msg.content + parsed.content }
                      : msg
                  ))
                }
                
                if (parsed.event === 'preferences_saved') {
                  setProgress(prev => ({ ...prev, saved: true }))
                }
              } catch (e) {
                console.error('Error parsing SSE data:', e)
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { ...msg, content: 'Sorry, I encountered an error. Please try again.' }
          : msg
      ))
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (action) => {
    setInput(action)
    handleSubmit(null, action)
  }

  const handleStarter = (starter) => {
    const message = starter.desc
    handleSubmit(null, message)
  }

  return (
    <ChatContainer>
      <ChatHeader>
        <BackButton onClick={() => navigate('/')}>
          ← Back to Home
        </BackButton>
        <HeaderTitle>Car Finder Assistant</HeaderTitle>
        <StatusIndicator>AI Online</StatusIndicator>
      </ChatHeader>
      
      <ChatMain>
        <ConversationArea>
          <MessagesContainer>
            {messages.length === 0 ? (
              <WelcomeMessage>
                <WelcomeTitle>Let's Find Your Perfect Car! 🚗</WelcomeTitle>
                <WelcomeSubtitle>
                  I'm your personal car advisor. Tell me about your needs, and I'll help you find the ideal vehicle.
                </WelcomeSubtitle>
                <ConversationStarters>
                  {conversationStarters.map((starter, index) => (
                    <StarterCard key={index} onClick={() => handleStarter(starter)}>
                      <div className="icon">{starter.icon}</div>
                      <div className="title">{starter.title}</div>
                      <div className="desc">{starter.desc}</div>
                    </StarterCard>
                  ))}
                </ConversationStarters>
              </WelcomeMessage>
            ) : (
              <>
                {messages.map((message) => (
                  <Message key={message.id} fromUser={message.fromUser}>
                    <MessageAvatar fromUser={message.fromUser}>
                      {message.fromUser ? '👤' : '🤖'}
                    </MessageAvatar>
                    <MessageContent fromUser={message.fromUser}>
                      {message.content || <LoadingDots>Thinking</LoadingDots>}
                    </MessageContent>
                  </Message>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </MessagesContainer>
          
          <InputArea onSubmit={handleSubmit}>
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about cars..."
              disabled={isLoading}
            />
            <SendButton type="submit" disabled={!input.trim() || isLoading}>
              Send
              <span style={{ fontSize: '1.2rem' }}>→</span>
            </SendButton>
          </InputArea>
        </ConversationArea>
        
        <SidePanel>
          <ProgressCard>
            <SectionTitle>
              📊 Your Progress
            </SectionTitle>
            <ProgressStep completed={progress.preferences}>
              <StepIcon completed={progress.preferences}>
                {progress.preferences ? '✓' : '1'}
              </StepIcon>
              <StepText completed={progress.preferences}>
                Vehicle type preferences
              </StepText>
            </ProgressStep>
            <ProgressStep completed={progress.budget}>
              <StepIcon completed={progress.budget}>
                {progress.budget ? '✓' : '2'}
              </StepIcon>
              <StepText completed={progress.budget}>
                Budget range
              </StepText>
            </ProgressStep>
            <ProgressStep completed={progress.features}>
              <StepIcon completed={progress.features}>
                {progress.features ? '✓' : '3'}
              </StepIcon>
              <StepText completed={progress.features}>
                Must-have features
              </StepText>
            </ProgressStep>
            <ProgressStep completed={progress.saved}>
              <StepIcon completed={progress.saved}>
                {progress.saved ? '✓' : '4'}
              </StepIcon>
              <StepText completed={progress.saved}>
                Preferences saved
              </StepText>
            </ProgressStep>
          </ProgressCard>
          
          <QuickActions>
            <SectionTitle>
              ⚡ Quick Actions
            </SectionTitle>
            {quickActions.map((action, index) => (
              <QuickButton
                key={index}
                onClick={() => handleQuickAction(action)}
                disabled={isLoading}
              >
                {action}
              </QuickButton>
            ))}
          </QuickActions>
        </SidePanel>
      </ChatMain>
    </ChatContainer>
  )
}

export default Chat 