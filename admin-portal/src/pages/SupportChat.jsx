import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';

import toast from 'react-hot-toast';
export default function SupportChat() {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const chatBottomRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchSessions();

    const sub = supabase
      .channel('public:cb_support_sessions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cb_support_sessions' }, payload => {
        fetchSessions();
      })
      .subscribe();

    return () => { supabase.removeChannel(sub); };
  }, []);

  const fetchSessions = async () => {
    const { data, error } = await supabase
      .from('cb_support_sessions')
      .select('*')
      .order('last_message_at', { ascending: false });
    
    if (!error && data) {
      setSessions(data);
    }
  };

  useEffect(() => {
    if (!activeSession) return;

    fetchMessages(activeSession.id);

    // Mark as read
    supabase.from('cb_support_sessions').update({ unread_admin_count: 0 }).eq('id', activeSession.id).then();

    const sub = supabase
      .channel(`public:cb_support_messages:session_id=eq.${activeSession.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'cb_support_messages', filter: `session_id=eq.${activeSession.id}` }, payload => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => { supabase.removeChannel(sub); };
  }, [activeSession]);

  const fetchMessages = async (sessionId) => {
    const { data, error } = await supabase
      .from('cb_support_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
    
    if (!error && data) setMessages(data);
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !activeSession) return;

    const text = inputMsg;
    setInputMsg('');

    const newMsg = {
      session_id: activeSession.id,
      sender: 'admin',
      content: text
    };

    const { error } = await supabase.from('cb_support_messages').insert([newMsg]);
    if (error) {
      toast.error("Failed to send message: " + error.message);
      return;
    }

    // Update session
    await supabase.from('cb_support_sessions').update({
      last_message_at: new Date().toISOString()
    }).eq('id', activeSession.id);
  };

  const handleImageUpload = async (event) => {
    try {
      if (!event.target.files || event.target.files.length === 0 || !activeSession) {
        return;
      }
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${activeSession.id}-admin-${Date.now()}.${fileExt}`;
      const filePath = `chat/${fileName}`;

      setUploading(true);

      const { error: uploadError } = await supabase.storage
        .from('cb_storage')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('cb_storage')
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      const newMsg = {
        session_id: activeSession.id,
        sender: 'admin',
        content: '',
        image_url: imageUrl
      };

      await supabase.from('cb_support_messages').insert([newMsg]);
      await supabase.from('cb_support_sessions').update({
        last_message_at: new Date().toISOString()
      }).eq('id', activeSession.id);

    } catch (error) {
      toast.error('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-page-container scale-up" style={{ display: 'flex', flexDirection: 'row', gap: 24, height: 'calc(100vh - 120px)' }}>
      {/* Session List */}
      <div className="admin-card" style={{ width: 320, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <h3 className="section-title">Support Sessions</h3>
        <div style={{ flex: 1, overflowY: 'auto', marginTop: 12 }}>
          {sessions.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No active sessions.</p>
          ) : (
            sessions.map(s => (
              <div 
                key={s.id} 
                onClick={() => setActiveSession(s)}
                style={{
                  padding: 12,
                  marginBottom: 8,
                  borderRadius: 8,
                  backgroundColor: activeSession?.id === s.id ? 'var(--bg-app)' : 'transparent',
                  border: `1px solid ${activeSession?.id === s.id ? 'var(--border-color-focus)' : 'var(--border-color)'}`,
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 14 }}>{s.user_username}</div>
                <div style={{ fontSize: 11, color: 'var(--text-light)' }}>
                  {new Date(s.last_message_at).toLocaleTimeString()}
                </div>
                {s.unread_admin_count > 0 && (
                  <div style={{ position: 'absolute', right: 12, top: 12, background: 'var(--color-danger)', color: 'white', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 'bold' }}>
                    {s.unread_admin_count}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="admin-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        {activeSession ? (
          <>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', fontWeight: 600 }}>
              Chatting with {activeSession.user_username}
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {messages.map(m => {
                const isAdmin = m.sender === 'admin';
                return (
                  <div key={m.id} style={{ display: 'flex', justifyContent: isAdmin ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '70%',
                      padding: m.image_url ? '8px' : '10px 16px',
                      borderRadius: 16,
                      backgroundColor: isAdmin ? 'var(--color-primary)' : '#f1f5f9',
                      color: isAdmin ? '#ffffff' : 'var(--text-color)',
                      fontSize: 14
                    }}>
                      {m.image_url ? (
                        <img src={m.image_url} alt="Attachment" style={{ maxWidth: '100%', borderRadius: 8, display: 'block' }} />
                      ) : null}
                      {m.content && <div style={{ marginTop: m.image_url ? 8 : 0 }}>{m.content}</div>}
                      <div style={{ fontSize: 10, marginTop: 4, opacity: 0.7, textAlign: isAdmin ? 'right' : 'left' }}>
                        {new Date(m.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            <form onSubmit={handleSend} style={{ padding: 16, borderTop: '1px solid var(--border-color)', display: 'flex', gap: 12, alignItems: 'center' }}>
              <button 
                type="button" 
                onClick={() => !uploading && fileInputRef.current?.click()}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-admin-muted)', padding: 4 }}
                title="Attach Image"
              >
                {uploading ? (
                  <span style={{ fontSize: 12 }}>...</span>
                ) : (
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                )}
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="image/*" 
                onChange={handleImageUpload} 
              />
              <input 
                type="text" 
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Type your message..."
                style={{ flex: 1, padding: '10px 16px', borderRadius: 20, border: '1px solid var(--border-color)', outline: 'none' }}
              />
              <button type="submit" className="btn-admin-primary" style={{ borderRadius: 20, padding: '0 24px' }}>
                Send
              </button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Select a session from the left to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
