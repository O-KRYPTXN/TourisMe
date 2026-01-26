import React, { createContext, useContext, useState } from 'react';
import chatbotService from '../services/chatbotService';

const ChatbotContext = createContext();

export const useChatbot = () => {
    const context = useContext(ChatbotContext);
    if (!context) {
        throw new Error('useChatbot must be used within ChatbotProvider');
    }
    return context;
};

const initialMessages = [
    {
        id: '1',
        role: 'assistant',
        content: 'Hello! 👋 Welcome to LuxorExplore. I\'m your virtual tourism assistant. How can I help you plan your Luxor adventure today?',
        timestamp: new Date(),
    },
];

export const ChatbotProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([...initialMessages]);
    const [isTyping, setIsTyping] = useState(false);

    const openChatbot = () => setIsOpen(true);

    const closeChatbot = () => setIsOpen(false);

    const sendMessage = async (content) => {
        if (!content.trim()) return;

        // Add user message
        const userMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: content.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);

        try {
            // Get AI response
            const response = await chatbotService.sendMessage(content);

            // Add assistant message
            const assistantMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.message,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            const errorMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const clearChat = () => {
        setMessages([...initialMessages]);
        chatbotService.clearHistory();
    };

    const value = {
        isOpen,
        messages,
        isTyping,
        openChatbot,
        closeChatbot,
        sendMessage,
        clearChat,
    };

    return (
        <ChatbotContext.Provider value={value}>
            {children}
        </ChatbotContext.Provider>
    );
};
