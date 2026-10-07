import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TextCursorInput,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import { SpeechService } from '../../services/speechService';
import { useApp } from '../../context/AppContext';
import { SpotlightCard } from '../motion/SpotlightCard';
import confetti from 'canvas-confetti';

interface ClozeQuestion {
  id: string;
  sentencePre: string;
  sentencePost: string;
  correctAnswer: string;
  wordBank: string[];
  explanation: string;
  hint: string;
}

export const FillBlanksPractice: React.FC = () => {
  const { addHistoryRecord } = useApp();

  const [mode, setMode] = useState<'free' | 'wordbank' | 'listening' | 'reading'>('wordbank');
  const [selectedTopic] = useState<string>('Daily Habits');

  const [clozeSet, setClozeSet] = useState<{
    title: string;
    passage: string;
    questions: ClozeQuestion[];
  }>({
    title: 'Morning Routine & Daily Healthy Habits',
    passage: 'Establishing a disciplined morning routine sets the tone for a productive day.',
    questions: [
      {
        id: 'c1',
        sentencePre: 'I always',
        sentencePost: 'to school on my bicycle every morning at 7:00 AM.',
        correctAnswer: 'go',
        wordBank: ['go', 'ride', 'travel', 'stay', 'visit'],
        explanation: 'Cụm từ quen thuộc: "go to school" (đi học).',
        hint: 'Động từ 2 chữ cái bắt đầu bằng chữ g.',
      },
      {
        id: 'c2',
        sentencePre: 'Drinking a glass of warm water helps',
        sentencePost: 'your metabolism and digestion after waking up.',
        correctAnswer: 'boost',
        wordBank: ['boost', 'stop', 'reduce', 'delay', 'ruin'],
        explanation: '"boost metabolism" nghĩa là thúc đẩy quá trình trao đổi chất.',
        hint: 'Từ mang nghĩa làm tăng, cải thiện nhanh chóng.',
      },
      {
        id: 'c3',
        sentencePre: 'Students should always',
        sentencePost: 'attention to the teacher during classroom lectures.',
        correctAnswer: 'pay',
        wordBank: ['pay', 'make', 'give', 'keep', 'take'],
        explanation: 'Collocation cố định: "pay attention to" (chú ý đến cái gì).',
        hint: 'Đi kèm với từ "attention".',
      },
      {
        id: 'c4',
        sentencePre: 'Regular physical exercise helps students',
        sentencePost: 'stress and maintain peak mental focus.',
        correctAnswer: 'release',
        wordBank: ['release', 'increase', 'cause', 'hold', 'add'],
        explanation: '"release stress" = giải tỏa căng thẳng.',
        hint: 'Giải phóng hoặc giải tỏa.',
      },
      {
        id: 'c5',
        sentencePre: 'Before going to bed, it is best to',
        sentencePost: 'off smartphone notifications for restful sleep.',
        correctAnswer: 'turn',
        wordBank: ['turn', 'switch', 'keep', 'leave', 'take'],
        explanation: 'Cụm động từ "turn off" = tắt thiết bị hoặc thông báo.',
        hint: 'Đi kèm với giới từ "off".',
      },
      {
        id: 'c6',
        sentencePre: 'Reading twenty pages every day will definitely',
        sentencePost: 'your active vocabulary and reading fluency.',
        correctAnswer: 'expand',
        wordBank: ['expand', 'limit', 'narrow', 'damage', 'reduce'],
        explanation: '"expand vocabulary" = mở rộng vốn từ vựng.',
        hint: 'Đồng nghĩa với từ "broaden" hoặc "enlarge".',
      },
    ],
  });

  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [isAllSubmitted, setIsAllSubmitted] = useState<boolean>(false);

  const handleInputChange = (id: string, value: string) => {
    setUserInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectWord = (id: string, word: string) => {
    setUserInputs((prev) => ({ ...prev, [id]: word }));
  };

  const handleCheckSingle = (q: ClozeQuestion) => {
    setChecked((prev) => ({ ...prev, [q.id]: true }));
  };

  const handleCheckAll = () => {
    const allCheckedMap: Record<string, boolean> = {};
    clozeSet.questions.forEach((q) => {
      allCheckedMap[q.id] = true;
    });
    setChecked(allCheckedMap);
    setIsAllSubmitted(true);

    const correctCount = clozeSet.questions.filter(
      (q) => (userInputs[q.id] || '').trim().toLowerCase() === q.correctAnswer.toLowerCase()
    ).length;

    const score = Math.round((correctCount / clozeSet.questions.length) * 100);

    addHistoryRecord({
      activityType: 'FillBlank',
      topicId: selectedTopic.toLowerCase().replace(/\s+/g, '-'),
      topicTitle: clozeSet.title,
      level: 'Intermediate',
      score,
      durationSeconds: 120,
      skillCategory: 'Vocabulary',
      detailsSummary: `Hoàn thành bài tập điền từ (${mode}). Đúng ${correctCount}/${clozeSet.questions.length} câu.`,
      detailedQuestions: clozeSet.questions.map((q) => ({
        questionId: q.id,
        questionText: `${q.sentencePre} [____] ${q.sentencePost}`,
        studentAnswer: userInputs[q.id] || '',
        correctAnswer: q.correctAnswer,
        isCorrect: (userInputs[q.id] || '').trim().toLowerCase() === q.correctAnswer.toLowerCase(),
        explanation: q.explanation,
      })),
    });

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  const handleGenerateNewCloze = () => {
    const sampleTopics = [
      {
        title: `AI Cloze: Environmental Conservation & Planet Earth`,
        passage: 'Protecting our planet requires proactive actions and sustainable habits from every community.',
        questions: [
          {
            id: `c-gen-1`,
            sentencePre: 'We ought to',
            sentencePost: 'single-use plastic bottles to minimize ocean waste.',
            correctAnswer: 'recycle',
            wordBank: ['recycle', 'throw', 'burn', 'collect', 'waste'],
            explanation: '"recycle plastic bottles" nghĩa là tái chế chai nhựa.',
            hint: 'Bắt đầu bằng chữ r.',
          },
          {
            id: `c-gen-2`,
            sentencePre: 'Planting trees helps to',
            sentencePost: 'carbon emissions and cool urban areas.',
            correctAnswer: 'reduce',
            wordBank: ['reduce', 'increase', 'create', 'worsen', 'double'],
            explanation: '"reduce carbon emissions" = giảm lượng phát thải carbon.',
            hint: 'Làm giảm bớt.',
          },
          {
            id: `c-gen-3`,
            sentencePre: 'Transitioning to renewable clean energy will',
            sentencePost: 'our dependence on fossil fuels.',
            correctAnswer: 'decrease',
            wordBank: ['decrease', 'raise', 'double', 'keep', 'expand'],
            explanation: '"decrease dependence" = giảm bớt sự phụ thuộc.',
            hint: 'Làm hạ bớt hoặc giảm đi.',
          },
          {
            id: `c-gen-4`,
            sentencePre: 'Local communities must take collective',
            sentencePost: 'to conserve precious freshwater reserves.',
            correctAnswer: 'action',
            wordBank: ['action', 'delay', 'hesitation', 'rest', 'silence'],
            explanation: '"take collective action" = hành động tập thể.',
            hint: 'Bắt đầu bằng chữ a.',
          },
          {
            id: `c-gen-5`,
            sentencePre: 'Safeguarding endangered species preserves global',
            sentencePost: 'and stabilizes fragile food chains.',
            correctAnswer: 'biodiversity',
            wordBank: ['biodiversity', 'pollution', 'warming', 'drought', 'erosion'],
            explanation: '"biodiversity" = sự đa dạng sinh học.',
            hint: 'Tính đa dạng của các loài sinh vật sống.',
          },
          {
            id: `c-gen-6`,
            sentencePre: 'Every small green habit contributes to',
            sentencePost: 'a sustainable future for the next generation.',
            correctAnswer: 'building',
            wordBank: ['building', 'destroying', 'neglecting', 'forgetting', 'losing'],
            explanation: '"building a sustainable future" = kiến tạo tương lai bền vững.',
            hint: 'Xây dựng, kiến tạo.',
          },
        ],
      },
    ];

    const random = sampleTopics[Math.floor(Math.random() * sampleTopics.length)];
    setClozeSet(random);
    setUserInputs({});
    setChecked({});
    setIsAllSubmitted(false);
  };

  return (
    <div className="space-y-6">
      <SpotlightCard className="p-6 lg:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TextCursorInput className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl lg:text-2xl font-black text-white">
                Luyện Điền Từ Vào Chỗ Trống (Cloze Test)
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              AI tạo đoạn văn ngữ cảnh tự nhiên, học sinh nhập từ còn thiếu và nhận kiểm tra tức thì.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-[#090c14] border border-white/[0.08] p-1.5 rounded-2xl">
            {(['wordbank', 'free', 'listening', 'reading'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  mode === m
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-glow-amber'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m === 'wordbank'
                  ? 'Có Word Bank'
                  : m === 'free'
                  ? 'Không gợi ý'
                  : m === 'listening'
                  ? 'Theo bài nghe'
                  : 'Theo bài đọc'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between bg-[#0b0e17] p-4 rounded-2xl border border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI có thể tạo một đoạn văn mới với các khoảng trống tương ứng cho bạn.</span>
          </div>

          <button
            onClick={handleGenerateNewCloze}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-glow-amber transition-all flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tạo bài điền từ mới</span>
          </button>
        </div>
      </SpotlightCard>

      <SpotlightCard className="p-6 lg:p-8 space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
            Chế độ: {mode === 'wordbank' ? 'Word Bank' : mode === 'free' ? 'Tự do' : mode === 'listening' ? 'Nghe Audio & Điền' : 'Đọc hiểu & Điền'}
          </span>
          <h3 className="text-base sm:text-lg font-extrabold text-white mt-1">
            {clozeSet.title}
          </h3>
        </div>

        {mode === 'listening' && (
          <div className="p-4 bg-[#090c14] border border-white/[0.08] text-white rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const fullText = clozeSet.questions
                    .map((q) => `${q.sentencePre} ${q.correctAnswer} ${q.sentencePost}`)
                    .join(' ');
                  SpeechService.speak(fullText);
                }}
                className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-bold"
              >
                <Volume2 className="w-5 h-5 fill-slate-950" />
              </button>
              <div>
                <p className="text-xs font-bold">Nghe đoạn băng mẫu</p>
                <p className="text-[10px] text-slate-400">Bấm nút để nghe phát âm và bắt từ khóa cần điền</p>
              </div>
            </div>
          </div>
        )}

        {/* Questions Sentences with Input In-line (Section 25) */}
        <div className="space-y-4">
          {clozeSet.questions.map((q, idx) => {
            const userVal = userInputs[q.id] || '';
            const isChecked = !!checked[q.id];
            const isCorrect = userVal.trim().toLowerCase() === q.correctAnswer.toLowerCase();

            return (
              <div
                key={q.id}
                className="p-5 bg-[#0b0e17] border border-white/[0.08] rounded-2xl space-y-4"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>Câu #{idx + 1}</span>
                  {q.hint && <span className="text-amber-400 font-semibold">💡 Gợi ý: {q.hint}</span>}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-slate-200 leading-loose">
                  <span>{q.sentencePre}</span>

                  <input
                    type="text"
                    disabled={isChecked}
                    value={userVal}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    placeholder="Nhập từ..."
                    className={`px-3 py-1.5 w-32 sm:w-40 border-b-2 text-center font-bold text-xs sm:text-sm focus:outline-none transition-all rounded-lg ${
                      isChecked
                        ? isCorrect
                          ? 'border-emerald-500 bg-emerald-500/15 text-emerald-200'
                          : 'border-rose-500 bg-rose-500/15 text-rose-200 animate-soft-shake'
                        : 'border-amber-500/80 bg-[#121726] text-white focus:border-amber-400'
                    }`}
                  />

                  <span>{q.sentencePost}</span>
                </div>

                {mode === 'wordbank' && !isChecked && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-bold text-slate-500">Từ gợi ý:</span>
                    {q.wordBank.map((w, wIdx) => (
                      <button
                        key={wIdx}
                        onClick={() => handleSelectWord(q.id, w)}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                          userVal === w
                            ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-glow-amber'
                            : 'bg-[#121726] hover:bg-white/[0.06] border-white/[0.08] text-slate-300'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs">
                  {isChecked ? (
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        {isCorrect ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Chính xác!
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Sai rồi! Đáp án: <strong className="text-white">{q.correctAnswer}</strong>
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400">{q.explanation}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCheckSingle(q)}
                      disabled={!userVal.trim()}
                      className="px-4 py-1.5 bg-white/[0.06] border border-white/[0.08] hover:border-amber-500 text-slate-300 hover:text-white disabled:opacity-40 font-bold rounded-xl transition-all"
                    >
                      Kiểm tra câu này
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 flex justify-between items-center border-t border-white/[0.06]">
          <button
            onClick={() => {
              setUserInputs({});
              setChecked({});
              setIsAllSubmitted(false);
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Làm lại</span>
          </button>

          {!isAllSubmitted ? (
            <button
              onClick={handleCheckAll}
              className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-glow-amber transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Chấm toàn bộ & Lưu kết quả</span>
            </button>
          ) : (
            <span className="text-xs font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/25 px-3 py-1.5 rounded-xl">
              ✓ Đã hoàn thành và lưu vào hồ sơ học sinh
            </span>
          )}
        </div>
      </SpotlightCard>
    </div>
  );
};
