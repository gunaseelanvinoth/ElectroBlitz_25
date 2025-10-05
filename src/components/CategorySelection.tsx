import React from 'react';
import styled, { keyframes, css } from 'styled-components';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const CategoryContainer = styled.div`
  text-align: center;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #ffffff;
`;

const Description = styled.p`
  color: #aaaaaa;
  margin-bottom: 3rem;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const CategoryCard = styled.button<{ isSelected: boolean }>`
  background: ${props => props.isSelected
        ? 'linear-gradient(45deg, #00d4ff, #ff00ff)'
        : 'rgba(255, 255, 255, 0.05)'};
  border: 2px solid ${props => props.isSelected
        ? 'transparent'
        : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 20px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  color: ${props => props.isSelected ? '#ffffff' : '#cccccc'};
  animation: ${fadeInUp} 0.6s ease-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 212, 255, 0.2);
    border-color: ${props => props.isSelected ? 'transparent' : '#00d4ff'};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }

  ${props => props.isSelected && css`
    animation: ${pulse} 2s ease-in-out infinite;
  `}
`;

const CategoryIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
`;

const CategoryTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const CategoryDescription = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
  line-height: 1.4;
`;

const EventCount = styled.div`
  margin-top: 1rem;
  font-size: 0.8rem;
  opacity: 0.7;
  font-weight: 600;
`;

interface CategorySelectionProps {
    selectedCategory: 'tech' | 'non-tech' | 'workshop' | '';
    onCategorySelect: (category: 'tech' | 'non-tech' | 'workshop') => void;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({
    selectedCategory,
    onCategorySelect
}) => {
    const categories = [
        {
            id: 'tech' as const,
            title: 'Technical Events',
            // description: 'Coding competitions, hackathons, robotics, and cutting-edge technology challenges',
            icon: '⚡',
            // eventCount: '25+ Events'
        },
        {
            id: 'non-tech' as const,
            title: 'Non-Technical Events',
            // description: 'Cultural events, management games, quizzes, and creative competitions',
            icon: '🎨',
            // eventCount: '15+ Events'
        },
        {
            id: 'workshop' as const,
            title: 'Workshops',
            // description: 'Hands-on learning sessions with industry experts and skill development',
            icon: '🔧',
            // eventCount: '10+ Workshops'
        }
    ];

    return (
        <CategoryContainer>
            <Title>Choose Your Category</Title>
            <Description>
                Select the type of events you're most interested in. You can participate in multiple categories!
            </Description>

            <CategoryGrid>
                {categories.map((category) => (
                    <CategoryCard
                        key={category.id}
                        isSelected={selectedCategory === category.id}
                        onClick={() => onCategorySelect(category.id)}
                    >
                        <CategoryIcon>{category.icon}</CategoryIcon>
                        <CategoryTitle>{category.title}</CategoryTitle>
                         {/* <CategoryDescription>{category.description}</CategoryDescription>  */}
                        {/* <EventCount>{category.eventCount}</EventCount> */}
                    </CategoryCard>
                ))}
            </CategoryGrid>
        </CategoryContainer>
    );
};

export default CategorySelection;




