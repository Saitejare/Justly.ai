import React from 'react';
import MessageBubble from './MessageBubble';
import './ChatArea.css';

interface ChatAreaProps {
  messages: { role: 'user' | 'assistant'; content: string }[];
  typing: boolean;
}

const ChatArea: React.FC<ChatAreaProps> = ({ messages, typing }) => {
  return (
    <main className="chat-area">
      {messages.length === 0 && (
        <div className="welcome">
          <div>👋 Hi! I'm JustlyAI, here to guide you through legal issues—no lawyer needed.</div>
        </div>
      )}
      {messages.map((msg, i) => (
        <MessageBubble key={i} message={msg} />
      ))}
      {typing && <div className="typing">JustlyAI is typing<span className="dots">...</span></div>}
    </main>
  );
};

export default ChatArea; 