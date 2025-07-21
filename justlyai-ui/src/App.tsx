import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import InputBox from './components/InputBox';
import QuickActions from './components/QuickActions';
import styled from 'styled-components';
import './App.css';
import { ChatPreview } from './types';

// Sidebar widths for expanded/collapsed
const SIDEBAR_WIDTH = 300;
const SIDEBAR_COLLAPSED = 60;
const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed";
const CHAT_HISTORY_KEY = "chat-history";

// Main content wrapper to offset sidebar
const MainContent = styled.div<{ collapsed: boolean }>`
  margin-left: ${({ collapsed }) => (collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH)}px;
  transition: margin-left 0.25s cubic-bezier(0.4,0,0.2,1);
  min-height: 100vh;
  background: #fff;
  @media (max-width: 700px) {
    margin-left: 0;
  }
`;

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const App: React.FC = () => {
  const [language, setLanguage] = useState('English');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [voiceEnabled] = useState(false);
  // Sidebar collapsed state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Load sidebar state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (stored) setSidebarCollapsed(stored === "true");
  }, []);

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, sidebarCollapsed.toString());
  }, [sidebarCollapsed]);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CHAT_HISTORY_KEY);
    if (stored) setChats(JSON.parse(stored));
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chats));
  }, [chats]);

  // Load messages for the active chat
  useEffect(() => {
    if (activeChatId) {
      const stored = localStorage.getItem(`chat-messages-${activeChatId}`);
      setMessages(stored ? JSON.parse(stored) : []);
    } else {
      setMessages([]);
    }
  }, [activeChatId]);

  // Save messages for the active chat
  useEffect(() => {
    if (activeChatId) {
      localStorage.setItem(`chat-messages-${activeChatId}` , JSON.stringify(messages));
    }
  }, [messages, activeChatId]);

  // Modular API call to LLM endpoint
  const callLLMAPI = async (messages: ChatMessage[]) => {
    // Only send the latest user message for LLM
    const lastUserMessage = messages.filter(m => m.role === 'user').slice(-1)[0];
    const res = await fetch('http://localhost:5000/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: lastUserMessage.content }),
    });
    const data = await res.json();
    if (data.response) return data.response;
    throw new Error(data.error || 'LLM API error');
  };

  const sendMessage = async (msg: string) => {
    if (!msg.trim()) return;
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setTyping(true);
    try {
      const aiResponse = await callLLMAPI(newMessages);
      let displayResponse = aiResponse;
      if (typeof aiResponse === 'object') {
        displayResponse = JSON.stringify(aiResponse, null, 2);
      }
      setMessages([...newMessages, { role: 'assistant', content: displayResponse }]);
    } catch (err: any) {
      setMessages([...newMessages, { role: 'assistant', content: err.message || 'Sorry, there was an error connecting to the server.' }]);
    } finally {
      setTyping(false);
    }
  };

  const handleQuickAction = (action: string) => {
    if (action === 'emergency') sendMessage('I need emergency legal help.');
    if (action === 'settlement') sendMessage('Give me settlement tips.');
    if (action === 'court') sendMessage('How do I prepare for court?');
  };

  // When creating a new chat, add to history and set as active
  const handleNewChat = () => {
    const newChat: ChatPreview = {
      id: Date.now().toString(),
      title: `Chat ${chats.length + 1}`,
      codeSnippet: "",
      timestamp: new Date().toISOString(),
      model: "GPT-4",
    };
    setChats([newChat, ...chats]);
    setActiveChatId(newChat.id);
    setMessages([]);
    setTyping(false);
  };

  // When selecting a chat, load its messages
  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
  };

  // Handle file upload from Sidebar
  const handleFileUpload = (file: File) => {
    if (!activeChatId) return;
    const fileMsg = `📎 Uploaded file: ${file.name}`;
    setMessages((prev) => [...prev, { role: 'user', content: fileMsg }]);
  };

  return (
    <div>
      {/* Sidebar is always rendered, fixed on the left */}
      <Sidebar
        chats={chats}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        activeChatId={activeChatId}
        onFileUpload={handleFileUpload}
      />
      {/* Main content is offset by sidebar width */}
      <MainContent collapsed={sidebarCollapsed}>
        <Header language={language} setLanguage={setLanguage} collapsed={sidebarCollapsed} />
        <ChatArea messages={messages} typing={typing} />
        <QuickActions onAction={handleQuickAction} />
        <InputBox onSend={sendMessage} disabled={typing} />
      </MainContent>
    </div>
  );
};

export default App;
