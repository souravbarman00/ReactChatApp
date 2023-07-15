import { Button, VStack } from '@chakra-ui/react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider, db } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import chatLogo from './chat-logo.png';

const MotionVStack = motion(VStack);

const GoogleSignIn = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // Handle successful sign-in
        const user = result.user;

        // Store user data in the database
        const userRef = doc(db, 'users', user.uid);
        setDoc(userRef, {
          id: user.uid,
          name: user.displayName,
          picture: user.photoURL,
        });



        // Redirect to Home
        navigate('/home');
      })
      .catch((error) => {
        // Handle sign-in error
        console.error(error);
      });
  };

  const logoAnimation = {
    scale: [1, 1.1, 1],
    rotate: [0, 0, 360],
  };

  return (
    <VStack bg="blue.500" justifyContent="center" h="100vh" p={6}>
      <MotionVStack
        as="div"
        initial={{ scale: 1 }}
        animate={logoAnimation}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <img src={chatLogo} alt="Chat Logo" style={{ width: '80px', borderRadius: '50%' }} />
      </MotionVStack>
      <Button
        colorScheme="teal"
        onClick={handleSignIn}
        leftIcon={<img src={chatLogo} alt="Chat Logo" style={{ width: '24px' }} />}
        _hover={{ bg: 'teal.600' }}
        _active={{ bg: 'teal.700' }}
        _focus={{ outline: 'none' }}
        animation="pulse"
        transition="all 0.2s ease-in-out"
        boxShadow="lg"
      >
        Sign in with Google
      </Button>
    </VStack>
  );
};

export default GoogleSignIn;
