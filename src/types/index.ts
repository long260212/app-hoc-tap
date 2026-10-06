export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  gradeLevel: string;
  proficiencyLevel: ProficiencyLevel;
  dailyGoalMinutes: number;
  dailyGoalScore: number;
  currentStreak: number;
  longestStreak: number;
  totalXp: number;
  avatarUrl?: string;
  apiKey?: string;
  useMockAI: boolean;
  createdAt?: string;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  gradeLevel: string;
  proficiencyLevel: ProficiencyLevel;
  dailyGoalMinutes: number;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface TopicItem {
  id: string;
  title: string;
  titleVi: string;
  description: string;
  icon: string;
  category: 'Daily Life' | 'School & Work' | 'Travel & Social' | 'Global & Tech';
  recommendedLevel: ProficiencyLevel;
}

export interface SpeakingFeedback {
  pronunciationScore: number;
  grammarScore: number;
  vocabularyScore: number;
  fluencyScore: number;
  relevanceScore: number;
  overallScore: number;
  studentSentence: string;
  errors: string[];
  correctedSentence: string;
  betterExpression: string;
  recommendedVocab: string[];
  pronunciationTips: string;
}

export interface SpeakingMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  feedback?: SpeakingFeedback;
}

export interface RolePlayScenario {
  id: string;
  title: string;
  titleVi: string;
  aiRole: string;
  userRole: string;
  context: string;
  initialMessage: string;
  suggestedPhrases: string[];
  icon: string;
}

export type ExerciseType =
  | 'multiple_choice'
  | 'true_false'
  | 'fill_in_the_blank'
  | 'matching'
  | 'sentence_reorder'
  | 'vocabulary'
  | 'grammar'
  | 'reading'
  | 'listening'
  | 'speaking';

export interface MatchingPair {
  left: string;
  right: string;
}

export interface QuestionItem {
  id: string;
  questionOrder: number;
  questionText: string;
  type: ExerciseType;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  hint?: string;
  evidenceQuote?: string;
  wordBank?: string[];
  matchingPairs?: MatchingPair[];
  scrambledWords?: string[];
}

export interface ExerciseItem {
  id: string;
  title: string;
  topicId: string;
  topicTitle: string;
  level: ProficiencyLevel;
  type: ExerciseType;
  passage?: string;
  audioUrl?: string;
  audioDuration?: number;
  transcript?: string;
  questions: QuestionItem[];
  isAiGenerated?: boolean;
}

export interface DetailedAnswerRecord {
  questionId: string;
  questionText: string;
  studentAnswer: string | string[];
  correctAnswer: string | string[];
  isCorrect: boolean;
  explanation: string;
}

export interface ExerciseResult {
  id: string;
  exerciseId: string;
  title: string;
  topicId: string;
  topicTitle: string;
  exerciseType: ExerciseType;
  level: ProficiencyLevel;
  score: number;
  correctCount: number;
  incorrectCount: number;
  totalQuestions: number;
  durationSeconds: number;
  detailedAnswers: DetailedAnswerRecord[];
  createdAt: string;
}

export interface LearningHistoryRecord {
  id: string;
  activityType: 'Speaking' | 'RolePlay' | 'Exercise' | 'Listening' | 'Reading' | 'FillBlank';
  topicId: string;
  topicTitle: string;
  level: ProficiencyLevel;
  score: number;
  durationSeconds: number;
  skillCategory: 'Speaking' | 'Listening' | 'Reading' | 'Grammar' | 'Vocabulary';
  detailsSummary: string;
  createdAt: string;
  detailedQuestions?: DetailedAnswerRecord[];
  speakingFeedback?: SpeakingFeedback[];
}

export interface DailyStatisticRecord {
  date: string; // YYYY-MM-DD
  dayLabel: string; // Mon, Tue, etc.
  totalMinutes: number;
  completedLessons: number;
  averageScore: number;
  speakingScore: number;
  listeningScore: number;
  readingScore: number;
  grammarScore: number;
  vocabularyScore: number;
  correctAnswers: number;
  incorrectAnswers: number;
  speakingSessionsCount: number;
  listeningLessonsCount: number;
}

export interface AICoachRecommendation {
  id: string;
  title: string;
  description: string;
  skill: 'Speaking' | 'Listening' | 'Reading' | 'Grammar' | 'Vocabulary';
  priority: 'High' | 'Medium' | 'Low';
  actionType: 'speaking' | 'roleplay' | 'exercise' | 'listening' | 'reading' | 'fillblanks';
  topicId: string;
  reason: string;
}

export interface AICoachAnalysis {
  overallAssessment: string;
  speakingFeedback: string;
  grammarFeedback: string;
  listeningFeedback: string;
  strengths: string[];
  areasToImprove: string[];
  recommendations: AICoachRecommendation[];
}
