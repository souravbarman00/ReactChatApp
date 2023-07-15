import { useEffect, useState } from 'react';
import { Box, Heading, VStack,Container } from '@chakra-ui/react';
import { onSnapshot, query, collection } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import UserCard from '../components/UserCard';
import UserProfile from '../components/UserProfile';

const Home = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const usersRef = collection(db, 'users');
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const userList = [];
      snapshot.forEach((doc) => {
        const user = doc.data();
        userList.push(user);
      });
      setUsers(userList);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Box>
      <Container maxW="container.lg">
        <VStack spacing={6} align="stretch">
          <Heading as="h1" size="lg" textAlign="center">
            Registered Users
          </Heading>
          <Box ml="auto">
            <UserProfile />
          </Box>
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </VStack>
      </Container>
    </Box>
  );
};

export default Home;
