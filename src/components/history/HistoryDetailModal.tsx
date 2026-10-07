import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, XCircle } from 'lucide-react';
import { LearningHistoryRecord } from '../../types';
import { modalVariants, backdropVariants } from '../../utils/motion';

interface HistoryDetailModalProps {
  record: LearningHistoryRecord | null;
  onClose: () => void;
}

export const HistoryDetailModal: React.FC<HistoryDetailModalProps> = ({ record, onClose }) => {
  if (!record) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          variants={backdropVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          variants={modalVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative z-10 bg-[#0d111a] rounded-3xl max-w-2xl w-full max-h-[85vh] border border-white/[0.12] shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-white/[0.06] flex items-center justify-between bg-[#0a0d15]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    record.activityType === 'Speaking'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : record.activityType === 'Listening'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : record.activityType === 'Reading'
                      ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {record.activityType}
                </span>
                <span className="text-[11px] text-slate-400">
                  {new Date(record.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>
              <h3 className="font-extrabold text-white text-base sm:text-lg">
                {record.topicTitle}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-2xl font-black text-indigo-400">{record.score}</span>
                <span className="text-xs font-bold text-slate-500">/100</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content Scroll */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="p-3.5 bg-[#0b0e17] border border-white/[0.08] rounded-2xl text-xs text-slate-300">
              <span className="font-bold text-white">Tóm tắt kết quả: </span>
              {record.detailsSummary}
            </div>

            {/* Questions breakdown */}
            {record.detailedQuestions && record.detailedQuestions.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-500">
                  Chi tiết câu hỏi & Đáp án ({record.detailedQuestions.length} câu)
                </h4>

                {record.detailedQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border text-xs space-y-2 ${
                      q.isCorrect
                        ? 'bg-emerald-500/10 border-emerald-500/25'
                        : 'bg-rose-500/10 border-rose-500/25'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-white">
                        Câu #{idx + 1}: {q.questionText}
                      </p>
                      {q.isCorrect ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-4 h-4" /> Đúng
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold flex items-center gap-1 shrink-0">
                          <XCircle className="w-4 h-4" /> Sai
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 pt-1 border-t border-white/[0.06]">
                      <p className="text-slate-300">
                        <span className="font-semibold text-slate-500">Câu trả lời của bạn: </span>
                        <strong className={q.isCorrect ? 'text-emerald-300' : 'text-rose-300'}>
                          {Array.isArray(q.studentAnswer) ? q.studentAnswer.join(', ') : q.studentAnswer || '(Chưa nhập)'}
                        </strong>
                      </p>

                      {!q.isCorrect && (
                        <p className="text-slate-300">
                          <span className="font-semibold text-slate-500">Đáp án chuẩn: </span>
                          <strong className="text-emerald-400 font-bold">
                            {Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer}
                          </strong>
                        </p>
                      )}

                      {q.explanation && (
                        <div className="mt-1 p-2 bg-[#090c14] rounded-xl border border-white/[0.06] text-[11px] text-slate-400">
                          💡 <strong>Giải thích của AI:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Speaking feedback */}
            {record.speakingFeedback && record.speakingFeedback.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-500">
                  Chi tiết đánh giá từng lượt nói
                </h4>

                {record.speakingFeedback.map((fb, idx) => (
                  <div key={idx} className="p-4 bg-[#0b0e17] border border-white/[0.08] rounded-2xl text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-indigo-400">Lượt nói #{idx + 1}</span>
                      <span className="bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 px-2 py-0.5 rounded-md">
                        {fb.overallScore}/100 điểm
                      </span>
                    </div>

                    <p className="italic text-slate-200 bg-[#121726] p-2.5 rounded-xl border border-white/[0.06]">
                      "{fb.studentSentence}"
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-500">Câu sửa chuẩn:</span>
                        <p className="font-medium text-emerald-400">{fb.correctedSentence}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Cách nói tự nhiên hơn:</span>
                        <p className="font-medium text-cyan-400">{fb.betterExpression}</p>
                      </div>
                    </div>

                    {fb.pronunciationTips && (
                      <p className="text-[11px] text-violet-300 bg-violet-500/10 border border-violet-500/20 p-2 rounded-lg">
                        🗣️ <strong>Gợi ý phát âm:</strong> {fb.pronunciationTips}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/[0.06] flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 font-bold text-xs rounded-xl transition-colors"
            >
              Đóng
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
