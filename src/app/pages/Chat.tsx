import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Mic, Send, Heart, ArrowLeft } from "lucide-react";
import imgKoala from "@/assets/8e3a8ca18b6104070e04a9f1cdd5980d520b3a7d.png";
import { useUser } from "../context/UserContext";
import { sendMessageToAI, ChatMessage } from "../services/chatService";

interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
}

export default function Chat() {
  const navigate = useNavigate();
  const { avatar } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "user", text: "N, Hello" },
    { id: 2, sender: "ai", text: "Hello, I am Love ego AI. I come from Natural Planet." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsgText = input;
    const newMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: userMsgText,
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);

    // Prepare history for AI
    const history: ChatMessage[] = messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    }));
    history.push({ role: 'user', content: userMsgText });

    try {
      const aiResponse = await sendMessageToAI(userMsgText, history);
      
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: "ai",
        text: aiResponse
      }]);
    } catch (error) {
      console.error("Failed to get response", error);
      // Optional: Show error message
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F3EEEA]">
      <div className="flex items-center gap-4 p-6 pt-12 border-b border-black/5 bg-[#F3EEEA] z-10">
        <button onClick={() => navigate(-1)}>
            <ArrowLeft />
        </button>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-black/10">
                <img src={imgKoala} className="w-full h-full object-cover" />
            </div>
            <h1 className="text-xl font-bold">Love ego AI</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
        {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 items-start ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 border border-black/5">
                     {msg.sender === 'ai' ? (
                         <img src={imgKoala} className="w-full h-full object-cover" />
                     ) : (
                         <img src={avatar} className="w-full h-full object-cover" />
                     )}
                </div>
                <div className={`flex flex-col gap-1 max-w-[80%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <span className="text-xs font-bold text-gray-500 mx-1">
                        {msg.sender === 'ai' ? 'Love ego AI' : 'Me'}
                    </span>
                    <div className={`text-lg font-medium leading-snug px-4 py-2 rounded-2xl ${
                        msg.sender === 'user' 
                        ? 'bg-[#EAD6C9] text-black rounded-tr-none' 
                        : 'bg-white text-black rounded-tl-none shadow-sm'
                    }`}>
                        {msg.text}
                    </div>
                </div>
            </div>
        ))}
        
        {isTyping && (
            <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 border border-black/5">
                    <img src={imgKoala} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col gap-1">
                     <span className="text-xs font-bold text-gray-500 ml-1">Love ego AI</span>
                     <div className="bg-white text-black px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-0"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                     </div>
                </div>
            </div>
        )}
      </div>

      <div className="p-4 pb-8 space-y-4 bg-[#F3EEEA]">
        <div className="flex gap-4 px-2 overflow-x-auto pb-2 scrollbar-hide">
            <button className="flex items-center gap-2 border border-black/20 rounded-full px-4 py-2 bg-white/50 text-sm font-medium whitespace-nowrap hover:bg-white/80 transition-colors"
                onClick={() => navigate('/meditation')}
            >
                <Heart size={16} /> Meditation
            </button>
            <button className="flex items-center gap-2 border border-black/20 rounded-full px-4 py-2 bg-white/50 text-sm font-medium whitespace-nowrap hover:bg-white/80 transition-colors">
                <Heart size={16} /> Change Mind
            </button>
        </div>
        
        <div className="flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-sm border border-black/5">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-transparent outline-none py-2 text-lg"
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isTyping}
            />
            <button className="text-gray-400 hover:text-gray-600 p-2">
                <Mic size={20} />
            </button>
            <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    !input.trim() || isTyping ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#6E3677] hover:bg-[#5a2d61] text-white'
                }`}
            >
                <Send size={18} />
            </button>
        </div>
      </div>
    </div>
  );
}
