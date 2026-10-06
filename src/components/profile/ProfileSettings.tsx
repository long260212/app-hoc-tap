import React, { useState } from 'react';
import {
  User,
  Settings,
  Bot,
  Key,
  Flame,
  Award,
  Target,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Sparkles,
  LogOut,
  Mail,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProficiencyLevel } from '../../types';
import { SpotlightCard } from '../motion/SpotlightCard';
import { motion, AnimatePresence } from 'framer-motion';

export const ProfileSettings: React.FC = () => {
  const { user, updateUser, resetAllDemoData, history, logout } = useApp();

  const [fullName, setFullName] = useState<string>(user.fullName);
  const [gradeLevel, setGradeLevel] = useState<string>(user.gradeLevel);
  const [proficiency, setProficiency] = useState<ProficiencyLevel>(user.proficiencyLevel);
  const [goalMinutes, setGoalMinutes] = useState<number>(user.dailyGoalMinutes);
  const [goalScore, setGoalScore] = useState<number>(user.dailyGoalScore);
  const [apiKey, setApiKey] = useState<string>(user.apiKey || '');
  const [useMockAI, setUseMockAI] = useState<boolean>(user.useMockAI);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      fullName,
      gradeLevel,
      proficiencyLevel: proficiency,
      dailyGoalMinutes: goalMinutes,
      dailyGoalScore: goalScore,
      apiKey,
      useMockAI,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetData = () => {
    resetAllDemoData();
    setShowResetConfirm(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Save Toast notification */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-semibold shadow-2xl backdrop-blur-xl"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Đã cập nhật thông tin thành công!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Profile Card */}
      <SpotlightCard className="p-6 lg:p-8 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
        <div className="relative group">
          <img
            src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
            alt={user.fullName}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-brand-500/30 shadow-xl transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-0 right-0 bg-brand-500 text-white p-1.5 rounded-full shadow-lg ring-2 ring-surface-card">
            <Award className="w-4 h-4" />
          </div>
        </div>

        <div className="text-center sm:text-left space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <h2 className="text-xl lg:text-2xl font-bold text-white tracking-tight">{user.fullName}</h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
              {user.proficiencyLevel}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">{user.gradeLevel}</p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl">
              <Flame className="w-4 h-4 fill-amber-400" />
              {user.currentStreak} ngày liên tiếp
            </span>
            <span className="flex items-center gap-1.5 text-brand-300 bg-brand-500/10 border border-brand-500/20 px-3 py-1 rounded-xl">
              <Zap className="w-4 h-4 text-brand-400" />
              {user.totalXp} XP tích lũy
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
              {history.length} bài học hoàn thành
            </span>
          </div>
        </div>
      </SpotlightCard>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Section 1: Thông tin học sinh */}
        <SpotlightCard className="p-6 lg:p-8 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-white/[0.06] pb-3.5">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm lg:text-base text-white">1. Thông Tin Học Sinh</h3>
              <p className="text-xs text-slate-400">Tùy biến tên hiển thị, khối lớp và trình độ tiếng Anh cá nhân</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Họ và tên học sinh:</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-card border border-white/[0.1] rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Trường & Lớp học:</label>
              <input
                type="text"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-card border border-white/[0.1] rounded-xl font-medium text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-medium mb-1.5">Trình độ tiếng Anh hiện tại:</label>
              <select
                value={proficiency}
                onChange={(e) => setProficiency(e.target.value as ProficiencyLevel)}
                className="w-full px-4 py-2.5 bg-surface-card border border-white/[0.1] rounded-xl font-medium text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-colors cursor-pointer"
              >
                <option value="Beginner" className="bg-surface-elevated text-white">Beginner (Cơ bản / Mới bắt đầu - A1-A2)</option>
                <option value="Intermediate" className="bg-surface-elevated text-white">Intermediate (Trung cấp - B1-B2)</option>
                <option value="Advanced" className="bg-surface-elevated text-white">Advanced (Nâng cao - C1-C2)</option>
              </select>
            </div>
          </div>
        </SpotlightCard>

        {/* Section 2: Mục tiêu học tập hàng ngày */}
        <SpotlightCard className="p-6 lg:p-8 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-white/[0.06] pb-3.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm lg:text-base text-white">2. Mục Tiêu Học Tập Cá Nhân</h3>
              <p className="text-xs text-slate-400">Thiết lập mục tiêu để theo dõi vòng tròn tiến độ mỗi ngày</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-2">
                Mục tiêu thời gian học mỗi ngày:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setGoalMinutes(mins)}
                    className={`py-2.5 rounded-xl font-semibold border transition-all text-xs active:scale-95 ${
                      goalMinutes === mins
                        ? 'bg-brand-500/20 border-brand-500 text-brand-300 shadow-glow-sm'
                        : 'bg-surface-card/60 border-white/[0.08] text-slate-400 hover:text-white hover:border-white/[0.2]'
                    }`}
                  >
                    {mins}p
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-2">
                Mục tiêu điểm số trung bình:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[75, 85, 90, 95].map((pts) => (
                  <button
                    key={pts}
                    type="button"
                    onClick={() => setGoalScore(pts)}
                    className={`py-2.5 rounded-xl font-semibold border transition-all text-xs active:scale-95 ${
                      goalScore === pts
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-glow-sm'
                        : 'bg-surface-card/60 border-white/[0.08] text-slate-400 hover:text-white hover:border-white/[0.2]'
                    }`}
                  >
                    {pts}+
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SpotlightCard>

        {/* Section 3: Cấu hình AI & Mock Mode */}
        <SpotlightCard className="p-6 lg:p-8 space-y-5">
          <div className="flex items-center gap-2.5 border-b border-white/[0.06] pb-3.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm lg:text-base text-white">3. Cấu Hình AI & Chế Độ Mock AI</h3>
              <p className="text-xs text-slate-400">Lựa chọn chế độ thông minh cục bộ hoặc kết nối API OpenAI</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Toggle Mock vs Live */}
            <div className="p-4 bg-surface-card/60 border border-white/[0.08] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-white">
                    Chế độ MOCK AI MODE
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Khuyên dùng
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed max-w-xl">
                  Khi bật, toàn bộ tính năng Luyện nói, Role-play, Sinh bài tập, Đọc hiểu và AI Coach đều hoạt động mượt mà bằng thuật toán thông minh tích hợp, không cần OpenAI API key.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setUseMockAI(!useMockAI)}
                className={`px-4 py-2.5 rounded-xl font-semibold transition-all shrink-0 text-xs flex items-center gap-2 active:scale-95 ${
                  useMockAI
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-glow-sm'
                    : 'bg-white/[0.08] hover:bg-white/[0.12] text-slate-300 border border-white/[0.1]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{useMockAI ? 'Mock AI: Đang Bật' : 'Mock AI: Tắt'}</span>
              </button>
            </div>

            {/* Custom AI Key */}
            {!useMockAI && (
              <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2 font-semibold text-indigo-300">
                  <Key className="w-4 h-4 text-indigo-400" />
                  <span>Google Gemini hoặc OpenAI API Key:</span>
                </div>
                <p className="text-xs text-slate-400">
                  Hệ thống hỗ trợ cả Google Gemini API Key (<code className="bg-white/[0.08] px-1 py-0.5 rounded text-brand-300 font-mono">AQ...</code> / <code className="bg-white/[0.08] px-1 py-0.5 rounded text-brand-300 font-mono">AIza...</code>) và OpenAI Key (<code className="bg-white/[0.08] px-1 py-0.5 rounded text-brand-300 font-mono">sk-...</code>). Đã cấu hình tại file <code className="bg-white/[0.08] px-1.5 py-0.5 rounded border border-white/[0.1] text-brand-300 font-mono">.env</code>.
                </p>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AQ... hoặc sk-..."
                  className="w-full px-4 py-2.5 bg-surface-card border border-indigo-500/30 rounded-xl font-mono text-xs text-white focus:outline-none focus:border-indigo-400 transition-colors"
                />
              </div>
            )}
          </div>
        </SpotlightCard>

        {/* Section 4: Quản lý tài khoản & Đăng xuất */}
        <SpotlightCard className="p-6 lg:p-8 space-y-5">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm lg:text-base text-white">4. Quản Lý Tài Khoản & Đăng Xuất</h3>
                <p className="text-xs text-slate-400">Thông tin đăng nhập, bảo mật và kết thúc phiên học tập</p>
              </div>
            </div>
            <span className="hidden sm:inline-block text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold">
              Tài khoản đang hoạt động
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                <Mail className="w-3.5 h-3.5" />
                <span>Email đăng nhập:</span>
              </div>
              <p className="text-sm font-bold text-white truncate">{user.email || 'Chưa liên kết'}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                <User className="w-3.5 h-3.5" />
                <span>Mã định danh học sinh (ID):</span>
              </div>
              <p className="text-xs font-mono font-bold text-indigo-300 truncate">{user.id}</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-rose-500/5 border border-rose-500/15 p-4 rounded-2xl">
            <div>
              <p className="text-xs font-bold text-rose-300">Đăng xuất khỏi thiết bị này</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Bạn có thể đăng nhập lại bất kỳ lúc nào để tiếp tục chuỗi ngày học Streak và điểm XP.
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-200 hover:text-white border border-rose-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất tài khoản</span>
            </button>
          </div>
        </SpotlightCard>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {showResetConfirm ? (
            <div className="flex items-center gap-2 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <span className="text-xs text-rose-300 px-2 font-medium">Bạn có chắc chắn?</span>
              <button
                type="button"
                onClick={handleResetData}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors"
              >
                Đồng ý
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] text-slate-300 font-semibold text-xs transition-colors"
              >
                Hủy
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="w-full sm:w-auto px-5 py-2.5 bg-surface-card hover:bg-white/[0.08] text-slate-300 hover:text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 border border-white/[0.08] transition-all active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Khôi phục dữ liệu Demo ban đầu</span>
            </button>
          )}

          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs rounded-xl shadow-glow-sm hover:shadow-glow transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Lưu tất cả thay đổi</span>
          </button>
        </div>
      </form>
    </div>
  );
};
