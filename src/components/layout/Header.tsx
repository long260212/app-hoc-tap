import React from 'react';
import { Menu, Flame, Clock, Award, CheckCircle2, Bot, Sparkles, RefreshCw, Command, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { currentTab, setCurrentTab, user, dailyStats, updateUser, resetAllDemoData, logout } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayStat = dailyStats.find((s) => s.date === todayStr) || {
    totalMinutes: 0,
    completedLessons: 0,
    averageScore: 0,
  };

  const goalProgress = Math.min(100, Math.round((todayStat.totalMinutes / (user.dailyGoalMinutes || 30)) * 100));

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard Học Tập', subtitle: 'Tổng quan tiến độ & mục tiêu hôm nay' },
    speaking: { title: 'Luyện Nói Với AI', subtitle: 'Hội thoại tương tác 1:1 và sửa lỗi tức thì' },
    roleplay: { title: 'Role-Play Thực Tế', subtitle: 'Đóng vai nhân vật trong các tình huống thực tế' },
    exercises: { title: 'Kho Bài Tập Đa Dạng', subtitle: '10 dạng bài tập chấm điểm ngay và sinh đề bằng AI' },
    listening: { title: 'Luyện Nghe Chủ Động', subtitle: 'Audio tùy chỉnh tốc độ, transcript và câu hỏi' },
    reading: { title: 'Đọc Hiểu Tương Tác', subtitle: 'Văn bản theo cấp độ với câu hỏi suy luận và từ vựng' },
    fillblanks: { title: 'Luyện Điền Từ (Cloze)', subtitle: 'Thực hành điền từ với ngân hàng từ gợi ý' },
    progress: { title: 'Biểu Đồ & Thống Kê', subtitle: 'Phân tích kết quả theo ngày, kỹ năng và hoạt động' },
    history: { title: 'Lịch Sử Học Tập', subtitle: 'Tra cứu toàn bộ bài làm, đáp án và nhận xét AI' },
    aicoach: { title: 'AI Learning Coach', subtitle: 'Trợ lý phân tích điểm mạnh và đề xuất lộ trình' },
    profile: { title: 'Hồ Sơ & Cài Đặt', subtitle: 'Tùy chỉnh mục tiêu cá nhân và cấu hình API' },
  };

  const currentInfo = tabTitles[currentTab] || { title: 'EduSpeak AI', subtitle: 'Học tiếng Anh thông minh' };

  return (
    <header className="sticky top-0 z-30 bg-[#07090e]/80 backdrop-blur-xl border-b border-white/[0.06] px-4 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] focus:outline-none transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base lg:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            {currentInfo.title}
          </h2>
          <p className="text-[11px] text-slate-400 hidden sm:block font-medium">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Quick Stats & AI Mode */}
      <div className="flex items-center gap-2 lg:gap-3.5">
        {/* Desktop Quick Today Stats Pill */}
        <div className="hidden xl:flex items-center gap-3 bg-[#0d111a] border border-white/[0.08] px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-400 shadow-soft">
          <div className="flex items-center gap-1.5 text-indigo-400">
            <Award className="w-3.5 h-3.5" />
            <span>Điểm: <strong className="text-white">{todayStat.averageScore}</strong></span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-cyan-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Xong: <strong className="text-white">{todayStat.completedLessons} bài</strong></span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-blue-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Thời gian: <strong className="text-white">{todayStat.totalMinutes}p</strong></span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-orange-400">
            <Flame className="w-3.5 h-3.5 fill-orange-500" />
            <span>Streak: <strong className="text-white">{user.currentStreak} ngày</strong></span>
          </div>
        </div>

        {/* Keyboard shortcut hint (Section 35) */}
        <div className="hidden lg:flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-white/[0.03] border border-white/[0.06] px-2.5 py-1 rounded-lg">
          <kbd className="font-mono text-[9px] bg-white/[0.08] px-1 py-0.5 rounded text-slate-300">Space</kbd>
          <span>Mic</span>
          <span className="mx-1 text-slate-700">•</span>
          <kbd className="font-mono text-[9px] bg-white/[0.08] px-1 py-0.5 rounded text-slate-300">↵ Enter</kbd>
          <span>Gửi</span>
        </div>

        {/* Mock AI vs Real AI Mode Badge */}
        <button
          onClick={() => updateUser({ useMockAI: !user.useMockAI })}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
            user.useMockAI
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
              : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/25'
          }`}
          title="Bấm để chuyển đổi giữa Mock AI thông minh và AI Live (Gemini / OpenAI)"
        >
          <Bot className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{user.useMockAI ? 'Mock AI Sẵn Sàng' : 'AI Live Mode'}</span>
          <span className="md:hidden">{user.useMockAI ? 'Mock' : 'AI Live'}</span>
        </button>

        {/* Reset Demo Data quick button */}
        <button
          onClick={resetAllDemoData}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
          title="Khôi phục dữ liệu mẫu ban đầu"
        >
          <RefreshCw className="w-3.5 h-3.5 hover:rotate-180 transition-transform duration-500" />
        </button>

        {/* User Pill & Logout Button */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-white/[0.08]">
          <button
            onClick={() => setCurrentTab('profile')}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] transition-all"
            title="Xem hồ sơ học sinh"
          >
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
              alt={user.fullName}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-indigo-500/50"
            />
            <span className="text-xs font-semibold text-slate-200 hidden md:inline max-w-[110px] truncate">
              {user.fullName}
            </span>
          </button>

          <button
            onClick={logout}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
            title="Đăng xuất khỏi tài khoản"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
