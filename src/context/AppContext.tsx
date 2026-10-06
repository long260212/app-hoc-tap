import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  LearningHistoryRecord,
  DailyStatisticRecord,
  ExerciseItem,
  RegisterInput,
  LoginInput,
} from '../types';
import { StorageService } from '../services/storageService';

export type NavigationTab =
  | 'dashboard'
  | 'speaking'
  | 'roleplay'
  | 'exercises'
  | 'listening'
  | 'reading'
  | 'fillblanks'
  | 'progress'
  | 'history'
  | 'aicoach'
  | 'profile';

interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  user: UserProfile;
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  login: (input: LoginInput) => { success: boolean; message: string };
  register: (input: RegisterInput) => { success: boolean; message: string };
  loginAsDemo: () => void;
  logout: () => void;
  updateUser: (updated: Partial<UserProfile>) => void;
  history: LearningHistoryRecord[];
  addHistoryRecord: (item: Omit<LearningHistoryRecord, 'id' | 'createdAt'> & { id?: string; createdAt?: string }) => void;
  dailyStats: DailyStatisticRecord[];
  exercises: ExerciseItem[];
  addCustomExercise: (exercise: ExerciseItem) => void;
  activeExercise: ExerciseItem | null;
  startExercise: (exercise: ExerciseItem) => void;
  finishExercise: () => void;
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  resetAllDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(StorageService.isAuthenticated());
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(StorageService.getUser());
  const [history, setHistory] = useState<LearningHistoryRecord[]>(StorageService.getHistory());
  const [dailyStats, setDailyStats] = useState<DailyStatisticRecord[]>(StorageService.getDailyStats());
  const [exercises, setExercises] = useState<ExerciseItem[]>(StorageService.getExercises());
  const [activeExercise, setActiveExercise] = useState<ExerciseItem | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Tải lại dữ liệu đồng bộ
  const refreshUserData = (activeUser: UserProfile | null) => {
    setCurrentUser(activeUser);
    setIsAuthenticated(!!activeUser);
    setHistory(StorageService.getHistory(activeUser?.id));
    setDailyStats(StorageService.getDailyStats(activeUser?.id));
    setExercises(StorageService.getExercises());
  };

  useEffect(() => {
    const loaded = StorageService.getUser();
    refreshUserData(loaded);
  }, []);

  const login = (input: LoginInput) => {
    const result = StorageService.login(input);
    if (result.success && result.user) {
      refreshUserData(result.user);
      showToast(result.message, 'success');
    } else {
      showToast(result.message, 'error');
    }
    return result;
  };

  const register = (input: RegisterInput) => {
    const result = StorageService.register(input);
    if (result.success && result.user) {
      refreshUserData(result.user);
      showToast(result.message, 'success');
    } else {
      showToast(result.message, 'error');
    }
    return result;
  };

  const loginAsDemo = () => {
    const demo = StorageService.loginAsDemo();
    refreshUserData(demo);
    showToast(`Đã vào chế độ tài khoản mẫu: ${demo.fullName}`, 'info');
  };

  const logout = () => {
    StorageService.logout();
    refreshUserData(null);
    setCurrentTab('dashboard');
    showToast('Bạn đã đăng xuất tài khoản thành công.', 'info');
  };

  const updateUser = (updated: Partial<UserProfile>) => {
    if (!currentUser) return;
    const newUser = { ...currentUser, ...updated };
    setCurrentUser(newUser);
    StorageService.saveUser(newUser);
    showToast('Hồ sơ học tập đã được cập nhật!', 'success');
  };

  const addHistoryRecord = (item: Omit<LearningHistoryRecord, 'id' | 'createdAt'> & { id?: string; createdAt?: string }) => {
    const created = StorageService.addHistoryItem(item);
    setHistory(StorageService.getHistory(currentUser?.id));
    setDailyStats(StorageService.getDailyStats(currentUser?.id));
    const refreshedUser = StorageService.getUser();
    if (refreshedUser) setCurrentUser(refreshedUser);
    showToast(`Đã lưu kết quả học tập! (+${Math.round(created.score / 2) + 20} XP)`, 'success');
  };

  const addCustomExercise = (exercise: ExerciseItem) => {
    StorageService.addExercise(exercise);
    setExercises(StorageService.getExercises());
    showToast('Đã tạo thành công bài tập mới với AI!', 'success');
  };

  const startExercise = (exercise: ExerciseItem) => {
    setActiveExercise(exercise);
    setCurrentTab('exercises');
  };

  const finishExercise = () => {
    setActiveExercise(null);
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const resetAllDemoData = () => {
    StorageService.resetToDemo();
    const demo = StorageService.getUser();
    refreshUserData(demo);
    setActiveExercise(null);
    showToast('Đã khôi phục dữ liệu mẫu ban đầu!', 'info');
  };

  // Fallback an toàn cho components dùng user không bị undefined/null
  const user = currentUser || StorageService.getFallbackUser();

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        user,
        currentUser,
        isAuthenticated,
        login,
        register,
        loginAsDemo,
        logout,
        updateUser,
        history,
        addHistoryRecord,
        dailyStats,
        exercises,
        addCustomExercise,
        activeExercise,
        startExercise,
        finishExercise,
        toasts,
        showToast,
        resetAllDemoData,
      }}
    >
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all transform animate-bounce duration-300 flex items-center gap-2 ${
              toast.type === 'success'
                ? 'bg-emerald-600 text-white'
                : toast.type === 'error'
                ? 'bg-rose-600 text-white'
                : toast.type === 'warning'
                ? 'bg-amber-500 text-white'
                : 'bg-brand-700 text-white'
            }`}
          >
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
