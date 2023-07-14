// src/components/Auth/GoogleSignIn.js
import { Button,VStack } from '@chakra-ui/react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider, db } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';

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

        console.log(user);

        // Redirect to Home
        navigate('/');
      })
      .catch((error) => {
        // Handle sign-in error
        console.error(error);
      });
  };

  return (
    <VStack bg="white" justifyContent={"center"} h="100vh">
      <Button colorScheme="blue" onClick={handleSignIn}>
      Sign in with Google
    </Button>
    </VStack>
    
  );
};

export default GoogleSignIn;
