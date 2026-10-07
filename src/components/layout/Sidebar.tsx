import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Mic,
  Drama,
  BookOpenCheck,
  Headphones,
  BookMarked,
  TextCursorInput,
  BarChart3,
  History,
  Sparkles,
  User,
  Flame,
  Award,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useApp, NavigationTab } from '../../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentTab, setCurrentTab, user, logout } = useApp();

  const navItems: { id: NavigationTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'dashboard', label: 'Trang chủ', icon: LayoutDashboard },
    { id: 'speaking', label: 'Luyện nói với AI', icon: Mic, badge: 'Hot' },
    { id: 'roleplay', label: 'Role-play thực tế', icon: Drama },
    { id: 'exercises', label: 'Kho bài tập', icon: BookOpenCheck },
    { id: 'listening', label: 'Luyện nghe', icon: Headphones },
    { id: 'reading', label: 'Đọc hiểu', icon: BookMarked },
    { id: 'fillblanks', label: 'Điền từ', icon: TextCursorInput },
    { id: 'progress', label: 'Kết quả học tập', icon: BarChart3 },
    { id: 'history', label: 'Lịch sử học tập', icon: History },
    { id: 'aicoach', label: 'AI Learning Coach', icon: Sparkles, badge: 'AI' },
    { id: 'profile', label: 'Hồ sơ & Cài đặt', icon: User },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-[#090c14]/95 backdrop-blur-2xl border-r border-white/[0.08] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-glow-indigo">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                EduSpeak <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold px-1.5 py-0.5 rounded-md">PRO AI</span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">Desktop Learning App</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06]"
          >
            ✕
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Học tập tương tác
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  onClose();
                }}
                className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-colors duration-200 group ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                {/* Smooth Sliding Active Pill Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="sidebarActivePill"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 32,
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-indigo-600/30 to-blue-600/20 border border-indigo-500/40 rounded-2xl shadow-glow-indigo pointer-events-none"
                  />
                )}

                <div className="relative z-10 flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 ${
                      isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="relative z-10 flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                        isActive
                          ? 'bg-indigo-400/20 text-indigo-300 border border-indigo-400/30'
                          : 'bg-white/[0.06] text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Streak & Profile Card at Bottom (Section 19: Streak Flame scale 1 -> 1.15 -> 1 with glow) */}
        <div className="p-4 border-t border-white/[0.06] bg-[#07090f]/70">
          <div className="bg-[#0e1320] p-3 rounded-2xl border border-white/[0.06] shadow-card flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <motion.div
                whileHover={{ scale: 1.15 }}
                transition={{ duration: 0.2 }}
                className="w-8 h-8 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center text-orange-400 shadow-glow-orange cursor-pointer"
              >
                <Flame className="w-4 h-4 fill-orange-500" />
              </motion.div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Chuỗi ngày học</p>
                <p className="text-xs font-bold text-white">{user.currentStreak} ngày liên tục</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-lg">
              <Award className="w-3.5 h-3.5" />
              {user.totalXp} XP
            </div>
          </div>

          <div className="flex items-center justify-between p-1.5 rounded-2xl hover:bg-white/[0.04] transition-colors group">
            <div
              onClick={() => {
                setCurrentTab('profile');
                onClose();
              }}
              className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
            >
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                alt={user.fullName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                  {user.fullName}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{user.gradeLevel}</p>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
