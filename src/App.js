import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './chakra';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Login from './components/Auth/Login';
import GoogleSignIn from './components/Auth/GoogleSignIn';

function App() {

  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat/:userId" element={<Chat />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<GoogleSignIn />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;