import React from 'react';
import './MessageBubble.css';

interface MessageBubbleProps {
  message: { role: 'user' | 'assistant'; content: string };
}

// Formatter for assistant responses
function formatLegalResponse(response: string) {
  // Split by newlines, bold headings, or emoji section markers
  const lines = response.split(/\n|(?=\*\*)|(?=\u{1F4C8}|\u{1F4A1}|\u{1F3AF}|\u{2696}\uFE0F)/gu);
  const items: React.ReactNode[] = [];
  let bulletList: string[] = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    // Headings
    if (/^\*\*.*\*\*$/.test(trimmed)) {
      if (bulletList.length) {
        items.push(<ul key={`ul-${idx}`}>{bulletList.map((b, i) => <li key={i}>{b}</li>)}</ul>);
        bulletList = [];
      }
      items.push(<h4 key={idx}>{trimmed.replace(/\*\*/g, '')}</h4>);
      return;
    }
    // Bullet points
    if (trimmed.startsWith('•')) {
      bulletList.push(trimmed.replace(/^•\s*/, ''));
      return;
    }
    // Emoji section
    if (/^\p{Emoji}/u.test(trimmed)) {
      if (bulletList.length) {
        items.push(<ul key={`ul-${idx}`}>{bulletList.map((b, i) => <li key={i}>{b}</li>)}</ul>);
        bulletList = [];
      }
      items.push(<div key={idx} style={{ marginTop: 8, fontWeight: 'bold' }}>{trimmed}</div>);
      return;
    }
    // Paragraph
    if (trimmed) {
      if (bulletList.length) {
        items.push(<ul key={`ul-${idx}`}>{bulletList.map((b, i) => <li key={i}>{b}</li>)}</ul>);
        bulletList = [];
      }
      items.push(<p key={idx}>{trimmed}</p>);
    }
  });
  if (bulletList.length) {
    items.push(<ul key={`ul-last`}>{bulletList.map((b, i) => <li key={i}>{b}</li>)}</ul>);
  }
  return <div>{items}</div>;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  return (
    <div className={message.role === 'user' ? 'bubble user' : 'bubble assistant'}>
      {message.role === 'assistant'
        ? formatLegalResponse(message.content)
        : message.content}
    </div>
  );
};

export default MessageBubble; 