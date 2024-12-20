import React, { useEffect, useState } from 'react';
import './App.css';
import ChatScreen from './chatScreen';
import Login from './login';
import {SocketConnector} from './socketConnector';
import { CreateAndShowRooms } from './roomJoiner';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = new SocketConnector('http://localhost:3001');
    setSocket(newSocket);
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedUserName = localStorage.getItem('userName');

    if (storedIsLoggedIn && storedUserName) {
      setIsLoggedIn(true);
      setUserName(storedUserName);
    }

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleLoginSuccess = (userName) => {
    console.log('Login successful:', userName);
    setUserName(userName);
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', userName);
    if (socket) {
      socket.sendMessage({ type: 'user-join', userName });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    if (socket) {
      socket.sendMessage({ type: 'user-leave', userName });
    }
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        // <ChatScreen userName={userName} onLogout={handleLogout} socket={socket} />
        <CreateAndShowRooms userName={userName} onLogout={handleLogout} socket={socket}/>
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
