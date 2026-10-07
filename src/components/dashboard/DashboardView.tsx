import React from 'react';
import { motion } from 'framer-motion';
import {
  Mic,
  BookOpenCheck,
  Headphones,
  TextCursorInput,
  BookMarked,
  BarChart3,
  History,
  Sparkles,
  Flame,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SpotlightCard } from '../motion/SpotlightCard';
import { AnimatedCounter } from '../motion/AnimatedCounter';
import { ProgressRing } from '../motion/ProgressRing';
import { ShimmerText } from '../motion/ShimmerText';
import { staggerContainerVariants, cardEntranceVariants } from '../../utils/motion';

export const DashboardView: React.FC = () => {
  const { user, dailyStats, history, setCurrentTab } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayStat = dailyStats.find((s) => s.date === todayStr) || {
    totalMinutes: 0,
    completedLessons: 0,
    averageScore: 0,
  };

  const goalMinutes = user.dailyGoalMinutes || 30;
  const goalProgress = Math.min(100, Math.round((todayStat.totalMinutes / goalMinutes) * 100));

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="initial"
      animate="animate"
      className="space-y-6 pb-12"
    >
      {/* 1. Hero / Welcome Area with Sequential Stagger (Section 15) */}
      <motion.div
        variants={cardEntranceVariants}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/70 via-[#0d1326] to-[#071322] border border-white/[0.1] p-6 lg:p-8 text-white shadow-card card-gradient-border"
      >
        <div className="relative z-10 max-w-3xl space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] backdrop-blur-md text-xs font-semibold text-cyan-300 border border-white/[0.08]"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI English Learning Platform • Next-Gen Pro</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-2xl lg:text-3xl font-black tracking-tight"
          >
            Chào mừng trở lại, {user.fullName}! 👋
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-xs lg:text-sm text-slate-300 font-medium leading-relaxed"
          >
            {todayStat.completedLessons > 0 ? (
              <>
                Sẵn sàng bứt phá cùng <ShimmerText>AI Speaking</ShimmerText> hôm nay? Bạn đã hoàn thành{' '}
                <strong className="text-white font-bold">{todayStat.completedLessons} bài học</strong> và đạt{' '}
                <strong className="text-white font-bold">{todayStat.averageScore}/100 điểm</strong> trung bình.
              </>
            ) : (
              <>
                Chào mừng bạn đến với <ShimmerText>EduSpeak AI</ShimmerText>! Tài khoản của bạn đã sẵn sàng. Hãy bắt đầu bài học đầu tiên để kích hoạt chuỗi học Streak và tích lũy điểm XP hôm nay.
              </>
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="pt-2 flex flex-wrap items-center gap-3"
          >
            <button
              onClick={() => setCurrentTab('speaking')}
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-blue-600 to-cyan-500 text-white font-bold text-xs shadow-glow-indigo transition-all transform hover:-translate-y-0.5 active:scale-98"
            >
              <Mic className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>Luyện nói với AI ngay</span>
            </button>

            <button
              onClick={() => setCurrentTab('roleplay')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white font-semibold text-xs border border-white/[0.08] transition-all transform hover:-translate-y-0.5 active:scale-98"
            >
              <span>Thử thách Role-play</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>

        {/* Ambient Hero Light Glows */}
        <div className="absolute right-0 top-0 -mt-16 -mr-16 w-80 h-80 bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute right-40 bottom-0 -mb-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />
      </motion.div>

      {/* 2. Key Metrics Row with Animated Counters (Section 21) */}
      <motion.div variants={cardEntranceVariants} className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Metric 1: Điểm hôm nay */}
        <SpotlightCard className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold text-slate-400">Điểm hôm nay</span>
            <div className="w-7 h-7 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white">
              <AnimatedCounter value={todayStat.averageScore} duration={850} />
            </span>
            <span className="text-xs font-bold text-slate-500">/100</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 mt-1 flex items-center gap-1">
            {todayStat.completedLessons > 0 ? (
              <span className="text-emerald-400">Điểm trung bình các bài hôm nay</span>
            ) : (
              <span className="text-slate-500">Chưa làm bài hôm nay</span>
            )}
          </span>
        </SpotlightCard>

        {/* Metric 2: Bài hoàn thành */}
        <SpotlightCard className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold text-slate-400">Bài hoàn thành</span>
            <div className="w-7 h-7 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white">
              <AnimatedCounter value={todayStat.completedLessons} duration={800} />
            </span>
            <span className="text-xs font-bold text-slate-500">bài</span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 mt-1">
            {todayStat.completedLessons > 0
              ? `Đã hoàn thành ${todayStat.completedLessons} bài hôm nay`
              : 'Chưa hoàn thành bài nào'}
          </span>
        </SpotlightCard>

        {/* Metric 3: Thời gian học */}
        <SpotlightCard className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold text-slate-400">Thời gian học</span>
            <div className="w-7 h-7 rounded-xl bg-violet-500/15 text-violet-400 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white">
              <AnimatedCounter value={todayStat.totalMinutes} duration={900} />
            </span>
            <span className="text-xs font-bold text-slate-500">phút</span>
          </div>
          <span className="text-[10px] font-semibold text-indigo-400 mt-1">
            {todayStat.totalMinutes > 0
              ? `Đạt ${goalProgress}% mục tiêu`
              : `Mục tiêu: ${goalMinutes}p`}
          </span>
        </SpotlightCard>

        {/* Metric 4: Streak */}
        <SpotlightCard className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold text-slate-400">Chuỗi ngày liên tục</span>
            <div className="w-7 h-7 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center">
              <Flame className="w-3.5 h-3.5 fill-orange-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-orange-400">
              <AnimatedCounter value={user.currentStreak} duration={750} />
            </span>
            <span className="text-xs font-bold text-slate-500">ngày</span>
          </div>
          <div className="mt-2 w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-orange-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, (user.currentStreak / 10) * 100)}%` }}
            />
          </div>
        </SpotlightCard>
      </motion.div>

      {/* 3. Asymmetric Bento Grid (Section 6) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* BENTO 1: AI Speaking - CARD LỚN NHẤT (Col 8) */}
        <motion.div variants={cardEntranceVariants} className="md:col-span-8">
          <SpotlightCard
            onClick={() => setCurrentTab('speaking')}
            enableTilt={true}
            className="p-6 cursor-pointer card-gradient-border flex flex-col justify-between h-full group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-glow-indigo group-hover:scale-105 transition-transform">
                    <Mic className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                      Feature Flagship
                    </span>
                    <h3 className="text-lg font-black text-white group-hover:text-indigo-300 transition-colors">
                      1. Luyện Nói Với AI (AI Speaking)
                    </h3>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/15 border border-cyan-500/25 px-2.5 py-1 rounded-full">
                  17 Chủ đề thực tế
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                Hội thoại 1:1 tương tác giọng nói trực tiếp qua microphone. AI chấm điểm tức thì trên 5 tiêu chí: <strong>Phát âm, Ngữ pháp, Từ vựng, Trôi chảy, Độ liên quan</strong>, kèm gợi ý diễn đạt tự nhiên chuẩn bản xứ.
              </p>

              {/* Sample preview tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {['At a Restaurant', 'Shopping', 'Job Interview', 'Introduce yourself', 'Travel'].map((tag, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors">
              <span>Bắt đầu đối thoại ngay</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
            </div>
          </SpotlightCard>
        </motion.div>

        {/* BENTO 2: Daily Progress - CARD TRUNG BÌNH (Col 4) with ProgressRing */}
        <motion.div variants={cardEntranceVariants} className="md:col-span-4">
          <SpotlightCard
            onClick={() => setCurrentTab('progress')}
            className="p-6 cursor-pointer flex flex-col items-center justify-between text-center h-full group"
          >
            <div>
              <div className="flex items-center justify-between w-full mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Mục tiêu hôm nay
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  Active
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">Tiến Độ Học Tập</h4>
            </div>

            {/* Circular Progress Ring */}
            <div className="my-2">
              <ProgressRing progress={goalProgress} size={120} strokeWidth={8} title="Đạt được" />
            </div>

            <div className="w-full pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">
              <span>Xem 3 biểu đồ phân tích</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </SpotlightCard>
        </motion.div>

        {/* BENTO 3: Kho bài tập (Col 4) */}
        <motion.div variants={cardEntranceVariants} className="md:col-span-4">
          <SpotlightCard
            onClick={() => setCurrentTab('exercises')}
            className="p-5 cursor-pointer flex flex-col justify-between h-full group"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <BookOpenCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                2. Kho Bài Tập Đa Dạng
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                10 dạng bài trắc nghiệm, True/False, nối từ, sắp xếp câu và sinh đề mới bằng AI.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>Làm bài ngay</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </SpotlightCard>
        </motion.div>

        {/* BENTO 4: Luyện nghe (Col 4) */}
        <motion.div variants={cardEntranceVariants} className="md:col-span-4">
          <SpotlightCard
            onClick={() => setCurrentTab('listening')}
            className="p-5 cursor-pointer flex flex-col justify-between h-full group"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/25 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Headphones className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                3. Luyện Nghe Chủ Động
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                Audio tốc độ 0.75x - 1.25x, ban đầu ẩn transcript để thử thách khả năng bắt từ khóa.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-bold text-cyan-400">
              <span>Nghe audio</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </SpotlightCard>
        </motion.div>

        {/* BENTO 5: Điền từ & Đọc hiểu (Col 4) */}
        <motion.div variants={cardEntranceVariants} className="md:col-span-4">
          <SpotlightCard
            onClick={() => setCurrentTab('fillblanks')}
            className="p-5 cursor-pointer flex flex-col justify-between h-full group"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/25 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <TextCursorInput className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                4. Điền Từ (Cloze Test)
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                4 chế độ: Tự do, Word Bank, theo bài nghe và theo bài đọc hiểu văn bản.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-bold text-amber-400">
              <span>Thực hành điền từ</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </SpotlightCard>
        </motion.div>

        {/* BENTO 6: AI Coach - CARD RỘNG (Col 12) (Section 27: Sentence/block reveal) */}
        <motion.div variants={cardEntranceVariants} className="md:col-span-12">
          <SpotlightCard
            onClick={() => setCurrentTab('aicoach')}
            className="p-6 cursor-pointer card-gradient-border group"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-glow-indigo shrink-0">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-full">
                      AI Learning Coach
                    </span>
                    <span className="text-xs text-slate-400">• Phân tích thời gian thực</span>
                  </div>
                  <h4 className="text-base font-extrabold text-white">
                    “Your speaking fluency improved this week (+12%).”
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                    AI ghi nhận bạn phát âm tự tin hơn trong các chủ đề đời sống. Hôm nay hãy thử sức với tình huống{' '}
                    <strong className="text-cyan-300">At a Restaurant</strong> hoặc làm thêm bài đọc{' '}
                    <strong className="text-cyan-300">The Rise of AI in Education</strong> để củng cố vốn từ vựng nhé!
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentTab('aicoach');
                }}
                className="shrink-0 px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-bold border border-white/[0.1] transition-all flex items-center gap-1.5 self-start md:self-auto"
              >
                <span>Xem chi tiết lộ trình</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </SpotlightCard>
        </motion.div>
      </div>

      {/* 4. Recent History Preview with Dark Surface Styling */}
      <motion.div variants={cardEntranceVariants}>
        <SpotlightCard className="p-6">
          <div className="flex items-center justify-between mb-4 border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="font-extrabold text-white text-sm">Hoạt Động Gần Đây</h3>
            </div>
            <button
              onClick={() => setCurrentTab('history')}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              <span>Xem toàn bộ lịch sử</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {history.slice(0, 4).map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-lg shrink-0 ${
                      item.activityType === 'Speaking'
                        ? 'bg-blue-500/15 text-blue-300 border border-blue-500/20'
                        : item.activityType === 'Listening'
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20'
                        : item.activityType === 'Reading'
                        ? 'bg-violet-500/15 text-violet-300 border border-violet-500/20'
                        : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                    }`}
                  >
                    {item.activityType}
                  </span>
                  <div className="truncate">
                    <p className="font-bold text-white truncate">{item.topicTitle}</p>
                    <p className="text-[10px] text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString('vi-VN')} • {Math.round(item.durationSeconds / 60)} phút học
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-black text-sm text-indigo-300">{item.score}</span>
                  <span className="text-[10px] text-slate-500">/100</span>
                </div>
              </div>
            ))}
          </div>
        </SpotlightCard>
      </motion.div>
    </motion.div>
  );
};
