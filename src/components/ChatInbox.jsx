import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, Send, MessageSquare } from 'lucide-react';

export default function ChatInbox({ 
  isOpen, 
  onClose, 
  chats, 
  onSendMessage 
}) {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [typedMessage, setTypedMessage] = useState('');
  const chatEndRef = useRef(null);

  const activeChat = chats.find(c => c.id === selectedChatId);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChat?.messages]);

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!typedMessage.trim() || !selectedChatId) return;

    onSendMessage(selectedChatId, typedMessage);
    setTypedMessage('');
  };

  return (
    <div className="sidebar-drawer-overlay" onClick={onClose}>
      <div className="drawer-container glass-panel" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {selectedChatId && (
              <button 
                className="drawer-close-btn" 
                onClick={() => setSelectedChatId(null)}
                style={{ marginRight: '4px' }}
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <h2 className="drawer-title">
              {selectedChatId ? activeChat?.sellerName : 'Messages'}
            </h2>
          </div>
          <button className="drawer-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: selectedChatId ? '0' : '20px' }}>
          
          {!selectedChatId ? (
            /* Chats List */
            <div className="chat-inbox-list">
              {chats.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  <MessageSquare size={36} style={{ marginBottom: '12px', opacity: 0.5 }} />
                  <p>No conversations yet</p>
                </div>
              ) : (
                chats.map((chat) => {
                  const lastMsg = chat.messages[chat.messages.length - 1];
                  return (
                    <div 
                      key={chat.id}
                      className="chat-inbox-card glass-panel"
                      onClick={() => setSelectedChatId(chat.id)}
                    >
                      <div className="chat-avatar-wrapper">
                        <img src={chat.sellerAvatar} alt={chat.sellerName} className="chat-avatar" />
                        <div className={`chat-status-dot-overlay ${chat.status}`} />
                      </div>
                      
                      <div className="chat-inbox-card-details">
                        <div className="chat-inbox-header">
                          <span className="chat-inbox-name">{chat.sellerName}</span>
                          <span className="chat-inbox-time">{lastMsg?.time || '1d ago'}</span>
                        </div>
                        <span className="chat-inbox-title">{chat.itemTitle}</span>
                        <span className="chat-inbox-last-msg">{lastMsg?.text || 'No messages yet'}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            /* Selected Chat Window */
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: 'calc(100vh - 150px)' }}>
              
              {/* Product Info Bar */}
              <div style={{ padding: '12px 20px', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Inquiring About</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>
                    {activeChat?.itemTitle}
                  </div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-primary)', marginLeft: '12px' }}>
                  ${activeChat?.itemPrice.toLocaleString()}
                </div>
              </div>

              {/* Messages Log */}
              <div className="chat-panel-body" style={{ flex: 1, height: 'auto' }}>
                {activeChat?.messages.map((msg, index) => (
                  <div key={index} className={`chat-msg ${msg.sender}`}>
                    <div>{msg.text}</div>
                    <div className="chat-msg-time">{msg.time}</div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Footer */}
              <form className="chat-panel-footer" onSubmit={handleSend}>
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="chat-panel-input"
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                />
                <button type="submit" className="chat-panel-send-btn">
                  <Send size={14} />
                </button>
              </form>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
