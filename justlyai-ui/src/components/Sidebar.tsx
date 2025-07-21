import React from "react";
import styled from "styled-components";
import { Plus, Folder, MessageSquare, Bot, Settings, ChevronLeft, Menu } from "lucide-react";
import { ChatPreview } from "../types";

// Sidebar width constants
const SIDEBAR_WIDTH = 300;
const SIDEBAR_COLLAPSED = 60;

// Sidebar container with slide animation
const SidebarContainer = styled.aside<{ collapsed: boolean }>`
  width: ${({ collapsed }) => (collapsed ? `${SIDEBAR_COLLAPSED}px` : `${SIDEBAR_WIDTH}px`)};
  background: #1e1e1e;
  color: #fff;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
  border-right: 1px solid #232323;
  box-shadow: ${({ collapsed }) => (collapsed ? "none" : "2px 0 8px rgba(0,0,0,0.04)")};
  overflow: hidden;
`;

// Toggle button always visible
const ToggleBtn = styled.button<{ collapsed: boolean }>`
  position: absolute;
  top: 16px;
  left: ${({ collapsed }) => (collapsed ? "12px" : "100%")};
  transform: ${({ collapsed }) => (collapsed ? "none" : "translateX(-100%)")};
  background: #232323;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 101;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  cursor: pointer;
  transition: left 0.3s, transform 0.3s, background 0.2s;
  &:hover, &:focus {
    background: #19c37d;
    color: #fff;
    outline: none;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 18px 16px 12px 16px;
  border-bottom: 1px solid #232323;
`;
const IconBtn = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  color: ${({ active }) => (active ? "#19c37d" : "#fff")};
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background 0.2s;
  &:hover, &:focus {
    background: #232323;
    outline: none;
  }
`;
const NewChatBtn = styled(IconBtn)`
  font-weight: 600;
  gap: 6px;
  background: #232323;
  color: #19c37d;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 1rem;
  margin-right: 8px;
`;
const Tabs = styled.div`
  display: flex;
  margin: 12px 0 0 0;
  border-bottom: 1px solid #232323;
`;
const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  background: none;
  border: none;
  color: ${({ active }) => (active ? "#19c37d" : "#aaa")};
  font-weight: 600;
  font-size: 1rem;
  padding: 10px 0;
  cursor: pointer;
  border-bottom: 2px solid ${({ active }) => (active ? "#19c37d" : "transparent")};
  transition: color 0.2s, border-bottom 0.2s;
  &:focus {
    outline: 2px solid #19c37d;
  }
`;
const ScrollSection = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 0 8px 0;
  min-height: 0;
`;
const ChatItem = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 18px;
  background: ${({ active }) => (active ? "#232323" : "none")};
  border-left: 3px solid ${({ active }) => (active ? "#19c37d" : "transparent")};
  cursor: pointer;
  transition: background 0.2s, border-left 0.2s;
  &:hover, &:focus {
    background: #232323;
    outline: none;
  }
`;
const ChatTitle = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 6px;
`;
const ChatMeta = styled.div`
  font-size: 0.85rem;
  color: #aaa;
  display: flex;
  align-items: center;
  gap: 8px;
`;
const CodePreview = styled.pre`
  background: #181818;
  color: #dcdcaa;
  font-size: 0.92rem;
  margin: 4px 0 0 0;
  padding: 6px 10px;
  border-radius: 6px;
  overflow-x: auto;
  font-family: 'Fira Mono', 'Consolas', monospace;
`;
const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-top: 1px solid #232323;
  background: #181818;
`;
const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #232323;
  color: #19c37d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
`;
const StatusDot = styled.span<{ online: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ online }) => (online ? "#19c37d" : "#aaa")};
  display: inline-block;
  margin-left: 6px;
`;

// Mock data for demonstration
const mockChats: ChatPreview[] = [
  {
    id: "1",
    title: "Refactor login logic",
    codeSnippet: "const login = async () => {\n  // ...\n}",
    timestamp: "2024-06-01T10:00:00Z",
    model: "GPT-4",
  },
  {
    id: "2",
    title: "Debug payment API",
    codeSnippet: "fetch('/api/payments')\n  .then(res => res.json())",
    timestamp: "2024-06-02T14:30:00Z",
    model: "Claude",
  },
];

interface SidebarProps {
  chats?: ChatPreview[];
  onNewChat?: () => void;
  onSelectChat?: (id: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  userName?: string;
  userInitials?: string;
  online?: boolean;
  activeChatId?: string | null;
  onFileUpload?: (file: File) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  chats = mockChats,
  onNewChat = () => {},
  onSelectChat = () => {},
  collapsed = false,
  onToggleCollapse = () => {},
  userName = "Dev User",
  userInitials = "DU",
  online = true,
  activeChatId = null,
  onFileUpload = () => {},
}) => {
  // File input ref
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Handle folder icon click
  const handleFolderClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <SidebarContainer collapsed={collapsed} aria-label="Sidebar" role="navigation">
      {/* Toggle button: Hamburger when closed, arrow when open */}
      <ToggleBtn
        onClick={onToggleCollapse}
        collapsed={collapsed}
        aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
        tabIndex={0}
      >
        {collapsed ? <Menu size={22} /> : <ChevronLeft size={22} />}
      </ToggleBtn>
      {/* Sidebar content only visible when open */}
      {!collapsed && (
        <>
          <Header>
            <NewChatBtn onClick={onNewChat} aria-label="New Chat">
              <Plus size={18} /> New Chat
            </NewChatBtn>
            {/* Folder icon triggers file input */}
            <IconBtn aria-label="Upload File" onClick={handleFolderClick}>
              <Folder size={20} />
            </IconBtn>
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </Header>
          <Tabs role="tablist">
            <Tab
              active={true}
              onClick={() => {}}
              role="tab"
              aria-selected={true}
              tabIndex={0}
            >
              <MessageSquare size={16} style={{ marginRight: 4 }} /> Chats
            </Tab>
          </Tabs>
          <ScrollSection>
            {chats.length === 0 ? (
              <ChatMeta style={{ padding: "18px" }}>No chats yet</ChatMeta>
            ) : (
              chats.map((chat) => (
                <ChatItem
                  key={chat.id}
                  active={activeChatId === chat.id}
                  tabIndex={0}
                  role="button"
                  aria-pressed={activeChatId === chat.id}
                  onClick={() => onSelectChat(chat.id)}
                >
                  <ChatTitle>
                    <Bot size={16} style={{ marginRight: 4 }} />
                    {chat.title}
                    <span style={{ marginLeft: "auto", fontSize: 12, color: "#19c37d" }}>{chat.model}</span>
                  </ChatTitle>
                  <ChatMeta>
                    {new Date(chat.timestamp).toLocaleString()} {/* Timestamp */}
                  </ChatMeta>
                  {chat.codeSnippet && (
                    <CodePreview aria-label="Code preview">
                      {chat.codeSnippet}
                    </CodePreview>
                  )}
                </ChatItem>
              ))
            )}
          </ScrollSection>
          <Footer>
            <Avatar aria-label="User profile">{userInitials}</Avatar>
            <span style={{ fontWeight: 500 }}>{userName}</span>
            <IconBtn aria-label="Settings">
              <Settings size={20} />
            </IconBtn>
            <StatusDot online={online} title={online ? "Online" : "Offline"} />
          </Footer>
        </>
      )}
    </SidebarContainer>
  );
};

export default Sidebar; 