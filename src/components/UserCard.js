import { useEffect, useState } from 'react';
import { Box, Avatar, Text, VStack } from '@chakra-ui/react';
import { collection, query, getDocs, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';

const UserCard = ({ user }) => {
  const [latestMessage, setLatestMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestMessage = async () => {
      try {
        const chatRef = collection(db, 'chats', user.id, 'messages');
        const chatQuery = query(chatRef, orderBy('timestamp', 'desc'), limit(1));
        const chatSnapshot = await getDocs(chatQuery);
        const latestMessage = chatSnapshot.docs[0]?.data()?.content || '';
        setLatestMessage(latestMessage);
      } catch (error) {
        console.error('Error fetching latest message:', error);
      }
    };

    fetchLatestMessage();
  }, [user.id]);

  const handleCardClick = () => {
    navigate(`/chat/${user.id}`);
  };

  return (
    <Box
      p={2}
      display="flex"
      alignItems="center"
      borderBottom="1px"
      borderColor="gray.200"
      cursor="pointer"
      onClick={handleCardClick}
    >
      <Avatar size="md" src={user.picture} alt={user.name} mr={4} />
      <VStack align="flex-start">
        <Text>{user.name}</Text>
        <Text color="gray.500" fontSize="sm">
          {latestMessage}
        </Text>
      </VStack>
    </Box>
  );
};

export default UserCard;
