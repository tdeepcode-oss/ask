import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Chat = ({ messages = [], onSendMessage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [sender, setSender] = useState('him'); // 'him' | 'her'
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage({
                text: newMessage.trim(),
                sender: sender,
                timestamp: new Date().toISOString()
            });
            setNewMessage('');
        }
    };

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl w-80 md:w-96 mb-4 overflow-hidden flex flex-col h-[500px]"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 bg-slate-900/50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MessageCircle className="w-5 h-5 text-rose-500" />
                                <h3 className="font-bold text-white">Bizim Sohbetimiz</h3>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/30">
                            {messages.length === 0 ? (
                                <div className="text-center text-slate-500 text-sm py-10">
                                    <p>Henüz mesaj yok.</p>
                                    <p className="text-xs mt-1">İlk notu sen bırak!</p>
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex flex-col ${msg.sender === sender ? 'items-end' : 'items-start'}`}
                                    >
                                        <div className={`
                      max-w-[80%] rounded-2xl px-4 py-2 text-sm relative
                      ${msg.sender === 'him'
                                                ? 'bg-blue-600/20 text-blue-100 rounded-br-none border border-blue-500/20'
                                                : 'bg-rose-600/20 text-rose-100 rounded-bl-none border border-rose-500/20'
                                            }
                    `}>
                                            <p>{msg.text}</p>
                                            <span className="text-[10px] opacity-50 mt-1 block text-right">
                                                {formatTime(msg.timestamp)}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-slate-500 mt-1 px-1">
                                            {msg.sender === 'him' ? 'O (Erkek)' : 'O (Kadın)'}
                                        </span>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 bg-slate-900/50">
                            {/* Sender Toggle */}
                            <div className="flex gap-2 mb-3 bg-slate-950 p-1 rounded-lg border border-white/5">
                                <button
                                    onClick={() => setSender('him')}
                                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium rounded-md transition-all
                    ${sender === 'him'
                                            ? 'bg-blue-500/20 text-blue-400 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-300'
                                        }
                  `}
                                >
                                    <User className="w-3 h-3" />
                                    Ben (Erkek)
                                </button>
                                <button
                                    onClick={() => setSender('her')}
                                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium rounded-md transition-all
                    ${sender === 'her'
                                            ? 'bg-rose-500/20 text-rose-400 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-300'
                                        }
                  `}
                                >
                                    <User className="w-3 h-3" />
                                    Ben (Kadın)
                                </button>
                            </div>

                            <form onSubmit={handleSend} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Bir not bırak..."
                                    className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-xl transition-colors"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center shadow-lg hover:bg-slate-700 transition-all hover:scale-105 group"
            >
                <MessageCircle className="w-6 h-6 text-rose-500 group-hover:text-rose-400" />
            </button>
        </div>
    );
};

export default Chat;
