import { auth,db } from '../firebase/firebase';
import { collectionGroup, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc,setDoc,where,collection } from 'firebase/firestore';
import React from 'react'
import { Box, Button, Container, Input, VStack } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

const Test = ({ currentUserId="121xad", otherUserId='13dsadada' }) => {
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState([]);
  
    useEffect(() => {
        const chatQuery = query(
          collectionGroup(db, 'messageList'),
          where('currentUserId', '==', currentUserId),
          where('otherUserId', '==', otherUserId),
          orderBy('timestamp')
        );
    
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
      }, [currentUserId, otherUserId]);
    
      const sendMessage = async (e) => {
        e.preventDefault();
        if (messageInput.trim() !== '') {
          const newMessage = {
            content: messageInput.trim(),
            timestamp: new Date().getTime(),
            currentUserId: currentUserId,
            otherUserId: otherUserId,
          };
    
          try {
            await addDoc(collection(db, 'chats', 'messageList'), newMessage);
            setMessageInput('');
          } catch (error) {
            console.error('Error sending message:', error);
          }
        }
      };
  
    return (
        <Box>
        <form onSubmit={sendMessage}>
          <Input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message"
          />
          <Button type="submit">Send</Button>
        </form>
      </Box>
    );
  };
  

export default Test