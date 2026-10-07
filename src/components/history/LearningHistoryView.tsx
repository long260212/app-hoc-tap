import React, { useState } from 'react';
import {
  History,
  Search,
  Eye,
  BookOpenCheck,
  Mic,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LearningHistoryRecord } from '../../types';
import { HistoryDetailModal } from './HistoryDetailModal';
import { SpotlightCard } from '../motion/SpotlightCard';

export const LearningHistoryView: React.FC = () => {
  const { history, setCurrentTab } = useApp();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [selectedScoreRange, setSelectedScoreRange] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all');

  const [inspectingRecord, setInspectingRecord] = useState<LearningHistoryRecord | null>(null);

  const filteredHistory = history.filter((item) => {
    if (searchTerm) {
      const match =
        item.topicTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.detailsSummary.toLowerCase().includes(searchTerm.toLowerCase());
      if (!match) return false;
    }

    if (selectedSkill !== 'all' && item.skillCategory !== selectedSkill) {
      return false;
    }

    if (selectedScoreRange === 'excellent' && item.score < 90) return false;
    if (selectedScoreRange === 'good' && (item.score < 80 || item.score >= 90)) return false;
    if (selectedScoreRange === 'needs_review' && item.score >= 80) return false;

    if (selectedDateRange !== 'all') {
      const itemDate = new Date(item.createdAt).getTime();
      const now = Date.now();
      const diffDays = (now - itemDate) / (1000 * 60 * 60 * 24);

      if (selectedDateRange === 'today' && diffDays > 1) return false;
      if (selectedDateRange === '7days' && diffDays > 7) return false;
      if (selectedDateRange === '30days' && diffDays > 30) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <SpotlightCard className="p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] text-xs font-bold text-slate-300 border border-white/[0.08] mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Nhật Ký Học Tập Chi Tiết</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-black text-white">
            Lịch Sử Học Tập Toàn Diện
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tra cứu lại tất cả các câu hỏi, câu trả lời của bạn, đáp án chính xác và nhận xét chi tiết của AI.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-[#090c14] border border-white/[0.08] px-4 py-2.5 rounded-2xl">
          <span>Tổng số lượt học: </span>
          <strong className="text-indigo-400 text-sm">{history.length} phiên</strong>
        </div>
      </SpotlightCard>

      {history.length === 0 ? (
        /* Empty State for New Accounts */
        <SpotlightCard className="p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-glow-sm">
            <History className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Chưa có lịch sử học tập</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
              Tài khoản mới của bạn chưa có bài làm nào. Khi bạn hoàn thành bất kỳ bài tập hoặc buổi luyện nói AI nào, kết quả chấm điểm và lời giải chi tiết sẽ được tự động lưu trữ tại đây.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setCurrentTab('speaking')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:brightness-110 text-white font-bold text-xs shadow-glow-indigo transition-all flex items-center gap-2"
            >
              <Mic className="w-4 h-4" />
              <span>Luyện nói với AI ngay</span>
            </button>
            <button
              onClick={() => setCurrentTab('exercises')}
              className="px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 font-bold text-xs border border-white/[0.08] transition-all flex items-center gap-2"
            >
              <BookOpenCheck className="w-4 h-4" />
              <span>Khám phá kho bài tập</span>
            </button>
          </div>
        </SpotlightCard>
      ) : (
        <>
          {/* Filter Bar */}
          <SpotlightCard className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm theo chủ đề..."
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#0e1320] border border-white/[0.08] rounded-xl text-xs font-medium text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
                />
              </div>

              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0e1320] border border-white/[0.08] rounded-xl text-xs font-medium text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="all">Tất cả kỹ năng</option>
                <option value="Speaking">Speaking (Luyện nói)</option>
                <option value="Listening">Listening (Luyện nghe)</option>
                <option value="Reading">Reading (Đọc hiểu)</option>
                <option value="Grammar">Grammar (Ngữ pháp)</option>
                <option value="Vocabulary">Vocabulary (Từ vựng)</option>
              </select>

              <select
                value={selectedScoreRange}
                onChange={(e) => setSelectedScoreRange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0e1320] border border-white/[0.08] rounded-xl text-xs font-medium text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="all">Tất cả mức điểm</option>
                <option value="excellent">Xuất sắc (90 - 100 điểm)</option>
                <option value="good">Khá / Tốt (80 - 89 điểm)</option>
                <option value="needs_review">Cần ôn tập lại (&lt; 80 điểm)</option>
              </select>

              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0e1320] border border-white/[0.08] rounded-xl text-xs font-medium text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="all">Mọi thời điểm</option>
                <option value="today">Hôm nay</option>
                <option value="7days">7 ngày gần nhất</option>
                <option value="30days">30 ngày gần nhất</option>
              </select>
            </div>
          </SpotlightCard>

          {/* Table Container */}
          <SpotlightCard className="overflow-hidden border border-white/[0.08] rounded-3xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-5">Thời gian</th>
                    <th className="py-4 px-5">Kỹ năng / Hoạt động</th>
                    <th className="py-4 px-5">Chủ đề & Nội dung</th>
                    <th className="py-4 px-5">Điểm số</th>
                    <th className="py-4 px-5">Thời lượng</th>
                    <th className="py-4 px-5 text-right">Chi tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-xs">
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((item) => {
                      const dateObj = new Date(item.createdAt);
                      const formattedDate = `${dateObj.toLocaleDateString('vi-VN')} • ${dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;

                      return (
                        <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-5 whitespace-nowrap text-slate-400 font-medium text-[11px]">
                            {formattedDate}
                          </td>

                          <td className="py-4 px-5 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                                item.skillCategory === 'Speaking'
                                  ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                  : item.skillCategory === 'Listening'
                                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                  : item.skillCategory === 'Reading'
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              }`}
                            >
                              {item.activityType} ({item.skillCategory})
                            </span>
                          </td>

                          <td className="py-4 px-5">
                            <div className="font-bold text-white text-xs sm:text-sm line-clamp-1">
                              {item.topicTitle}
                            </div>
                            <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                              {item.detailsSummary}
                            </div>
                          </td>

                          <td className="py-4 px-5 whitespace-nowrap">
                            <div className="inline-flex items-baseline gap-0.5 font-black text-sm">
                              <span
                                className={
                                  item.score >= 90
                                    ? 'text-emerald-400'
                                    : item.score >= 80
                                    ? 'text-indigo-400'
                                    : 'text-amber-400'
                                }
                              >
                                {item.score}
                              </span>
                              <span className="text-[10px] text-slate-500">/100</span>
                            </div>
                          </td>

                          <td className="py-4 px-5 whitespace-nowrap text-xs text-slate-300 font-medium">
                            {Math.round(item.durationSeconds / 60) || 1} phút
                          </td>

                          <td className="py-4 px-5 whitespace-nowrap text-right">
                            <button
                              onClick={() => setInspectingRecord(item)}
                              className="px-3.5 py-1.5 bg-white/[0.06] hover:bg-indigo-600 hover:text-white text-slate-300 font-bold text-xs rounded-xl transition-all inline-flex items-center gap-1.5 shadow-sm"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Chi tiết</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                        Không tìm thấy bài học nào phù hợp với bộ lọc hiện tại.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </SpotlightCard>
        </>
      )}

      <HistoryDetailModal
        record={inspectingRecord}
        onClose={() => setInspectingRecord(null)}
      />
    </div>
  );
};
