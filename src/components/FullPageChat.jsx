import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Send, Paperclip, Smile, MoreVertical, Phone, Video, Search, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FullPageChat = ({ messages = [], onSendMessage, onMarkSeen, currentUser, onBack }) => {
    const [newMessage, setNewMessage] = useState('');
    // On mobile, start with no user selected to show the list first
    const [selectedUser, setSelectedUser] = useState(window.innerWidth > 768 ? (currentUser === 'him' ? 'her' : 'him') : null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Mark messages as seen
    useEffect(() => {
        if (!onMarkSeen || !currentUser) return;

        const unseenMessages = messages.filter(msg =>
            msg.sender !== currentUser && !msg.seenAt
        );

        if (unseenMessages.length > 0) {
            const unseenIds = unseenMessages.map(msg => msg.id);
            onMarkSeen(unseenIds);
        }
    }, [messages, currentUser, onMarkSeen]);

    // Dynamic Viewport Height Hook
    const [viewportHeight, setViewportHeight] = useState('100dvh');

    useEffect(() => {
        const updateHeight = () => {
            if (window.visualViewport) {
                setViewportHeight(`${window.visualViewport.height}px`);
            } else {
                setViewportHeight(`${window.innerHeight}px`);
            }
        };

        window.visualViewport?.addEventListener('resize', updateHeight);
        window.addEventListener('resize', updateHeight);
        updateHeight();

        return () => {
            window.visualViewport?.removeEventListener('resize', updateHeight);
            window.removeEventListener('resize', updateHeight);
        };
    }, []);

    const handleSend = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage({
                text: newMessage.trim(),
                sender: currentUser,
                timestamp: new Date().toISOString()
            });
            setNewMessage('');
        }
    };

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
    };

    // Group messages by date
    const groupedMessages = messages.reduce((groups, message) => {
        const date = formatDate(message.timestamp);
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(message);
        return groups;
    }, {});

    return ReactDOM.createPortal(
        <div
            className="fixed top-0 left-0 w-full z-[9999] bg-slate-950 flex flex-col md:static overscroll-none"
            style={{ height: viewportHeight }}
        >
            {/* Sidebar - Contact List */}
            <div className={`${selectedUser ? 'hidden md:flex' : 'flex'} w-full md:w-80 border-r border-white/10 bg-slate-900/50 flex-col`}>
                <div className="p-4 border-b border-white/10">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Ara..."
                            className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {['him', 'her'].map((user) => {
                        if (user === currentUser) return null; // Don't show self in list (usually)
                        const isSelected = selectedUser === user;
                        const lastMessage = messages.filter(m => m.sender === user || m.sender === currentUser).pop();

                        return (
                            <div
                                key={user}
                                onClick={() => setSelectedUser(user)}
                                className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${isSelected ? 'bg-rose-500/10 border-r-2 border-rose-500' : 'hover:bg-white/5'}`}
                            >
                                <div className="relative">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${user === 'him' ? 'bg-blue-500/20 text-blue-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                        {user === 'him' ? 'E' : 'K'}
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-semibold text-white truncate">
                                            {user === 'him' ? 'Sevgilim (Erkek)' : 'Sevgilim (Kadın)'}
                                        </h3>
                                        {lastMessage && (
                                            <span className="text-xs text-slate-500">{formatTime(lastMessage.timestamp)}</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-400 truncate">
                                        {lastMessage ? lastMessage.text : 'Henüz mesaj yok'}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`${!selectedUser ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-slate-950 relative`}>
                {/* Chat Header */}
                <div className="h-16 border-b border-white/10 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSelectedUser(null)} className="md:hidden p-2 -ml-2 hover:bg-white/10 rounded-full text-slate-400">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="relative">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${selectedUser === 'him' ? 'bg-blue-500/20 text-blue-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                {selectedUser === 'him' ? 'E' : 'K'}
                            </div>
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-900"></div>
                        </div>
                        <div>
                            <h2 className="font-bold text-white">
                                {selectedUser === 'him' ? 'Sevgilim (Erkek)' : 'Sevgilim (Kadın)'}
                            </h2>
                            <span className="text-xs text-green-400 flex items-center gap-1">
                                ● Çevrimiçi
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400">
                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
                    {Object.entries(groupedMessages).map(([date, msgs]) => (
                        <div key={date} className="space-y-6">
                            <div className="flex justify-center">
                                <span className="bg-slate-800/50 text-slate-400 text-xs px-3 py-1 rounded-full border border-white/5">
                                    {date}
                                </span>
                            </div>
                            {msgs.map((msg) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id}
                                    className={`flex ${msg.sender === currentUser ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] md:max-w-[60%] rounded-2xl px-4 py-3 shadow-md relative group break-words ${msg.sender === currentUser
                                        ? 'bg-rose-600 text-white rounded-br-none'
                                        : 'bg-slate-800 text-slate-200 rounded-bl-none border border-white/5'
                                        }`}>
                                        <p className="leading-relaxed text-sm md:text-base break-words">{msg.text}</p>
                                        <div className={`text-[10px] mt-1 flex items-center gap-1 ${msg.sender === currentUser ? 'text-rose-200/70 justify-end' : 'text-slate-500'
                                            }`}>
                                            {formatTime(msg.timestamp)}
                                            {msg.sender === currentUser && (
                                                <span className="text-xs">✓✓</span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div
                    className="p-4 bg-slate-900 border-t border-white/10 backdrop-blur-md"
                    style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
                >
                    <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-end gap-2 md:gap-4">
                        <button type="button" className="p-2 md:p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <div className="flex-1 bg-slate-950 border border-white/10 rounded-2xl flex items-center px-3 md:px-4 py-2 focus-within:border-rose-500 transition-colors">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Bir mesaj yazın..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-slate-500 py-2 max-h-32 text-sm md:text-base"
                            />
                            <button type="button" className="p-2 text-slate-400 hover:text-white transition-colors hidden md:block">
                                <Smile className="w-5 h-5" />
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="p-3 md:p-4 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full shadow-lg shadow-rose-500/20 transition-all hover:scale-105 active:scale-95"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default FullPageChat;
