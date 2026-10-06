import React, { useState, useRef, useMemo } from 'react';
import {
  BookMarked,
  Sparkles,
  CheckCircle2,
  XCircle,
  Type,
  Loader2,
  ArrowDown,
  ArrowUp,
  RotateCcw,
  Clock,
  HelpCircle,
  FileText,
  Award,
  PenTool,
  ExternalLink,
  Eye,
  EyeOff,
  Search,
  Globe,
  Leaf,
  Brain,
  Compass,
  Briefcase,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { TOPICS_LIST, SEED_EXERCISES } from '../../services/mockData';
import { ExerciseItem, ProficiencyLevel, QuestionItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { SpotlightCard } from '../motion/SpotlightCard';
import confetti from 'canvas-confetti';

export interface ReadingTopicItem {
  id: string;
  category: 'tech' | 'environment' | 'health' | 'culture' | 'career';
  categoryLabel: string;
  title: string;
  titleVi: string;
  description: string;
  level: ProficiencyLevel;
  icon: any;
  seedExerciseId?: string;
}

export const READING_TOPICS_CATALOG: ReadingTopicItem[] = [
  // 1. Công nghệ & AI
  {
    id: 'ai-education',
    category: 'tech',
    categoryLabel: 'Công nghệ & AI',
    title: 'The Rise of Artificial Intelligence in Education',
    titleVi: 'AI trong giáo dục & Học tập cá nhân hóa',
    description: 'Cách trí tuệ nhân tạo hỗ trợ học ngôn ngữ, phản hồi phát âm tức thì và thích ứng tốc độ học sinh.',
    level: 'Advanced',
    icon: Sparkles,
    seedExerciseId: 'ex-reading-1',
  },
  {
    id: 'smart-cities',
    category: 'tech',
    categoryLabel: 'Công nghệ & AI',
    title: 'Autonomous Vehicles and the Rise of Smart Cities',
    titleVi: 'Xe tự hành & Đô thị thông minh tương lai',
    description: 'Tác động của giao thông tự động hóa và cảm biến IoT đến giảm thiểu ùn tắc và ô nhiễm đô thị.',
    level: 'Intermediate',
    icon: Globe,
  },
  {
    id: 'cybersecurity',
    category: 'tech',
    categoryLabel: 'Công nghệ & AI',
    title: 'Cybersecurity and Digital Privacy in the Modern Age',
    titleVi: 'An ninh mạng & Bảo vệ quyền riêng tư số',
    description: 'Các nguy cơ bảo mật số, quyền bảo vệ dữ liệu cá nhân và kỹ năng tự vệ trên không gian mạng.',
    level: 'Advanced',
    icon: Sparkles,
  },
  {
    id: 'space-exploration',
    category: 'tech',
    categoryLabel: 'Công nghệ & AI',
    title: 'Deep Space Exploration and the Artemis Moon Missions',
    titleVi: 'Thám hiểm vũ trụ sâu & Sứ mệnh Mặt Trăng',
    description: 'Hành trình chinh phục không gian mới của nhân loại, trạm vũ trụ quốc tế và tiềm năng trên Sao Hỏa.',
    level: 'Advanced',
    icon: Compass,
  },

  // 2. Môi trường & Trái Đất
  {
    id: 'coral-reefs',
    category: 'environment',
    categoryLabel: 'Môi trường & Trái Đất',
    title: 'Safeguarding Coral Reefs from Ocean Warming',
    titleVi: 'Bảo vệ rạn san hô trước nhiệt độ đại dương tăng',
    description: 'Hệ sinh thái biển quý giá, hiện tượng tẩy trắng san hô và công nghệ in 3D phục hồi đáy biển.',
    level: 'Advanced',
    icon: Leaf,
    seedExerciseId: 'ex-reading-3',
  },
  {
    id: 'renewable-energy',
    category: 'environment',
    categoryLabel: 'Môi trường & Trái Đất',
    title: 'The Global Revolution of Renewable Energy',
    titleVi: 'Cuộc cách mạng năng lượng gió & mặt trời',
    description: 'Chuyển đổi từ nhiên liệu hóa thạch sang điện gió, pin mặt trời và tương lai trung hòa carbon.',
    level: 'Intermediate',
    icon: Leaf,
  },
  {
    id: 'amazon-rainforest',
    category: 'environment',
    categoryLabel: 'Môi trường & Trái Đất',
    title: 'The Amazon Rainforest and Planetary Biosphere',
    titleVi: 'Rừng Amazon & Lá phổi xanh Trái Đất',
    description: 'Đa dạng sinh học phong phú, vai trò hấp thụ carbon toàn cầu và nỗ lực ngăn chặn nạn phá rừng.',
    level: 'Intermediate',
    icon: Leaf,
  },
  {
    id: 'plastic-pollution',
    category: 'environment',
    categoryLabel: 'Môi trường & Trái Đất',
    title: 'Combating Single-Use Plastic in Marine Ecosystems',
    titleVi: 'Chiến dịch giảm thiểu rác thải nhựa đại dương',
    description: 'Tác hại của hạt vi nhựa đối với sinh vật biển và các giải pháp bao bì sinh học phân hủy.',
    level: 'Beginner',
    icon: Leaf,
  },

  // 3. Sức khỏe & Não bộ
  {
    id: 'daily-reading',
    category: 'health',
    categoryLabel: 'Sức khỏe & Não bộ',
    title: 'The Hidden Power of Daily Reading Habits',
    titleVi: 'Sức mạnh kỳ diệu của thói quen đọc sách mỗi ngày',
    description: 'Khoa học về liên kết vỏ não thùy thái dương, mở rộng vốn từ tự nhiên và nuôi dưỡng lòng trắc ẩn.',
    level: 'Intermediate',
    icon: Brain,
    seedExerciseId: 'ex-reading-2',
  },
  {
    id: 'sleep-science',
    category: 'health',
    categoryLabel: 'Sức khỏe & Não bộ',
    title: 'The Science of Sleep and Academic Success',
    titleVi: 'Khoa học giấc ngủ & Trí nhớ học đường',
    description: 'Cơ chế lưu trữ ký ức từ hippocampus sang neocortex và lợi ích của 7-9 tiếng ngủ mỗi đêm.',
    level: 'Intermediate',
    icon: Brain,
    seedExerciseId: 'ex-reading-4',
  },
  {
    id: 'mindfulness-stress',
    category: 'health',
    categoryLabel: 'Sức khỏe & Não bộ',
    title: 'Mindfulness Meditation and Stress Reduction for Students',
    titleVi: 'Thiền chánh niệm & Kiểm soát căng thẳng',
    description: 'Cách rèn luyện sự tĩnh tâm, hạ mức hormone cortisol và nâng cao khả năng tập trung học tập.',
    level: 'Beginner',
    icon: Brain,
  },
  {
    id: 'nutrition-brain',
    category: 'health',
    categoryLabel: 'Sức khỏe & Não bộ',
    title: 'Nutritional Neuroscience and Cognitive Vitality',
    titleVi: 'Dinh dưỡng não bộ & Năng lượng học tập',
    description: 'Chất chống oxy hóa, omega-3 và mối liên hệ giữa hệ vi sinh đường ruột và tâm trạng minh mẫn.',
    level: 'Intermediate',
    icon: Brain,
  },

  // 4. Văn hóa, Du lịch & Xã hội
  {
    id: 'vietnam-heritage',
    category: 'culture',
    categoryLabel: 'Văn hóa & Xã hội',
    title: 'Preserving Cultural Heritage in Modern Vietnam',
    titleVi: 'Bảo tồn di sản văn hóa Việt Nam hiện đại',
    description: 'Múa rối nước, phố cổ Hội An và cách các nghệ nhân trẻ kết hợp thiết kế xanh và tiếp thị số.',
    level: 'Intermediate',
    icon: Compass,
    seedExerciseId: 'ex-reading-5',
  },
  {
    id: 'eco-tourism',
    category: 'culture',
    categoryLabel: 'Văn hóa & Xã hội',
    title: 'Eco-Tourism and Sustainable Travel Around the Globe',
    titleVi: 'Du lịch sinh thái & Khám phá có trách nhiệm',
    description: 'Trải nghiệm du lịch tôn trọng thiên nhiên, bảo tồn bản sắc địa phương và kinh tế cộng đồng.',
    level: 'Intermediate',
    icon: Compass,
  },
  {
    id: 'street-food-culture',
    category: 'culture',
    categoryLabel: 'Văn hóa & Xã hội',
    title: 'The Cultural Identity of Global Street Food',
    titleVi: 'Bản sắc văn hóa ẩm thực đường phố thế giới',
    description: 'Từ phở, bánh mì Việt Nam đến tacos Mexico: Ẩm thực đường phố là cầu nối văn hóa nhân loại.',
    level: 'Beginner',
    icon: Compass,
  },
  {
    id: 'cross-cultural',
    category: 'culture',
    categoryLabel: 'Văn hóa & Xã hội',
    title: 'Cross-Cultural Communication in an Interconnected World',
    titleVi: 'Kỹ năng giao tiếp đa văn hóa trong kỷ nguyên toàn cầu',
    description: 'Vượt qua rào cản ngôn ngữ, hiểu ngôn ngữ cơ thể và tôn trọng các giá trị văn hóa khác biệt.',
    level: 'Advanced',
    icon: Compass,
  },

  // 5. Học tập, Nghề nghiệp & Tương lai
  {
    id: 'remote-work',
    category: 'career',
    categoryLabel: 'Học tập & Sự nghiệp',
    title: 'The Evolution of Remote Work and Global Teams',
    titleVi: 'Làm việc từ xa & Đội ngũ nhân tài toàn cầu',
    description: 'Ưu thế linh hoạt, cơ hội tuyển dụng xuyên lục địa và nguyên tắc chống kiệt sức khi làm từ xa.',
    level: 'Advanced',
    icon: Briefcase,
    seedExerciseId: 'ex-reading-6',
  },
  {
    id: 'habit-psychology',
    category: 'career',
    categoryLabel: 'Học tập & Sự nghiệp',
    title: 'The Psychology of Habit Formation and Daily Discipline',
    titleVi: 'Tâm lý học hình thành thói quen & Kỷ luật tự thân',
    description: 'Vòng lặp thói quen: Gợi ý (Cue), Hành động (Routine) và Phần thưởng (Reward) để xây dựng sự kiên trì.',
    level: 'Intermediate',
    icon: Briefcase,
  },
  {
    id: 'financial-literacy',
    category: 'career',
    categoryLabel: 'Học tập & Sự nghiệp',
    title: 'Financial Literacy and Smart Money Management for Youth',
    titleVi: 'Quản lý tài chính cá nhân thông minh cho giới trẻ',
    description: 'Kỹ năng lập ngân sách 50/30/20, tiết kiệm quỹ khẩn cấp và tư duy đầu tư dài hạn có kỷ luật.',
    level: 'Intermediate',
    icon: Briefcase,
  },
  {
    id: 'lifelong-learning',
    category: 'career',
    categoryLabel: 'Học tập & Sự nghiệp',
    title: 'Lifelong Learning in the Century of Artificial Intelligence',
    titleVi: 'Tinh thần học tập suốt đời trong kỷ nguyên AI',
    description: 'Tại sao khả năng tự học liên tục và tư duy phản biện là năng lực cạnh tranh tối quan trọng.',
    level: 'Advanced',
    icon: Briefcase,
  },
];

export const ReadingPractice: React.FC = () => {
  const { addHistoryRecord } = useApp();

  const availableReadings = SEED_EXERCISES.filter((e) => e.type === 'reading');
  const [currentReading, setCurrentReading] = useState<ExerciseItem>(availableReadings[0] || SEED_EXERCISES[0]);

  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Gạch ý trực tiếp trong bài văn khi chấm điểm
  const [showEvidenceUnderline, setShowEvidenceUnderline] = useState<boolean>(true);
  const [activeEvidenceQNum, setActiveEvidenceQNum] = useState<number | null>(null);

  // Bộ lọc danh mục chủ đề
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTopicQuery, setSearchTopicQuery] = useState<string>('');

  const [topicInput, setTopicInput] = useState<string>('Technology');
  const [levelInput, setLevelInput] = useState<ProficiencyLevel>('Intermediate');
  const [lengthInput, setLengthInput] = useState<string>('Trung bình (250 từ)');
  const [questionCountInput, setQuestionCountInput] = useState<number>(8);

  const questionsRef = useRef<HTMLDivElement>(null);
  const passageRef = useRef<HTMLDivElement>(null);

  const scrollToQuestions = () => {
    questionsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPassage = () => {
    passageRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToEvidence = (qNum: number) => {
    setActiveEvidenceQNum(qNum);
    const el = document.getElementById(`evidence-quote-${qNum}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      scrollToPassage();
    }
    setTimeout(() => {
      setActiveEvidenceQNum(null);
    }, 3500);
  };

  const scrollToQuestionCard = (qIdx: number) => {
    const el = document.getElementById(`question-card-${qIdx}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setActiveEvidenceQNum(qIdx + 1);
      setTimeout(() => {
        setActiveEvidenceQNum(null);
      }, 3500);
    }
  };

  const handleSelectAnswer = (qIndex: number, val: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: val }));
  };

  const totalQuestions = currentReading.questions.length;
  const answeredCount = Object.keys(answers).length;

  const handleSubmit = () => {
    setSubmitted(true);
    setShowEvidenceUnderline(true);

    let correctCount = 0;
    currentReading.questions.forEach((q, idx) => {
      const studentAns = (answers[idx] || '').trim().toLowerCase();
      const correctAns = (q.correctAnswer as string).trim().toLowerCase();
      if (studentAns === correctAns || studentAns.includes(correctAns) || correctAns.includes(studentAns)) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / totalQuestions) * 100);

    addHistoryRecord({
      activityType: 'Reading',
      topicId: currentReading.topicId,
      topicTitle: currentReading.title,
      level: currentReading.level,
      score,
      durationSeconds: 240,
      skillCategory: 'Reading',
      detailsSummary: `Hoàn thành bài đọc hiểu (${currentReading.level}). Đạt ${correctCount}/${totalQuestions} câu đúng (${score}%).`,
      detailedQuestions: currentReading.questions.map((q, idx) => ({
        questionId: q.id,
        questionText: q.questionText,
        studentAnswer: answers[idx] || '',
        correctAnswer: q.correctAnswer,
        isCorrect: (answers[idx] || '').trim().toLowerCase() === (q.correctAnswer as string).trim().toLowerCase(),
        explanation: q.explanation,
      })),
    });

    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    scrollToQuestions();
  };

  // Helper to generate dynamic, rich reading passages & 6-8 questions
  const generateRichReading = (topic: string, level: ProficiencyLevel, numQuestions: number): ExerciseItem => {
    const topicLow = topic.toLowerCase();

    let passage = '';
    let title = '';

    if (topicLow.includes('technol') || topicLow.includes('ai') || topicLow.includes('công nghệ') || topicLow.includes('robot') || topicLow.includes('cyber') || topicLow.includes('space') || topicLow.includes('smart')) {
      title = `The Frontiers of Innovation: Exploring ${topic}`;
      passage = `In the twenty-first century, rapid advancements in ${topic} have fundamentally revolutionized both educational methodologies and daily communications. Across modern universities, intelligent algorithms now tailor learning trajectories to each student's unique intellectual pace, diagnosing conceptual weaknesses in real time and providing adaptive problem-solving materials.\n\nSimultaneously, workplace environments have embraced decentralized digital collaboration. Professionals from diverse geographic zones can coalesce in shared virtual workspaces, disintegrating traditional physical constraints. However, leading sociologists emphasize that while computational automation accelerates productivity, it must never overshadow critical human virtues such as spontaneous empathy, ethical discernment, and authentic interpersonal warmth.\n\nTo flourish in an increasingly algorithmic society, students must cultivate cognitive flexibility. Rather than passively absorbing technical tools, individuals should develop analytical discernment to filter misinformation and maintain emotional resilience amidst perpetual digital acceleration.`;
    } else if (topicLow.includes('environ') || topicLow.includes('môi trường') || topicLow.includes('nature') || topicLow.includes('coral') || topicLow.includes('climate') || topicLow.includes('energy') || topicLow.includes('plastic')) {
      title = `Safeguarding Biodiversity: The Ecological Imperative of ${topic}`;
      passage = `Global ecosystems currently face unprecedented ecological pressures driven by anthropogenic industrial expansion and habitat degradation. Coastal wetlands and ancient rainforests, which serve as planetary carbon sinks and biospheric stabilizers, are increasingly fragmented by modern infrastructural encroachment.\n\nScientific research indicates that regional climate shifts directly disrupt seasonal migration cycles and pollination networks. When keystone species disappear, fragile food webs experience cascading shocks that diminish systemic resilience. Fortunately, modern community-driven conservation initiatives, combined with satellite tracking and satellite-guided reforestation, are revealing promising avenues for ecological restoration.\n\nAchieving long-term sustainability demands an urgent transformation in human production cycles and civic responsibility. By transitioning toward circular economies and embracing rigorous conservation ethics, society can preserve the planet's rich ecological heritage for future generations.`;
    } else if (topicLow.includes('health') || topicLow.includes('sức khỏe') || topicLow.includes('food') || topicLow.includes('sleep') || topicLow.includes('stress') || topicLow.includes('mind') || topicLow.includes('brain')) {
      title = `Mind, Nutrition, and Vitality: The Science Behind ${topic}`;
      passage = `Modern neuroscience has uncovered profound interconnections between dietary habits, quality sleep cycles, and optimal cognitive functioning. When individuals maintain regular circadian rhythms and allocate sufficient hours for restorative sleep, neurochemical processes effectively clear metabolic waste products from cerebral tissues, sharpening memory consolidation and emotional regulation.\n\nConversely, chronic sleep deprivation coupled with heavily processed diets impairs neural plasticity, precipitating elevated stress hormone levels and diminished concentration. Nutritional experts advocate for whole foods rich in antioxidants and omega-3 fatty acids, which fortify cellular health against oxidative stress.\n\nUltimately, sustainable well-being is not achieved through drastic, short-lived lifestyle overhauls, but through the patient cultivation of balanced daily habits. Prioritizing consistent rest, mindful nourishment, and regular physical movement builds a robust foundation for lifelong vitality.`;
    } else if (topicLow.includes('culture') || topicLow.includes('vietnam') || topicLow.includes('travel') || topicLow.includes('heritage') || topicLow.includes('tourism')) {
      title = `Cultural Heritage and Globalization: The Spirit of ${topic}`;
      passage = `Across diverse global regions, historical architectural landmarks, indigenous craft traditions, and folk arts stand as living testaments to generations of human ingenuity and communal resilience. Cultural heritage offers a profound bridge, anchoring contemporary citizens to ancestral wisdom while fostering mutual respect across international borders.\n\nIn our rapidly modernizing world, preserving tangible and intangible heritage requires creative diplomacy and community stewardship. When local populations are empowered to showcase their living traditions through authentic cultural tourism, historical preservation transforms into an engine of sustainable economic growth.\n\nMoving forward, embracing both cultural diversity and cooperative problem-solving will be paramount. Learners who master cross-cultural communication while honoring their own roots will be ideally positioned to lead with wisdom in an interconnected global community.`;
    } else {
      title = `Mastering the Modern Era: Perspectives on ${topic}`;
      passage = `In our rapidly changing economic landscape, mastering ${topic} has emerged as an indispensable cornerstone of personal growth and professional distinction. Successful individuals do not rely on static knowledge; instead, they continually expand their cognitive horizons and cultivate adaptable problem-solving skills.\n\nFurthermore, research in behavioral economics demonstrates that deliberate daily systems consistently outperform sporadic bursts of intense effort. Cultivating structured routines, maintaining meticulous personal accountability, and soliciting honest feedback form the bedrock of sustainable mastery.\n\nUltimately, true leadership in any discipline requires combining technical expertise with unwavering empathy and ethical clarity. By pursuing excellence with a growth mindset, learners can transform ambitious goals into lasting achievements for their wider communities.`;
    }

    // Build 6 to 8 questions with evidenceQuote
    const questions: QuestionItem[] = [
      {
        id: `gen-q-1`,
        questionOrder: 1,
        questionText: `What is the central focus of the reading passage?`,
        type: 'multiple_choice',
        options: [
          `The multifaceted impact, opportunities, and responsibilities associated with ${topic}`,
          `Why modern society should completely reject technological and cultural changes`,
          `A brief biographical account of an ancient historical king`,
          `A statistical report on financial investments in banking sectors`
        ],
        correctAnswer: `The multifaceted impact, opportunities, and responsibilities associated with ${topic}`,
        explanation: `Đoạn văn mở đầu và toàn bộ bài viết tổng quan về tác động sâu rộng, cơ hội cũng như trách nhiệm liên quan đến chủ đề ${topic}.`,
        evidenceQuote: `fundamentally revolutionized both educational methodologies and daily communications`,
      },
      {
        id: 'gen-q-2',
        questionOrder: 2,
        questionText: `According to the first paragraph, what is one major benefit or principle highlighted?`,
        type: 'multiple_choice',
        options: [
          `Adapting to individual needs and facilitating rapid collaboration across distances`,
          `Eliminating the necessity for critical thinking and research`,
          `Decreasing global communication among academic institutions`,
          `Preventing students from engaging in independent problem solving`
        ],
        correctAnswer: `Adapting to individual needs and facilitating rapid collaboration across distances`,
        explanation: `Đoạn 1 nêu rõ lợi ích thích ứng với nhu cầu cá nhân ("tailor learning trajectories to each student's unique intellectual pace") và tăng cường kết nối xuyên biên giới.`,
        evidenceQuote: `tailor learning trajectories to each student's unique intellectual pace, diagnosing conceptual weaknesses in real time`,
      },
      {
        id: 'gen-q-3',
        questionOrder: 3,
        questionText: `True or False: According to the passage, automated and computational tools can completely substitute human empathy and ethical discernment.`,
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: `Đoạn 2 chỉ rõ: "...it must never overshadow critical human virtues such as spontaneous empathy, ethical discernment, and authentic interpersonal warmth." Do đó khẳng định trên là Sai (False).`,
        evidenceQuote: `it must never overshadow critical human virtues such as spontaneous empathy, ethical discernment, and authentic interpersonal warmth`,
      },
      {
        id: 'gen-q-4',
        questionOrder: 4,
        questionText: `Vocabulary in Context: What does the phrase "cognitive flexibility" in the final paragraph mean?`,
        type: 'multiple_choice',
        options: [
          `The mental ability to adapt thinking and strategies to changing environments`,
          `Physical stretching exercises for the neck and spine`,
          `The habit of completely ignoring new ideas and opinions`,
          `The capacity to memorize vast tables of numbers without understanding`
        ],
        correctAnswer: `The mental ability to adapt thinking and strategies to changing environments`,
        explanation: `"Cognitive flexibility" nghĩa là sự linh hoạt về nhận thức - khả năng điều chỉnh suy nghĩ và phương pháp tiếp cận khi hoàn cảnh thay đổi.`,
        evidenceQuote: `students must cultivate cognitive flexibility`,
      },
      {
        id: 'gen-q-5',
        questionOrder: 5,
        questionText: `True or False: The author suggests that students should passively accept technical tools without filtering misinformation.`,
        type: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: `Đoạn cuối nhấn mạnh: "Rather than passively absorbing technical tools, individuals should develop analytical discernment to filter misinformation..." -> Đáp án là False.`,
        evidenceQuote: `Rather than passively absorbing technical tools, individuals should develop analytical discernment to filter misinformation`,
      },
      {
        id: 'gen-q-6',
        questionOrder: 6,
        questionText: `What can be inferred about the author's tone toward the future of ${topic}?`,
        type: 'multiple_choice',
        options: [
          `Cautiously optimistic, advocating for balanced adoption alongside human values`,
          `Extremely hostile and demanding an immediate ban on all modernization`,
          `Completely indifferent and uninterested in student outcomes`,
          `Overly sensationalized with unrealistic promises`
        ],
        correctAnswer: `Cautiously optimistic, advocating for balanced adoption alongside human values`,
        explanation: `Tác giả giữ quan điểm lạc quan có chọn lọc ("cautiously optimistic"), khuyến khích tận dụng thế mạnh mới đi đôi với việc gìn giữ giá trị nhân bản.`,
        evidenceQuote: `computational automation accelerates productivity, it must never overshadow critical human virtues`,
      },
    ];

    if (numQuestions >= 7) {
      questions.push({
        id: 'gen-q-7',
        questionOrder: 7,
        questionText: `Which of the following actions is recommended in the concluding section?`,
        type: 'multiple_choice',
        options: [
          `Developing analytical discernment and emotional resilience`,
          `Ignoring regional traditions completely in favor of globalization`,
          `Reducing study time to avoid mental strain`,
          `Relying solely on automated solutions for everyday decisions`
        ],
        correctAnswer: `Developing analytical discernment and emotional resilience`,
        explanation: `Phần kết luận khuyến nghị người học rèn luyện óc phân tích sắc bén và khả năng kiên định về cảm xúc ("develop analytical discernment... and maintain emotional resilience").`,
        evidenceQuote: `develop analytical discernment to filter misinformation and maintain emotional resilience`,
      });
    }

    if (numQuestions >= 8) {
      questions.push({
        id: 'gen-q-8',
        questionOrder: 8,
        questionText: `What is the most suitable alternative title for this passage?`,
        type: 'multiple_choice',
        options: [
          `Balancing Innovation with Human Discretion in ${topic}`,
          `The Complete Decline of Contemporary Education`,
          `Historical Records from Centuries Past`,
          `A Technical Manual for Software Developers`
        ],
        correctAnswer: `Balancing Innovation with Human Discretion in ${topic}`,
        explanation: `Tiêu đề phù hợp nhất phản ánh thông điệp cân bằng giữa sự đổi mới sáng tạo và sự tỉnh thức, nhân văn của con người.`,
        evidenceQuote: `To flourish in an increasingly algorithmic society, students must cultivate cognitive flexibility`,
      });
    }

    return {
      id: `read-ai-${Date.now()}`,
      title,
      topicId: topicLow.replace(/\s+/g, '-'),
      topicTitle: topic,
      level,
      type: 'reading',
      passage,
      questions,
      isAiGenerated: true,
    };
  };

  const handleSelectTopicFromCatalog = (item: ReadingTopicItem) => {
    setAnswers({});
    setSubmitted(false);

    if (item.seedExerciseId) {
      const found = availableReadings.find((e) => e.id === item.seedExerciseId);
      if (found) {
        setCurrentReading(found);
        scrollToPassage();
        return;
      }
    }

    // Nếu là chủ đề chưa có sẵn bài mẫu, gọi tạo AI tức thì
    setIsGenerating(true);
    setTopicInput(item.title);
    setLevelInput(item.level);

    setTimeout(() => {
      const newArticle = generateRichReading(item.title, item.level, questionCountInput);
      setCurrentReading(newArticle);
      setIsGenerating(false);
      scrollToPassage();
    }, 600);
  };

  const handleGenerateNewReading = () => {
    setIsGenerating(true);
    setAnswers({});
    setSubmitted(false);

    setTimeout(() => {
      const newArticle = generateRichReading(topicInput, levelInput, questionCountInput);
      setCurrentReading(newArticle);
      setIsGenerating(false);
      scrollToPassage();
    }, 750);
  };

  const filteredTopics = useMemo(() => {
    return READING_TOPICS_CATALOG.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchQuery =
        !searchTopicQuery.trim() ||
        item.title.toLowerCase().includes(searchTopicQuery.toLowerCase()) ||
        item.titleVi.toLowerCase().includes(searchTopicQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTopicQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchTopicQuery]);

  const words = currentReading.passage ? currentReading.passage.trim().split(/\s+/).length : 0;
  const estimatedReadTime = Math.max(1, Math.ceil(words / 140));

  const getQuestionTypeBadge = (q: QuestionItem) => {
    if (q.type === 'true_false') return { label: 'True / False', color: 'text-amber-400 bg-amber-500/15 border-amber-500/25' };
    if (q.questionText.toLowerCase().includes('vocabulary') || q.questionText.toLowerCase().includes('word') || q.questionText.toLowerCase().includes('mean')) {
      return { label: 'Từ vựng ngữ cảnh', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/25' };
    }
    if (q.questionText.toLowerCase().includes('central') || q.questionText.toLowerCase().includes('primary') || q.questionText.toLowerCase().includes('focus') || q.questionText.toLowerCase().includes('title')) {
      return { label: 'Ý chính / Main Idea', color: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/25' };
    }
    if (q.questionText.toLowerCase().includes('inferred') || q.questionText.toLowerCase().includes('tone') || q.questionText.toLowerCase().includes('suggest')) {
      return { label: 'Suy luận / Inference', color: 'text-violet-400 bg-violet-500/15 border-violet-500/25' };
    }
    return { label: 'Chi tiết bài đọc', color: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/25' };
  };

  // Hàm render trực quan gạch ý trực tiếp trong từng đoạn văn khi chấm điểm
  const renderParagraphWithHighlights = (paragraph: string, pIdx: number) => {
    if (!submitted || !showEvidenceUnderline) {
      return (
        <p key={pIdx} className="indent-4 sm:indent-6 text-justify leading-relaxed">
          {paragraph}
        </p>
      );
    }

    interface MatchItem {
      start: number;
      end: number;
      qNums: number[];
      qIndexes: number[];
    }

    const matches: MatchItem[] = [];
    const lowerPara = paragraph.toLowerCase();

    currentReading.questions.forEach((q, idx) => {
      let quote = q.evidenceQuote;
      if (!quote && q.explanation) {
        const foundInQuotes = q.explanation.match(/"([^"]{10,})"/);
        if (foundInQuotes) {
          quote = foundInQuotes[1];
        }
      }

      if (!quote) return;
      const lowerQuote = quote.toLowerCase().trim();
      if (!lowerQuote) return;

      let searchStart = 0;
      while (searchStart < lowerPara.length) {
        const foundIdx = lowerPara.indexOf(lowerQuote, searchStart);
        if (foundIdx === -1) break;
        matches.push({
          start: foundIdx,
          end: foundIdx + lowerQuote.length,
          qNums: [idx + 1],
          qIndexes: [idx],
        });
        searchStart = foundIdx + lowerQuote.length;
      }
    });

    if (matches.length === 0) {
      return (
        <p key={pIdx} className="indent-4 sm:indent-6 text-justify leading-relaxed">
          {paragraph}
        </p>
      );
    }

    matches.sort((a, b) => a.start - b.start);

    const merged: MatchItem[] = [];
    for (const m of matches) {
      if (merged.length === 0) {
        merged.push({ ...m });
      } else {
        const last = merged[merged.length - 1];
        if (m.start <= last.end) {
          last.end = Math.max(last.end, m.end);
          m.qNums.forEach((qn) => {
            if (!last.qNums.includes(qn)) last.qNums.push(qn);
          });
          m.qIndexes.forEach((qi) => {
            if (!last.qIndexes.includes(qi)) last.qIndexes.push(qi);
          });
        } else {
          merged.push({ ...m });
        }
      }
    }

    const elements: React.ReactNode[] = [];
    let currentIdx = 0;

    merged.forEach((item, mIdx) => {
      if (item.start > currentIdx) {
        elements.push(paragraph.slice(currentIdx, item.start));
      }

      const highlightedText = paragraph.slice(item.start, item.end);
      const isTargeted = item.qNums.some((qn) => qn === activeEvidenceQNum);

      elements.push(
        <span
          key={`highlight-${pIdx}-${mIdx}`}
          id={`evidence-quote-${item.qNums[0]}`}
          onClick={() => scrollToQuestionCard(item.qIndexes[0])}
          className={`inline relative cursor-pointer px-1 py-0.5 rounded transition-all duration-300 ${
            isTargeted
              ? 'bg-amber-400/40 text-amber-50 ring-2 ring-amber-400 font-bold border-b-2 border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.5)]'
              : 'bg-amber-500/20 text-amber-200 border-b-2 border-dashed border-amber-400/80 hover:bg-amber-500/30'
          }`}
          title={`Bấm để chuyển đến câu hỏi: Câu ${item.qNums.join(', ')}`}
        >
          <span className="font-semibold underline decoration-amber-400/70 underline-offset-4 decoration-2">
            {highlightedText}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 ml-1 rounded-md border align-middle select-none transition-all ${
              isTargeted
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                : 'bg-amber-500/25 border-amber-400/50 text-amber-200 hover:bg-amber-400 hover:text-slate-950'
            }`}
          >
            📌 {item.qNums.length === 1 ? `Câu ${item.qNums[0]}` : `Câu ${item.qNums.join(', ')}`}
          </span>
        </span>
      );

      currentIdx = item.end;
    });

    if (currentIdx < paragraph.length) {
      elements.push(paragraph.slice(currentIdx));
    }

    return (
      <p key={pIdx} className="indent-4 sm:indent-6 text-justify leading-relaxed">
        {elements}
      </p>
    );
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* 1. KHU VỰC CHỌN CHỦ ĐỀ ĐA DẠNG (TOPIC SELECTOR CATALOG) */}
      <SpotlightCard className="p-6 lg:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <BookMarked className="w-5 h-5 text-violet-400" />
              <h2 className="text-xl lg:text-2xl font-black text-white">
                Kho Chủ Đề Đọc Hiểu Tiếng Anh
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Khám phá hơn 20 chủ đề học thuật đa dạng: Công nghệ, Môi trường, Não bộ, Văn hóa & Nghề nghiệp. Chọn chủ đề để đọc và luyện tập ngay!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-violet-300 bg-violet-500/15 border border-violet-500/25 px-3 py-1.5 rounded-full">
              {READING_TOPICS_CATALOG.length} Chủ đề tuyển chọn
            </span>
          </div>
        </div>

        {/* Thanh tìm kiếm & Tabs phân loại chủ đề */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm chủ đề: AI, san hô, giấc ngủ, văn hóa, việc làm..."
                value={searchTopicQuery}
                onChange={(e) => setSearchTopicQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#0b0e17] border border-white/[0.08] focus:border-violet-500 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>

            {/* Quick Status */}
            <span className="text-xs text-slate-400 font-medium">
              Đang hiển thị <strong className="text-white">{filteredTopics.length}</strong> chủ đề
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {[
              { id: 'all', label: 'Tất cả chủ đề', icon: Layers },
              { id: 'tech', label: 'Công nghệ & AI', icon: Sparkles },
              { id: 'environment', label: 'Môi trường & Trái Đất', icon: Leaf },
              { id: 'health', label: 'Sức khỏe & Não bộ', icon: Brain },
              { id: 'culture', label: 'Văn hóa & Xã hội', icon: Compass },
              { id: 'career', label: 'Học tập & Sự nghiệp', icon: Briefcase },
            ].map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-violet-600/30 border-violet-500 text-white ring-2 ring-violet-500/40 shadow-glow-indigo'
                      : 'bg-[#0b0e17] border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-violet-400" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lưới thẻ chủ đề chọn lọc (Topic Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2 max-h-[360px] overflow-y-auto pr-1">
          {filteredTopics.map((item) => {
            const isCurrent =
              currentReading.title.toLowerCase().includes(item.title.toLowerCase()) ||
              (item.seedExerciseId && currentReading.id === item.seedExerciseId);
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                onClick={() => handleSelectTopicFromCatalog(item)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between group ${
                  isCurrent
                    ? 'bg-violet-600/20 border-violet-500 ring-2 ring-violet-500/50 shadow-glow-indigo'
                    : 'bg-[#0b0e17] border-white/[0.08] hover:border-violet-500/40 hover:bg-[#101424]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-violet-300 bg-violet-500/15 border border-violet-500/25 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Icon className="w-3 h-3 text-violet-400" />
                      {item.categoryLabel}
                    </span>
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        item.level === 'Advanced'
                          ? 'text-rose-300 bg-rose-500/15 border-rose-500/30'
                          : item.level === 'Intermediate'
                          ? 'text-indigo-300 bg-indigo-500/15 border-indigo-500/30'
                          : 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30'
                      }`}
                    >
                      {item.level}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-extrabold text-white leading-snug group-hover:text-violet-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] font-medium text-slate-300">
                    {item.titleVi}
                  </p>
                  <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                  {item.seedExerciseId ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1 text-[10px]">
                      <CheckCircle2 className="w-3 h-3" /> Bài mẫu có sẵn
                    </span>
                  ) : (
                    <span className="text-violet-400 font-bold flex items-center gap-1 text-[10px]">
                      <Sparkles className="w-3 h-3" /> Tạo ngay với AI
                    </span>
                  )}
                  <span className="text-slate-400 group-hover:text-white flex items-center gap-0.5 font-bold transition-transform group-hover:translate-x-0.5">
                    Làm bài <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Reading Generator Custom Panel */}
        <div className="bg-[#0b0e17] p-5 rounded-2xl border border-white/[0.08] space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-violet-300">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>Hoặc tự nhập chủ đề tùy ý để AI tạo bài đọc độc quyền:</span>
            </div>
            <span className="text-[11px] text-slate-400">Tùy biến độ dài & số lượng câu hỏi</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Chủ đề mong muốn:</label>
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="VD: Space, Music, Sports..."
                className="w-full p-2.5 bg-[#121726] border border-white/[0.08] rounded-xl font-medium text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Trình độ:</label>
              <select
                value={levelInput}
                onChange={(e) => setLevelInput(e.target.value as ProficiencyLevel)}
                className="w-full p-2.5 bg-[#121726] border border-white/[0.08] rounded-xl font-medium text-white focus:outline-none focus:border-violet-500"
              >
                <option value="Beginner">Beginner (Cơ bản)</option>
                <option value="Intermediate">Intermediate (Trung cấp)</option>
                <option value="Advanced">Advanced (Nâng cao)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Độ dài văn bản:</label>
              <select
                value={lengthInput}
                onChange={(e) => setLengthInput(e.target.value)}
                className="w-full p-2.5 bg-[#121726] border border-white/[0.08] rounded-xl font-medium text-white focus:outline-none focus:border-violet-500"
              >
                <option value="Ngắn (150 từ)">Ngắn (~150 từ)</option>
                <option value="Trung bình (250 từ)">Trung bình (~250 từ)</option>
                <option value="Dài (350 từ)">Dài (~350 từ)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Số lượng câu hỏi:</label>
              <select
                value={questionCountInput}
                onChange={(e) => setQuestionCountInput(Number(e.target.value))}
                className="w-full p-2.5 bg-[#121726] border border-white/[0.08] rounded-xl font-bold text-violet-300 focus:outline-none focus:border-violet-500"
              >
                <option value={6}>6 câu hỏi (Chuẩn)</option>
                <option value={8}>8 câu hỏi (Đầy đủ chuyên sâu)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                disabled={isGenerating || !topicInput.trim()}
                onClick={handleGenerateNewReading}
                className="w-full p-2.5 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-glow-indigo transition-all flex items-center justify-center gap-1.5"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang tạo...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Tạo bài đọc mới</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </SpotlightCard>

      {/* 2. BÀI VIẾT ĐỌC HIỂU (PASSAGE) - FULL WIDTH TRÊN ĐẦU */}
      <div ref={passageRef}>
        <SpotlightCard className="p-6 lg:p-9 space-y-6">
          {/* Header Bar of the Article */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-lg flex items-center gap-1.5">
                <BookMarked className="w-3.5 h-3.5" />
                VĂN BẢN ĐỌC HIỂU
              </span>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Khoảng {estimatedReadTime} phút đọc</span>
                <span className="text-slate-600">•</span>
                <span>{words} từ</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')}
                className="text-xs text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-semibold transition-colors"
                title="Thay đổi cỡ chữ"
              >
                <Type className="w-3.5 h-3.5 text-violet-400" />
                <span>{fontSize === 'normal' ? 'Chữ lớn (A+)' : 'Chữ thường (A)'}</span>
              </button>

              <button
                onClick={scrollToQuestions}
                className="text-xs text-violet-300 hover:text-white bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold transition-all"
              >
                <span>Xuống câu hỏi ({totalQuestions} câu)</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Article Title */}
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {currentReading.title}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
              <span>Chủ đề: <strong className="text-slate-300">{currentReading.topicTitle}</strong></span>
              <span>•</span>
              <span>Trình độ: <strong className="text-violet-400">{currentReading.level}</strong></span>
              <span>•</span>
              <span>Bộ câu hỏi: <strong className="text-indigo-400">{totalQuestions} câu</strong></span>
            </div>
          </div>

          {/* Banner thông báo chế độ gạch ý dẫn chứng sau khi chấm điểm */}
          {submitted && (
            <div className="p-3.5 bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-500/35 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-amber-200">
                <div className="w-7 h-7 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                  <PenTool className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <span className="font-extrabold text-amber-300 block">
                    Đã bật gạch ý trực tiếp trong bài văn!
                  </span>
                  <span className="text-[11px] text-amber-200/80">
                    Các câu dẫn chứng giải thích cho từng câu hỏi đã được gạch chân màu vàng. Bạn có thể nhấn vào đoạn gạch ý để nhảy nhanh tới câu hỏi tương ứng.
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowEvidenceUnderline(!showEvidenceUnderline)}
                className="px-3 py-1.5 bg-amber-500/25 hover:bg-amber-500/40 text-amber-200 hover:text-white font-bold rounded-xl border border-amber-400/40 transition-colors flex items-center gap-1.5"
              >
                {showEvidenceUnderline ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showEvidenceUnderline ? 'Ẩn gạch ý' : 'Hiện gạch ý'}</span>
              </button>
            </div>
          )}

          {/* Article Passage Content với gạch ý dẫn chứng trực tiếp */}
          <div
            className={`font-serif leading-relaxed text-slate-200 space-y-4 pt-2 border-t border-white/[0.04] ${
              fontSize === 'large' ? 'text-base sm:text-lg sm:leading-loose' : 'text-sm sm:text-base sm:leading-relaxed'
            }`}
          >
            {currentReading.passage?.split('\n\n').map((paragraph, pIdx) =>
              renderParagraphWithHighlights(paragraph, pIdx)
            )}
          </div>

          {/* Bottom hint to jump to questions */}
          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Đã đọc xong bài viết? Hãy kéo xuống làm <strong>{totalQuestions} câu hỏi</strong> bên dưới!
            </span>
            <button
              onClick={scrollToQuestions}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors"
            >
              <span>Làm bài tập ngay</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </button>
          </div>
        </SpotlightCard>
      </div>

      {/* 3. PHẦN CÂU HỎI - NẰM XUỐNG DƯỚI BÀI VIẾT (FULL WIDTH VỚI NHIỀU CÂU HỎI) */}
      <div ref={questionsRef} id="questions-section">
        <SpotlightCard className="p-6 lg:p-9 space-y-6">
          {/* Questions Header with progress & back to reading button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <HelpCircle className="w-5 h-5 text-indigo-400" />
                <h4 className="text-lg lg:text-xl font-black text-white">
                  Bộ Câu Hỏi Đọc Hiểu ({totalQuestions} câu)
                </h4>
              </div>
              <p className="text-xs text-slate-400">
                Đọc kỹ văn bản phía trên và chọn đáp án chính xác nhất cho từng câu hỏi dưới đây.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={scrollToPassage}
                className="text-xs font-bold text-slate-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <ArrowUp className="w-3.5 h-3.5 text-violet-400" />
                <span>Xem lại bài đọc</span>
              </button>

              <div className="text-xs font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/25 px-3.5 py-2 rounded-xl flex items-center gap-1.5">
                <span>Đã làm:</span>
                <span className="text-white font-extrabold">{answeredCount}</span>
                <span>/</span>
                <span>{totalQuestions} câu</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
              <span>Tiến độ hoàn thành</span>
              <span>{Math.round((answeredCount / totalQuestions) * 100)}%</span>
            </div>
            <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-300 rounded-full"
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Questions Grid: 2 Columns on desktop for comfortable reading */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {currentReading.questions.map((q, idx) => {
              const userAns = answers[idx];
              const isAnswered = userAns !== undefined && userAns !== '';
              const isCorrect = submitted && userAns === q.correctAnswer;
              const typeBadge = getQuestionTypeBadge(q);
              const isTargeted = activeEvidenceQNum === idx + 1;

              const options = q.options && q.options.length > 0 ? q.options : ['True', 'False'];

              return (
                <div
                  key={q.id || idx}
                  id={`question-card-${idx}`}
                  className={`p-5 rounded-2xl border transition-all space-y-4 flex flex-col justify-between ${
                    isTargeted
                      ? 'ring-2 ring-amber-400 bg-amber-500/[0.08] border-amber-400/60 shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                      : submitted
                      ? isCorrect
                        ? 'bg-emerald-500/[0.04] border-emerald-500/30'
                        : 'bg-rose-500/[0.04] border-rose-500/30'
                      : isAnswered
                      ? 'bg-[#0f1422] border-violet-500/40 shadow-glow-indigo'
                      : 'bg-[#0b0e17] border-white/[0.08]'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top row: Question index + Type tag */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black text-white bg-white/[0.08] px-2.5 py-1 rounded-lg">
                        Câu {idx + 1}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${typeBadge.color}`}>
                        {typeBadge.label}
                      </span>
                    </div>

                    {/* Question text */}
                    <p className="text-xs sm:text-sm font-bold text-slate-100 leading-snug">
                      {q.questionText}
                    </p>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 pt-2">
                    {options.map((opt, optIdx) => {
                      const isSelected = userAns === opt;
                      const letter = String.fromCharCode(65 + optIdx); // A, B, C, D

                      let btnStyle = 'bg-[#121726] border-white/[0.08] text-slate-300 hover:border-violet-500/40 hover:bg-[#161c2e]';

                      if (isSelected && !submitted) {
                        btnStyle = 'bg-violet-500/20 border-violet-500 text-white font-bold ring-2 ring-violet-500/40 shadow-glow-indigo';
                      } else if (submitted) {
                        if (opt === q.correctAnswer) {
                          btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-100 font-bold ring-2 ring-emerald-500/40';
                        } else if (isSelected && opt !== q.correctAnswer) {
                          btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-200 line-through opacity-90';
                        } else {
                          btnStyle = 'bg-[#121726]/60 border-white/[0.04] text-slate-500 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={submitted}
                          onClick={() => handleSelectAnswer(idx, opt)}
                          className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 ${btnStyle}`}
                        >
                          <span
                            className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-extrabold shrink-0 mt-0.5 ${
                              isSelected && !submitted
                                ? 'bg-violet-500 text-white'
                                : submitted && opt === q.correctAnswer
                                ? 'bg-emerald-500 text-white'
                                : submitted && isSelected && opt !== q.correctAnswer
                                ? 'bg-rose-500 text-white'
                                : 'bg-white/[0.06] text-slate-400'
                            }`}
                          >
                            {letter}
                          </span>
                          <span className="flex-1 leading-relaxed">{opt}</span>
                          {submitted && opt === q.correctAnswer && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          )}
                          {submitted && isSelected && opt !== q.correctAnswer && (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation card after submit kèm nút nhảy lên dẫn chứng bài đọc */}
                  {submitted && (
                    <div className="p-3 bg-[#121726] rounded-xl border border-white/[0.08] text-xs space-y-2 mt-2">
                      <div className="font-bold flex items-center justify-between">
                        {isCorrect ? (
                          <span className="text-emerald-400 flex items-center gap-1.5 font-black">
                            <CheckCircle2 className="w-4 h-4" /> Chính xác (+100 điểm)
                          </span>
                        ) : (
                          <span className="text-rose-400 flex items-center gap-1.5 font-black">
                            <XCircle className="w-4 h-4" /> Đáp án đúng: {q.correctAnswer}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11px] font-sans">
                        💡 <strong>Giải thích:</strong> {q.explanation}
                      </p>

                      {/* Gạch ý dẫn chứng trực tiếp trong bài văn */}
                      {q.evidenceQuote && (
                        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between gap-2 bg-amber-500/[0.08] p-2 rounded-lg border border-amber-500/20">
                          <div className="text-[11px] text-amber-200/90 leading-tight truncate">
                            📌 <strong>Dẫn chứng:</strong> "{q.evidenceQuote}"
                          </div>
                          <button
                            onClick={() => scrollToEvidence(idx + 1)}
                            className="shrink-0 text-[10px] font-bold text-amber-300 hover:text-white bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/40 px-2 py-1 rounded-lg flex items-center gap-1 transition-all"
                            title="Cuộn lên xem gạch ý trực tiếp trong bài đọc"
                          >
                            <span>Xem vị trí</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submission & Score Actions Bar */}
          <div className="pt-6 border-t border-white/[0.08]">
            {!submitted ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#0b0e17] rounded-2xl border border-white/[0.08]">
                <div>
                  <h5 className="text-sm font-bold text-white">
                    {answeredCount === totalQuestions
                      ? '🎉 Bạn đã trả lời đủ tất cả các câu hỏi!'
                      : `Đã làm ${answeredCount}/${totalQuestions} câu hỏi`}
                  </h5>
                  <p className="text-xs text-slate-400">
                    {answeredCount === totalQuestions
                      ? 'Nhấn nút bên cạnh để nộp bài, chấm điểm và xem gạch ý trực tiếp trong bài văn.'
                      : `Vui lòng hoàn thành nốt ${totalQuestions - answeredCount} câu còn lại để chấm điểm.`}
                  </p>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={answeredCount < totalQuestions}
                  className="px-6 py-3.5 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-glow-indigo transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Nộp bài đọc & Chấm điểm</span>
                </button>
              </div>
            ) : (
              <div className="p-6 bg-gradient-to-r from-violet-950/40 to-indigo-950/40 rounded-2xl border border-violet-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center shrink-0">
                    <Award className="w-7 h-7 text-violet-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-white">
                        Kết quả bài đọc hiểu:
                      </span>
                      <span className="text-base font-extrabold text-violet-300">
                        {Math.round(
                          (currentReading.questions.filter((q, i) => answers[i] === q.correctAnswer).length /
                            totalQuestions) *
                            100
                        )}
                        /100 điểm
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Đúng{' '}
                      <strong className="text-emerald-400">
                        {currentReading.questions.filter((q, i) => answers[i] === q.correctAnswer).length}
                      </strong>{' '}
                      / {totalQuestions} câu hỏi. Các ý tương ứng đã được gạch chân trực tiếp trong bài văn!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => {
                      setAnswers({});
                      setSubmitted(false);
                      scrollToPassage();
                    }}
                    className="px-4 py-2.5 bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Làm lại bài đọc</span>
                  </button>

                  <button
                    onClick={() => {
                      setAnswers({});
                      setSubmitted(false);
                      handleGenerateNewReading();
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-400 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-glow-indigo transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Tạo bài đọc mới</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
};
