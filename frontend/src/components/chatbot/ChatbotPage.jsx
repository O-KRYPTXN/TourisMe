import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Send, Loader2, Bot, User as UserIcon, Sparkles } from 'lucide-react';
import { useChatbot } from '../../contexts/ChatbotContext';
import Button from '../common/Button';

const ChatbotPage = () => {
    const { isOpen, messages, isTyping, closeChatbot, sendMessage } = useChatbot();
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = () => {
        if (inputValue.trim() && !isTyping) {
            sendMessage(inputValue);
            setInputValue('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const quickQuestions = [
        'Tell me about Karnak Temple',
        'What tour programs do you offer?',
        'How much can I save?',
        'Best time to visit Luxor?',
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeChatbot}
                    />

                    {/* Chatbot Container */}
                    <motion.div
                        className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-dark-800 shadow-2xl z-50 flex flex-col border-l border-white/5"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        LuxorExplore Assistant
                                        <Sparkles className="w-4 h-4" />
                                    </h2>
                                    <p className="text-sm text-white/80">Powered by AI</p>
                                </div>
                            </div>
                            <button
                                onClick={closeChatbot}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-dark-900">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                        }`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {message.role === 'assistant' && (
                                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(242,133,109,0.3)]">
                                            <Bot className="w-5 h-5 text-white" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[75%] px-4 py-3 rounded-2xl ${message.role === 'user'
                                            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-tr-none'
                                            : 'bg-dark-700 border border-white/10 text-white/90 rounded-tl-none'
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                        <p className="text-xs mt-1 opacity-50">
                                            {new Date(message.timestamp).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                    {message.role === 'user' && (
                                        <div className="w-8 h-8 bg-dark-600 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/10">
                                            <UserIcon className="w-5 h-5 text-white/60" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <motion.div
                                    className="flex gap-3 justify-start"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(242,133,109,0.3)]">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="bg-dark-700 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none">
                                        <div className="flex gap-1">
                                            <motion.div
                                                className="w-2 h-2 bg-primary-400 rounded-full"
                                                animate={{ y: [0, -8, 0] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                            />
                                            <motion.div
                                                className="w-2 h-2 bg-primary-400 rounded-full"
                                                animate={{ y: [0, -8, 0] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                            />
                                            <motion.div
                                                className="w-2 h-2 bg-primary-400 rounded-full"
                                                animate={{ y: [0, -8, 0] }}
                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Questions */}
                        {messages.length === 1 && !isTyping && (
                            <div className="px-6 py-4 bg-dark-800 border-t border-white/5">
                                <p className="text-sm text-white/50 mb-3">Quick questions:</p>
                                <div className="flex flex-wrap gap-2">
                                    {quickQuestions.map((question, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setInputValue(question);
                                                setTimeout(handleSend, 100);
                                            }}
                                            className="text-xs bg-white/5 hover:bg-white/10 text-white/70 hover:text-white px-3 py-2 rounded-full transition-all duration-300 border border-white/5 hover:border-primary-500/30"
                                        >
                                            {question}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="p-6 bg-dark-800 border-t border-white/5">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask about Luxor tours..."
                                    disabled={isTyping}
                                    className="flex-1 px-4 py-3 bg-dark-700/50 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 disabled:opacity-50 transition-all duration-300"
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={!inputValue.trim() || isTyping}
                                    className="px-6"
                                >
                                    {isTyping ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Send className="w-5 h-5" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ChatbotPage;
