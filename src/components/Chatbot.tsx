'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  RotateCcw, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

const DEFAULT_WEBHOOK_URL = 'http://localhost:5678/webhook-test/e978a7f2-bcc6-478d-8e8d-370526d0ed8b';

export default function Chatbot() {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or load unique sessionId
  useEffect(() => {
    let storedSessionId = '';
    if (typeof window !== 'undefined') {
      storedSessionId = localStorage.getItem('adawat_chatbot_session_id') || '';
      if (!storedSessionId) {
        storedSessionId = 'session_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now();
        localStorage.setItem('adawat_chatbot_session_id', storedSessionId);
      }
      setSessionId(storedSessionId);

      // Welcome message
      setMessages([
        {
          id: 'welcome-msg',
          sender: 'bot',
          text: lang === 'ar'
            ? 'مرحباً بك في منصة أدواتك! أنا مساعدك الذكي المباشر. كيف يمكنني مساعدتك اليوم؟'
            : 'Welcome to ADAWAT! I am your AI assistant. How can I help you today?',
          time: new Date().toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [lang]);

  // Auto scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Send message to n8n Webhook
  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessageTime = new Date().toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const userMessage: Message = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: trimmed,
      time: userMessageTime,
    };

    // Append user message immediately and clear input
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || DEFAULT_WEBHOOK_URL;

    try {
      // 1. Send POST request with JSON body (message & sessionId)
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          message: trimmed,
          sessionId: sessionId || 'session_guest',
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      // 2. Parse response from n8n
      let replyText = '';
      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        const data = await response.json();
        // Support common n8n AI output keys
        if (typeof data === 'string') {
          replyText = data;
        } else if (data && typeof data === 'object') {
          replyText = 
            data.output || 
            data.response || 
            data.message || 
            data.text || 
            data.reply || 
            (Array.isArray(data) && (data[0]?.output || data[0]?.message || data[0]?.text)) ||
            JSON.stringify(data);
        }
      } else {
        replyText = await response.text();
      }

      if (!replyText || replyText.trim() === '') {
        replyText = lang === 'ar' 
          ? 'تم استلام رسالتك بنجاح من نظام n8n.' 
          : 'Your message was successfully processed by n8n.';
      }

      const botMessage: Message = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: replyText,
        time: new Date().toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
      };

      setMessages((prev) => [...prev, botMessage]);

    } catch (error: any) {
      console.error('Error communicating with n8n webhook:', error);
      const errorMsg: Message = {
        id: 'err-' + Date.now(),
        sender: 'bot',
        text: lang === 'ar'
          ? 'تعذر الاتصال بـ Webhook الخاص بـ n8n. تأكد من تشغيل n8n محلياً (Active) وأن مسار webhook-test متاح.'
          : 'Could not connect to n8n Webhook. Please verify n8n is running and the webhook is active.',
        time: new Date().toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset conversation and generate a fresh sessionId
  const handleResetChat = () => {
    const newId = 'session_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now();
    localStorage.setItem('adawat_chatbot_session_id', newId);
    setSessionId(newId);
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'bot',
        text: lang === 'ar'
          ? 'تم بدء محادثة جديدة ومعرف جلسة جديد. كيف يمكنني خدمتك؟'
          : 'Started a fresh session. How can I assist you?',
        time: new Date().toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Chat Window */}
      {isOpen && (
        <div 
          className="mb-3 w-[90vw] sm:w-[380px] h-[520px] max-h-[80vh] bg-[#040406] border border-[#2e3038] rounded-[16px] shadow-2xl flex flex-col overflow-hidden"
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-[#121317] border-b border-[#1c1d22] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-[#08080a] border border-[#cc9166] text-[#cc9166] flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                {/* Active Online Indicator */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#121317]" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-semibold text-[#ffffff]">
                    {lang === 'ar' ? 'المساعد الذكي (n8n AI)' : 'AI Assistant (n8n)'}
                  </h3>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-[#cc9166]/20 text-[#cc9166] border border-[#cc9166]/40">
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-[#777a88] font-mono truncate max-w-[170px]">
                  ID: {sessionId.slice(0, 14)}...
                </p>
              </div>
            </div>

            {/* Actions: Reset & Close */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                title={lang === 'ar' ? 'محادثة جديدة' : 'New Chat Session'}
                className="p-1.5 text-[#9194a1] hover:text-[#ffffff] hover:bg-[#1c1d22] rounded-full transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title={lang === 'ar' ? 'إغلاق' : 'Close'}
                className="p-1.5 text-[#9194a1] hover:text-[#ffffff] hover:bg-[#1c1d22] rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#08080a]/60">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-[14px] px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-gradient-to-r from-[#cc9166] to-[#b37c54] text-[#000000] font-medium rounded-br-xs'
                        : 'bg-[#121317] text-[#e2e3e9] border border-[#1c1d22] rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                  </div>
                  <span className="text-[9px] text-[#5e616e] font-mono mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              );
            })}

            {/* Typing Indicator (Loading State) */}
            {isLoading && (
              <div className="flex flex-col items-start">
                <div className="bg-[#121317] border border-[#1c1d22] rounded-[14px] rounded-bl-xs px-4 py-2.5 flex items-center gap-2">
                  <span className="text-xs text-[#cc9166] font-mono">
                    {lang === 'ar' ? 'جاري الكتابة...' : 'Typing...'}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#cc9166]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#cc9166]/70" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#cc9166]/40" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input & Send Form */}
          <form 
            onSubmit={sendMessage} 
            className="p-2.5 bg-[#040406] border-t border-[#1c1d22] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={lang === 'ar' ? 'اكتب استفسارك هنا...' : 'Type your message here...'}
              disabled={isLoading}
              className="flex-1 px-3.5 py-2 bg-[#121317] border border-[#2e3038] focus:border-[#cc9166] rounded-full text-xs text-[#ffffff] placeholder-[#5e616e] outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-full bg-[#ffffff] hover:bg-[#e2e3e9] text-[#000000] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shrink-0"
              title={lang === 'ar' ? 'إرسال' : 'Send'}
            >
              <Send className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group p-3.5 rounded-full bg-[#040406] hover:bg-[#121317] text-[#cc9166] border border-[#2e3038] hover:border-[#cc9166] shadow-xl hover:shadow-2xl transition-colors active:scale-95 flex items-center justify-center"
        aria-label="مساعد الدردشة"
      >
        {isOpen ? (
          <X className="w-5 h-5 relative z-10 text-[#ffffff]" />
        ) : (
          <div className="flex items-center gap-2 relative z-10">
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs font-mono font-medium hidden sm:inline text-[#e2e3e9]">
              {lang === 'ar' ? 'المساعد الذكي' : 'AI Chat'}
            </span>
          </div>
        )}
      </button>

    </div>
  );
}
