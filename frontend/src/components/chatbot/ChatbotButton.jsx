import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { useChatbot } from '../../contexts/ChatbotContext';
import './ChatbotButton.css';

const ChatbotButton = () => {
    const { openChatbot } = useChatbot();

    return (
        <button
            onClick={openChatbot}
            className="chatbot-button"
            aria-label="Open chatbot"
        >
            <div className="glow-effect" />
            <div className="button-content">
                <MessageCircle className="w-6 h-6" />
                <Sparkles className="w-3 h-3 sparkle" />
            </div>
            <div className="tooltip">Ask me anything about Luxor!</div>
        </button>
    );
};

export default ChatbotButton;
