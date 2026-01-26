import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

let genAI = null;
let model = null;

if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-pro' });
}

// System prompt for Luxor tourism focus
const SYSTEM_CONTEXT = `You are a helpful tourism assistant for LuxorExplore, a tourism platform focused exclusively on Luxor, Egypt. 
You help tourists with:
- Information about Luxor's ancient temples and monuments
- Tour program recommendations
- Travel tips for visiting Luxor
- Best times to visit attractions
- Cultural insights about ancient Egyptian history
- Booking assistance

You should be friendly, professional, and knowledgeable about Luxor. When users ask about places outside Luxor, politely redirect them to Luxor's attractions.

Our platform connects tourists with local tourism companies and offers exclusive discounts on tour programs.`;

class ChatbotService {
    constructor() {
        this.chatHistory = [];
    }

    async sendMessage(message) {
        try {
            // If no API key, return mock response
            if (!API_KEY || !model) {
                return this.getMockResponse(message);
            }

            // Add system context
            const chat = model.startChat({
                history: [
                    {
                        role: 'user',
                        parts: [{ text: SYSTEM_CONTEXT }],
                    },
                    {
                        role: 'model',
                        parts: [{ text: 'I understand. I am a tourism assistant for LuxorExplore. How can I help you today?' }],
                    },
                    ...this.chatHistory,
                ],
            });

            const result = await chat.sendMessage(message);
            const response = await result.response;
            const text = response.text();

            // Update history
            this.chatHistory.push(
                {
                    role: 'user',
                    parts: [{ text: message }],
                },
                {
                    role: 'model',
                    parts: [{ text }],
                }
            );

            return {
                success: true,
                message: text,
            };
        } catch (error) {
            console.error('Chatbot error:', error);
            return {
                success: false,
                message: 'Sorry, I encountered an error. Please try again.',
            };
        }
    }

    getMockResponse(message) {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return {
                success: true,
                message: 'Hello! Welcome to LuxorExplore 🏛️ I\'m here to help you plan your perfect Luxor adventure. What would you like to know about our tour programs or Luxor\'s incredible ancient sites?',
            };
        }

        if (lowerMessage.includes('temple') || lowerMessage.includes('karnak')) {
            return {
                success: true,
                message: 'Luxor is home to amazing temples! The Karnak Temple Complex is one of the largest religious sites ever built, and it\'s absolutely breathtaking. Luxor Temple is another must-see, especially beautiful at sunset. Would you like recommendations for tour programs that include these sites?',
            };
        }

        if (lowerMessage.includes('valley of the kings') || lowerMessage.includes('tomb')) {
            return {
                success: true,
                message: 'The Valley of the Kings is one of Luxor\'s crown jewels! It houses the tombs of pharaohs like Tutankhamun and Ramses II. I recommend visiting early in the morning to avoid crowds. Our tour programs include guided visits with expert Egyptologists. Interested in our 3-day or 5-day programs?',
            };
        }

        if (lowerMessage.includes('balloon') || lowerMessage.includes('hot air')) {
            return {
                success: true,
                message: 'Hot air balloon rides over Luxor are magical! 🎈 You\'ll float over the West Bank at sunrise, seeing temples and the Nile from above. We have programs that include balloon rides, like our "Luxor Hot Air Balloon & Temples" tour with a 16% discount!',
            };
        }

        if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
            return {
                success: true,
                message: 'All our tour programs come with exclusive discounts! Prices range from $380 for our 2-day quick tour to $850 for our comprehensive 5-day experience. Remember, booking through LuxorExplore gives you 16-20% off compared to booking directly! Which type of tour interests you?',
            };
        }

        if (lowerMessage.includes('book') || lowerMessage.includes('reservation')) {
            return {
                success: true,
                message: 'Great! To book a tour program, browse our available programs on the Tours page. Select the one that interests you, and click "Book with Discount". You\'ll need to create an account to complete your booking. Need help choosing the right program for you?',
            };
        }

        if (lowerMessage.includes('discount')) {
            return {
                success: true,
                message: 'We offer 16-20% discounts on all tour programs! 💰 We partner with the best tourism companies in Luxor and negotiate exclusive rates for our customers. The discount is automatically applied when you book through our platform. It\'s our way of making Luxor more accessible to travelers!',
            };
        }

        // Default response
        return {
            success: true,
            message: `Thanks for your question about Luxor! 🌟 I'm here to help you with information about our tour programs, temples, activities, and booking. Here are some things I can help with:

• Tour program recommendations
• Temple and monument information  
• Best times to visit
• Booking assistance
• Discount details

Feel free to ask me anything about exploring Luxor!

Note: This is a demo chatbot. To enable full AI responses, add your Gemini API key to the .env file.`,
        };
    }

    clearHistory() {
        this.chatHistory = [];
    }
}

export default new ChatbotService();
