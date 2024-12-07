import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  styled 
} from '@mui/material';
import { User } from '../../models/AdminModel'; // Import the User type

interface UserCardProps {
  user: User;
  onDeleteClick: () => void; // New prop for delete functionality
}

// Styled ActionButton with gradient text
const ActionButton = styled(Button)({
  background: 'linear-gradient(45deg, #FF69B4, #9370DB)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  '&:hover': {
    WebkitTextFillColor: '#FF69B4',
    background: 'rgba(255, 105, 180, 0.1)',
    borderRadius: '5px',
  },
});

// Styled Card with hover transition
const AnimatedCard = styled(Card)({
  transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth scaling and shadow transition
  '&:hover': {
    transform: 'translateY(-10px)', // Lift the card
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.15)', // Add shadow effect
  },
});

const UserCard: React.FC<UserCardProps> = ({ user, onDeleteClick }) => {
  return (
    <AnimatedCard sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {`${user.firstName} ${user.lastName}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Email: {user.email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Role: {user.role}
        </Typography>
        <ActionButton onClick={onDeleteClick}>Delete</ActionButton>
      </CardContent>
    </AnimatedCard>
  );
};

export default UserCard;
