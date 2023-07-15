import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebase';

const UserProfile = () => {
  const [user] = useAuthState(auth);

  return (
    <Flex align="center" ml="auto">
      <Avatar size="sm" src={user.photoURL} alt={user.displayName} mr={2} />
      <Text fontSize="sm" fontWeight="bold">
        {user.displayName}
      </Text>
    </Flex>
  );
};

export default UserProfile;
