import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { QuestionItem } from '../../types';

interface QuestionRendererProps {
  question: QuestionItem;
  userAnswer: any;
  onAnswerChange: (answer: any) => void;
  isSubmitted: boolean;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  userAnswer,
  onAnswerChange,
  isSubmitted,
}) => {
  // Matching state
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchingPairsMap, setMatchingPairsMap] = useState<Record<string, string>>({});

  // Sentence reordering state
  const [orderedWords, setOrderedWords] = useState<string[]>([]);

  useEffect(() => {
    if (question.type === 'sentence_reorder') {
      setOrderedWords(userAnswer ? userAnswer.split(' ') : []);
    }
    if (question.type === 'matching') {
      try {
        setMatchingPairsMap(userAnswer ? JSON.parse(userAnswer) : {});
      } catch {
        setMatchingPairsMap({});
      }
    }
  }, [question]);

  // 1. Multiple Choice & True/False & Vocab & Grammar (Section 24)
  if (
    question.type === 'multiple_choice' ||
    question.type === 'true_false' ||
    question.type === 'vocabulary' ||
    question.type === 'grammar' ||
    question.type === 'reading' ||
    question.type === 'listening'
  ) {
    const options = question.options || ['True', 'False'];

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {options.map((opt, idx) => {
            const isSelected = userAnswer === opt;
            const isCorrect = isSubmitted && opt === question.correctAnswer;
            const isWrong = isSubmitted && isSelected && opt !== question.correctAnswer;

            let btnClasses = 'border-white/[0.08] bg-[#0f1422] hover:border-white/[0.18] text-slate-300';
            if (isSelected && !isSubmitted) {
              btnClasses = 'border-indigo-500 bg-indigo-500/20 text-white shadow-glow-indigo font-bold';
            } else if (isCorrect) {
              btnClasses = 'border-emerald-500/50 bg-emerald-500/15 text-emerald-200 font-bold';
            } else if (isWrong) {
              btnClasses = 'border-rose-500/50 bg-rose-500/15 text-rose-200 font-bold animate-soft-shake';
            }

            return (
              <motion.button
                key={idx}
                whileHover={!isSubmitted ? { scale: 1.01 } : {}}
                whileTap={!isSubmitted ? { scale: 0.98 } : {}}
                disabled={isSubmitted}
                onClick={() => onAnswerChange(opt)}
                className={`p-4 rounded-2xl border text-left text-xs sm:text-sm transition-colors duration-200 flex items-center justify-between ${btnClasses}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-glow-indigo'
                        : 'bg-white/[0.06] text-slate-400'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </div>
                {isCorrect && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  </motion.div>
                )}
                {isWrong && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. Fill in the Blank (Section 25)
  if (question.type === 'fill_in_the_blank') {
    const isCorrectAnswer =
      isSubmitted &&
      (userAnswer || '').toLowerCase().trim() === (question.correctAnswer as string).toLowerCase().trim();
    const isWrongAnswer = isSubmitted && !isCorrectAnswer;

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2">
            Nhập từ còn thiếu vào ô dưới:
          </label>
          <input
            type="text"
            disabled={isSubmitted}
            value={userAnswer || ''}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Type your answer here..."
            className={`w-full max-w-md px-4 py-3 border rounded-2xl text-xs sm:text-sm font-semibold focus:outline-none transition-all ${
              isSubmitted
                ? isCorrectAnswer
                  ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-200'
                  : 'border-rose-500/60 bg-rose-500/15 text-rose-200 animate-soft-shake'
                : 'border-white/[0.08] bg-[#0e1320] text-white focus:border-indigo-500'
            }`}
          />
        </div>

        {/* Word bank */}
        {question.wordBank && question.wordBank.length > 0 && !isSubmitted && (
          <div className="bg-[#0b0e17] p-3.5 rounded-2xl border border-white/[0.06]">
            <span className="text-[11px] font-bold text-slate-400 block mb-2">
              Ngân hàng từ gợi ý (Bấm vào từ để điền):
            </span>
            <div className="flex flex-wrap gap-2">
              {question.wordBank.map((word, i) => (
                <button
                  key={i}
                  onClick={() => onAnswerChange(word)}
                  className="px-3 py-1 bg-white/[0.04] hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-200 border border-white/[0.08] rounded-xl text-xs font-semibold transition-all hover:scale-102"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. Sentence Reordering
  if (question.type === 'sentence_reorder') {
    const scrambled = question.scrambledWords || [];

    const handleWordClick = (word: string) => {
      if (isSubmitted) return;
      const updated = [...orderedWords, word];
      setOrderedWords(updated);
      onAnswerChange(updated.join(' '));
    };

    const handleRemoveWord = (index: number) => {
      if (isSubmitted) return;
      const updated = orderedWords.filter((_, i) => i !== index);
      setOrderedWords(updated);
      onAnswerChange(updated.join(' '));
    };

    const handleReset = () => {
      setOrderedWords([]);
      onAnswerChange('');
    };

    return (
      <div className="space-y-4">
        <div className="min-h-16 p-4 bg-[#0b0e17] border border-dashed border-white/[0.12] rounded-2xl flex flex-wrap items-center gap-2">
          {orderedWords.length === 0 ? (
            <span className="text-xs text-slate-500 italic">
              Bấm vào các từ bên dưới theo thứ tự đúng để tạo thành câu...
            </span>
          ) : (
            orderedWords.map((word, i) => (
              <span
                key={i}
                onClick={() => handleRemoveWord(i)}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-rose-600 transition-colors shadow-glow-indigo"
                title="Bấm để gỡ từ này"
              >
                {word} ✕
              </span>
            ))
          )}
        </div>

        {!isSubmitted && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Các từ cần sắp xếp:</span>
              <button
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Làm lại
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {scrambled.map((word, idx) => {
                const usedCount = orderedWords.filter((w) => w === word).length;
                const totalInScrambled = scrambled.filter((w) => w === word).length;
                const isExhausted = usedCount >= totalInScrambled;

                return (
                  <button
                    key={idx}
                    disabled={isExhausted}
                    onClick={() => handleWordClick(word)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                      isExhausted
                        ? 'opacity-30 bg-white/[0.02] text-slate-600 border-white/[0.04]'
                        : 'bg-[#0f1422] hover:bg-indigo-500/20 text-slate-200 border-white/[0.08] hover:border-indigo-400/50'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 4. Matching Pairs
  if (question.type === 'matching') {
    const pairs = question.matchingPairs || [];
    const leftItems = pairs.map((p) => p.left);
    const rightItems = pairs.map((p) => p.right);

    const handleSelectLeft = (left: string) => {
      if (isSubmitted) return;
      setSelectedLeft(left);
    };

    const handleSelectRight = (right: string) => {
      if (isSubmitted || !selectedLeft) return;
      const updated = { ...matchingPairsMap, [selectedLeft]: right };
      setMatchingPairsMap(updated);
      setSelectedLeft(null);
      onAnswerChange(JSON.stringify(updated));
    };

    return (
      <div className="space-y-4">
        <p className="text-xs text-slate-400">
          Bước 1: Chọn từ ở cột trái → Bước 2: Chọn nghĩa ở cột phải để ghép cặp.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Từ vựng (Cột A)</span>
            {leftItems.map((left, idx) => {
              const matchedRight = matchingPairsMap[left];
              const isSelected = selectedLeft === left;
              return (
                <button
                  key={idx}
                  disabled={isSubmitted}
                  onClick={() => handleSelectLeft(left)}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/20 text-white shadow-glow-indigo'
                      : matchedRight
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                      : 'border-white/[0.08] bg-[#0e1320] text-slate-300 hover:border-white/[0.18]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{left}</span>
                    {matchedRight && <span className="text-[10px] text-emerald-400">✓ Đã ghép</span>}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Định nghĩa (Cột B)</span>
            {rightItems.map((right, idx) => {
              const matchedLeft = Object.keys(matchingPairsMap).find((k) => matchingPairsMap[k] === right);
              return (
                <button
                  key={idx}
                  disabled={isSubmitted || !selectedLeft}
                  onClick={() => handleSelectRight(right)}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition-all ${
                    matchedLeft
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                      : selectedLeft
                      ? 'border-indigo-400/40 bg-indigo-500/10 text-slate-200 hover:bg-indigo-500/20 cursor-pointer'
                      : 'border-white/[0.06] bg-[#0c101a] text-slate-400 opacity-70'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{right}</span>
                    {matchedLeft && (
                      <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                        [{matchedLeft}]
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 5. Speaking format
  if (question.type === 'speaking') {
    return (
      <div className="space-y-3">
        <label className="block text-xs font-semibold text-slate-400">
          Ghi lại câu trả lời nói của bạn:
        </label>
        <textarea
          rows={3}
          disabled={isSubmitted}
          value={userAnswer || ''}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="Type or dictate your response in English..."
          className="w-full p-3 bg-[#0e1320] border border-white/[0.08] text-white rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
        />
      </div>
    );
  }

  return null;
};
