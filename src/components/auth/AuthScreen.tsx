import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Mic,
  BookOpenCheck,
  Award,
  Lock,
  Mail,
  User,
  GraduationCap,
  Target,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Zap,
  PlayCircle,
  Flame,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProficiencyLevel } from '../../types';

export const AuthScreen: React.FC = () => {
  const { register, login, loginAsDemo } = useApp();

  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Register Form State
  const [regFullName, setRegFullName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');
  const [regGradeLevel, setRegGradeLevel] = useState<string>('Lớp 9');
  const [regProficiency, setRegProficiency] = useState<ProficiencyLevel>('Intermediate');
  const [regDailyGoal, setRegDailyGoal] = useState<number>(30);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  const gradeOptions = [
    'Lớp 6',
    'Lớp 7',
    'Lớp 8',
    'Lớp 9',
    'Lớp 10',
    'Lớp 11',
    'Lớp 12',
    'Đại học / Đi làm',
  ];

  const proficiencyLevels: {
    level: ProficiencyLevel;
    label: string;
    sub: string;
    color: string;
    border: string;
    bg: string;
  }[] = [
    {
      level: 'Beginner',
      label: 'Beginner (A1-A2)',
      sub: 'Mới bắt đầu, từ vựng cơ bản',
      color: 'text-emerald-400',
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-500/10',
    },
    {
      level: 'Intermediate',
      label: 'Intermediate (B1-B2)',
      sub: 'Giao tiếp khá, cần tăng phản xạ',
      color: 'text-indigo-400',
      border: 'border-indigo-500/40',
      bg: 'bg-indigo-500/10',
    },
    {
      level: 'Advanced',
      label: 'Advanced (C1)',
      sub: 'Thành thạo, ngữ pháp chuyên sâu',
      color: 'text-purple-400',
      border: 'border-purple-500/40',
      bg: 'bg-purple-500/10',
    },
  ];

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regFullName.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên của bạn.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setErrorMsg('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg('Mật khẩu phải có tối thiểu 6 ký tự.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Vui lòng đồng ý với cam kết học tập để tiếp tục.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = register({
        fullName: regFullName,
        email: regEmail,
        password: regPassword,
        gradeLevel: regGradeLevel,
        proficiencyLevel: regProficiency,
        dailyGoalMinutes: regDailyGoal,
      });

      setIsLoading(false);
      if (!result.success) {
        setErrorMsg(result.message);
      }
    }, 400);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginEmail.trim()) {
      setErrorMsg('Vui lòng nhập email hoặc tên tài khoản.');
      return;
    }
    if (!loginPassword) {
      setErrorMsg('Vui lòng nhập mật khẩu.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = login({
        email: loginEmail,
        password: loginPassword,
      });

      setIsLoading(false);
      if (!result.success) {
        setErrorMsg(result.message);
      }
    }, 400);
  };

  const handleDemoClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      loginAsDemo();
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-10 relative z-20">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* LEFT COLUMN: Feature Showcase & Value Proposition */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 flex flex-col justify-center space-y-6 text-left"
        >
          {/* Logo & Brand Badge */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-glow-indigo">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white">EduSpeak</span>
                <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  PRO AI
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Nền tảng luyện tiếng Anh thông minh</p>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Tạo tài khoản để bắt đầu hành trình{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                bứt phá tiếng Anh
              </span>
            </h1>
            <p className="mt-3 text-slate-300 text-sm leading-relaxed">
              Trải nghiệm học tương tác thời gian thực với AI: luyện nói phản xạ, sửa phát âm chi tiết, làm 10 dạng bài tập và xây dựng chuỗi ngày học liên tục.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Luyện Nói Với AI & Role-play</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  17 chủ đề thực tế, chấm 5 tiêu chí: Phát âm, Ngữ pháp, Từ vựng, Độ trôi chảy, Độ liên quan.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                <BookOpenCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">10 Dạng Bài Tập & Sinh Đề AI</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Trắc nghiệm, Nghe Audio 3 tốc độ, Cloze test, Đọc hiểu văn bản và tự động tạo đề theo nhu cầu.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors">
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                <Flame className="w-5 h-5 fill-orange-500" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Theo Dõi Tiến Độ & Chuỗi Streak</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Tích lũy XP, duy trì ngọn lửa streak hàng ngày và xem biểu đồ 5 kỹ năng Recharts trực quan.
                </p>
              </div>
            </div>
          </div>

          {/* Social Proof Badge */}
          <div className="pt-2 flex items-center gap-3">
            <div className="flex -space-x-2 overflow-hidden">
              <img
                className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0c101d]"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                alt="Student 1"
              />
              <img
                className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0c101d]"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                alt="Student 2"
              />
              <img
                className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0c101d]"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                alt="Student 3"
              />
            </div>
            <div className="text-xs">
              <div className="flex items-center text-amber-400 text-xs">
                {'★'.repeat(5)}
                <span className="ml-1 font-bold text-white">4.9/5</span>
              </div>
              <p className="text-[11px] text-slate-400">12,000+ học sinh đang rèn luyện mỗi ngày</p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Modern Auth Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-7"
        >
          <div className="bg-[#0b0f19]/90 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Tab Switcher: Đăng ký vs Đăng nhập */}
            <div className="relative z-10 flex bg-[#121727] p-1.5 rounded-2xl border border-white/[0.06] mb-6">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === 'register'
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>Tạo tài khoản mới</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  activeTab === 'login'
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Đăng nhập</span>
              </button>
            </div>

            {/* Error Message Alert */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* TAB 1: FORM TẠO TÀI KHOẢN MỚI */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Họ và tên */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Họ và tên học sinh <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="Ví dụ: Nguyễn Minh Quân"
                        className="w-full bg-[#121829] border border-white/[0.08] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm placeholder:text-slate-600 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Địa chỉ Email <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="hocsinh@truong.edu.vn"
                        className="w-full bg-[#121829] border border-white/[0.08] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm placeholder:text-slate-600 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Mật khẩu */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Mật khẩu (ít nhất 6 ký tự) <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#121829] border border-white/[0.08] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm placeholder:text-slate-600 transition-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Xác nhận mật khẩu */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Xác nhận lại mật khẩu <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#121829] border border-white/[0.08] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm placeholder:text-slate-600 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Khối lớp */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Khối lớp / Trình độ học
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <select
                        value={regGradeLevel}
                        onChange={(e) => setRegGradeLevel(e.target.value)}
                        className="w-full bg-[#121829] border border-white/[0.08] focus:border-indigo-500 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm outline-none transition-all cursor-pointer"
                      >
                        {gradeOptions.map((g) => (
                          <option key={g} value={g} className="bg-[#121829] text-white">
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Mục tiêu học mỗi ngày */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Mục tiêu học mỗi ngày
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Target className="w-4 h-4" />
                      </div>
                      <select
                        value={regDailyGoal}
                        onChange={(e) => setRegDailyGoal(Number(e.target.value))}
                        className="w-full bg-[#121829] border border-white/[0.08] focus:border-indigo-500 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm outline-none transition-all cursor-pointer"
                      >
                        <option value={15} className="bg-[#121829] text-white">15 phút / ngày (Nhẹ nhàng)</option>
                        <option value={30} className="bg-[#121829] text-white">30 phút / ngày (Tiêu chuẩn)</option>
                        <option value={45} className="bg-[#121829] text-white">45 phút / ngày (Nỗ lực)</option>
                        <option value={60} className="bg-[#121829] text-white">60 phút / ngày (Chuyên sâu)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Chọn trình độ tiếng Anh khởi đầu */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Trình độ tiếng Anh hiện tại của bạn
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {proficiencyLevels.map((item) => (
                      <button
                        key={item.level}
                        type="button"
                        onClick={() => setRegProficiency(item.level)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          regProficiency === item.level
                            ? `${item.bg} ${item.border} ring-1 ring-indigo-500/50`
                            : 'bg-[#121829]/50 border-white/[0.06] hover:bg-white/[0.03]'
                        }`}
                      >
                        <p className={`text-xs font-bold ${regProficiency === item.level ? item.color : 'text-slate-200'}`}>
                          {item.label}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{item.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cam kết học tập */}
                <div className="flex items-center gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 bg-[#121829]"
                  />
                  <label htmlFor="agreeTerms" className="text-xs text-slate-300 cursor-pointer">
                    Tôi cam kết luyện tập đều đặn và duy trì chuỗi học Streak mỗi ngày 🔥
                  </label>
                </div>

                {/* Submit Register Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 group mt-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Tạo tài khoản & Bắt đầu học ngay</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Quick Hint */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2">
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Tặng +100 XP khi kích hoạt tài khoản
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4"
                  >
                    Đã có tài khoản? Đăng nhập
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: FORM ĐĂNG NHẬP */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 relative z-10">
                {/* Email / Username */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email hoặc Tên tài khoản <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="Email đã đăng ký (hoặc minhquan.english@school.edu.vn)"
                      className="w-full bg-[#121829] border border-white/[0.08] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white rounded-xl pl-10 pr-3.5 py-3 text-xs sm:text-sm placeholder:text-slate-600 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Mật khẩu */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Mật khẩu <span className="text-rose-400">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#121829] border border-white/[0.08] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm placeholder:text-slate-600 transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-[#121829]"
                    />
                    <label htmlFor="rememberMe" className="text-xs text-slate-400 cursor-pointer">
                      Ghi nhớ phiên đăng nhập này
                    </label>
                  </div>
                </div>

                {/* Submit Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 group mt-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Đăng nhập vào hệ thống</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/[0.08]" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase">
                    <span className="bg-[#0b0f19] px-3 text-slate-500 font-bold tracking-wider">
                      Hoặc trải nghiệm nhanh
                    </span>
                  </div>
                </div>

                {/* Quick 1-Click Demo Login */}
                <button
                  type="button"
                  onClick={handleDemoClick}
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/25 hover:bg-indigo-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <PlayCircle className="w-4 h-4 text-indigo-400" />
                  <span>⚡ Đăng nhập nhanh tài khoản mẫu (Demo: Nguyễn Minh Quân - Lớp 9A)</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Chưa có tài khoản?{' '}
                    <span className="text-indigo-400 font-bold underline underline-offset-4">
                      Tạo tài khoản mới ngay
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
