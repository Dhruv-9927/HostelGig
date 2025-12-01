import { useState } from 'react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { MOCK_USERS } from '../lib/mockData';
import { Search, Send, MoreVertical, Phone, Video } from 'lucide-react';
import { cn } from '../lib/utils';

// Mock Conversations
const CONVERSATIONS = [
    { id: '1', user: MOCK_USERS[1], lastMessage: 'Hey, can you print it by 5 PM?', time: '10:30 AM', unread: 2 },
    { id: '2', user: MOCK_USERS[2], lastMessage: 'Sure, I will start working on it.', time: 'Yesterday', unread: 0 },
    { id: '3', user: MOCK_USERS[0], lastMessage: 'Payment received, thanks!', time: '2 days ago', unread: 0 },
];

const MESSAGES = [
    { id: '1', senderId: 'me', text: 'Hi, is this still available?', time: '10:00 AM' },
    { id: '2', senderId: 'other', text: 'Yes, it is!', time: '10:05 AM' },
    { id: '3', senderId: 'me', text: 'Great, I can do it for ₹500.', time: '10:06 AM' },
    { id: '4', senderId: 'other', text: 'That works. When can you deliver?', time: '10:10 AM' },
];

export const Messages = () => {
    const [activeChat, setActiveChat] = useState(CONVERSATIONS[0].id);
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState(MESSAGES);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msg = {
            id: Date.now().toString(),
            senderId: 'me',
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages([...messages, msg]);
        setNewMessage('');
    };

    const activeUser = CONVERSATIONS.find(c => c.id === activeChat)?.user;

    return (
        <div className="h-[calc(100vh-8rem)] grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Sidebar - Chat List */}
            <Card className="md:col-span-1 flex flex-col overflow-hidden h-full">
                <div className="p-4 border-b border-slate-100 space-y-4">
                    <h2 className="text-xl font-bold">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            className="w-full h-9 pl-9 pr-4 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {CONVERSATIONS.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => setActiveChat(chat.id)}
                            className={cn(
                                "p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0",
                                activeChat === chat.id && "bg-slate-50 border-l-4 border-l-primary"
                            )}
                        >
                            <div className="relative">
                                <img src={chat.user.avatar} alt={chat.user.name} className="h-12 w-12 rounded-full bg-slate-200" />
                                {chat.user.status === 'online' && (
                                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-medium text-slate-900 truncate">{chat.user.name}</h3>
                                    <span className="text-xs text-slate-400 whitespace-nowrap">{chat.time}</span>
                                </div>
                                <p className={cn("text-sm truncate", chat.unread > 0 ? "text-slate-900 font-medium" : "text-slate-500")}>
                                    {chat.lastMessage}
                                </p>
                            </div>
                            {chat.unread > 0 && (
                                <span className="h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                                    {chat.unread}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </Card>

            {/* Chat Window */}
            <Card className="md:col-span-2 lg:col-span-3 flex flex-col overflow-hidden h-full">
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
                    <div className="flex items-center gap-3">
                        <img src={activeUser?.avatar} alt={activeUser?.name} className="h-10 w-10 rounded-full bg-slate-200" />
                        <div>
                            <h3 className="font-bold text-slate-900">{activeUser?.name}</h3>
                            <span className="text-xs text-green-600 flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span> Online
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm"><Phone className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm"><Video className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm"><MoreVertical className="h-4 w-4" /></Button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex w-full",
                                msg.senderId === 'me' ? "justify-end" : "justify-start"
                            )}
                        >
                            <div className={cn(
                                "max-w-[70%] rounded-2xl px-4 py-2 shadow-sm",
                                msg.senderId === 'me'
                                    ? "bg-primary text-white rounded-br-none"
                                    : "bg-white text-slate-800 rounded-bl-none border border-slate-100"
                            )}>
                                <p className="text-sm">{msg.text}</p>
                                <span className={cn(
                                    "text-[10px] block text-right mt-1 opacity-70",
                                    msg.senderId === 'me' ? "text-white" : "text-slate-400"
                                )}>
                                    {msg.time}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-100">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <Input
                            placeholder="Type a message..."
                            className="flex-1 rounded-full"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <Button type="submit" size="lg" className="rounded-full h-10 w-10 p-0 flex items-center justify-center">
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
};
