import React, { useState, useEffect } from 'react';
import './Bot.css';

function Bot() {
    const [userMessage, setUserMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    // Display initial greeting when the page loads
    useEffect(() => {
        setMessages([
            { sender: 'bot', text: 'Hey, I am your assistant to help you. Ask any query!' }
        ]);
    }, []);

    const handleSendMessage = async () => {
        if (!userMessage.trim()) return;

        const newMessages = [...messages, { sender: 'user', text: userMessage }];
        setMessages(newMessages);
        setUserMessage('');

        setIsTyping(true);

        // Simulate the typing delay (1 second) before bot response
        setTimeout(async () => {
            try {
                // Send user message to the backend
                const response = await fetch('http://localhost:3000/webhook', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: userMessage }),
                });
                const result = await response.json();

                // Check if the response contains an email link
                const emailPattern = /developers\.lts@fix\.com/;
                let replyText = result.reply;
                if (emailPattern.test(replyText)) {
                    // Make email clickable
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
        }, 1000);  // Simulate bot typing delay (1 second)
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">Chat with Us</div>
            <div className="chat-log">
                {messages.map((message, index) => (
                    <div key={index} className={`chat-message ${message.sender}`}>
                        <span dangerouslySetInnerHTML={{ __html: message.text }}></span>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type a message..."
                />
                <button onClick={handleSendMessage}>→</button>  {/* Send arrow */}
            </div>
        </div>
    );
}

export default Bot;
