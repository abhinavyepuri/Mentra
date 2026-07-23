import React, { useState, useRef, useEffect } from 'react';
import { User, Classroom, SocraticMessage } from '../../types';
import {
  Bot,
  Sparkles,
  Send,
  User as UserIcon,
  Mic,
  MicOff,
  BookOpen,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface SocraticTutorProps {
  currentUser: User;
  activeClassroom: Classroom;
  onSendSocraticPrompt: (
    prompt: string,
    history: SocraticMessage[],
    topic: string
  ) => Promise<{ replyText: string; doubtLogged: boolean; detectedDoubt: any }>;
}

export const SocraticTutor: React.FC<SocraticTutorProps> = ({
  currentUser,
  activeClassroom,
  onSendSocraticPrompt,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string>(
    activeClassroom.syllabus[0]?.title || 'Torque & Rotational Dynamics'
  );

  const [messages, setMessages] = useState<SocraticMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello ${currentUser.name}! I am your Socratic AI Tutor for ${activeClassroom.name}. I am here to guide your learning through step-by-step questions. What concept in ${selectedTopic} would you like to explore today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [lastDoubtNotice, setLastDoubtNotice] = useState<string | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputPrompt.trim() || isLoading) return;

    const userMsg: SocraticMessage = {
      id: `msg-${Date.now()}`,
      sender: 'student',
      text: inputPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await onSendSocraticPrompt(userMsg.text, updatedHistory, selectedTopic);

      const aiMsg: SocraticMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: res.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (res.doubtLogged && res.detectedDoubt) {
        setLastDoubtNotice(`Concept tagged: "${res.detectedDoubt.conceptTag}" (Silent Doubt Logged to Teacher Dashboard)`);
        setTimeout(() => setLastDoubtNotice(null), 6000);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: 'I had trouble analyzing that statement. Could you rephrase your question or thought?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicToggle = () => {
    if (!isMicActive) {
      setIsMicActive(true);
      setInputPrompt("I'm confused about why moment of inertia depends on distance squared instead of just distance.");
    } else {
      setIsMicActive(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#161618] border border-[#27272A] text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1C1E] text-emerald-400 border border-emerald-500/30 text-xs font-semibold uppercase tracking-widest mb-2">
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            AI Study Helper
          </div>
          <h1 className="text-2xl font-serif italic text-white">Interactive AI Tutor</h1>
          <p className="text-xs text-[#A1A1AA] mt-1 max-w-xl">
            Ask questions step-by-step to understand key concepts. Never worry about making mistakes!
          </p>
        </div>

        {/* Topic Context Dropdown */}
        <div className="bg-[#1C1C1E] p-3 rounded-xl border border-[#27272A] space-y-1">
          <label className="text-[10px] uppercase font-semibold text-[#8E75FF] block">Syllabus Topic Context</label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="bg-[#161618] text-white border border-[#27272A] text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#8E75FF] font-semibold cursor-pointer"
          >
            {(activeClassroom?.syllabus || []).map((s) => (
              <option key={s.id} value={s.title}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Silent Doubt Sync Alert Banner */}
      {lastDoubtNotice ? (
        <div className="p-3 rounded-xl bg-[#1C1C1E] border border-amber-500/30 text-amber-400 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span><strong>Silent Learning Assist:</strong> {lastDoubtNotice}</span>
          </div>
          <span className="text-[10px] text-amber-400 font-semibold">Teacher notified for support</span>
        </div>
      ) : (
        <div className="p-2.5 rounded-xl bg-[#1C1C1E] border border-[#27272A] text-[#8E75FF] text-[11px] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#8E75FF]" />
            <strong>Silent Doubt Logging Active:</strong> If you get stuck, doubts are auto-flagged to your teacher so they can adapt upcoming lectures.
          </span>
        </div>
      )}

      {/* Chat Messages Container */}
      <div className="bg-[#161618] rounded-2xl border border-[#27272A] shadow-lg p-4 sm:p-6 flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'student' ? 'flex-row-reverse' : ''
              }`}
            >
              {msg.sender === 'student' ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-[#8E75FF]/30 shrink-0 mt-1"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#1C1C1E] border border-[#27272A] text-[#8E75FF] flex items-center justify-center font-bold shrink-0 mt-1 shadow">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed space-y-1 ${
                  msg.sender === 'student'
                    ? 'bg-[#8E75FF] text-white rounded-tr-none'
                    : 'bg-[#1C1C1E] text-[#EDEDED] border border-[#27272A] rounded-tl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-4 text-[10px] opacity-70 mb-1">
                  <span className="font-bold">{msg.sender === 'student' ? currentUser.name : 'Mentra Socratic AI'}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#8E75FF] text-white flex items-center justify-center font-bold shrink-0 shadow">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-[#27272A] text-xs text-[#A1A1AA] rounded-tl-none flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#8E75FF]" />
                Mentra is analyzing your thought process...
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Box */}
        <div className="pt-4 border-t border-[#27272A] mt-2 space-y-2">
          {/* Preset Prompts */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[10px]">
            <span className="font-semibold text-[#8E75FF] shrink-0 uppercase">Quick Ideas:</span>
            <button
              onClick={() => setInputPrompt("I don't get why hollow cylinders roll slower than solid disks down an incline.")}
              className="px-2.5 py-1 rounded-full bg-[#1C1C1E] border border-[#27272A] hover:bg-[#27272A] text-[#EDEDED] shrink-0 transition cursor-pointer"
            >
              Hollow vs Solid Disk Incline
            </button>
            <button
              onClick={() => setInputPrompt('Can you guide me step-by-step through calculating torque cross product direction?')}
              className="px-2.5 py-1 rounded-full bg-[#1C1C1E] border border-[#27272A] hover:bg-[#27272A] text-[#EDEDED] shrink-0 transition cursor-pointer"
            >
              Torque Cross Product
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleMicToggle}
              className={`p-2.5 rounded-xl border transition cursor-pointer ${
                isMicActive
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                  : 'bg-[#1C1C1E] text-[#A1A1AA] border-[#27272A] hover:bg-[#27272A]'
              }`}
              title="Voice Input Simulation"
            >
              {isMicActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            <input
              type="text"
              placeholder={`Ask or share your understanding about ${selectedTopic}...`}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-4 py-2.5 bg-[#1C1C1E] border border-[#27272A] rounded-xl text-xs text-white placeholder-[#A1A1AA] focus:outline-none focus:ring-1 focus:ring-[#8E75FF]"
            />

            <button
              onClick={handleSend}
              disabled={!inputPrompt.trim() || isLoading}
              className="px-5 py-2.5 bg-[#8E75FF] hover:bg-[#8E75FF]/90 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
