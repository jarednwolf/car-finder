import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

const SocialContainer = styled.div`
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

const ReviewCard = styled.div`
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

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  margin-right: 0.75rem;
`

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`

const UserInfo = styled.div`
  flex: 1;
`

const UserName = styled.div`
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
`

const ReviewDate = styled.div`
  color: #b0b0b0;
  font-size: 0.8rem;
`

const StarRating = styled.div`
  display: flex;
  gap: 0.25rem;
  margin: 0.5rem 0;
`

const Star = styled.span`
  color: ${props => props.filled ? '#ffc107' : '#b0b0b0'};
  font-size: 1rem;
`

const ReviewText = styled.p`
  color: #e0e0e0;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0.5rem 0;
`

const CarMention = styled.span`
  color: #4facfe;
  font-weight: 600;
`

const CommunityStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
`

const StatNumber = styled.div`
  color: #4facfe;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`

const StatLabel = styled.div`
  color: #b0b0b0;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const ShareButton = styled.button`
  background: rgba(79, 172, 254, 0.1);
  border: 1px solid rgba(79, 172, 254, 0.3);
  color: #4facfe;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0.25rem;
  
  &:hover {
    background: rgba(79, 172, 254, 0.2);
    transform: translateY(-1px);
  }
`

const ExpertTip = styled.div`
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 12px;
  padding: 1rem;
  margin: 1rem 0;
`

const ExpertHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`

const ExpertBadge = styled.div`
  background: #ffc107;
  color: #000;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
`

function SocialFeatures({ car, userLocation }) {
  const [reviews, setReviews] = useState([])
  const [communityStats, setCommunityStats] = useState({})
  const [expertTips, setExpertTips] = useState([])

  useEffect(() => {
    // Simulate fetching social data
    const mockReviews = [
      {
        id: 1,
        user: { name: 'Sarah M.', avatar: 'SM' },
        rating: 5,
        date: '2 days ago',
        text: 'Found my dream car through Car Finder! The AI recommendations were spot on. Ended up with a beautiful BMW X5 that perfectly fits my family.',
        carMention: 'BMW X5'
      },
      {
        id: 2,
        user: { name: 'Mike R.', avatar: 'MR' },
        rating: 5,
        date: '1 week ago',
        text: 'Saved $3,000 with their financing recommendations. The process was smooth and the rates were unbeatable.',
        carMention: 'Mercedes GLE'
      },
      {
        id: 3,
        user: { name: 'Lisa K.', avatar: 'LK' },
        rating: 4,
        date: '3 days ago',
        text: 'Perfect match for my budget and lifestyle. The comparison feature helped me make the right choice.',
        carMention: 'Tesla Model Y'
      }
    ]

    const mockStats = {
      totalUsers: 15420,
      carsFound: 8934,
      moneySaved: 2840000,
      testDrives: 2156
    }

    const mockTips = [
      {
        expert: 'John Smith',
        title: 'Certified Auto Expert',
        tip: 'Consider total cost of ownership, not just purchase price. Electric vehicles often have lower long-term costs.',
        car: 'Electric Vehicles'
      },
      {
        expert: 'Maria Garcia',
        title: 'Luxury Car Specialist',
        tip: 'Don\'t skip the test drive! Even luxury cars can feel different than expected.',
        car: 'Luxury SUVs'
      }
    ]

    setReviews(mockReviews)
    setCommunityStats(mockStats)
    setExpertTips(mockTips)
  }, [car])

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleShare = (platform) => {
    const url = window.location.href
    const text = `Check out this amazing car I found on Car Finder!`
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    }
    
    window.open(shareUrls[platform], '_blank')
  }

  return (
    <div>
      {/* Community Stats */}
      <SocialContainer>
        <SectionTitle>👥 Community Impact</SectionTitle>
        <CommunityStats>
          <StatCard>
            <StatNumber>{communityStats.totalUsers?.toLocaleString()}</StatNumber>
            <StatLabel>Happy Users</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{communityStats.carsFound?.toLocaleString()}</StatNumber>
            <StatLabel>Cars Found</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{formatMoney(communityStats.moneySaved)}</StatNumber>
            <StatLabel>Money Saved</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{communityStats.testDrives?.toLocaleString()}</StatNumber>
            <StatLabel>Test Drives</StatLabel>
          </StatCard>
        </CommunityStats>
      </SocialContainer>

      {/* User Reviews */}
      <SocialContainer>
        <SectionTitle>⭐ Recent Success Stories</SectionTitle>
        {reviews.map(review => (
          <ReviewCard key={review.id}>
            <ReviewHeader>
              <UserAvatar>{review.user.avatar}</UserAvatar>
              <UserInfo>
                <UserName>{review.user.name}</UserName>
                <ReviewDate>{review.date}</ReviewDate>
              </UserInfo>
              <StarRating>
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} filled={star <= review.rating}>
                    ★
                  </Star>
                ))}
              </StarRating>
            </ReviewHeader>
            <ReviewText>
              {review.text.replace(review.carMention, (match) => (
                <CarMention key={match}>{match}</CarMention>
              ))}
            </ReviewText>
          </ReviewCard>
        ))}
      </SocialContainer>

      {/* Expert Tips */}
      <SocialContainer>
        <SectionTitle>💡 Expert Tips</SectionTitle>
        {expertTips.map((tip, index) => (
          <ExpertTip key={index}>
            <ExpertHeader>
              <ExpertBadge>Expert</ExpertBadge>
              <div>
                <div style={{ color: 'white', fontWeight: 600 }}>{tip.expert}</div>
                <div style={{ color: '#b0b0b0', fontSize: '0.8rem' }}>{tip.title}</div>
              </div>
            </ExpertHeader>
            <p style={{ color: '#e0e0e0', fontSize: '0.9rem', lineHeight: '1.5' }}>
              <strong style={{ color: '#ffc107' }}>Tip:</strong> {tip.tip}
            </p>
            <div style={{ color: '#4facfe', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              Related to: {tip.car}
            </div>
          </ExpertTip>
        ))}
      </SocialContainer>

      {/* Share Options */}
      <SocialContainer>
        <SectionTitle>📤 Share Your Experience</SectionTitle>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <ShareButton onClick={() => handleShare('twitter')}>
            🐦 Share on Twitter
          </ShareButton>
          <ShareButton onClick={() => handleShare('facebook')}>
            📘 Share on Facebook
          </ShareButton>
          <ShareButton onClick={() => handleShare('linkedin')}>
            💼 Share on LinkedIn
          </ShareButton>
        </div>
      </SocialContainer>
    </div>
  )
}

export default SocialFeatures