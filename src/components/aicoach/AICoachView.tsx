import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  BookOpenCheck,
  Headphones,
  Mic,
  Bot,
  Send,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AIService } from '../../services/aiService';
import { SpotlightCard } from '../motion/SpotlightCard';

export const AICoachView: React.FC = () => {
  const { history, dailyStats, user, setCurrentTab } = useApp();

  const coachAnalysis = AIService.getAICoachAnalysis(history, dailyStats, user);

  const [coachChat, setCoachChat] = useState<{ sender: 'coach' | 'student'; text: string }[]>([
    {
      sender: 'coach',
      text: `Xin chào ${user.fullName}! Thầy là AI Learning Coach đồng hành cùng em. Em đang muốn cải thiện kỹ năng nào hôm nay, hoặc có câu hỏi ngữ pháp nào cần thầy giải đáp không?`,
    },
  ]);
  const [coachInput, setCoachInput] = useState<string>('');

  const handleSendCoachMsg = () => {
    if (!coachInput.trim()) return;

    const userText = coachInput.trim();
    setCoachChat((prev) => [...prev, { sender: 'student', text: userText }]);
    setCoachInput('');

    setTimeout(() => {
      let reply = `Thầy đã ghi nhận câu hỏi: "${userText}". Đối với phần này, em nên chú ý ngữ cảnh và thực hành đều đặn mỗi ngày ít nhất 15 phút. Thầy gợi ý em thử làm thêm bài tập trắc nghiệm và luyện nói tình huống tương ứng nhé!`;

      if (userText.toLowerCase().includes('thì') || userText.toLowerCase().includes('tense')) {
        reply = `Để nắm chắc các thì trong tiếng Anh, em hãy nhớ quy tắc: Hiện tại đơn (thói quen, chân lý), Quá khứ đơn (hành động đã kết thúc có mốc thời gian rõ ràng) và Hiện tại hoàn thành (kết quả còn lưu ở hiện tại). Em có thể vào mục "Kho bài tập" chọn dạng Grammar để luyện tập ngay nhé!`;
      } else if (userText.toLowerCase().includes('nói') || userText.toLowerCase().includes('phát âm')) {
        reply = `Về phát âm, em hãy tập trung phát âm rõ các âm đuôi /s/, /t/, /d/ và nối âm khi đọc cụm từ. Thầy khuyến khích em vào mục "AI Speaking" luyện chủ đề "Food & Cooking" hoặc "Shopping"!`;
      }

      setCoachChat((prev) => [...prev, { sender: 'coach', text: reply }]);
    }, 600);
  };

  const handleExecuteAction = (actionType: string) => {
    if (actionType === 'roleplay') setCurrentTab('roleplay');
    else if (actionType === 'speaking') setCurrentTab('speaking');
    else if (actionType === 'listening') setCurrentTab('listening');
    else if (actionType === 'exercise') setCurrentTab('exercises');
    else if (actionType === 'reading') setCurrentTab('reading');
    else if (actionType === 'fillblanks') setCurrentTab('fillblanks');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Header */}
      <SpotlightCard className="p-6 lg:p-8 card-gradient-border">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 text-xs font-bold text-cyan-300 border border-cyan-500/25">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>AI Learning Coach Thông Minh</span>
          </div>

          <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
            Cố Vấn Học Tập Cá Nhân Hóa Dành Riêng Cho Bạn
          </h2>
          <p className="text-xs lg:text-sm text-slate-300 font-medium leading-relaxed max-w-3xl">
            {coachAnalysis.overallAssessment}
          </p>
        </div>
      </SpotlightCard>

      {/* 3 Core Qualitative Remarks with Sequential Sentence Reveal (Section 27) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Remark 1: Speaking */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <SpotlightCard className="p-5 space-y-3 h-full">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/25 text-blue-400 flex items-center justify-center font-bold">
                <Mic className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-1 rounded-lg">
                Tiến bộ +12%
              </span>
            </div>
            <h4 className="font-extrabold text-white text-xs sm:text-sm">
              “Your speaking fluency improved this week.”
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              {coachAnalysis.speakingFeedback}
            </p>
          </SpotlightCard>
        </motion.div>

        {/* Remark 2: Grammar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <SpotlightCard className="p-5 space-y-3 h-full">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/25 text-amber-400 flex items-center justify-center font-bold">
                <BookOpenCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/25 px-2.5 py-1 rounded-lg">
                Cần chú ý
              </span>
            </div>
            <h4 className="font-extrabold text-white text-xs sm:text-sm">
              “You often make mistakes with past tense.”
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              {coachAnalysis.grammarFeedback}
            </p>
          </SpotlightCard>
        </motion.div>

        {/* Remark 3: Listening */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <SpotlightCard className="p-5 space-y-3 h-full">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/25 text-cyan-400 flex items-center justify-center font-bold">
                <Headphones className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/15 border border-cyan-500/25 px-2.5 py-1 rounded-lg">
                Đề xuất luyện thêm
              </span>
            </div>
            <h4 className="font-extrabold text-white text-xs sm:text-sm">
              “Your listening skill needs more practice.”
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              {coachAnalysis.listeningFeedback}
            </p>
          </SpotlightCard>
        </motion.div>
      </div>

      {/* Strengths & Weaknesses Detailed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SpotlightCard className="p-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs sm:text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Điểm Mạnh Của Bạn (Strengths)</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300 font-medium">
            {coachAnalysis.strengths.map((s, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-[#0b0e17] p-2.5 rounded-xl border border-white/[0.06]">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </SpotlightCard>

        <SpotlightCard className="p-6 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Kỹ Năng Cần Cải Thiện (Areas to Improve)</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300 font-medium">
            {coachAnalysis.areasToImprove.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-[#0b0e17] p-2.5 rounded-xl border border-white/[0.06]">
                <span className="text-rose-400 font-bold">!</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </SpotlightCard>
      </div>

      {/* AI Recommendations List */}
      <SpotlightCard className="p-6 lg:p-8 space-y-5">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Lộ Trình Đề Xuất Học Tập Tiếp Theo
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Được AI tính toán dựa trên điểm số và các câu trả lời sai gần đây
            </p>
          </div>
          <span className="text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/25 px-3 py-1 rounded-full">
            {coachAnalysis.recommendations.length} gợi ý
          </span>
        </div>

        <div className="space-y-3">
          {coachAnalysis.recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-2xl border border-white/[0.08] hover:border-indigo-500/40 bg-[#0b0e17] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {rec.skill}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Ưu tiên: {rec.priority}
                  </span>
                </div>
                <h4 className="font-extrabold text-white text-sm">{rec.title}</h4>
                <p className="text-xs text-slate-400">{rec.description}</p>
                <p className="text-[11px] text-indigo-300 font-medium">💡 Lý do: {rec.reason}</p>
              </div>

              <button
                onClick={() => handleExecuteAction(rec.actionType)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-glow-indigo transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto shrink-0"
              >
                <span>Bắt đầu luyện ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </SpotlightCard>

      {/* Interactive Chat with AI Coach */}
      <SpotlightCard className="p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
          <Bot className="w-5 h-5 text-indigo-400" />
          <h3 className="font-extrabold text-white text-sm sm:text-base">
            Hỏi Đáp Trực Tiếp Với AI Learning Coach
          </h3>
        </div>

        <div className="space-y-3 max-h-60 overflow-y-auto p-4 bg-[#0b0e17] rounded-2xl border border-white/[0.06]">
          {coachChat.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'coach' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'coach'
                    ? 'bg-[#121726] text-slate-200 border border-white/[0.08]'
                    : 'bg-indigo-600 text-white shadow-glow-indigo'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={coachInput}
            onChange={(e) => setCoachInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendCoachMsg()}
            placeholder="Hỏi AI Coach về phương pháp học, giải thích thì, mẹo phát âm..."
            className="flex-1 px-4 py-2.5 bg-[#0e1320] border border-white/[0.08] text-white rounded-xl text-xs focus:outline-none focus:border-indigo-500 placeholder-slate-500"
          />
          <button
            onClick={handleSendCoachMsg}
            disabled={!coachInput.trim()}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl font-bold text-xs shadow-glow-indigo transition-all flex items-center gap-1"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Gửi</span>
          </button>
        </div>
      </SpotlightCard>
    </div>
  );
};
