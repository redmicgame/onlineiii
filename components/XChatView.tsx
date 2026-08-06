
import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { XChat, XUser, XMessage } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import PlusCircleIcon from './icons/PlusCircleIcon';
import HeartIcon from './icons/HeartIcon';
import { GoogleGenAI } from '@google/genai';

const getAI = () => {
    const key = process.env.API_KEY;
    if (!key) throw new Error("API key not configured");
    return new GoogleGenAI({ apiKey: key });
};

const MessageBubble: React.FC<{ message: XMessage, author: XUser | undefined, isPlayer: boolean, isGroup: boolean }> = ({ message, author, isPlayer, isGroup }) => {
    if (!author) return null;

    if (isPlayer) {
        return (
            <div className="flex justify-end">
                <div className="bg-blue-500 rounded-2xl px-4 py-2 max-w-xs sm:max-w-sm">
                    {message.text}
                </div>
            </div>
        );
    }

    return (
         <div className="flex items-end gap-2">
            <img src={author.avatar} alt={author.name} className="w-7 h-7 rounded-full object-cover"/>
             <div className="flex flex-col">
                {isGroup && <p className="text-xs text-zinc-400 ml-3">{author.name}</p>}
                <div className="bg-zinc-700 rounded-2xl px-4 py-2 max-w-xs sm:max-w-sm">
                    {message.text}
                </div>
            </div>
        </div>
    );
};


const XChatView: React.FC = () => {
    const { gameState, dispatch, activeArtistData, activeArtist } = useGame();
    const { selectedXChatId } = gameState;
    const { xUsers, xChats } = activeArtistData!;
    const [messageText, setMessageText] = useState('');
    const [isAiReplying, setIsAiReplying] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const chat = xChats.find(c => c.id === selectedXChatId);
    const playerUser = xUsers.find(u => u.isPlayer);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat?.messages]);
    
    const findUser = (id: string) => xUsers.find(u => u.id === id);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chat || !playerUser || !messageText.trim() || isAiReplying) return;
    
        const playerMessage: XMessage = {
            id: crypto.randomUUID(),
            senderId: playerUser.id,
            text: messageText.trim(),
            date: gameState.date,
        };
        
        const currentMessageText = messageText;
        dispatch({ type: 'SEND_X_MESSAGE', payload: { chatId: chat.id, message: playerMessage }});
        setMessageText('');
        setIsAiReplying(true);
    
        try {
            const otherParticipants = chat.participants
                .filter(pId => pId !== playerUser.id)
                .map(findUser)
                .filter((u): u is XUser => !!u);
    
            // Pick a random replier from the chat
            const replier = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
            if (!replier) {
                setIsAiReplying(false);
                return;
            }
    
            const chatHistory = chat.messages
                .map(msg => {
                    const author = findUser(msg.senderId);
                    return `${author?.name || 'Unknown'}: ${msg.text}`;
                })
                .join('\n');
    
            const persona = chat.isGroup 
                ? `You are a die-hard fan of the music artist ${activeArtist?.name}. Your username is ${replier.name}. You are in an exclusive group chat with the artist and other fans. Be enthusiastic, supportive, and use casual, lowercase internet slang.`
                : `You are a die-hard fan of the music artist ${activeArtist?.name}. Your username is ${replier.name}. You are direct messaging them. Be respectful but very excited. Use casual, lowercase internet slang.`;
    
            let aiReplyText = '';
            if (gameState.offlineMode || !activeArtistData?.redMicPro?.unlocked) {
                const genericReplies = [
                    "Interesting...", 
                    "Wow!", 
                    "Gotcha.", 
                    "That makes sense.", 
                    "I see.",
                    "If you say so!",
                    "Noted.",
                    "Cool cool.",
                    "Hmm..."
                ];
                aiReplyText = genericReplies[Math.floor(Math.random() * genericReplies.length)];
            } else {
                const prompt = `This is a chat conversation with the music artist ${activeArtist?.name}.
---
PERSONA: ${persona}
---
CHAT HISTORY (most recent messages are last):
${chatHistory}
${playerUser.name}: ${currentMessageText}
---
Based on your persona and the chat history, write a short, realistic reply as ${replier.name}. Your reply should be a single text message. Do not include your name in the reply itself.`;
        
                const aiClient = getAI();
                const response = await aiClient.models.generateContent({
                  model: 'gemini-2.5-flash',
                  contents: prompt,
                  config: {
                      stopSequences: ['\n'],
                      maxOutputTokens: 50,
                      temperature: 0.9,
                  }
                });
        
                aiReplyText = response.text.trim();
            }
    
            if (aiReplyText) {
                const aiMessage: XMessage = {
                    id: crypto.randomUUID(),
                    senderId: replier.id,
                    text: aiReplyText,
                    date: gameState.date,
                };
                // Delay for realism
                setTimeout(() => {
                    dispatch({ type: 'SEND_X_MESSAGE', payload: { chatId: chat.id, message: aiMessage }});
                    setIsAiReplying(false);
                }, Math.random() * 1500 + 500); // 0.5s to 2s delay
            } else {
                setIsAiReplying(false);
            }
    
        } catch (error) {
            console.error("Error getting AI reply:", error);
            setIsAiReplying(false);
        }
    };

    if (!chat || !playerUser) {
        return <div className="p-4">Chat not found. <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'x' })}>Back</button></div>;
    }
    
    return (
         <div className="bg-black text-white h-full overflow-y-auto flex flex-col pb-24">
            <header className="sticky top-0 bg-black/80 backdrop-blur-sm z-20 p-3 flex items-center gap-4 border-b border-zinc-700/70">
                <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'x' })} className="p-2 rounded-full hover:bg-zinc-800">
                    <ArrowLeftIcon className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                    <img src={chat.avatar} alt={chat.name} className="w-8 h-8 rounded-full object-cover"/>
                    <h2 className="font-bold text-lg">{chat.name}</h2>
                </div>
            </header>
            
            <main className="flex-grow p-4 overflow-y-auto space-y-4">
                {chat.messages.map(msg => (
                    <MessageBubble key={msg.id} message={msg} author={findUser(msg.senderId)} isPlayer={msg.senderId === playerUser.id} isGroup={chat.isGroup} />
                ))}
                 <div ref={messagesEndRef} />
            </main>

            <footer className="sticky bottom-0 bg-black p-2 border-t border-zinc-700/70">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <button type="button" className="p-2"><PlusCircleIcon className="w-6 h-6 text-zinc-400" /></button>
                    <input 
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder={isAiReplying ? "..." : "Start a message"}
                        disabled={isAiReplying}
                        className="flex-grow bg-zinc-800 rounded-full h-10 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    />
                     <button type="submit" disabled={isAiReplying || !messageText.trim()} className="p-2 disabled:opacity-50">
                        <HeartIcon className="w-6 h-6 text-zinc-400" />
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default XChatView;