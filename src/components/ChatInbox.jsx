import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, Send, MessageSquare } from 'lucide-react';

export default function ChatInbox({ 
  isOpen, 
  onClose, 
  chats, 
  onSendMessage,
  onSelectListing,
  listings
}) {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [typedMessage, setTypedMessage] = useState('');
  const [typingChatId, setTypingChatId] = useState(null);
  const chatEndRef = useRef(null);

  const activeChat = chats.find(c => c.id === selectedChatId);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChat?.messages, typingChatId]);

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!typedMessage.trim() || !selectedChatId) return;

    onSendMessage(selectedChatId, typedMessage);
    setTypedMessage('');

    // Trigger local simulated seller typing status
    setTypingChatId(selectedChatId);
    setTimeout(() => {
      setTypingChatId(null);
    }, 1500);
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
                <div className="chat-empty-state">
                  <div className="lottie-svg-wrapper">
                    <svg className="chat-empty-svg" viewBox="0 0 100 100" width="100" height="100">
                      <defs>
                        <radialGradient id="chatGrad" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      <circle cx="50" cy="50" r="45" fill="url(#chatGrad)" />
                      {/* Left message bubble */}
                      <g className="empty-chat-left-bubble">
                        <rect x="25" y="32" width="34" height="22" rx="10" fill="var(--bg-tertiary)" stroke="var(--border-color)" strokeWidth="1.5" />
                        <polygon points="32,54 28,62 38,54" fill="var(--bg-tertiary)" stroke="var(--border-color)" strokeWidth="1.5" strokeLinejoin="miter" />
                        <line x1="33" y1="40" x2="51" y2="40" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                        <line x1="33" y1="46" x2="45" y2="46" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                      </g>
                      {/* Right message bubble */}
                      <g className="empty-chat-right-bubble">
                        <rect x="42" y="44" width="34" height="22" rx="10" fill="var(--color-primary-light)" stroke="var(--color-primary)" strokeWidth="1.5" />
                        <polygon points="68,66 72,74 62,66" fill="var(--color-primary-light)" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinejoin="miter" />
                        <circle className="dot-blink-1" cx="50" cy="55" r="2" fill="var(--color-primary)" />
                        <circle className="dot-blink-2" cx="59" cy="55" r="2" fill="var(--color-primary)" />
                        <circle className="dot-blink-3" cx="68" cy="55" r="2" fill="var(--color-primary)" />
                      </g>
                    </svg>
                  </div>
                  <h4 className="chat-empty-title">Inbox is Empty</h4>
                  <p className="chat-empty-desc">Send offers or messages to sellers to start a luxury negotiation!</p>
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
              <div 
                className="chat-product-info-bar"
                onClick={() => {
                  if (activeChat && onSelectListing && listings) {
                    const targetItem = listings.find(item => item.id === activeChat.listingId);
                    if (targetItem) {
                      onSelectListing(targetItem);
                      onClose();
                    }
                  }
                }}
                style={{ 
                  padding: '12px 20px', 
                  background: 'var(--bg-tertiary)', 
                  borderBottom: '1px solid var(--border-color)', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
              >
                <div style={{ overflow: 'hidden', flex: 1 }}>
                  <div style={{ fontSize: '10px', color: 'var(--color-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Inquiring About</span>
                    <span style={{ fontSize: '9px', background: 'var(--color-primary-light)', padding: '1px 5px', borderRadius: '4px' }}>View Details</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>
                    {activeChat?.itemTitle}
                  </div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-primary)', marginLeft: '12px', whiteSpace: 'nowrap' }}>
                  ${activeChat?.itemPrice.toLocaleString()}
                </div>
              </div>

              <div className="chat-panel-body" style={{ flex: 1, height: 'auto' }}>
                {activeChat?.messages.map((msg, index) => (
                  <div key={index} className={`chat-msg ${msg.sender}`}>
                    <div>{msg.text}</div>
                    <div className="chat-msg-time">{msg.time}</div>
                  </div>
                ))}
                {typingChatId === selectedChatId && (
                  <div className="chat-msg seller typing" style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
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
