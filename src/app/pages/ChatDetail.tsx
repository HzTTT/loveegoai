import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Mic, Send, Heart, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import imgKoala from "@/assets/8e3a8ca18b6104070e04a9f1cdd5980d520b3a7d.png";
import { useUser } from "../context/UserContext";
import { ChatMessage, sendMessageStream } from "../services/chatService";
import { generateMeditation } from "../services/meditationService";
import { addMeditationRecord } from "../services/meditationStorage";
import { useLanguage } from "../context/LanguageContext";
import { API_BASE } from "../services/api";

const AUDIO_BASE = API_BASE.replace(/\/api\/v1$/, "");

interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
  audioUrl?: string;
  isGenerating?: boolean;
  showMeditationOffer?: boolean;
}

export default function ChatDetail() {
  const navigate = useNavigate();
  const { avatar } = useUser();
  const { t, language } = useLanguage();
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

    const history: ChatMessage[] = messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    }));
    history.push({ role: 'user', content: userMsgText });

    const aiMsgId = Date.now();
    let detectedMode = "changemind";

    // 先添加空的AI消息占位
    setMessages(prev => [...prev, { id: aiMsgId, sender: "ai", text: "" }]);

    try {
      await sendMessageStream(
        userMsgText,
        history,
        language,
        (fullText) => {
          setMessages(prev => prev.map(msg =>
            msg.id === aiMsgId ? { ...msg, text: fullText } : msg
          ));
        },
        (mode) => { detectedMode = mode; }
      );

      // 流结束后，设置冥想推荐
      if (detectedMode === "meditation") {
        setMessages(prev => prev.map(msg =>
          msg.id === aiMsgId ? { ...msg, showMeditationOffer: true } : msg
        ));
      }
    } catch (error) {
      console.error("Failed to get response", error);
    } finally {
      setIsTyping(false);
    }
  };

  // 从聊天记录中提取用户的冥想需求
  const extractUserNeed = (): string => {
    const recentUserMsgs = messages
      .filter(m => m.sender === 'user' && m.text !== 'Meditation' && m.text !== 'Change Mind')
      .slice(-3)
      .map(m => m.text);
    return recentUserMsgs.join(' ') || '';
  };

  // 点击"生成音频"按钮 → 提取需求 + 聊天历史 → 生成个性化冥想
  const handleAcceptMeditation = async (offerMsgId: number) => {
    if (isTyping) return;

    // 隐藏推荐按钮
    setMessages(prev => prev.map(msg =>
      msg.id === offerMsgId ? { ...msg, showMeditationOffer: false } : msg
    ));

    const aiMsgId = Date.now();

    // 添加 AI 等待消息
    setMessages(prev => [...prev, {
      id: aiMsgId,
      sender: "ai",
      text: t('chat.audioGenerating'),
      isGenerating: true
    }]);

    setIsTyping(true);

    try {
      // 提取用户需求
      const userNeed = extractUserNeed();

      // 构建聊天历史传给后端
      const chatHistory = messages
        .slice(-8)
        .map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));

      const result = await generateMeditation(userNeed, 5, language, chatHistory);

      const audioUrl = result.audio_url.startsWith('http')
        ? result.audio_url
        : `${AUDIO_BASE}${result.audio_url}`;

      addMeditationRecord({
        id: result.id,
        title: result.title,
        text: result.text,
        audioUrl,
        createdAt: new Date().toISOString(),
      });

      setMessages(prev => prev.map(msg =>
        msg.id === aiMsgId
          ? { ...msg, text: t('chat.audioReady'), audioUrl, isGenerating: false }
          : msg
      ));
    } catch (error) {
      console.error("Meditation generation failed", error);
      setMessages(prev => prev.map(msg =>
        msg.id === aiMsgId
          ? { ...msg, text: t('chat.audioFailed'), isGenerating: false }
          : msg
      ));
    } finally {
      setIsTyping(false);
    }
  };

  // 点击 Meditation 按钮 → 发聊天消息让 AI 先询问用户需求
  const handleMeditation = async () => {
    if (isTyping) return;

    const meditationMsg: Record<string, string> = {
      en: "I'd like to do a meditation",
      zh: "我想做一次冥想",
      ja: "瞑想をしたいです",
      ko: "명상을 하고 싶어요",
    };
    const text = meditationMsg[language] || meditationMsg.en;

    const userMsgId = Date.now();
    const aiMsgId = userMsgId + 1;

    setMessages(prev => [...prev, {
      id: userMsgId,
      sender: "user",
      text
    }]);
    setIsTyping(true);

    const history: ChatMessage[] = messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    }));
    history.push({ role: 'user', content: text });

    setMessages(prev => [...prev, { id: aiMsgId, sender: "ai", text: "" }]);

    try {
      await sendMessageStream(
        text,
        history,
        language,
        (fullText) => {
          setMessages(prev => prev.map(msg =>
            msg.id === aiMsgId ? { ...msg, text: fullText } : msg
          ));
        },
        () => {
          // meditation mode detected
        }
      );

      // AI 询问完后，显示"生成音频"按钮
      setMessages(prev => prev.map(msg =>
        msg.id === aiMsgId ? { ...msg, showMeditationOffer: true } : msg
      ));
    } catch (error) {
      console.error("Failed to get response", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleChangeMind = async () => {
    if (isTyping) return;
    const text = "Change Mind";
    const userMsgId = Date.now();
    const aiMsgId = userMsgId + 1;

    setMessages(prev => [...prev, {
      id: userMsgId,
      sender: "user",
      text: text
    }]);
    setIsTyping(true);

    const history: ChatMessage[] = messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    }));
    history.push({ role: 'user', content: text });

    // 先添加空的AI消息占位
    setMessages(prev => [...prev, { id: aiMsgId, sender: "ai", text: "" }]);

    try {
      await sendMessageStream(
        text,
        history,
        language,
        (fullText) => {
          setMessages(prev => prev.map(msg =>
            msg.id === aiMsgId ? { ...msg, text: fullText } : msg
          ));
        }
      );
    } catch (error) {
      console.error("Failed to get response", error);
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
            <h1 className="text-xl font-bold">{t('chat.title')}</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`flex gap-4 items-start ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 border border-black/5">
                     {msg.sender === 'ai' ? (
                         <img src={imgKoala} className="w-full h-full object-cover" />
                     ) : (
                         <img src={avatar} className="w-full h-full object-cover" />
                     )}
                </div>
                <div className={`flex flex-col gap-1 max-w-[80%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <span className="text-xs font-bold text-gray-500 mx-1">
                        {msg.sender === 'ai' ? t('chat.aiName') : t('chat.me')}
                    </span>
                    <div className={`text-lg font-medium leading-snug px-4 py-2 rounded-2xl ${
                        msg.sender === 'user'
                        ? 'bg-[#EAD6C9] text-black rounded-tr-none'
                        : 'bg-white text-black rounded-tl-none shadow-sm'
                    }`}>
                        <div className="flex items-center gap-2">
                          {msg.text}
                          {msg.isGenerating && (
                            <Loader2 className="w-4 h-4 animate-spin text-[#6E3677] flex-shrink-0" />
                          )}
                        </div>
                        {msg.showMeditationOffer && !isTyping && (
                          <button
                            onClick={() => handleAcceptMeditation(msg.id)}
                            className="mt-3 flex items-center gap-2 bg-[#6E3677] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#5a2d62] transition-colors"
                          >
                            <Sparkles size={14} /> {t('chat.generateAudio')}
                          </button>
                        )}
                        {msg.audioUrl && (
                          <audio
                            controls
                            src={msg.audioUrl}
                            className="mt-3 w-full rounded-lg"
                            style={{ maxWidth: '280px' }}
                          />
                        )}
                    </div>
                </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && !messages.some(m => m.isGenerating) && (
            <motion.div
              className="flex gap-4 items-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 border border-black/5">
                    <img src={imgKoala} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col gap-1">
                     <span className="text-xs font-bold text-gray-500 ml-1">{t('chat.aiName')}</span>
                     <div className="bg-white text-black px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                        <motion.span
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        ></motion.span>
                        <motion.span
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        ></motion.span>
                        <motion.span
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        ></motion.span>
                     </div>
                </div>
            </motion.div>
        )}
      </div>

      <div className="p-4 pb-8 space-y-4 bg-[#F3EEEA]">
        <div className="flex gap-4 px-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
                className="flex items-center gap-2 border border-black/20 rounded-full px-4 py-2 bg-white/50 text-sm font-medium whitespace-nowrap hover:bg-white/80 transition-colors"
                onClick={handleMeditation}
            >
                <Heart size={16} /> {t('chat.meditation')}
            </button>
            <button
                className="flex items-center gap-2 border border-black/20 rounded-full px-4 py-2 bg-white/50 text-sm font-medium whitespace-nowrap hover:bg-white/80 transition-colors"
                onClick={handleChangeMind}
            >
                <Heart size={16} /> {t('chat.changeMind')}
            </button>
        </div>

        <div className="flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-sm border border-black/5">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('chat.placeholder')}
                className="flex-1 bg-transparent outline-none py-2 text-lg"
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isTyping}
            />
            <button className="text-gray-400 hover:text-gray-600 p-2 transition-colors">
                <Mic size={20} />
            </button>
            <motion.button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    !input.trim() || isTyping ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#6E3677] text-white'
                }`}
                whileHover={input.trim() && !isTyping ? { scale: 1.1 } : {}}
                whileTap={input.trim() && !isTyping ? { scale: 0.95 } : {}}
                transition={{ duration: 0.15 }}
            >
                <Send size={18} />
            </motion.button>
        </div>
      </div>
    </div>
  );
}
