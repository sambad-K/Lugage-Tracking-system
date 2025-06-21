import React, { useState, useEffect, useRef } from 'react';
import './Bot.css';

function Bot({ onClose }) {
    const [userMessage, setUserMessage] = useState('');
    const [messages, setMessages] = useState(() => {
        const sessionID = sessionStorage.getItem('sessionID');
        if (!sessionID) {

            const newSessionID = Date.now().toString();
            sessionStorage.setItem('sessionID', newSessionID);
            
            localStorage.removeItem('chatMessages');
        }
        
        const storedMessages = localStorage.getItem('chatMessages');
        return storedMessages ? JSON.parse(storedMessages) : [{ sender: 'bot', text: 'Hey, I am your assistant to help you. Ask any query!' }];
    });
    const [isTyping, setIsTyping] = useState(false);
    const [showTypingIndicator, setShowTypingIndicator] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const chatLogRef = useRef(null);
    const botRef = useRef(null);

   
    useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }, [messages]);

   
    useEffect(() => {
        if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
        }
    }, [messages]);

   
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (botRef.current && !botRef.current.contains(event.target)) {
                handleClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSendMessage = async () => {
        if (!userMessage.trim()) return;

        const newMessages = [...messages, { sender: 'user', text: userMessage }];
        setMessages(newMessages);
        setUserMessage('');

        setIsTyping(true);
        setShowTypingIndicator(true);

       
        setTimeout(async () => {
            try {
                
                const response = await fetch('http://localhost:3000/webhook', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: userMessage }),
                });
                const result = await response.json();

                
                const emailPattern = /developers\.lts@fix\.com/;
                let replyText = result.reply;
                if (emailPattern.test(replyText)) {
                
                    replyText = replyText.replace(
                        emailPattern,
                        '<a href="mailto:developers.lts@fix.com">developers.lts@fix.com</a>'
                    );
                }

                setMessages([...newMessages, { sender: 'bot', text: replyText }]);
            } catch (error) {
                console.error('Error:', error);
                setMessages([...newMessages, { sender: 'bot', text: 'Error communicating with server.' }]);
            }
            setIsTyping(false);
            setShowTypingIndicator(false);
        }, 1400); 
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const handleCloseClick = () => {
        handleClose(); 
    };

    const handleClose = () => {
        setFadeOut(true);
        setTimeout(() => {
            onClose(); 
        }, 300); 
    };

    return (
        <div className={`bot-container ${fadeOut ? 'fade-out' : ''}`} ref={botRef}>
            <div className="chat-container">
                <div className="chat-header">
                    Chat with Us
                    <button onClick={handleCloseClick} className="close-button">✖</button>
                </div>
                <div className="chat-log" ref={chatLogRef}>
                    {messages.map((message, index) => (
                        <div key={index} className={`chat-message ${message.sender}`}>
                            <span dangerouslySetInnerHTML={{ __html: message.text }}></span>
                        </div>
                    ))}
                    {showTypingIndicator && (
                        <div className="chat-message bot typing-indicator">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                        </div>
                    )}
                </div>
                <div className="chat-input">
                    <input
                        type="text"
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type a message..."
                    />
                    <button onClick={handleSendMessage} className="send-button">→</button> 
                </div>
            </div>
        </div>
    );
}

export default Bot;
