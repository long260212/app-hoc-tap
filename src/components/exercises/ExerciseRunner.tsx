import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Award,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { ExerciseItem, DetailedAnswerRecord } from '../../types';
import { QuestionRenderer } from './QuestionRenderer';
import { SpotlightCard } from '../motion/SpotlightCard';
import { AnimatedCounter } from '../motion/AnimatedCounter';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';

interface ExerciseRunnerProps {
  exercise: ExerciseItem;
  onBack: () => void;
}

export const ExerciseRunner: React.FC<ExerciseRunnerProps> = ({ exercise, onBack }) => {
  const { addHistoryRecord } = useApp();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<number, boolean>>({});
  const [showHint, setShowHint] = useState<boolean>(false);
  const [startTime] = useState<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, isFinished]);

  const currentQ = exercise.questions[currentIndex];
  const isCurrentSubmitted = !!submittedQuestions[currentIndex];
  const currentAnswer = userAnswers[currentIndex];

  const checkIsCorrect = (q: any, ans: any): boolean => {
    if (!ans) return false;
    if (q.type === 'fill_in_the_blank') {
      return (ans as string).trim().toLowerCase() === (q.correctAnswer as string).trim().toLowerCase();
    }
    if (q.type === 'sentence_reorder') {
      const cleanAns = (ans as string).replace(/\s+/g, ' ').trim();
      const cleanCorrect = (q.correctAnswer as string).replace(/\s+/g, ' ').trim();
      return cleanAns === cleanCorrect;
    }
    if (q.type === 'matching') {
      try {
        const parsed = JSON.parse(ans);
        const expectedPairs = (q.correctAnswer as string).split(';');
        for (const pair of expectedPairs) {
          const [left, right] = pair.split(':');
          if (parsed[left] !== right) return false;
        }
        return true;
      } catch {
        return false;
      }
    }
    if (q.type === 'speaking') {
      return (ans as string).trim().split(/\s+/).length >= 5;
    }
    return ans === q.correctAnswer;
  };

  const handleAnswerChange = (ans: any) => {
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: ans }));
  };

  const handleSubmitCurrent = () => {
    if (currentAnswer === undefined || currentAnswer === '') return;
    setSubmittedQuestions((prev) => ({ ...prev, [currentIndex]: true }));
  };

  const handleNext = () => {
    setShowHint(false);
    if (currentIndex < exercise.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);

    const detailedAnswers: DetailedAnswerRecord[] = exercise.questions.map((q, idx) => {
      const studentAns = userAnswers[idx] || '';
      const isCorrect = checkIsCorrect(q, studentAns);
      return {
        questionId: q.id,
        questionText: q.questionText,
        studentAnswer: studentAns,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const correctCount = detailedAnswers.filter((a) => a.isCorrect).length;
    const totalQuestions = exercise.questions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);

    const skillMap: Record<string, 'Speaking' | 'Listening' | 'Reading' | 'Grammar' | 'Vocabulary'> = {
      speaking: 'Speaking',
      listening: 'Listening',
      reading: 'Reading',
      grammar: 'Grammar',
      vocabulary: 'Vocabulary',
      fill_in_the_blank: 'Vocabulary',
      matching: 'Vocabulary',
      sentence_reorder: 'Grammar',
      multiple_choice: 'Grammar',
      true_false: 'Reading',
    };

    addHistoryRecord({
      activityType: 'Exercise',
      topicId: exercise.topicId,
      topicTitle: exercise.title,
      level: exercise.level,
      score,
      durationSeconds: elapsedSeconds,
      skillCategory: skillMap[exercise.type] || 'Grammar',
      detailsSummary: `Đạt ${score}/100 (${correctCount}/${totalQuestions} câu đúng). Hoàn thành trong ${Math.round(elapsedSeconds / 60)} phút.`,
      detailedQuestions: detailedAnswers,
    });

    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
  };

  const isCurrentCorrect = checkIsCorrect(currentQ, currentAnswer);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar with Back, Progress and Timer */}
      <SpotlightCard className="p-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] px-3.5 py-1.5 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Thoát bài tập</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="text-xs font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/25 px-3 py-1.5 rounded-xl">
            Câu {currentIndex + 1} / {exercise.questions.length}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-white/[0.04] border border-white/[0.06] px-3 py-1.5 rounded-xl">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {Math.floor(elapsedSeconds / 60)}:{('0' + (elapsedSeconds % 60)).slice(-2)}
            </span>
          </div>
        </div>
      </SpotlightCard>

      {/* Progress Bar */}
      <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / exercise.questions.length) * 100}%` }}
        />
      </div>

      {!isFinished ? (
        <SpotlightCard className="p-6 lg:p-8 space-y-6">
          {/* Passage if reading or cloze */}
          {exercise.passage && (
            <div className="p-5 bg-[#0b0e17] border border-white/[0.08] rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                <BookOpen className="w-4 h-4" />
                <span>Đoạn văn đọc hiểu / ngữ cảnh:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif whitespace-pre-line">
                {exercise.passage}
              </p>
            </div>
          )}

          {/* Question Text */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Câu hỏi #{currentIndex + 1}
              </span>
              {currentQ.hint && (
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Ẩn gợi ý' : 'Xem gợi ý'}</span>
                </button>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
              {currentQ.questionText}
            </h3>

            {showHint && currentQ.hint && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl text-xs text-amber-300 font-medium"
              >
                💡 <strong>Gợi ý:</strong> {currentQ.hint}
              </motion.div>
            )}
          </div>

          {/* Interactive Question Input */}
          <QuestionRenderer
            question={currentQ}
            userAnswer={currentAnswer}
            onAnswerChange={handleAnswerChange}
            isSubmitted={isCurrentSubmitted}
          />

          {/* Instant Grading Feedback Card (Section 24) */}
          <AnimatePresence>
            {isCurrentSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrentCorrect
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                  {isCurrentCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>Chính xác tuyệt vời! (+20 XP)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-400" />
                      <span>Chưa chính xác!</span>
                    </>
                  )}
                </div>

                {!isCurrentCorrect && (
                  <div className="mt-2 text-xs font-semibold">
                    <span className="text-slate-400">Đáp án chuẩn: </span>
                    <span className="text-emerald-400 font-bold">
                      {Array.isArray(currentQ.correctAnswer)
                        ? currentQ.correctAnswer.join(', ')
                        : currentQ.correctAnswer}
                    </span>
                  </div>
                )}

                <div className="mt-2.5 pt-2.5 border-t border-white/[0.08] text-xs leading-relaxed text-slate-300">
                  <span className="font-bold block mb-0.5 text-white">Giải thích chi tiết:</span>
                  <p>{currentQ.explanation}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions Bottom Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
            <div>
              {currentIndex > 0 && !isCurrentSubmitted && (
                <button
                  onClick={() => setCurrentIndex((prev) => prev - 1)}
                  className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 rounded-xl text-xs font-bold transition-colors"
                >
                  Câu trước
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isCurrentSubmitted ? (
                <button
                  onClick={handleSubmitCurrent}
                  disabled={currentAnswer === undefined || currentAnswer === ''}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-glow-indigo transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kiểm tra đáp án ngay</span>
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-glow-mint transition-all flex items-center gap-1.5"
                >
                  <span>{currentIndex < exercise.questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả tổng kết'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </SpotlightCard>
      ) : (
        /* Summary Scorecard */
        <SpotlightCard className="p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center shadow-glow-mint">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-2xl font-black text-white">Hoàn Thành Bài Tập!</h3>
            <p className="text-xs text-slate-400 mt-1">{exercise.title}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            <div className="p-4 bg-[#0b0e17] rounded-2xl border border-white/[0.08]">
              <span className="text-[10px] text-slate-400 block font-medium">Điểm số</span>
              <span className="text-2xl font-black text-indigo-400">
                <AnimatedCounter
                  value={Math.round(
                    (exercise.questions.filter((q, idx) => checkIsCorrect(q, userAnswers[idx])).length /
                      exercise.questions.length) *
                      100
                  )}
                />
              </span>
              <span className="text-[10px] text-slate-500 block">/ 100</span>
            </div>

            <div className="p-4 bg-[#0b0e17] rounded-2xl border border-white/[0.08]">
              <span className="text-[10px] text-slate-400 block font-medium">Đúng</span>
              <span className="text-2xl font-black text-emerald-400">
                {exercise.questions.filter((q, idx) => checkIsCorrect(q, userAnswers[idx])).length}
              </span>
              <span className="text-[10px] text-slate-500 block">/ {exercise.questions.length} câu</span>
            </div>

            <div className="p-4 bg-[#0b0e17] rounded-2xl border border-white/[0.08]">
              <span className="text-[10px] text-slate-400 block font-medium">Thời gian</span>
              <span className="text-2xl font-black text-cyan-400">
                {Math.round(elapsedSeconds / 60) || 1}
              </span>
              <span className="text-[10px] text-slate-500 block">phút</span>
            </div>
          </div>

          <p className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 max-w-md mx-auto p-3 rounded-xl font-medium">
            ✓ Kết quả bài làm đã được tự động lưu vào <strong>Lịch sử học tập</strong> và đồng bộ vào <strong>Biểu đồ thống kê</strong>!
          </p>

          <div className="flex justify-center gap-3 pt-3">
            <button
              onClick={() => {
                setUserAnswers({});
                setSubmittedQuestions({});
                setCurrentIndex(0);
                setIsFinished(false);
              }}
              className="px-5 py-2.5 bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Làm lại bài này
            </button>

            <button
              onClick={onBack}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-glow-indigo transition-all"
            >
              Trở về danh sách bài tập
            </button>
          </div>
        </SpotlightCard>
      )}
    </div>
  );
};
