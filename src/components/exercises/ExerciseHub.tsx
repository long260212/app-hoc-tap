import React, { useState } from 'react';
import {
  BookOpenCheck,
  Sparkles,
  Filter,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ExerciseItem } from '../../types';
import { ExerciseRunner } from './ExerciseRunner';
import { ExerciseGeneratorModal } from './ExerciseGeneratorModal';
import { SpotlightCard } from '../motion/SpotlightCard';

export const ExerciseHub: React.FC = () => {
  const { exercises, activeExercise, startExercise, finishExercise } = useApp();

  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [isGeneratorOpen, setIsGeneratorOpen] = useState<boolean>(false);

  const filteredExercises = exercises.filter((ex) => {
    if (selectedType !== 'all' && ex.type !== selectedType) return false;
    if (selectedLevel !== 'all' && ex.level !== selectedLevel) return false;
    return true;
  });

  const typeLabels: Record<string, string> = {
    all: 'Tất cả dạng bài (10 loại)',
    multiple_choice: 'Multiple Choice',
    true_false: 'True / False',
    fill_in_the_blank: 'Fill in the Blank',
    matching: 'Matching Pairs',
    sentence_reorder: 'Sentence Reordering',
    vocabulary: 'Vocabulary',
    grammar: 'Grammar',
    reading: 'Reading',
    listening: 'Listening',
    speaking: 'Speaking',
  };

  if (activeExercise) {
    return <ExerciseRunner exercise={activeExercise} onBack={finishExercise} />;
  }

  return (
    <div className="space-y-6">
      {/* Header & AI Generator Trigger Banner */}
      <SpotlightCard className="p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5 card-gradient-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-300 border border-emerald-500/25 mb-2">
            <BookOpenCheck className="w-3.5 h-3.5" />
            <span>Kho 10 Dạng Bài Tập Thông Minh</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-black text-white">
            Làm Bài Tập & Chấm Điểm Tức Thì
          </h2>
          <p className="text-xs lg:text-sm text-slate-400 mt-1 max-w-xl">
            Tự do lựa chọn chủ đề, kiểm tra kiến thức và nhận giải thích chi tiết ngay sau mỗi câu trả lời.
          </p>
        </div>

        {/* Shiny AI Generator Button */}
        <button
          onClick={() => setIsGeneratorOpen(true)}
          className="px-6 py-3.5 bg-gradient-to-r from-indigo-500 via-blue-600 to-cyan-500 text-white font-extrabold text-xs rounded-2xl shadow-glow-indigo transition-all transform hover:-translate-y-0.5 active:scale-98 flex items-center justify-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
          <span>Generate new exercise with AI</span>
        </button>
      </SpotlightCard>

      {/* Filter Bar */}
      <SpotlightCard className="p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-300">Bộ lọc bài tập:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="text-xs font-semibold bg-[#111624] border border-white/[0.08] rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Tất cả trình độ</option>
            <option value="Beginner">Beginner (Cơ bản)</option>
            <option value="Intermediate">Intermediate (Trung cấp)</option>
            <option value="Advanced">Advanced (Nâng cao)</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs font-semibold bg-[#111624] border border-white/[0.08] rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            {Object.entries(typeLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </SpotlightCard>

      {/* Exercises List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map((ex) => (
          <SpotlightCard
            key={ex.id}
            className="p-5 flex flex-col justify-between hover:border-white/[0.18]"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 border border-indigo-500/25 px-2.5 py-1 rounded-lg">
                  {typeLabels[ex.type] || ex.type}
                </span>

                <div className="flex items-center gap-1.5">
                  {ex.isAiGenerated && (
                    <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> AI
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      ex.level === 'Beginner'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                        : ex.level === 'Intermediate'
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                        : 'bg-rose-500/15 text-rose-300 border border-rose-500/20'
                    }`}
                  >
                    {ex.level}
                  </span>
                </div>
              </div>

              <h3 className="font-extrabold text-white text-sm leading-snug line-clamp-2">
                {ex.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Chủ đề: <strong className="text-slate-300">{ex.topicTitle}</strong></p>

              <div className="mt-3 flex items-center gap-3 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  {ex.questions.length} câu hỏi
                </span>
                <span>• Tự động chấm</span>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Sẵn sàng</span>
              <button
                onClick={() => startExercise(ex)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-glow-indigo transition-all flex items-center gap-1.5"
              >
                <span>Làm bài</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </SpotlightCard>
        ))}
      </div>

      {/* Generator Modal */}
      <ExerciseGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onExerciseGenerated={(newEx) => startExercise(newEx)}
      />
    </div>
  );
};
