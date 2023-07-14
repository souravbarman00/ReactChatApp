// src/pages/Home.js
import { useEffect, useState } from 'react';
import { Box, Heading, VStack } from '@chakra-ui/react';
import { onSnapshot, query, collection } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import UserCard from '../components/UserCard';

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
      <Heading mb={4}>Registered Users</Heading>
      <VStack spacing={4} align="stretch">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </VStack>
    </Box>
  );
};

export default Home;
