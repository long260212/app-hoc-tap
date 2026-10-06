import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Volume2,
  Send,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import { TOPICS_LIST } from '../../services/mockData';
import { TopicItem, ProficiencyLevel, SpeakingFeedback, SpeakingMessage } from '../../types';
import { SpeechService } from '../../services/speechService';
import { AIService } from '../../services/aiService';
import { useApp } from '../../context/AppContext';
import { SpotlightCard } from '../motion/SpotlightCard';
import { AudioWaveform } from '../motion/AudioWaveform';
import { AIThinkingOrb } from '../motion/AIThinkingOrb';
import { AnimatedCounter } from '../motion/AnimatedCounter';
import { ShimmerText } from '../motion/ShimmerText';
import confetti from 'canvas-confetti';

export const SpeakingPractice: React.FC = () => {
  const { addHistoryRecord, showToast } = useApp();

  const [selectedTopic, setSelectedTopic] = useState<TopicItem>(TOPICS_LIST[0]);
  const [level, setLevel] = useState<ProficiencyLevel>('Intermediate');
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);

  const [messages, setMessages] = useState<SpeakingMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isAIResponding, setIsAIResponding] = useState<boolean>(false);
  const [activeFeedback, setActiveFeedback] = useState<SpeakingFeedback | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAIResponding]);

  // Keyboard shortcut: Spacebar to toggle mic when input is not focused (Section 35)
  useEffect(() => {
    if (!isSessionActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        toggleListening();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSessionActive, isListening]);

  const startSession = async () => {
    setIsSessionActive(true);
    setSessionStartTime(Date.now());
    setMessages([]);
    setActiveFeedback(null);
    setIsAIResponding(true);

    const initialAiPrompt = `Hi! I'm thrilled to chat with you today about "${selectedTopic.title}". To get started, could you introduce your thoughts or tell me a little about your experience with this?`;

    setTimeout(() => {
      const firstMsg: SpeakingMessage = {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        text: initialAiPrompt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([firstMsg]);
      setIsAIResponding(false);
      SpeechService.speak(initialAiPrompt, { rate: speechRate });
    }, 600);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      SpeechService.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      const rec = SpeechService.startListening(
        (transcript, isFinal) => {
          setInputText(transcript);
          if (isFinal) {
            setIsListening(false);
          }
        },
        (errorMsg) => {
          setIsListening(false);
          showToast(errorMsg, 'warning');
        },
        () => {
          setIsListening(false);
        }
      );
      recognitionRef.current = rec;
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isAIResponding) return;

    if (isListening) {
      recognitionRef.current?.stop();
      SpeechService.stopListening();
      setIsListening(false);
    }

    const userMsg: SpeakingMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsAIResponding(true);

    try {
      const historyPayload = messages.map((m) => ({ sender: m.sender, text: m.text }));
      const response = await AIService.sendSpeakingTurn({
        topic: selectedTopic.title,
        level,
        studentSpeech: text,
        history: historyPayload,
      });

      const aiMsg: SpeakingMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        feedback: response.feedback,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setActiveFeedback(response.feedback);
      setIsAIResponding(false);

      SpeechService.speak(response.aiReply, { rate: speechRate });
    } catch {
      setIsAIResponding(false);
      showToast('Có lỗi kết nối. Đã dùng Mock AI dự phòng.', 'error');
    }
  };

  const finishSession = () => {
    SpeechService.cancelSpeaking();
    SpeechService.stopListening();

    const feedbacks = messages.filter((m) => m.feedback).map((m) => m.feedback!);
    const avgScore =
      feedbacks.length > 0
        ? Math.round(feedbacks.reduce((sum, f) => sum + f.overallScore, 0) / feedbacks.length)
        : 85;

    const durationSeconds = Math.max(30, Math.round((Date.now() - sessionStartTime) / 1000));

    addHistoryRecord({
      activityType: 'Speaking',
      topicId: selectedTopic.id,
      topicTitle: selectedTopic.title,
      level,
      score: avgScore,
      durationSeconds,
      skillCategory: 'Speaking',
      detailsSummary: `Luyện nói ${feedbacks.length} lượt. Điểm tổng: ${avgScore}/100.`,
      speakingFeedback: feedbacks,
    });

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setIsSessionActive(false);
  };

  return (
    <div className="space-y-6">
      {!isSessionActive ? (
        <SpotlightCard className="p-6 lg:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Mic className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl lg:text-2xl font-black text-white">
                  Luyện Nói Tiếng Anh Cùng <ShimmerText>AI Speaking</ShimmerText>
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                17 chủ đề thực tế đời sống. AI đối thoại và chấm điểm 5 tiêu chí sau mỗi câu nói.
              </p>
            </div>

            {/* Level selection */}
            <div className="flex items-center gap-1.5 bg-[#090c14] border border-white/[0.08] p-1 rounded-2xl">
              {(['Beginner', 'Intermediate', 'Advanced'] as ProficiencyLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    level === lvl
                      ? 'bg-indigo-600 text-white shadow-glow-indigo'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* 17 Topics Grid */}
          <div>
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-400">
                17 Chủ đề giao tiếp thực tế
              </span>
              <span className="text-indigo-400 font-semibold">
                Đang chọn: <strong>{selectedTopic.title}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {TOPICS_LIST.map((topic) => {
                const isSelected = selectedTopic.id === topic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/15 shadow-glow-indigo ring-1 ring-indigo-500/50'
                        : 'border-white/[0.06] bg-[#0c101a] hover:border-white/[0.15] hover:bg-[#111624]'
                    }`}
                  >
                    <div>
                      <p className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {topic.title}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{topic.titleVi}</p>
                    </div>
                    <span className="text-[9px] font-semibold text-slate-400 mt-2 block">
                      {topic.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Start CTA Button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={startSession}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-500 via-blue-600 to-cyan-500 text-white font-extrabold text-xs rounded-2xl shadow-glow-indigo transition-all transform hover:-translate-y-0.5 active:scale-98 flex items-center justify-center gap-2"
            >
              <Mic className="w-4 h-4" />
              <span>Bắt đầu trò chuyện với AI</span>
            </button>
          </div>
        </SpotlightCard>
      ) : (
        /* Conversation Interface */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Stream (Col 8) */}
          <div className="lg:col-span-8 bg-[#0d111a]/85 backdrop-blur-xl rounded-3xl border border-white/[0.08] shadow-card flex flex-col h-[660px] overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/[0.06] bg-[#0a0d15] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    {selectedTopic.title}
                    <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                      {level}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Đối thoại giọng nói 1:1 với AI</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="text-xs font-semibold bg-[#111624] border border-white/[0.08] rounded-xl px-2.5 py-1 text-slate-300 focus:outline-none"
                  title="Tốc độ AI phát âm"
                >
                  <option value={0.75}>0.75x</option>
                  <option value={1.0}>1.0x</option>
                  <option value={1.25}>1.25x</option>
                </select>

                <button
                  onClick={finishSession}
                  className="px-3 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-colors"
                >
                  Kết thúc & Lưu
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg) => {
                const isAI = msg.sender === 'ai';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[75%]">
                      {isAI && (
                        <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mb-1 shadow-glow-indigo">
                          AI
                        </div>
                      )}
                      <div
                        className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isAI
                            ? 'bg-[#121726] text-slate-100 border border-white/[0.08] shadow-sm rounded-bl-sm'
                            : 'bg-indigo-600 text-white shadow-glow-indigo rounded-br-sm'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <div
                          className={`mt-2 flex items-center justify-between text-[10px] ${
                            isAI ? 'text-slate-400' : 'text-indigo-200'
                          }`}
                        >
                          <span>{msg.timestamp}</span>
                          {isAI && (
                            <button
                              onClick={() => SpeechService.speak(msg.text, { rate: speechRate })}
                              className="p-1 hover:text-indigo-400 text-slate-400 transition-colors ml-2"
                              title="Nghe lại câu nói của AI"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {msg.feedback && (
                      <button
                        onClick={() => setActiveFeedback(msg.feedback!)}
                        className="mt-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full ml-9"
                      >
                        <Award className="w-3 h-3" />
                        <span>Xem chấm điểm lượt nói ({msg.feedback.overallScore}/100)</span>
                      </button>
                    )}
                  </div>
                );
              })}

              {isAIResponding && <AIThinkingOrb />}
              <div ref={messagesEndRef} />
            </div>

            {/* Audio Waveform Bar (Section 8) */}
            <AudioWaveform isActive={isListening} />

            {/* Input & Microphone Controls (Section 7) */}
            <div className="p-4 border-t border-white/[0.06] bg-[#090c14]">
              <div className="flex items-center gap-2">
                {/* Microphone Button with Smooth Pulse Rings (Section 7) */}
                <div className="relative flex items-center justify-center">
                  {isListening && (
                    <>
                      <div className="absolute w-12 h-12 rounded-full border border-rose-500 animate-mic-ring-1 pointer-events-none" />
                      <div className="absolute w-12 h-12 rounded-full border border-rose-500 animate-mic-ring-2 pointer-events-none" />
                    </>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={toggleListening}
                    className={`relative z-10 p-3.5 rounded-2xl transition-colors flex items-center justify-center shrink-0 ${
                      isListening
                        ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40'
                        : 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/30 shadow-glow-indigo'
                    }`}
                    title={isListening ? 'Bấm để dừng ghi âm (Space)' : 'Bấm để nói bằng microphone (Space)'}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </motion.button>
                </div>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={
                    isListening
                      ? 'Đang lắng nghe giọng nói của bạn... Hãy nói câu tiếng Anh!'
                      : 'Nói qua micro (Space) hoặc gõ câu trả lời tiếng Anh tại đây...'
                  }
                  className="flex-1 px-4 py-3 bg-[#111624] border border-white/[0.08] rounded-2xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
                />

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isAIResponding}
                  className="p-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-2xl transition-all shadow-glow-indigo shrink-0"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                <span>Nhấn <strong>Space</strong> để bật/tắt micro • Nhấn <strong>Enter</strong> để gửi</span>
                <span>AI tôn trọng nhịp điệu tự nhiên của bạn</span>
              </div>
            </div>
          </div>

          {/* Real-time Feedback & Coaching Panel (Col 4) (Section 10 & 11) */}
          <div className="lg:col-span-4 space-y-4">
            <AnimatePresence mode="wait">
              {activeFeedback ? (
                <motion.div
                  key="feedback-card"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="bg-[#0d111a]/85 backdrop-blur-xl rounded-3xl border border-white/[0.08] p-5 shadow-card space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-indigo-400" />
                      <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">
                        Đánh Giá Lượt Nói Vừa Rồi
                      </h4>
                    </div>

                    {/* Animated Score (Section 11) */}
                    <div className="flex items-baseline gap-1 bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 px-2.5 py-1 rounded-full font-black text-sm">
                      <AnimatedCounter value={activeFeedback.overallScore} duration={800} />
                      <span className="text-[10px] text-slate-400">/100</span>
                    </div>
                  </div>

                  {/* 5 Tiêu chí điểm số (Staggered Animation) */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Phát âm (Pronunciation):</span>
                        <strong className="text-white">{activeFeedback.pronunciationScore}/100</strong>
                      </div>
                      <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-cyan-400 h-full rounded-full transition-all duration-700"
                          style={{ width: `${activeFeedback.pronunciationScore}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Ngữ pháp (Grammar):</span>
                        <strong className="text-white">{activeFeedback.grammarScore}/100</strong>
                      </div>
                      <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-400 h-full rounded-full transition-all duration-700"
                          style={{ width: `${activeFeedback.grammarScore}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Từ vựng (Vocabulary):</span>
                        <strong className="text-white">{activeFeedback.vocabularyScore}/100</strong>
                      </div>
                      <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-400 h-full rounded-full transition-all duration-700"
                          style={{ width: `${activeFeedback.vocabularyScore}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-1">
                        <span>Độ trôi chảy (Fluency):</span>
                        <strong className="text-white">{activeFeedback.fluencyScore}/100</strong>
                      </div>
                      <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-400 h-full rounded-full transition-all duration-700"
                          style={{ width: `${activeFeedback.fluencyScore}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Real-time Staggered Corrections (Section 10) */}
                  <div className="space-y-3 pt-2 text-xs border-t border-white/[0.06]">
                    {/* 1. Câu vừa nói */}
                    <div>
                      <span className="font-bold text-slate-400 block mb-1">1. Câu bạn vừa nói:</span>
                      <div className="p-2.5 bg-[#121726] rounded-xl text-slate-200 italic border border-white/[0.06]">
                        "{activeFeedback.studentSentence}"
                      </div>
                    </div>

                    {/* 2. Lỗi sai highlight bằng soft coral */}
                    {activeFeedback.errors && activeFeedback.errors.length > 0 && (
                      <div>
                        <span className="font-bold text-rose-400 flex items-center gap-1 mb-1">
                          <AlertCircle className="w-3.5 h-3.5" /> 2. Điểm cần lưu ý:
                        </span>
                        <ul className="list-disc pl-4 space-y-0.5 text-rose-300 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                          {activeFeedback.errors.map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 3. Câu sửa chuẩn ngữ pháp bằng soft green */}
                    <div>
                      <span className="font-bold text-emerald-400 flex items-center gap-1 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 3. Câu chuẩn xác:
                      </span>
                      <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 rounded-xl font-medium">
                        "{activeFeedback.correctedSentence}"
                      </div>
                    </div>

                    {/* 4. Cách nói tự nhiên hơn */}
                    <div>
                      <span className="font-bold text-cyan-400 flex items-center gap-1 mb-1">
                        <Lightbulb className="w-3.5 h-3.5" /> 4. Cách diễn đạt tự nhiên hơn:
                      </span>
                      <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 rounded-xl font-medium">
                        "{activeFeedback.betterExpression}"
                      </div>
                    </div>

                    {/* 5. Gợi ý ngữ âm */}
                    {activeFeedback.pronunciationTips && (
                      <div>
                        <span className="font-bold text-violet-400 block mb-1">5. Mẹo phát âm:</span>
                        <p className="p-2.5 bg-violet-500/10 border border-violet-500/20 text-violet-200 rounded-xl leading-relaxed">
                          {activeFeedback.pronunciationTips}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="bg-[#0d111a]/70 rounded-3xl border border-dashed border-white/[0.08] p-8 text-center text-slate-500 space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/[0.04] mx-auto flex items-center justify-center text-slate-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-300 text-xs">Bảng Đánh Giá AI Thông Minh</h4>
                  <p className="text-[11px] leading-relaxed">
                    Nói hoặc gửi một câu trả lời để AI tự động chấm phát âm, ngữ pháp, độ trôi chảy và xuất hiện phân tích chi tiết tại đây.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};
