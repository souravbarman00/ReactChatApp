import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './chakra';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Login from './components/Auth/Login';
import GoogleSignIn from './components/Auth/GoogleSignIn';
import { useEffect } from 'react';
import Test from './components/Test';



const requestNotificationPermission = () => {
  return new Promise((resolve, reject) => {
    if (!('Notification' in window)) {
      reject(new Error('Browser does not support notifications'));
    } else if (Notification.permission === 'granted') {
      resolve();
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          resolve();
        } else {
          reject(new Error('Permission denied for notifications'));
        }
      });
    }
  });
};

function App() {
  useEffect(() => {
    requestNotificationPermission()
      .then(() => {
        console.log('Notification permission granted');
      })
      .catch((error) => {
        console.error('Error requesting notification permission:', error);
      });
  }, []);
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<GoogleSignIn />} />
          <Route path="/home" element={<Home />} />
          <Route path="/chat/:userId" element={<Chat />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<GoogleSignIn />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;