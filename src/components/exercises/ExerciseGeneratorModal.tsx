import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Loader2 } from 'lucide-react';
import { TOPICS_LIST } from '../../services/mockData';
import { ProficiencyLevel, ExerciseType, ExerciseItem } from '../../types';
import { AIService } from '../../services/aiService';
import { useApp } from '../../context/AppContext';
import { modalVariants, backdropVariants } from '../../utils/motion';

interface ExerciseGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExerciseGenerated: (exercise: ExerciseItem) => void;
}

export const ExerciseGeneratorModal: React.FC<ExerciseGeneratorModalProps> = ({
  isOpen,
  onClose,
  onExerciseGenerated,
}) => {
  const { addCustomExercise, showToast } = useApp();

  const [topic, setTopic] = useState<string>(TOPICS_LIST[0].title);
  const [level, setLevel] = useState<ProficiencyLevel>('Intermediate');
  const [type, setType] = useState<ExerciseType>('multiple_choice');
  const [count, setCount] = useState<number>(3);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const exerciseTypes: { id: ExerciseType; label: string }[] = [
    { id: 'multiple_choice', label: '1. Multiple Choice (Trắc nghiệm)' },
    { id: 'true_false', label: '2. True / False (Đúng / Sai)' },
    { id: 'fill_in_the_blank', label: '3. Fill in the Blank (Điền từ)' },
    { id: 'matching', label: '4. Matching (Nối cặp từ / câu)' },
    { id: 'sentence_reorder', label: '5. Sentence Reordering (Sắp xếp câu)' },
    { id: 'vocabulary', label: '6. Vocabulary (Từ vựng ngữ cảnh)' },
    { id: 'grammar', label: '7. Grammar (Cấu trúc ngữ pháp)' },
    { id: 'reading', label: '8. Reading Comprehension (Đọc hiểu)' },
    { id: 'listening', label: '9. Listening (Luyện nghe)' },
    { id: 'speaking', label: '10. Speaking (Thách thức phát âm)' },
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const generated = await AIService.generateExercise({
        topic,
        level,
        type,
        count,
      });
      setIsLoading(false);
      addCustomExercise(generated);
      onExerciseGenerated(generated);
      showToast(`Đã tạo thành công đề bài mới bằng AI: "${generated.title}"!`, 'success');
      onClose();
    } catch (err) {
      console.error('Error generating exercise:', err);
      try {
        const fallback = (AIService as any).createMockExerciseItem({
          topic,
          level,
          type,
          count,
        });
        addCustomExercise(fallback);
        onExerciseGenerated(fallback);
        showToast(`Đã tạo bài tập mới thành công!`, 'success');
        onClose();
      } catch {
        showToast('Không thể tạo bài tập lúc này, vui lòng thử lại.', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop (Section 29) */}
        <motion.div
          variants={backdropVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Window with entrance scale 0.96 -> 1, translateY 10px -> 0 */}
        <motion.div
          variants={modalVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative z-10 bg-[#0d111a] rounded-3xl max-w-lg w-full border border-white/[0.12] shadow-2xl p-6 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <h3 className="font-extrabold text-white text-base">Generate New Exercise with AI</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            AI sẽ tự động soạn đề bài mới hoàn toàn, bám sát chủ đề đời sống và trình độ bạn chọn, kèm theo đáp án và lời giải thích chi tiết.
          </p>

          <div className="space-y-4">
            {/* Topic Select */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                1. Chọn chủ đề (Topic):
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#121726] border border-white/[0.08] rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
              >
                {TOPICS_LIST.map((t) => (
                  <option key={t.id} value={t.title}>
                    {t.title} ({t.titleVi})
                  </option>
                ))}
              </select>
            </div>

            {/* Level Select */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                2. Trình độ học sinh:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Beginner', 'Intermediate', 'Advanced'] as ProficiencyLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevel(lvl)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      level === lvl
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-glow-indigo'
                        : 'bg-[#121726] border-white/[0.06] text-slate-400 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Exercise Type */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                3. Dạng bài tập (10 loại):
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ExerciseType)}
                className="w-full px-3.5 py-2.5 bg-[#121726] border border-white/[0.08] rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
              >
                {exerciseTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                4. Số lượng câu hỏi:
              </label>
              <div className="flex gap-2">
                {[3, 5, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCount(num)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      count === num
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-glow-indigo'
                        : 'bg-[#121726] border-white/[0.06] text-slate-400'
                    }`}
                  >
                    {num} câu
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/[0.06] text-slate-300 font-bold text-xs rounded-xl hover:bg-white/[0.12] transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGenerate}
              className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-extrabold text-xs rounded-xl shadow-glow-indigo transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI đang soạn đề...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Tạo bài tập ngay</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
