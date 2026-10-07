import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { SpotlightCard } from '../motion/SpotlightCard';
import { AnimatedCounter } from '../motion/AnimatedCounter';

export const ProgressDashboard: React.FC = () => {
  const { dailyStats, user } = useApp();

  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '3months'>('7days');

  const hasData = dailyStats && dailyStats.length > 0;

  const lineChartData = dailyStats.map((item) => ({
    date: item.dayLabel || item.date,
    score: item.averageScore,
    minutes: item.totalMinutes,
  }));

  const latestStat = hasData
    ? dailyStats[dailyStats.length - 1]
    : {
        speakingScore: 0,
        listeningScore: 0,
        readingScore: 0,
        grammarScore: 0,
        vocabularyScore: 0,
      };

  const radarData = [
    { skill: 'Speaking', score: latestStat.speakingScore || 0, fullMark: 100 },
    { skill: 'Listening', score: latestStat.listeningScore || 0, fullMark: 100 },
    { skill: 'Reading', score: latestStat.readingScore || 0, fullMark: 100 },
    { skill: 'Grammar', score: latestStat.grammarScore || 0, fullMark: 100 },
    { skill: 'Vocabulary', score: latestStat.vocabularyScore || 0, fullMark: 100 },
  ];

  const activityData = dailyStats.map((item) => ({
    date: item.dayLabel || item.date,
    lessons: item.completedLessons,
    minutes: item.totalMinutes,
    correct: item.correctAnswers,
    incorrect: item.incorrectAnswers,
    speaking: item.speakingSessionsCount,
    listening: item.listeningLessonsCount,
  }));

  const totalMinutesAll = dailyStats.reduce((sum, s) => sum + s.totalMinutes, 0);
  const totalLessonsAll = dailyStats.reduce((sum, s) => sum + s.completedLessons, 0);
  const totalCorrectAll = dailyStats.reduce((sum, s) => sum + s.correctAnswers, 0);
  const totalIncorrectAll = dailyStats.reduce((sum, s) => sum + s.incorrectAnswers, 0);
  const overallAvgScore = hasData
    ? Math.round(dailyStats.reduce((sum, s) => sum + s.averageScore, 0) / dailyStats.length)
    : 0;

  const accuracyRate =
    totalCorrectAll + totalIncorrectAll > 0
      ? Math.round((totalCorrectAll / (totalCorrectAll + totalIncorrectAll)) * 100)
      : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <SpotlightCard className="p-6 lg:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 text-xs font-bold text-indigo-300 border border-indigo-500/25 mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Phân Tích Dữ Liệu Học Tập Chuyên Sâu</span>
            </div>
            <h2 className="text-xl lg:text-2xl font-black text-white">
              Kết Quả Học Tập & Báo Cáo Thống Kê
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Dữ liệu được cập nhật theo thời gian thực từ từng lần làm bài và luyện nói của học sinh.
            </p>
          </div>

          <span className="text-xs font-bold text-slate-400 bg-white/[0.04] border border-white/[0.08] px-3.5 py-2 rounded-xl">
            Học sinh: <strong className="text-white">{user.fullName}</strong>
          </span>
        </div>

        {/* 4 Summary Stats with Animated Counter (Section 21) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-6 mt-6 border-t border-white/[0.06]">
          <div className="p-4 bg-[#0b0e17] rounded-2xl border border-white/[0.08]">
            <span className="text-[10px] text-slate-400 font-semibold block">Điểm trung bình</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-indigo-400">
                <AnimatedCounter value={overallAvgScore} duration={800} />
              </span>
              <span className="text-xs font-bold text-slate-500">/100</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              {hasData ? 'Trung bình các bài đã làm' : 'Chưa có bài kiểm tra'}
            </span>
          </div>

          <div className="p-4 bg-[#0b0e17] rounded-2xl border border-white/[0.08]">
            <span className="text-[10px] text-slate-400 font-semibold block">Tổng thời lượng học</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-cyan-400">
                <AnimatedCounter value={totalMinutesAll} duration={850} />
              </span>
              <span className="text-xs font-bold text-slate-500">phút</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Mục tiêu hôm nay: {user.dailyGoalMinutes}p
            </span>
          </div>

          <div className="p-4 bg-[#0b0e17] rounded-2xl border border-white/[0.08]">
            <span className="text-[10px] text-slate-400 font-semibold block">Tổng bài học xong</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-emerald-400">
                <AnimatedCounter value={totalLessonsAll} duration={750} />
              </span>
              <span className="text-xs font-bold text-slate-500">bài</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              {hasData ? `${totalLessonsAll} bài đã hoàn thành` : 'Chưa hoàn thành bài nào'}
            </span>
          </div>

          <div className="p-4 bg-[#0b0e17] rounded-2xl border border-white/[0.08]">
            <span className="text-[10px] text-slate-400 font-semibold block">Độ chính xác câu hỏi</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-violet-400">
                <AnimatedCounter value={accuracyRate} duration={900} />
                %
              </span>
              <span className="text-[10px] font-bold text-slate-500 ml-1">({totalCorrectAll} câu)</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              {hasData ? `${totalCorrectAll} đúng / ${totalIncorrectAll} sai` : 'Chưa có câu trả lời'}
            </span>
          </div>
        </div>
      </SpotlightCard>

      {/* BIỂU ĐỒ 1 – KẾT QUẢ THEO NGÀY (Section 20) */}
      <SpotlightCard className="p-6 lg:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                Biểu Đồ 1: Xu Hướng Điểm Số Theo Ngày (Daily Score Trend)
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Trục X = Ngày học, Trục Y = Điểm trung bình (Thang điểm 0–100)
            </p>
          </div>

          {/* Time range selector (7 ngày, 30 ngày, 3 tháng) */}
          <div className="flex items-center gap-1 bg-[#090c14] border border-white/[0.08] p-1 rounded-xl self-start sm:self-auto text-xs font-bold">
            {(['7days', '30days', '3months'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeRange === r
                    ? 'bg-indigo-600 text-white shadow-glow-indigo'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r === '7days' ? '7 ngày' : r === '30days' ? '30 ngày' : '3 tháng'}
              </button>
            ))}
          </div>
        </div>

        {hasData ? (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '11px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  }}
                  formatter={(val: any) => [`${val} điểm`, 'Điểm trung bình']}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#0e1320' }}
                  activeDot={{ r: 7, fill: '#38bdf8' }}
                  isAnimationActive={true}
                  animationDuration={900}
                  animationEasing="ease-in-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 w-full flex flex-col items-center justify-center text-center p-6 bg-white/[0.02] rounded-2xl border border-dashed border-white/[0.08]">
            <TrendingUp className="w-8 h-8 text-indigo-400/50 mb-2" />
            <p className="text-xs font-bold text-white">Chưa có dữ liệu xu hướng điểm số</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-sm">
              Đây là tài khoản mới. Sau khi bạn hoàn thành ít nhất 1 bài tập hoặc bài luyện nói AI, biểu đồ sẽ vẽ xu hướng điểm số theo ngày tại đây.
            </p>
          </div>
        )}
      </SpotlightCard>

      {/* Row with Biểu Đồ 2 & Biểu Đồ 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* BIỂU ĐỒ 2 – KẾT QUẢ THEO KỸ NĂNG (Radar Chart) (Section 20) */}
        <SpotlightCard className="lg:col-span-5 p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-indigo-400" />
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                Biểu Đồ 2: Kết Quả Theo 5 Kỹ Năng
              </h3>
            </div>
            <p className="text-[11px] text-slate-400">
              Speaking, Listening, Reading, Grammar, Vocabulary
            </p>
          </div>

          {hasData ? (
            <>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="rgba(255, 255, 255, 0.08)" />
                    <PolarAngleAxis dataKey="skill" stroke="#94a3b8" fontSize={11} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255, 255, 255, 0.15)" fontSize={10} />
                    <Radar
                      name="Điểm năng lực"
                      dataKey="score"
                      stroke="#818cf8"
                      fill="#6366f1"
                      fillOpacity={0.4}
                      isAnimationActive={true}
                      animationDuration={850}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#090d16',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '14px',
                        color: '#fff',
                        fontSize: '11px',
                      }}
                      formatter={(val: any) => [`${val}/100 điểm`, 'Năng lực']}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06] text-center">
                {radarData.map((item, idx) => (
                  <div key={idx} className="p-2 bg-[#0b0e17] rounded-xl border border-white/[0.04]">
                    <span className="text-[10px] text-slate-400 block truncate">{item.skill}</span>
                    <span className="text-xs font-bold text-indigo-400">{item.score}/100</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-72 w-full flex flex-col items-center justify-center text-center p-6 bg-white/[0.02] rounded-2xl border border-dashed border-white/[0.08]">
              <Award className="w-8 h-8 text-indigo-400/50 mb-2" />
              <p className="text-xs font-bold text-white">Chưa có đánh giá 5 kỹ năng</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                Biểu đồ Radar sẽ tổng hợp năng lực Speaking, Listening, Reading, Grammar và Vocabulary sau khi bạn làm bài.
              </p>
            </div>
          )}
        </SpotlightCard>

        {/* BIỂU ĐỒ 3 – HOẠT ĐỘNG HỌC TẬP (Bar Chart) (Section 20) */}
        <SpotlightCard className="lg:col-span-7 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Biểu Đồ 3: Hoạt Động Học Tập
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Số bài hoàn thành, số phút học, số câu đúng/sai, bài Speaking & Listening
              </p>
            </div>
          </div>

          {hasData ? (
            <>
              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#090d16',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '14px',
                        color: '#fff',
                        fontSize: '11px',
                      }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="minutes" name="Phút học" fill="#06b6d4" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={800} />
                    <Bar dataKey="correct" name="Câu đúng" fill="#10b981" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={800} />
                    <Bar dataKey="incorrect" name="Câu sai" fill="#f43f5e" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={800} />
                    <Bar dataKey="speaking" name="Speaking" fill="#6366f1" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={800} />
                    <Bar dataKey="listening" name="Listening" fill="#a855f7" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={800} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-3 bg-[#0b0e17] rounded-2xl border border-white/[0.06] flex items-center justify-between text-xs text-slate-300">
                <span>🔥 Tỉ lệ câu trả lời đúng trung bình: <strong className="text-emerald-400">{accuracyRate}%</strong></span>
                <span>Tổng thời lượng: <strong className="text-cyan-400">{totalMinutesAll} phút</strong></span>
              </div>
            </>
          ) : (
            <div className="h-72 w-full flex flex-col items-center justify-center text-center p-6 bg-white/[0.02] rounded-2xl border border-dashed border-white/[0.08]">
              <Layers className="w-8 h-8 text-cyan-400/50 mb-2" />
              <p className="text-xs font-bold text-white">Chưa có nhật ký hoạt động hàng ngày</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-sm">
                Sau khi bắt đầu học, từng phút học và số câu hỏi hoàn thành sẽ được phân loại thành các cột thống kê tại đây.
              </p>
            </div>
          )}
        </SpotlightCard>
      </div>
    </div>
  );
};
