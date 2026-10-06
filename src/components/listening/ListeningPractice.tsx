import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';
import { TOPICS_LIST, SEED_EXERCISES } from '../../services/mockData';
import { ProficiencyLevel, ExerciseItem } from '../../types';
import { SpeechService } from '../../services/speechService';
import { useApp } from '../../context/AppContext';
import { SpotlightCard } from '../motion/SpotlightCard';
import confetti from 'canvas-confetti';

export const ListeningPractice: React.FC = () => {
  const { addHistoryRecord } = useApp();

  const defaultLesson = SEED_EXERCISES.find((e) => e.type === 'listening') || SEED_EXERCISES[0];
  const [currentLesson, setCurrentLesson] = useState<ExerciseItem>(defaultLesson);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Simulated audio playback progress (0% - 100%)
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);

  const [topicInput, setTopicInput] = useState<string>('Travel');
  const [levelInput, setLevelInput] = useState<ProficiencyLevel>('Intermediate');
  const [lengthInput, setLengthInput] = useState<string>('Trung bình (1-2 phút)');

  useEffect(() => {
    return () => {
      SpeechService.cancelSpeaking();
    };
  }, []);

  // Update playback progress simulation when playing
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setPlaybackProgress((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 2 * audioSpeed;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isPlaying, audioSpeed]);

  const handlePlayAudio = () => {
    if (isPlaying) {
      SpeechService.pauseSpeaking();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const textToSpeak = currentLesson.transcript || currentLesson.passage || '';
      SpeechService.speak(textToSpeak, {
        rate: audioSpeed,
        onEnd: () => {
          setIsPlaying(false);
          setPlaybackProgress(100);
        },
      });
    }
  };

  const handleReplay = () => {
    SpeechService.cancelSpeaking();
    setIsPlaying(true);
    setPlaybackProgress(0);
    const textToSpeak = currentLesson.transcript || currentLesson.passage || '';
    SpeechService.speak(textToSpeak, {
      rate: audioSpeed,
      onEnd: () => {
        setIsPlaying(false);
        setPlaybackProgress(100);
      },
    });
  };

  const handleSpeedChange = (speed: number) => {
    setAudioSpeed(speed);
    if (isPlaying) {
      handleReplay();
    }
  };

  const handleAnswerSelect = (qIndex: number, option: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmitQuiz = () => {
    setSubmitted(true);
    SpeechService.cancelSpeaking();
    setIsPlaying(false);

    let correctCount = 0;
    currentLesson.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / currentLesson.questions.length) * 100);

    addHistoryRecord({
      activityType: 'Listening',
      topicId: currentLesson.topicId,
      topicTitle: currentLesson.title,
      level: currentLesson.level,
      score,
      durationSeconds: 180,
      skillCategory: 'Listening',
      detailsSummary: `Hoàn thành bài luyện nghe với ${correctCount}/${currentLesson.questions.length} câu đúng.`,
      detailedQuestions: currentLesson.questions.map((q, idx) => ({
        questionId: q.id,
        questionText: q.questionText,
        studentAnswer: answers[idx] || '',
        correctAnswer: q.correctAnswer,
        isCorrect: answers[idx] === q.correctAnswer,
        explanation: q.explanation,
      })),
    });

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  const handleGenerateNewListening = () => {
    setIsGenerating(true);
    SpeechService.cancelSpeaking();
    setIsPlaying(false);
    setShowTranscript(false);
    setAnswers({});
    setSubmitted(false);
    setPlaybackProgress(0);

    setTimeout(() => {
      const newListeningItem: ExerciseItem = {
        id: `list-ai-${Date.now()}`,
        title: `AI Listening: ${topicInput} (${levelInput})`,
        topicId: topicInput.toLowerCase().replace(/\s+/g, '-'),
        topicTitle: topicInput,
        level: levelInput,
        type: 'listening',
        transcript: `Welcome to today's English listening practice focusing on ${topicInput}. When exploring ${topicInput}, it is essential to build clear comprehension of key terms and context clues. In modern communication, professionals and students actively exchange diverse viewpoints to resolve complex challenges efficiently. Throughout this listening track, listeners are encouraged to focus on word stress and natural phrase linking. Always remember that daily immersion in natural spoken English will consistently sharpen your auditory fluency and boost conversational confidence.`,
        questions: [
          {
            id: `q-gen-l1`,
            questionOrder: 1,
            questionText: `What is the primary objective of this listening lesson regarding ${topicInput}?`,
            type: 'multiple_choice',
            options: [
              `To enhance auditory comprehension and understand key context clues`,
              `To memorize written grammar rules without speaking`,
              `To practice silent reading with a dictionary`,
              `To take a formal written exam on historical dates`
            ],
            correctAnswer: `To enhance auditory comprehension and understand key context clues`,
            explanation: 'Đoạn audio nêu rõ mục tiêu là xây dựng khả năng nghe hiểu từ khóa và nắm bắt ngữ cảnh.',
          },
          {
            id: `q-gen-l2`,
            questionOrder: 2,
            questionText: `According to the speaker, what will sharpen your listening fluency and speech confidence?`,
            type: 'multiple_choice',
            options: [
              `Daily immersion in natural spoken English`,
              `Studying only once every couple of months`,
              `Avoiding difficult vocabulary and native audios`,
              `Translating every word literally into Vietnamese`
            ],
            correctAnswer: `Daily immersion in natural spoken English`,
            explanation: 'Câu cuối đoạn: "daily immersion in natural spoken English will consistently sharpen your auditory fluency..."',
          },
          {
            id: `q-gen-l3`,
            questionOrder: 3,
            questionText: `True or False: The speaker suggests that students and professionals exchange viewpoints to resolve challenges.`,
            type: 'true_false',
            options: ['True', 'False'],
            correctAnswer: 'True',
            explanation: 'Bài nghe nêu rõ: "professionals and students actively exchange diverse viewpoints to resolve complex challenges efficiently."',
          },
          {
            id: `q-gen-l4`,
            questionOrder: 4,
            questionText: `What specific pronunciation aspect are listeners encouraged to focus on?`,
            type: 'multiple_choice',
            options: [
              `Word stress and natural phrase linking`,
              `Speaking as fast as humanly possible`,
              `Ignoring sentence rhythm completely`,
              `Memorizing phonetic transcription symbols only`
            ],
            correctAnswer: `Word stress and natural phrase linking`,
            explanation: 'Người nói dặn: "listeners are encouraged to focus on word stress and natural phrase linking."',
          },
          {
            id: `q-gen-l5`,
            questionOrder: 5,
            questionText: `True or False: According to the audio, listening practice is only helpful for beginners.`,
            type: 'true_false',
            options: ['True', 'False'],
            correctAnswer: 'False',
            explanation: 'Bài nghe nhấn mạnh việc luyện nghe immersion hàng ngày giúp ích cho tất cả người học để phát triển sự tự tin và trôi chảy.',
          },
          {
            id: `q-gen-l6`,
            questionOrder: 6,
            questionText: `What is the overall tone of the speaker?`,
            type: 'multiple_choice',
            options: [
              `Encouraging and instructive`,
              `Pessimistic and discourteous`,
              `Strict and punitive`,
              `Indifferent and bored`
            ],
            correctAnswer: `Encouraging and instructive`,
            explanation: 'Giọng điệu bài nghe mang tính khích lệ, hướng dẫn tích cực cho người học tiếng Anh.',
          },
        ],
        isAiGenerated: true,
      };

      setCurrentLesson(newListeningItem);
      setIsGenerating(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & AI Creator Form */}
      <SpotlightCard className="p-6 lg:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Headphones className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl lg:text-2xl font-black text-white">
                Luyện Nghe Tiếng Anh Chủ Động (Interactive Listening)
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Audio phát âm bản xứ, tốc độ tùy chỉnh 0.75x - 1.25x, ban đầu ẩn transcript để kiểm tra khả năng bắt từ khóa.
            </p>
          </div>

          <span className="text-xs font-bold text-cyan-300 bg-cyan-500/15 border border-cyan-500/25 px-3 py-1.5 rounded-full">
            Trình độ: {currentLesson.level}
          </span>
        </div>

        {/* AI Creator Form */}
        <div className="bg-[#0b0e17] p-4 rounded-2xl border border-white/[0.08] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI Tạo Bài Nghe Tùy Chọn:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Chủ đề:</label>
              <select
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                className="w-full p-2 bg-[#121726] border border-white/[0.08] rounded-xl font-medium text-white focus:outline-none"
              >
                {TOPICS_LIST.map((t) => (
                  <option key={t.id} value={t.title}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Trình độ:</label>
              <select
                value={levelInput}
                onChange={(e) => setLevelInput(e.target.value as ProficiencyLevel)}
                className="w-full p-2 bg-[#121726] border border-white/[0.08] rounded-xl font-medium text-white focus:outline-none"
              >
                <option value="Beginner">Beginner (Cơ bản)</option>
                <option value="Intermediate">Intermediate (Trung cấp)</option>
                <option value="Advanced">Advanced (Nâng cao)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Độ dài:</label>
              <select
                value={lengthInput}
                onChange={(e) => setLengthInput(e.target.value)}
                className="w-full p-2 bg-[#121726] border border-white/[0.08] rounded-xl font-medium text-white focus:outline-none"
              >
                <option value="Ngắn (30-60 giây)">Ngắn (30-60 giây)</option>
                <option value="Trung bình (1-2 phút)">Trung bình (1-2 phút)</option>
                <option value="Dài (3 phút)">Dài (3 phút)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                disabled={isGenerating}
                onClick={handleGenerateNewListening}
                className="w-full p-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-glow-cyan transition-all flex items-center justify-center gap-1.5"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang tạo...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Tạo bài nghe với AI</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </SpotlightCard>

      {/* Audio Player Card (Section 26) */}
      <SpotlightCard className="p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
              Audio Player
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
              {currentLesson.title}
            </h3>
          </div>

          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              showTranscript
                ? 'bg-amber-500/20 border border-amber-500/30 text-amber-300'
                : 'bg-white/[0.06] hover:bg-white/[0.12] text-slate-300'
            }`}
          >
            {showTranscript ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showTranscript ? 'Ẩn Transcript' : 'Xem Transcript'}</span>
          </button>
        </div>

        {/* Cinematic Audio Controller Box */}
        <div className="p-5 bg-[#090c14] border border-white/[0.08] rounded-2xl space-y-4 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Morphing Play/Pause button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlayAudio}
                className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white flex items-center justify-center shadow-glow-cyan"
                title={isPlaying ? 'Tạm dừng' : 'Phát audio'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
              </motion.button>

              <button
                onClick={handleReplay}
                className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white transition-colors"
                title="Nghe lại từ đầu"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div>
                <p className="text-xs font-bold text-white">Audio Luyện Nghe Chuẩn</p>
                <p className="text-[10px] text-cyan-300">
                  {isPlaying ? 'Đang phát âm thanh bản xứ...' : 'Nhấn nút Play để nghe'}
                </p>
              </div>
            </div>

            {/* Speed Pills: 0.75x, 1x, 1.25x */}
            <div className="flex items-center gap-1.5 bg-white/[0.04] p-1 rounded-xl border border-white/[0.06]">
              <span className="text-[10px] font-semibold text-slate-400 px-2">Tốc độ:</span>
              {[0.75, 1.0, 1.25].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleSpeedChange(rate)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    audioSpeed === rate
                      ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>

          {/* Animated Progress Timeline Bar (Section 26) */}
          <div className="space-y-1.5 pt-1">
            <div className="w-full bg-white/[0.08] h-2 rounded-full overflow-hidden cursor-pointer">
              <div
                className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-200"
                style={{ width: `${playbackProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>{Math.floor((playbackProgress * 1.2) / 60)}:{('0' + Math.floor((playbackProgress * 1.2) % 60)).slice(-2)}</span>
              <span>02:00</span>
            </div>
          </div>
        </div>

        {/* Transcript Box */}
        <AnimatePresence>
          {showTranscript && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-5 bg-amber-500/10 border border-amber-500/25 rounded-2xl space-y-2 overflow-hidden"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Eye className="w-4 h-4" />
                <span>Audio Transcript:</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-100 leading-relaxed font-serif whitespace-pre-line">
                {currentLesson.transcript || currentLesson.passage}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comprehension Questions */}
        <div className="space-y-6 pt-4 border-t border-white/[0.06]">
          <h4 className="font-extrabold text-sm text-white">
            Câu Hỏi Nghe Hiểu ({currentLesson.questions.length} câu)
          </h4>

          <div className="space-y-4">
            {currentLesson.questions.map((q, idx) => {
              const selectedAns = answers[idx];
              const isCorrect = submitted && selectedAns === q.correctAnswer;
              const isWrong = submitted && selectedAns !== q.correctAnswer;

              return (
                <div key={q.id} className="p-4 bg-[#0b0e17] border border-white/[0.08] rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                    <span>Câu {idx + 1}:</span>
                  </div>
                  <p className="font-bold text-xs sm:text-sm text-white">{q.questionText}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {(q.options || ['True', 'False']).map((opt, optIdx) => {
                      const isOptionSelected = selectedAns === opt;
                      let btnStyle = 'bg-[#121726] border-white/[0.08] text-slate-300 hover:border-white/[0.18]';

                      if (isOptionSelected && !submitted) {
                        btnStyle = 'bg-cyan-500/20 border-cyan-500 text-white font-bold ring-1 ring-cyan-500/50';
                      } else if (submitted && opt === q.correctAnswer) {
                        btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold';
                      } else if (submitted && isOptionSelected && opt !== q.correctAnswer) {
                        btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-200 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={submitted}
                          onClick={() => handleAnswerSelect(idx, opt)}
                          className={`p-3 rounded-xl border text-left text-xs transition-all ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {submitted && (
                    <div className="mt-2.5 p-3 bg-[#121726] rounded-xl border border-white/[0.06] text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        {isCorrect ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Chính xác
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Đáp án: {q.correctAnswer}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 leading-relaxed font-medium">
                        💡 <strong>Giải thích:</strong> {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!submitted ? (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(answers).length < currentLesson.questions.length}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-white font-extrabold text-xs rounded-xl shadow-glow-cyan transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Nộp bài & Chấm điểm nghe</span>
              </button>
            </div>
          ) : (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-center justify-between text-xs text-emerald-300 font-bold">
              <span>Đã hoàn thành và lưu điểm vào hồ sơ của bạn!</span>
              <button
                onClick={() => {
                  setAnswers({});
                  setSubmitted(false);
                  setShowTranscript(false);
                  setPlaybackProgress(0);
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-colors"
              >
                Làm lại bài nghe này
              </button>
            </div>
          )}
        </div>
      </SpotlightCard>
    </div>
  );
};
