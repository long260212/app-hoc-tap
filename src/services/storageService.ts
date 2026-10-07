import {
  UserProfile,
  LearningHistoryRecord,
  DailyStatisticRecord,
  ExerciseItem,
  RegisterInput,
  LoginInput,
} from '../types';
import {
  INITIAL_USER,
  SEED_LEARNING_HISTORY,
  SEED_DAILY_STATS,
  SEED_EXERCISES,
} from './mockData';

export const DEMO_ACCOUNT: UserProfile = {
  ...INITIAL_USER,
  id: 'user-demo-1',
  email: 'minhquan.english@school.edu.vn',
  password: 'password123',
};

const STORAGE_KEYS = {
  USER: 'eduspeak_user',
  ACCOUNTS: 'eduspeak_accounts',
  AUTH_SESSION: 'eduspeak_auth_session',
  HISTORY: 'eduspeak_history',
  DAILY_STATS: 'eduspeak_daily_stats',
  EXERCISES: 'eduspeak_exercises',
};

export class StorageService {
  // 1. Quản lý danh sách tài khoản
  public static getAccounts(): UserProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    const initial = [DEMO_ACCOUNT];
    this.saveAccounts(initial);
    return initial;
  }

  public static saveAccounts(accounts: UserProfile[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    } catch {}
  }

  // 2. Kiểm tra trạng thái đăng nhập
  public static isAuthenticated(): boolean {
    return !!this.getCurrentSession();
  }

  public static getCurrentSession(): { userId: string } | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed?.userId) return parsed;
      }
    } catch {}
    return null;
  }

  public static getUser(): UserProfile | null {
    const session = this.getCurrentSession();
    if (!session) return null;
    const accounts = this.getAccounts();
    const user = accounts.find((a) => a.id === session.userId);
    return user || null;
  }

  public static getFallbackUser(): UserProfile {
    return INITIAL_USER;
  }

  public static saveUser(user: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      const accounts = this.getAccounts();
      const index = accounts.findIndex((a) => a.id === user.id);
      if (index >= 0) {
        accounts[index] = user;
      } else {
        accounts.push(user);
      }
      this.saveAccounts(accounts);
    } catch {}
  }

  // 3. Đăng ký tài khoản mới (Sign Up)
  public static register(input: RegisterInput): { success: boolean; message: string; user?: UserProfile } {
    const accounts = this.getAccounts();
    const cleanEmail = input.email.trim().toLowerCase();

    if (!input.fullName.trim()) {
      return { success: false, message: 'Vui lòng nhập họ và tên của bạn.' };
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Vui lòng nhập địa chỉ email hợp lệ.' };
    }
    if (!input.password || input.password.length < 6) {
      return { success: false, message: 'Mật khẩu phải có tối thiểu 6 ký tự.' };
    }
    if (accounts.some((a) => a.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: 'Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.' };
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      fullName: input.fullName.trim(),
      email: cleanEmail,
      password: input.password,
      gradeLevel: input.gradeLevel || 'Lớp 9',
      proficiencyLevel: input.proficiencyLevel || 'Intermediate',
      dailyGoalMinutes: input.dailyGoalMinutes || 30,
      dailyGoalScore: 80,
      currentStreak: 0,
      longestStreak: 0,
      totalXp: 0, // Tài khoản mới bắt đầu từ 0 XP
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(input.fullName.trim())}`,
      useMockAI: true,
      createdAt: new Date().toISOString(),
    };

    accounts.push(newUser);
    this.saveAccounts(accounts);

    // Lưu phiên đăng nhập
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify({ userId: newUser.id }));
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));

    // Khởi tạo nhật ký & thống kê riêng cho tài khoản mới (hoàn toàn trống)
    this.saveHistory([], newUser.id);
    this.saveDailyStats([], newUser.id);

    return {
      success: true,
      message: 'Chúc mừng bạn đã tạo tài khoản mới thành công! Hãy bắt đầu bài học đầu tiên.',
      user: newUser,
    };
  }

  // 4. Đăng nhập tài khoản (Sign In)
  public static login(input: LoginInput): { success: boolean; message: string; user?: UserProfile } {
    const accounts = this.getAccounts();
    const cleanEmail = input.email.trim().toLowerCase();

    const found = accounts.find(
      (a) => (a.email.toLowerCase() === cleanEmail || a.id === input.email.trim()) && a.password === input.password
    );

    if (!found) {
      return { success: false, message: 'Email hoặc mật khẩu không chính xác. Vui lòng thử lại.' };
    }

    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify({ userId: found.id }));
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(found));

    return {
      success: true,
      message: `Chào mừng bạn trở lại, ${found.fullName}!`,
      user: found,
    };
  }

  // 5. Đăng nhập tài khoản Demo mẫu
  public static loginAsDemo(): UserProfile {
    const accounts = this.getAccounts();
    let demo = accounts.find((a) => a.id === DEMO_ACCOUNT.id || a.email === DEMO_ACCOUNT.email);
    if (!demo) {
      demo = DEMO_ACCOUNT;
      accounts.push(demo);
      this.saveAccounts(accounts);
    }
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify({ userId: demo.id }));
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(demo));
    return demo;
  }

  // 6. Đăng xuất
  public static logout(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch {}
  }

  // 7. Nhật ký học tập (hỗ trợ lưu theo từng tài khoản)
  public static getHistory(userId?: string): LearningHistoryRecord[] {
    const session = this.getCurrentSession();
    const activeId = userId || session?.userId;

    if (!activeId || activeId === DEMO_ACCOUNT.id || activeId === INITIAL_USER.id) {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
        if (data) return JSON.parse(data);
      } catch {}
      this.saveHistory(SEED_LEARNING_HISTORY);
      return SEED_LEARNING_HISTORY;
    }

    try {
      const data = localStorage.getItem(`${STORAGE_KEYS.HISTORY}_${activeId}`);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  }

  public static saveHistory(history: LearningHistoryRecord[], userId?: string): void {
    const session = this.getCurrentSession();
    const activeId = userId || session?.userId;

    try {
      if (!activeId || activeId === DEMO_ACCOUNT.id || activeId === INITIAL_USER.id) {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
      } else {
        localStorage.setItem(`${STORAGE_KEYS.HISTORY}_${activeId}`, JSON.stringify(history));
      }
    } catch {}
  }

  public static addHistoryItem(item: Omit<LearningHistoryRecord, 'id' | 'createdAt'> & { id?: string; createdAt?: string }): LearningHistoryRecord {
    const history = this.getHistory();
    const newItem: LearningHistoryRecord = {
      ...item,
      id: item.id || `hist-${Date.now()}`,
      createdAt: item.createdAt || new Date().toISOString(),
    };
    const updated = [newItem, ...history];
    this.saveHistory(updated);

    // Cập nhật thống kê ngày hôm nay
    this.recordActivityToToday({
      durationSeconds: newItem.durationSeconds,
      score: newItem.score,
      skill: newItem.skillCategory,
      isSpeaking: newItem.activityType === 'Speaking' || newItem.activityType === 'RolePlay',
      isListening: newItem.activityType === 'Listening',
    });

    return newItem;
  }

  // 8. Thống kê theo ngày (hỗ trợ lưu theo từng tài khoản)
  public static getDailyStats(userId?: string): DailyStatisticRecord[] {
    const session = this.getCurrentSession();
    const activeId = userId || session?.userId;

    if (!activeId || activeId === DEMO_ACCOUNT.id || activeId === INITIAL_USER.id) {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.DAILY_STATS);
        if (data) return JSON.parse(data);
      } catch {}
      this.saveDailyStats(SEED_DAILY_STATS);
      return SEED_DAILY_STATS;
    }

    try {
      const data = localStorage.getItem(`${STORAGE_KEYS.DAILY_STATS}_${activeId}`);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  }

  public static saveDailyStats(stats: DailyStatisticRecord[], userId?: string): void {
    const session = this.getCurrentSession();
    const activeId = userId || session?.userId;

    try {
      if (!activeId || activeId === DEMO_ACCOUNT.id || activeId === INITIAL_USER.id) {
        localStorage.setItem(STORAGE_KEYS.DAILY_STATS, JSON.stringify(stats));
      } else {
        localStorage.setItem(`${STORAGE_KEYS.DAILY_STATS}_${activeId}`, JSON.stringify(stats));
      }
    } catch {}
  }

  public static recordActivityToToday(params: {
    durationSeconds: number;
    score: number;
    skill: 'Speaking' | 'Listening' | 'Reading' | 'Grammar' | 'Vocabulary';
    isSpeaking?: boolean;
    isListening?: boolean;
    correct?: number;
    incorrect?: number;
  }): void {
    const stats = this.getDailyStats();
    const todayStr = new Date().toISOString().split('T')[0];

    let todayStat = stats.find((s) => s.date === todayStr);
    const minutes = Math.max(1, Math.round(params.durationSeconds / 60));

    if (!todayStat) {
      todayStat = {
        date: todayStr,
        dayLabel: 'Hôm nay',
        totalMinutes: minutes,
        completedLessons: 1,
        averageScore: params.score,
        speakingScore: params.skill === 'Speaking' ? params.score : 0,
        listeningScore: params.skill === 'Listening' ? params.score : 0,
        readingScore: params.skill === 'Reading' ? params.score : 0,
        grammarScore: params.skill === 'Grammar' ? params.score : 0,
        vocabularyScore: params.skill === 'Vocabulary' ? params.score : 0,
        correctAnswers: params.correct || 3,
        incorrectAnswers: params.incorrect || 0,
        speakingSessionsCount: params.isSpeaking ? 1 : 0,
        listeningLessonsCount: params.isListening ? 1 : 0,
      };
      stats.push(todayStat);
    } else {
      todayStat.totalMinutes += minutes;
      todayStat.completedLessons += 1;
      todayStat.averageScore = Math.round((todayStat.averageScore + params.score) / 2);

      if (params.skill === 'Speaking') {
        todayStat.speakingScore = todayStat.speakingScore ? Math.round((todayStat.speakingScore + params.score) / 2) : params.score;
      }
      if (params.skill === 'Listening') {
        todayStat.listeningScore = todayStat.listeningScore ? Math.round((todayStat.listeningScore + params.score) / 2) : params.score;
      }
      if (params.skill === 'Reading') {
        todayStat.readingScore = todayStat.readingScore ? Math.round((todayStat.readingScore + params.score) / 2) : params.score;
      }
      if (params.skill === 'Grammar') {
        todayStat.grammarScore = todayStat.grammarScore ? Math.round((todayStat.grammarScore + params.score) / 2) : params.score;
      }
      if (params.skill === 'Vocabulary') {
        todayStat.vocabularyScore = todayStat.vocabularyScore ? Math.round((todayStat.vocabularyScore + params.score) / 2) : params.score;
      }

      if (params.isSpeaking) todayStat.speakingSessionsCount += 1;
      if (params.isListening) todayStat.listeningLessonsCount += 1;
      if (params.correct) todayStat.correctAnswers += params.correct;
      if (params.incorrect) todayStat.incorrectAnswers += params.incorrect;
    }

    this.saveDailyStats([...stats]);

    // Cập nhật XP người dùng
    const user = this.getUser();
    if (user) {
      user.totalXp += Math.round(params.score / 2) + 20;
      this.saveUser(user);
    }
  }

  // 9. Quản lý danh sách bài tập
  public static getExercises(): ExerciseItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXERCISES);
      if (data) return JSON.parse(data);
    } catch {}
    this.saveExercises(SEED_EXERCISES);
    return SEED_EXERCISES;
  }

  public static saveExercises(exercises: ExerciseItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(exercises));
    } catch {}
  }

  public static addExercise(exercise: ExerciseItem): void {
    const current = this.getExercises();
    this.saveExercises([exercise, ...current]);
  }

  // 10. Khôi phục dữ liệu Demo
  public static resetToDemo(): void {
    const accounts = this.getAccounts();
    const demoIndex = accounts.findIndex((a) => a.id === DEMO_ACCOUNT.id);
    if (demoIndex >= 0) {
      accounts[demoIndex] = DEMO_ACCOUNT;
    } else {
      accounts.push(DEMO_ACCOUNT);
    }
    this.saveAccounts(accounts);
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify({ userId: DEMO_ACCOUNT.id }));
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEMO_ACCOUNT));
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(SEED_LEARNING_HISTORY));
    localStorage.setItem(STORAGE_KEYS.DAILY_STATS, JSON.stringify(SEED_DAILY_STATS));
    localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(SEED_EXERCISES));
  }
}
