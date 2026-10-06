import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Mic, BookOpenCheck, BarChart3, Sparkles } from 'lucide-react';
import { useApp, NavigationTab } from '../../context/AppContext';

export const MobileNav: React.FC = () => {
  const { currentTab, setCurrentTab } = useApp();

  const mobileTabs: { id: NavigationTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Trang chủ', icon: LayoutDashboard },
    { id: 'speaking', label: 'Luyện nói', icon: Mic },
    { id: 'exercises', label: 'Bài tập', icon: BookOpenCheck },
    { id: 'progress', label: 'Tiến độ', icon: BarChart3 },
    { id: 'aicoach', label: 'AI Coach', icon: Sparkles },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090c14]/95 backdrop-blur-xl border-t border-white/[0.08] px-2 py-1.5 flex justify-around items-center shadow-2xl">
      {mobileTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`relative flex flex-col items-center py-1 px-3 rounded-2xl transition-all ${
              isActive ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="mobileActivePill"
                className="absolute inset-0 bg-indigo-500/15 border border-indigo-500/30 rounded-2xl pointer-events-none"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            <div className="relative z-10 p-1">
              <Icon className="w-4 h-4" />
            </div>
            <span className="relative z-10 text-[9px] mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
