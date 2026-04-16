import { useNavigate } from "react-router";
import { ArrowLeft, Search, Mail, Heart, Lasso } from "lucide-react";
import imgKoala from "@/assets/8e3a8ca18b6104070e04a9f1cdd5980d520b3a7d.png";
import imgAvatar2 from "@/assets/52f234f7faef1871ad9badb4f8506eb836151d5a.png";
import imgAvatar3 from "@/assets/44feed051e3dcd72e335777cc4f45107e20e02be.png";

export default function ChatList() {
  const navigate = useNavigate();

  const chats = [
    { id: 1, name: "Love ego AI", message: "Hello, I am Love ego AI...", time: "10:30 AM", avatar: imgKoala, unread: 2 },
    { id: 2, name: "Community", message: "New meditation session available!", time: "Yesterday", avatar: imgAvatar2, unread: 0 },
    { id: 3, name: "Support", message: "How can we help you today?", time: "Tue", avatar: imgAvatar3, unread: 0 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F3EEEA] relative">
      {/* Header */}
      <div className="p-6 pt-12 flex items-center justify-between">
         <button onClick={() => navigate('/home')} className="w-10 h-10 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6" />
         </button>
         <h1 className="text-[32px] font-bold font-['IM_FELL_DW_Pica'] text-white">Chats</h1>
         <div className="w-10 h-10"></div> {/* Spacer */}
      </div>

      {/* Title Area - The large "Chats" text is actually white in the screenshot? No, it's black/dark. 
          Wait, in Frame1.tsx lines 452, text color is #f3eeea (which is beige) but background is beige. 
          Ah, maybe it's layered on something dark.
          The screenshot shows "Chats" in large white letters on a dark background? No, it's black text on beige.
          Let's stick to black text on beige for consistency with Home.
      */}
      <div className="px-6 mb-6">
          <h1 className="text-[48px] font-normal font-['IM_FELL_DW_Pica'] text-[#F3EEEA] absolute top-10 left-1/2 -translate-x-1/2 z-0 opacity-0">Chats</h1>
          {/* Actually the screenshot shows "Chats" in white on a dark card? 
              No, looking at the middle row, 2nd screen: 
              "Chats" is large text at top.
          */}
          <h1 className="text-[40px] font-normal font-['IM_FELL_DW_Pica'] text-[#4A235A]">Chats</h1>
      </div>

      {/* Filter Icons */}
      <div className="flex gap-4 px-6 mb-8">
        <button className="w-12 h-12 bg-[#212121] rounded-full flex items-center justify-center text-white shadow-lg">
            <Mail size={20} />
        </button>
        <button className="w-12 h-12 bg-[#F3EEEA] border border-black/10 rounded-full flex items-center justify-center text-black shadow-sm">
            <Lasso size={20} />
        </button>
         <button className="w-12 h-12 bg-[#F3EEEA] border border-black/10 rounded-full flex items-center justify-center text-black shadow-sm">
            <Heart size={20} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-[20px] flex items-center px-4 py-3 shadow-sm">
            <Search className="text-gray-400 w-5 h-5 mr-3" />
            <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent outline-none w-full text-base font-['Nunito']"
            />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 px-4 pb-20 overflow-y-auto">
        <div className="space-y-3">
            {chats.map((chat) => (
                <div 
                    key={chat.id}
                    onClick={() => navigate('/chat/detail')}
                    className="flex items-center gap-4 p-4 bg-white rounded-[24px] shadow-sm cursor-pointer hover:bg-white/80 transition-colors"
                >
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 border border-black/5 flex-shrink-0">
                        <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                            <h3 className="text-lg font-bold font-['Nunito'] truncate">{chat.name}</h3>
                            <span className="text-xs text-gray-400 font-['Nunito'] whitespace-nowrap ml-2">{chat.time}</span>
                        </div>
                        <p className="text-gray-500 text-sm truncate font-['Nunito']">{chat.message}</p>
                    </div>
                    {chat.unread > 0 && (
                        <div className="w-6 h-6 bg-[#D87234] rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {chat.unread}
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
