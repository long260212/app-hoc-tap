import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Drama,
  Mic,
  MicOff,
  Send,
  Volume2,
  Sparkles,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  Award,
  Utensils,
  Plane,
  ShoppingBag,
  MapPin,
  Building2,
  Briefcase,
} from 'lucide-react';
import { ROLE_PLAY_SCENARIOS } from '../../services/mockData';
import { RolePlayScenario, ProficiencyLevel, SpeakingMessage, SpeakingFeedback } from '../../types';
import { AIService } from '../../services/aiService';
import { SpeechService } from '../../services/speechService';
import { useApp } from '../../context/AppContext';
import { SpotlightCard } from '../motion/SpotlightCard';
import { AudioWaveform } from '../motion/AudioWaveform';
import { AIThinkingOrb } from '../motion/AIThinkingOrb';
import { AnimatedCounter } from '../motion/AnimatedCounter';
import confetti from 'canvas-confetti';

export const RolePlayPractice: React.FC = () => {
  const { addHistoryRecord, showToast } = useApp();

  const [selectedScenario, setSelectedScenario] = useState<RolePlayScenario>(ROLE_PLAY_SCENARIOS[0]);
  const [level, setLevel] = useState<ProficiencyLevel>('Intermediate');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [messages, setMessages] = useState<SpeakingMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isAIResponding, setIsAIResponding] = useState<boolean>(false);
  const [activeFeedback, setActiveFeedback] = useState<SpeakingFeedback | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAIResponding]);

  const getScenarioIcon = (iconName: string) => {
    switch (iconName) {
      case 'Utensils': return Utensils;
      case 'Plane': return Plane;
      case 'ShoppingBag': return ShoppingBag;
      case 'MapPin': return MapPin;
      case 'Building2': return Building2;
      case 'Briefcase': return Briefcase;
      default: return Drama;
    }
  };

  const startRolePlay = () => {
    setIsPlaying(true);
    setSessionStartTime(Date.now());
    setActiveFeedback(null);
    setIsAIResponding(true);

    setTimeout(() => {
      const initialMsg: SpeakingMessage = {
        id: `rp-msg-${Date.now()}`,
        sender: 'ai',
        text: selectedScenario.initialMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([initialMsg]);
      setIsAIResponding(false);
      SpeechService.speak(selectedScenario.initialMessage);
    }, 500);
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
          if (isFinal) setIsListening(false);
        },
        (errMsg) => {
          setIsListening(false);
          showToast(errMsg, 'warning');
        },
        () => setIsListening(false)
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
        topic: selectedScenario.title,
        level,
        studentSpeech: text,
        rolePlayScenario: `${selectedScenario.context}. AI plays ${selectedScenario.aiRole}, Student plays ${selectedScenario.userRole}.`,
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
      SpeechService.speak(response.aiReply);
    } catch {
      setIsAIResponding(false);
      showToast('Có lỗi kết nối. Hãy thử lại!', 'error');
    }
  };

  const finishRolePlay = () => {
    SpeechService.cancelSpeaking();
    SpeechService.stopListening();

    const feedbacks = messages.filter((m) => m.feedback).map((m) => m.feedback!);
    const avgScore =
      feedbacks.length > 0
        ? Math.round(feedbacks.reduce((sum, f) => sum + f.overallScore, 0) / feedbacks.length)
        : 88;

    const durationSeconds = Math.max(40, Math.round((Date.now() - sessionStartTime) / 1000));

    addHistoryRecord({
      activityType: 'RolePlay',
      topicId: selectedScenario.id,
      topicTitle: selectedScenario.title,
      level,
      score: avgScore,
      durationSeconds,
      skillCategory: 'Speaking',
      detailsSummary: `Đóng vai tình huống "${selectedScenario.title}" với AI. Đạt điểm: ${avgScore}/100.`,
      speakingFeedback: feedbacks,
    });

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6">
      {!isPlaying ? (
        <SpotlightCard className="p-6 lg:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Drama className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl lg:text-2xl font-black text-white">
                  Chế Độ Role-Play Tình Huống Thực Tế
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Tạo phản xạ giao tiếp đời sống như thật: Gọi món ở nhà hàng, thủ tục sân bay, mua sắm và hỏi đường.
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-[#090c14] border border-white/[0.08] p-1 rounded-2xl">
              {(['Beginner', 'Intermediate', 'Advanced'] as ProficiencyLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    level === lvl ? 'bg-indigo-600 text-white shadow-glow-indigo' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Scenarios Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROLE_PLAY_SCENARIOS.map((scenario) => {
              const Icon = getScenarioIcon(scenario.icon);
              const isSelected = selectedScenario.id === scenario.id;
              return (
                <SpotlightCard
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario)}
                  className={`p-5 cursor-pointer flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/15 shadow-glow-indigo ring-1 ring-indigo-500/50'
                      : 'hover:border-white/[0.15]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                        isSelected ? 'bg-indigo-600 text-white shadow-glow-indigo' : 'bg-white/[0.06] text-slate-300'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/[0.06] text-slate-400">
                        {scenario.titleVi}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-white text-sm">{scenario.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{scenario.context}</p>

                    <div className="mt-3 pt-3 border-t border-white/[0.06] space-y-1 text-xs">
                      <div className="text-slate-300">
                        <span className="text-slate-500 font-medium">AI đóng vai: </span>
                        <strong>{scenario.aiRole}</strong>
                      </div>
                      <div className="text-slate-300">
                        <span className="text-slate-500 font-medium">Bạn đóng vai: </span>
                        <strong className="text-indigo-400">{scenario.userRole}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 flex items-center justify-between text-xs font-bold text-indigo-400">
                    <span>{isSelected ? 'Đang chọn' : 'Chọn tình huống này'}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </SpotlightCard>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={startRolePlay}
              className="px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-extrabold text-xs rounded-2xl shadow-glow-indigo transition-all transform hover:-translate-y-0.5 active:scale-98 flex items-center gap-2"
            >
              <Drama className="w-4 h-4" />
              <span>Bắt đầu nhập vai ngay</span>
            </button>
          </div>
        </SpotlightCard>
      ) : (
        /* Active Roleplay interface */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-[#0d111a]/85 backdrop-blur-xl rounded-3xl border border-white/[0.08] shadow-card flex flex-col h-[660px] overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/[0.06] bg-[#0a0d15] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-glow-indigo">
                  <Drama className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    {selectedScenario.title}
                    <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                      {level}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    AI: <span className="font-semibold text-slate-300">{selectedScenario.aiRole}</span> | Bạn: <span className="font-semibold text-indigo-400">{selectedScenario.userRole}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={finishRolePlay}
                className="px-3.5 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-colors"
              >
                Hoàn thành & Lưu
              </button>
            </div>

            {/* Suggested Starter Phrases for Students */}
            <div className="px-5 py-2.5 bg-indigo-950/30 border-b border-white/[0.06] flex items-center gap-2 overflow-x-auto text-xs">
              <span className="font-bold text-indigo-300 shrink-0 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5" /> Gợi ý câu:
              </span>
              <div className="flex items-center gap-2">
                {selectedScenario.suggestedPhrases.map((phrase, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputText(phrase)}
                    className="shrink-0 bg-white/[0.04] border border-white/[0.08] text-slate-300 px-2.5 py-1 rounded-xl hover:bg-white/[0.1] hover:text-white transition-colors text-[11px] font-medium"
                  >
                    "{phrase}"
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Flow */}
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
                        <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mb-1" title={selectedScenario.aiRole}>
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
                        <div className={`mt-2 flex items-center justify-between text-[10px] ${isAI ? 'text-slate-400' : 'text-indigo-200'}`}>
                          <span>{msg.timestamp}</span>
                          {isAI && (
                            <button
                              onClick={() => SpeechService.speak(msg.text)}
                              className="p-1 hover:text-indigo-400 text-slate-400 ml-2"
                              title="Nghe phát âm"
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
              {isAIResponding && <AIThinkingOrb text={`${selectedScenario.aiRole} đang phản hồi...`} />}
              <div ref={messagesEndRef} />
            </div>

            {/* Audio Waveform */}
            <AudioWaveform isActive={isListening} />

            {/* Input area */}
            <div className="p-4 border-t border-white/[0.06] bg-[#090c14]">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleListening}
                  className={`p-3.5 rounded-2xl transition-all flex items-center justify-center shrink-0 ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse shadow-glow-rose'
                      : 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/30'
                  }`}
                  title="Nói qua microphone"
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Đóng vai ${selectedScenario.userRole} và phản hồi...`}
                  className="flex-1 px-4 py-3 bg-[#111624] border border-white/[0.08] rounded-2xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
                />

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isAIResponding}
                  className="p-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-2xl transition-all shadow-glow-indigo shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Feedback details */}
          <div className="lg:col-span-4">
            <AnimatePresence mode="wait">
              {activeFeedback ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-[#0d111a]/85 backdrop-blur-xl rounded-3xl border border-white/[0.08] p-5 shadow-card space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">
                      Phản Hồi Nhập Vai
                    </h4>
                    <span className="font-black text-sm text-indigo-400 bg-indigo-500/15 border border-indigo-500/25 px-2.5 py-1 rounded-full">
                      <AnimatedCounter value={activeFeedback.overallScore} />/100
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Phát âm:</span> <strong className="text-white">{activeFeedback.pronunciationScore}/100</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Ngữ pháp:</span> <strong className="text-white">{activeFeedback.grammarScore}/100</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Độ trôi chảy:</span> <strong className="text-white">{activeFeedback.fluencyScore}/100</strong>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 text-xs border-t border-white/[0.06]">
                    <div>
                      <span className="font-bold text-slate-400 block mb-1">Câu đã nói:</span>
                      <p className="p-2.5 bg-[#121726] rounded-xl text-slate-200 italic border border-white/[0.06]">
                        "{activeFeedback.studentSentence}"
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-emerald-400 block mb-1">Diễn đạt tự nhiên hơn trong vai:</span>
                      <p className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 rounded-xl font-medium">
                        "{activeFeedback.betterExpression}"
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-indigo-400 block mb-1">Từ vựng phù hợp ngữ cảnh:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeFeedback.recommendedVocab.map((w, i) => (
                          <span key={i} className="px-2 py-0.5 bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 rounded-lg text-[10px] font-semibold">
                            {w}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-[#0d111a]/70 rounded-3xl border border-dashed border-white/[0.08] p-8 text-center text-slate-500 space-y-3">
                  <Drama className="w-10 h-10 mx-auto text-slate-600" />
                  <h4 className="font-bold text-slate-300 text-xs">Hộp Đánh Giá Tình Huống</h4>
                  <p className="text-[11px] leading-relaxed">
                    AI sẽ đánh giá phong cách giao tiếp và gợi ý mẫu câu chuẩn mực của người bản xứ sau mỗi câu nói của bạn.
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
