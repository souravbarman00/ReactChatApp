import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Text, Container, Heading, HStack, VStack, FormControl, Input, Button, Stack, Avatar } from '@chakra-ui/react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { format, formatRelative } from 'date-fns';

const Chat = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const divForScroll = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const chatRef = collection(db, 'chats');
    const chatQuery = query(chatRef, orderBy('timestamp'));

    const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
      const messageList = [];
      snapshot.forEach((doc) => {
        const message = doc.data();
        messageList.push(message);
      });
      setMessages(messageList);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchOtherUser = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setOtherUser(userData);
        }
      } catch (error) {
        console.error('Error fetching other user data:', error);
      }
    };

    fetchOtherUser();
  }, [userId]);

  const currentUserId = auth.currentUser ? auth.currentUser.uid : null;

  const isSelfChat = userId === currentUserId;

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/signup');
    }
  }, [navigate]);

  const getMessageContainerStyles = (isCurrentUser) => ({
    alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
    background: isCurrentUser ? 'blue.200' : 'green.200',
    color: isCurrentUser ? 'white' : 'black',
    borderRadius: 'md',
    p: 2,
    maxWidth: '70%',
    wordBreak: 'break-word',
  });

  const sendMessage = async (e) => {
    e.preventDefault();
    if (messageInput.trim() !== '') {
      const newMessage = {
        content: messageInput.trim(),
        timestamp: serverTimestamp(),
        userId: currentUserId,
        otherUserId: userId,
      };

      try {
        const chatRef = collection(db, 'chats');
        await addDoc(chatRef, newMessage);
        setMessageInput('');
        divForScroll.current.scrollIntoView({ behavior: 'smooth' });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/signup');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Container h={'100vh'} bg={'white'}>
      <Box display="flex" alignItems="center" mb={4}>
        {otherUser && <Avatar size="md" src={otherUser.picture} alt={otherUser.name} mr={4} />}
        <Heading size="md">{otherUser ? otherUser.name : 'Loading...'}</Heading>
        <Button type='submit' colorScheme="blue" padding={5} margin={5} onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <VStack>
        {messages.map((message, index) =>
          (message.userId === currentUserId && message.otherUserId === userId) ||
          (message.userId === userId && message.otherUserId === currentUserId) ? (
            <Box
              key={index}
              {...getMessageContainerStyles(message.userId === currentUserId)}
            >
              <Box display="flex" justifyContent="space-between">
                <Text size="md" mr={6}>
                  {message.content}
                </Text>
                <Box color="gray.500" fontSize="xs">
                  {}
                </Box>
              </Box>
            </Box>
          ) : null
        )}
        <div ref={divForScroll}></div>
      </VStack>

      {!isSelfChat ? (
        <form onSubmit={(e) => e.preventDefault()}>
          <HStack>
            <FormControl isRequired>
              <Input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message..."
              />
            </FormControl>
            <Button type="submit" colorScheme="blue" onClick={sendMessage}>
              Send
            </Button>
          </HStack>
        </form>
      ) : (
        'Not allowed to chat with yourself'
      )}
    </Container>
  );
};

export default Chat;
