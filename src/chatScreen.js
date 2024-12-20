import React, { useState, useEffect, useRef } from 'react';
import './chatScreen.css';

function ChatScreen({ userName, onLogout, socket }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        socket.onMessage("message", (message) => {
            const parsedMessage = JSON.parse(message);
            setMessages((prevMessages) => [...prevMessages, parsedMessage]);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() !== '') {
            const message = {
                id: Date.now(),
                sender: userName,
                text: newMessage,
                timestamp: new Date().toLocaleTimeString(),
            };
            socket.sendMessage(JSON.stringify(message));
        }
    };

    return (
        <div className="chat-screen">
            <div className="chat-messages">
                {messages.map((message) => (
                    <div key={message.id} className={`message ${message.sender === userName ? 'sent' : 'received'}`}>
                        <span className="message-sender">{message.sender}</span>
                        <p>{message.text}</p>
                        <span className="message-timestamp">{message.timestamp}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="chat-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

export default ChatScreen;

