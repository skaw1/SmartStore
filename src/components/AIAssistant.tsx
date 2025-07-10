import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { marked } from 'marked';

import { useData } from '../contexts/DataContext';
import { Icons } from './icons';
import Button from './ui/Button';
import Input from './ui/Input';
import { Card } from './ui/Card';

interface Message {
    role: 'user' | 'model';
    content: string;
}

const AIAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    const { products, settings } = useData();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        // Automatically scroll to the bottom of the chat
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (!isOpen || chat) return; // Only initialize once when opened

        if (!isOnline) {
             setError("The AI assistant is unavailable while you're offline.");
             return;
        }

        if (!process.env.API_KEY) {
            setError("The AI assistant is offline. API_KEY is missing.");
            return;
        }
        
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const productList = products.map(p => `- ${p.name} (Category: ${p.category}, Price: Ksh ${p.price})`).join('\n');
            const systemInstruction = `You are a friendly and helpful shopping assistant for an online store called "${settings.shopName}".
Your goal is to help users find products and answer their questions.
Be concise and conversational.
Use the following product list to answer questions about inventory. Do not invent products.
Product List:
${productList}

If asked about store policies (shipping, returns, etc.), you can provide helpful, generic e-commerce answers, as you don't have access to the specific store policies.
If you can't answer a question, politely say so and suggest they contact support at ${settings.contactEmail}.`;

            const newChat = ai.chats.create({
                model: 'gemini-2.5-flash-preview-04-17',
                config: { systemInstruction },
            });
            setChat(newChat);
            setMessages([{ role: 'model', content: "Hello! How can I help you find the perfect smart device today?" }]);
        } catch (e) {
            console.error("Failed to initialize AI Chat:", e);
            setError("Could not connect to the AI assistant.");
        }
    }, [isOpen, chat, products, settings, isOnline]);

    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chat || !isOnline) return;

        const userInput: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userInput]);
        setInput('');
        setIsLoading(true);
        setError(null);
        
        try {
            const responseStream = await chat.sendMessageStream({ message: input });
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', content: '' }]); 

            for await (const chunk of responseStream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].content = modelResponse;
                    return newMessages;
                });
            }
        } catch (e: any) {
            console.error("Gemini stream error:", e);
            setError("Sorry, I encountered an error. Please try again.");
            setMessages(prev => prev.slice(0, -1)); // Remove the empty model message
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button
                variant="accent"
                size="icon"
                className="fixed bottom-24 right-6 h-16 w-16 rounded-full shadow-lg transition-transform hover:scale-110 z-30"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle AI Assistant"
            >
                {isOpen ? <Icons.X className="h-8 w-8" /> : <Icons.Bot className="h-8 w-8" />}
            </Button>

            {isOpen && (
                <div className="fixed bottom-[7.5rem] right-6 z-30 mb-4 sm:mb-0">
                    <Card className="w-[calc(100vw-3rem)] sm:w-96 h-[60vh] flex flex-col shadow-2xl">
                        <div className="flex justify-between items-center p-3 border-b dark:border-gray-700">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Icons.Bot className="h-5 w-5 text-accent" />
                                AI Shopping Assistant
                            </h3>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}><Icons.X className="h-5 w-5"/></Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                        className={`max-w-xs lg:max-w-sm rounded-lg px-3 py-2 text-sm ${
                                            msg.role === 'user'
                                                ? 'bg-accent text-white'
                                                : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }}
                                    />
                                </div>
                            ))}
                             {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg px-3 py-2 flex items-center">
                                       <span className="h-2 w-2 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                       <span className="h-2 w-2 bg-accent rounded-full animate-bounce [animation-delay:-0.15s] mx-1"></span>
                                       <span className="h-2 w-2 bg-accent rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            )}
                            {error && <p className="text-red-500 text-sm p-2 bg-red-100 dark:bg-red-900/40 rounded-md">{error}</p>}
                            <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={handleSendMessage} className="flex items-center p-3 border-t dark:border-gray-700 gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={isOnline ? "Ask about products..." : "AI Assistant is offline"}
                                className="flex-1"
                                disabled={isLoading || !!error || !isOnline}
                            />
                            <Button type="submit" size="icon" variant="accent" disabled={isLoading || !input.trim() || !isOnline}>
                                <Icons.Send className="h-5 w-5" />
                            </Button>
                        </form>
                    </Card>
                </div>
            )}
        </>
    );
};

export default AIAssistant;