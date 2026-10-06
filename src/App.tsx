import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { AmbientBackground } from './components/motion/AmbientBackground';
import { MouseGlow } from './components/motion/MouseGlow';
import { AnimatePresence, motion } from 'framer-motion';
import { pageVariants } from './utils/motion';

// Views
import { AuthScreen } from './components/auth/AuthScreen';
import { DashboardView } from './components/dashboard/DashboardView';
import { SpeakingPractice } from './components/speaking/SpeakingPractice';
import { RolePlayPractice } from './components/speaking/RolePlayPractice';
import { ExerciseHub } from './components/exercises/ExerciseHub';
import { ListeningPractice } from './components/listening/ListeningPractice';
import { ReadingPractice } from './components/reading/ReadingPractice';
import { FillBlanksPractice } from './components/fillblanks/FillBlanksPractice';
import { ProgressDashboard } from './components/progress/ProgressDashboard';
import { LearningHistoryView } from './components/history/LearningHistoryView';
import { AICoachView } from './components/aicoach/AICoachView';
import { ProfileSettings } from './components/profile/ProfileSettings';

const AppContent: React.FC = () => {
  const { currentTab, isAuthenticated } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Global ESC key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // Nếu người dùng chưa đăng nhập, bắt buộc tạo tài khoản hoặc đăng nhập
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen text-slate-100 flex flex-col justify-center relative selection:bg-brand-500/30 selection:text-white">
        <AmbientBackground />
        <MouseGlow />
        <AuthScreen />
      </div>
    );
  }

  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'speaking':
        return <SpeakingPractice />;
      case 'roleplay':
        return <RolePlayPractice />;
      case 'exercises':
        return <ExerciseHub />;
      case 'listening':
        return <ListeningPractice />;
      case 'reading':
        return <ReadingPractice />;
      case 'fillblanks':
        return <FillBlanksPractice />;
      case 'progress':
        return <ProgressDashboard />;
      case 'history':
        return <LearningHistoryView />;
      case 'aicoach':
        return <AICoachView />;
      case 'profile':
        return <ProfileSettings />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen text-slate-100 flex relative selection:bg-brand-500/30 selection:text-white">
      {/* Cinematic Layered Animated Background */}
      <AmbientBackground />

      {/* Interactive Cursor Spotlight Glow (Desktop only, 0-cost on mobile) */}
      <MouseGlow />

      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main App Container */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen relative z-10">
        {/* Sticky Glass Header */}
        <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Dynamic Main Content View with Smooth Page Transitions */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full pb-24 lg:pb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <MobileNav />
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
