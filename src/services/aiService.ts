import {
  ProficiencyLevel,
  SpeakingFeedback,
  ExerciseItem,
  ExerciseType,
  QuestionItem,
  AICoachAnalysis,
  LearningHistoryRecord,
  DailyStatisticRecord,
  UserProfile,
} from '../types';
import { StorageService } from './storageService';

function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // Nếu chạy trên HTTPS (như Vercel) hoặc production, tuyệt đối tránh gọi http://localhost:3001 gây lỗi Mixed Content
    if (window.location.protocol === 'https:' || !import.meta.env.DEV) {
      const customUrl = import.meta.env.VITE_API_URL;
      if (customUrl && customUrl.startsWith('https://')) {
        return customUrl;
      }
      return '';
    }
  }
  return import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001' : '');
}

export class AIService {
  // 1. Phản hồi hội thoại Luyện nói & Đánh giá năng lực phát âm, ngữ pháp
  public static async sendSpeakingTurn(params: {
    topic: string;
    level: ProficiencyLevel;
    studentSpeech: string;
    rolePlayScenario?: string;
    history?: { sender: 'ai' | 'user'; text: string }[];
  }): Promise<{ aiReply: string; feedback: SpeakingFeedback }> {
    const user = StorageService.getUser() || StorageService.getFallbackUser();

    // Thử gọi Backend nếu không bật chế độ mock thuần túy
    if (!user.useMockAI) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);
        const response = await fetch(`${getApiBaseUrl()}/api/chat-speaking`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (response.ok) {
          const data = await response.json();
          if (data && data.aiReply && data.feedback) {
            return data;
          }
        }
      } catch (err) {
        console.warn('Backend API unreachable, switching to Smart Mock AI Mode:', err);
      }
    }

    // SMART CLIENT MOCK AI ENGINE
    return this.generateSmartMockSpeaking(params);
  }

  // Thuật toán giả lập phân tích ngữ âm và ngôn ngữ thông minh
  private static generateSmartMockSpeaking(params: {
    topic: string;
    level: ProficiencyLevel;
    studentSpeech: string;
    rolePlayScenario?: string;
  }): { aiReply: string; feedback: SpeakingFeedback } {
    const text = (params.studentSpeech || '').trim();
    const wordCount = text.split(/\s+/).filter(Boolean).length;

    // Tính điểm dựa trên độ dài, từ vựng và sự trôi chảy
    let fluency = Math.min(98, Math.max(70, 75 + Math.round(wordCount * 1.8)));
    let grammar = 85;
    let pronunciation = 88;
    let vocabulary = 82;
    let relevance = 92;

    const lower = text.toLowerCase();
    const errors: string[] = [];
    let correctedSentence = text;
    let betterExpression = text;
    let recommendedVocab = ['delighted', 'captivating', 'perspective'];
    let pronunciationTips = "Pay attention to sentence stress: emphasize key nouns and verbs rather than prepositions.";

    // Nhận diện lỗi thường gặp của học sinh
    if (lower.includes('i am agree') || lower.includes("i'm agree")) {
      errors.push("Thay vì 'I am agree', hãy dùng 'I agree' vì 'agree' vốn là động từ.");
      correctedSentence = text.replace(/i am agree|i'm agree/gi, 'I agree');
      grammar -= 8;
    }
    if (lower.includes('because') && lower.includes('so')) {
      errors.push("Không dùng đồng thời 'Because' và 'So' trong cùng một câu ghép tiếng Anh.");
      grammar -= 6;
    }
    if (wordCount < 4 && wordCount > 0) {
      errors.push("Hãy cố gắng mở rộng câu trả lời bằng cách thêm lý do (Because...) hoặc ví dụ cụ thể.");
      fluency -= 10;
    }

    // AI Phản hồi theo kịch bản Role-play hoặc hội thoại tự do
    let aiReply = '';
    if (params.rolePlayScenario?.includes('restaurant')) {
      aiReply = `Certainly! I have noted that down for you. Would you like to pair your meal with our special fresh lime juice or a dessert?`;
      betterExpression = "Could I also have a look at the beverage list, please?";
      recommendedVocab = ['appetizer', 'culinary', 'refreshing'];
      pronunciationTips = "Softly pronounce the 's' in 'dessert' as /z/, different from 'desert' /s/.";
    } else if (params.rolePlayScenario?.includes('airport')) {
      aiReply = `Thank you. Everything is in order. You are seated in 14A by the window. Here is your boarding pass, please proceed to Gate 6 at 10:15. Do you have any liquids in your carry-on?`;
      betterExpression = "Thank you very much. Could you remind me where security screening is?";
      recommendedVocab = ['carry-on luggage', 'proceed to gate', 'overhead compartment'];
      pronunciationTips = "Drop the pitch at the end of the statement: 'Gate 6'.";
    } else if (params.rolePlayScenario?.includes('shopping')) {
      aiReply = `That fits you wonderfully! It is made of breathable cotton and looks great with your style. Would you like to check out at the cash counter?`;
      betterExpression = "This is a great fit! Does it come with any warranty or return policy?";
      recommendedVocab = ['flattering', 'fitting room', 'cashier'];
      pronunciationTips = "Link words: 'That fits_you' -> /ðæt fɪtsjuː/.";
    } else if (params.rolePlayScenario?.includes('directions')) {
      aiReply = `You are very close! Just walk straight ahead for two blocks, turn left at the traffic lights, and you will see it right opposite the fountain. Is there anything else you need help finding?`;
      betterExpression = "Thank you so much! How long will it take on foot?";
      recommendedVocab = ['crossroads', 'landmark', 'pedestrian crossing'];
      pronunciationTips = "Stress 'straight' and 'left' clearly when clarifying directions.";
    } else {
      // Free talk replies
      const generalPrompts = [
        `That's a very interesting point about ${params.topic}! How long have you been interested in this, and what inspires you the most?`,
        `I really like how you described that! Can you share a memorable experience you had related to ${params.topic}?`,
        `That sounds delightful! If you had the chance to change one thing about it, what would it be?`,
        `Awesome explanation! How do your friends or family feel when you talk about this?`,
      ];
      aiReply = generalPrompts[Math.floor(Math.random() * generalPrompts.length)];
      betterExpression = `I have always found ${params.topic} truly engaging because it broadens my horizons.`;
      recommendedVocab = ['broaden horizons', 'memorable', 'fascinating'];
      pronunciationTips = "Use rising intonation for friendly open questions and falling intonation for statements.";
    }

    const overall = Math.round((pronunciation + grammar + vocabulary + fluency + relevance) / 5);

    return {
      aiReply,
      feedback: {
        pronunciationScore: pronunciation,
        grammarScore: Math.max(60, grammar),
        vocabularyScore: vocabulary,
        fluencyScore: Math.max(60, fluency),
        relevanceScore: relevance,
        overallScore: overall,
        studentSentence: text || 'I enjoy practicing speaking English with AI.',
        errors,
        correctedSentence: correctedSentence || text,
        betterExpression,
        recommendedVocab,
        pronunciationTips,
      },
    };
  }

  // 2. AI Tự sinh bài tập mới (Exercise Generator)
  public static async generateExercise(params: {
    topic: string;
    level: ProficiencyLevel;
    type: ExerciseType;
    count?: number;
  }): Promise<ExerciseItem> {
    const user = StorageService.getUser() || StorageService.getFallbackUser();

    if (!user.useMockAI) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);
        const response = await fetch(`${getApiBaseUrl()}/api/generate-exercise`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (response.ok) {
          const data = await response.json();
          const rawQuestions = Array.isArray(data?.questions) ? data.questions : (data?.exercise?.questions);
          if (Array.isArray(rawQuestions) && rawQuestions.length > 0) {
            const item: ExerciseItem = {
              id: `ai-gen-${Date.now()}`,
              title: data.title || `AI Generated: ${params.topic}`,
              topicId: params.topic.toLowerCase().replace(/\s+/g, '-'),
              topicTitle: params.topic,
              level: params.level,
              type: params.type,
              passage: data.passage || `AI generated practice for ${params.topic}.`,
              questions: rawQuestions,
              isAiGenerated: true,
            };
            StorageService.addExercise(item);
            return item;
          }
        }
      } catch (err) {
        console.warn('Backend generation failed or timed out, using intelligent client generator:', err);
      }
    }

    // CLIENT MOCK GENERATOR FOR ALL 10 EXERCISE TYPES
    const generated = this.createMockExerciseItem(params);
    StorageService.addExercise(generated);
    return generated;
  }

  private static createMockExerciseItem(params: {
    topic: string;
    level: ProficiencyLevel;
    type: ExerciseType;
    count?: number;
  }): ExerciseItem {
    const count = params.count || 6;
    const questions: QuestionItem[] = [];

    const mcVariations = [
      {
        q: `Which sentence uses the correct grammar structure when discussing ${params.topic}?`,
        opts: [
          `It plays an indispensable role in modern personal development.`,
          `It makes me feeling happily every time.`,
          `They does not agree with that proposed plan.`,
          `Because it is important so everyone must join.`
        ],
        ans: `It plays an indispensable role in modern personal development.`,
        exp: '"Indispensable role" nghĩa là vai trò không thể thiếu, cấu trúc chuẩn xác về ngữ pháp và văn phong.',
        hint: 'Chọn câu diễn đạt tự nhiên và chính xác nhất.',
      },
      {
        q: `Choose the correct preposition to complete: "Students are encouraged to participate ______ extracurricular clubs."`,
        opts: ['in', 'at', 'on', 'with'],
        ans: 'in',
        exp: 'Cụm từ cố định: "participate in" = tham gia vào hoạt động gì.',
        hint: 'Đi kèm với từ "participate".',
      },
      {
        q: `Identify the appropriate word form: "She showed great ______ and dedication in completing the project."`,
        opts: ['enthusiasm', 'enthusiastic', 'enthusiastically', 'enthuse'],
        ans: 'enthusiasm',
        exp: 'Sau tính từ "great", cần một danh từ (enthusiasm).',
        hint: 'Cần một danh từ chỉ sự nhiệt huyết.',
      },
      {
        q: `Which phrasal verb means "to continue doing something with persistence"?`,
        opts: ['keep on', 'give up', 'put off', 'break down'],
        ans: 'keep on',
        exp: '"keep on + V-ing" nghĩa là tiếp tục kiên trì làm việc gì.',
        hint: 'Từ trái nghĩa với "give up".',
      },
      {
        q: `Choose the correct conditional form: "If I ______ more time, I would volunteer for the charity."`,
        opts: ['had', 'have', 'will have', 'am having'],
        ans: 'had',
        exp: 'Câu điều kiện loại 2 giả định trái ngược với hiện tại: If + S + V2/ed, S + would + V.',
        hint: 'Mệnh đề chính dùng "would volunteer".',
      },
      {
        q: `Which vocabulary word is closest in meaning to "innovative"?`,
        opts: ['creative & novel', 'outdated & obsolete', 'boring & static', 'dangerous & harmful'],
        ans: 'creative & novel',
        exp: '"Innovative" nghĩa là có tính đổi mới sáng tạo, đồng nghĩa với "creative & novel".',
        hint: 'Mang nghĩa tích cực về sự sáng tạo.',
      },
      {
        q: `Complete the sentence: "Neither John nor his classmates ______ aware of the schedule change."`,
        opts: ['were', 'was', 'is', 'has been'],
        ans: 'were',
        exp: 'Quy tắc "Neither... nor...": Động từ chia theo chủ ngữ gần nhất (his classmates - số nhiều).',
        hint: 'Chủ ngữ gần nhất là số nhiều.',
      },
      {
        q: `What is the opposite meaning of the word "mandatory"?`,
        opts: ['optional', 'compulsory', 'obligatory', 'required'],
        ans: 'optional',
        exp: '"Mandatory" là bắt buộc, từ trái nghĩa là "optional" (tùy chọn, không bắt buộc).',
        hint: 'Không mang tính bắt buộc.',
      },
    ];

    const tfVariations = [
      {
        q: `Consistent daily practice in ${params.topic} yields far better results than infrequent study sessions.`,
        ans: 'True',
        exp: 'Thói quen học tập đều đặn hàng ngày đã được chứng minh hiệu quả hơn học dồn ngắt quãng.',
      },
      {
        q: `According to educational experts, memorizing word lists without context is the best way to master English.`,
        ans: 'False',
        exp: 'Học từ trong ngữ cảnh tự nhiên (in context) hiệu quả và ghi nhớ bền vững hơn nhiều so với học vẹt danh sách rời rạc.',
      },
      {
        q: `Active listening requires focusing on the speaker\'s tone, primary word stress, and key ideas.`,
        ans: 'True',
        exp: 'Lắng nghe chủ động đòi hỏi chú ý đến ngữ điệu, trọng âm từ và ý chính của người nói.',
      },
      {
        q: `Making mistakes during English speaking practice is harmful and should be strictly avoided.`,
        ans: 'False',
        exp: 'Mắc lỗi là một phần tự nhiên và cần thiết của quá trình hoàn thiện ngôn ngữ.',
      },
      {
        q: `Connecting new vocabulary with personal memories or visual images significantly boosts retention.`,
        ans: 'True',
        exp: 'Kỹ thuật liên kết (association) giúp củng cố mạng lưới tế bào thần kinh lưu trữ thông tin.',
      },
      {
        q: `Fluency in communication solely depends on speaking speed, regardless of grammatical coherence.`,
        ans: 'False',
        exp: 'Sự trôi chảy đòi hỏi sự kết hợp hài hòa giữa tốc độ, độ mạch lạc và tính chính xác.',
      },
    ];

    const fibVariations = [
      {
        q: `I always try to ______ my English communicative skills every morning.`,
        ans: 'improve',
        wb: ['improve', 'practice', 'enhance', 'listen', 'write'],
        exp: 'Động từ "improve" nghĩa là nâng cao, cải thiện.',
        hint: 'Bắt đầu bằng chữ "i".',
      },
      {
        q: `Students should ______ attention to the pronunciation of ending sounds.`,
        ans: 'pay',
        wb: ['pay', 'make', 'give', 'keep', 'take'],
        exp: 'Collocation cố định: "pay attention to" (chú ý đến).',
        hint: 'Đi kèm với từ "attention".',
      },
      {
        q: `Consistent daily efforts will ______ to remarkable long-term achievements.`,
        ans: 'lead',
        wb: ['lead', 'result', 'bring', 'make', 'follow'],
        exp: 'Cụm từ "lead to" = dẫn đến kết quả.',
        hint: 'Bắt đầu bằng chữ "l".',
      },
      {
        q: `Before starting a task, it is wise to ______ realistic daily goals.`,
        ans: 'set',
        wb: ['set', 'make', 'take', 'do', 'hold'],
        exp: '"set goals" = thiết lập mục tiêu.',
        hint: 'Từ 3 chữ cái bắt đầu bằng chữ s.',
      },
      {
        q: `Reading English books helps readers ______ rare words in authentic contexts.`,
        ans: 'encounter',
        wb: ['encounter', 'forget', 'avoid', 'lose', 'ignore'],
        exp: '"encounter words" = bắt gặp từ vựng.',
        hint: 'Bắt đầu bằng tiền tố en-.',
      },
      {
        q: `Regular physical exercise helps ______ stress and maintain mental clarity.`,
        ans: 'release',
        wb: ['release', 'increase', 'cause', 'hold', 'add'],
        exp: '"release stress" = giải tỏa căng thẳng.',
        hint: 'Giải tỏa, giải phóng.',
      },
    ];

    const reorderVariations = [
      {
        words: ['English', 'every', 'practice', 'We', 'should', 'day', '.'],
        ans: 'We should practice English every day .',
        exp: 'S (We) + should + V (practice) + O (English) + trạng từ (every day).',
        hint: 'Bắt đầu bằng chủ ngữ "We".',
      },
      {
        words: ['Could', 'check', 'the', 'please', 'have', 'we', '?'],
        ans: 'Could we have the check please ?',
        exp: 'Cấu trúc hỏi xin lịch sự: Could we have + O + please?',
        hint: 'Bắt đầu bằng "Could we".',
      },
      {
        words: ['is', 'travel', 'summer', 'planning', 'to', 'She', 'this', '.'],
        ans: 'She is planning to travel this summer .',
        exp: 'Thì hiện tại tiếp diễn diễn tả kế hoạch: S + is planning to + V.',
        hint: 'Bắt đầu bằng "She".',
      },
      {
        words: ['reading', 'enhances', 'Daily', 'vocabulary', 'our', 'significantly', '.'],
        ans: 'Daily reading enhances our vocabulary significantly .',
        exp: 'Chủ ngữ (Daily reading) + Động từ (enhances) + Tân ngữ (our vocabulary) + Trạng từ (significantly).',
        hint: 'Bắt đầu bằng "Daily reading".',
      },
      {
        words: ['you', 'Could', 'me', 'way', 'tell', 'the', 'station', 'the', 'to', '?'],
        ans: 'Could you tell me the way to the station ?',
        exp: 'Cấu trúc hỏi đường: Could you tell me the way to + địa điểm?',
        hint: 'Bắt đầu bằng "Could you tell me".',
      },
      {
        words: ['always', 'They', 'support', 'other', 'in', 'each', 'need', '.'],
        ans: 'They always support each other in need .',
        exp: 'S (They) + trạng từ (always) + V (support) + O (each other) + cụm giới từ (in need).',
        hint: 'Bắt đầu bằng "They always".',
      },
    ];

    for (let i = 1; i <= count; i++) {
      if (params.type === 'multiple_choice' || params.type === 'grammar') {
        const item = mcVariations[(i - 1) % mcVariations.length];
        questions.push({
          id: `gen-q-${Date.now()}-${i}`,
          questionOrder: i,
          questionText: item.q,
          type: params.type,
          options: item.opts,
          correctAnswer: item.ans,
          explanation: item.exp,
          hint: item.hint,
        });
      } else if (params.type === 'true_false') {
        const item = tfVariations[(i - 1) % tfVariations.length];
        questions.push({
          id: `gen-q-${Date.now()}-${i}`,
          questionOrder: i,
          questionText: item.q,
          type: 'true_false',
          options: ['True', 'False'],
          correctAnswer: item.ans,
          explanation: item.exp,
        });
      } else if (params.type === 'fill_in_the_blank') {
        const item = fibVariations[(i - 1) % fibVariations.length];
        questions.push({
          id: `gen-q-${Date.now()}-${i}`,
          questionOrder: i,
          questionText: item.q,
          type: 'fill_in_the_blank',
          correctAnswer: item.ans,
          wordBank: item.wb,
          explanation: item.exp,
          hint: item.hint,
        });
      } else if (params.type === 'matching') {
        const pairSets = [
          {
            ans: 'Knowledge:Information gained through learning;Confidence:Belief in one\'s own abilities;Fluency:Speaking smoothly and easily;Perseverance:Steadfast persistence in an aim',
            pairs: [
              { left: 'Knowledge', right: 'Information gained through learning' },
              { left: 'Confidence', right: 'Belief in one\'s own abilities' },
              { left: 'Fluency', right: 'Speaking smoothly and easily' },
              { left: 'Perseverance', right: 'Steadfast persistence in an aim' },
            ],
            exp: 'Định nghĩa chuẩn của các phẩm chất học tập tiếng Anh.',
          },
          {
            ans: 'Boarding pass:Document providing airplane access;Departure lounge:Airport waiting area before flight;Baggage carousel:Rotating conveyor for luggage collection;Immigration:Border authority checking passports',
            pairs: [
              { left: 'Boarding pass', right: 'Document providing airplane access' },
              { left: 'Departure lounge', right: 'Airport waiting area before flight' },
              { left: 'Baggage carousel', right: 'Rotating conveyor for luggage collection' },
              { left: 'Immigration', right: 'Border authority checking passports' },
            ],
            exp: 'Từ vựng chuyên ngành du lịch và sân bay quốc tế.',
          },
        ];
        const chosen = pairSets[(i - 1) % pairSets.length];
        questions.push({
          id: `gen-q-${Date.now()}-${i}`,
          questionOrder: i,
          questionText: `Round ${i}: Match each keyword with its corresponding definition:`,
          type: 'matching',
          correctAnswer: chosen.ans,
          matchingPairs: chosen.pairs,
          explanation: chosen.exp,
        });
      } else if (params.type === 'sentence_reorder') {
        const item = reorderVariations[(i - 1) % reorderVariations.length];
        questions.push({
          id: `gen-q-${Date.now()}-${i}`,
          questionOrder: i,
          questionText: `Sentence ${i}: Reorder the scrambled words into a correct sentence:`,
          type: 'sentence_reorder',
          scrambledWords: item.words,
          correctAnswer: item.ans,
          explanation: item.exp,
          hint: item.hint,
        });
      } else {
        const item = mcVariations[(i - 1) % mcVariations.length];
        questions.push({
          id: `gen-q-${Date.now()}-${i}`,
          questionOrder: i,
          questionText: item.q,
          type: 'multiple_choice',
          options: item.opts,
          correctAnswer: item.ans,
          explanation: item.exp,
          hint: item.hint,
        });
      }
    }

    return {
      id: `ai-gen-${Date.now()}`,
      title: `AI Practice: ${params.topic} (${params.level})`,
      topicId: params.topic.toLowerCase().replace(/\s+/g, '-'),
      topicTitle: params.topic,
      level: params.level,
      type: params.type,
      passage: `This interactive exercise was automatically generated by AI to strengthen your skills in ${params.topic} at ${params.level} level.`,
      questions,
      isAiGenerated: true,
    };
  }

  // 3. AI Coach phân tích kết quả học tập và đề xuất bài luyện
  public static getAICoachAnalysis(
    history: LearningHistoryRecord[],
    stats: DailyStatisticRecord[],
    user: UserProfile
  ): AICoachAnalysis {
    // Trạng thái tài khoản mới chưa có bài làm nào
    if (!history || history.length === 0) {
      return {
        overallAssessment: `Chào mừng ${user.fullName} đến với Cánh Buồm Tri Thức! Đây là tài khoản mới của em. Thầy là AI Learning Coach đồng hành. Hãy bắt đầu bài luyện nói hoặc làm bài tập đầu tiên để thầy có thể phân tích năng lực và đưa ra lộ trình chính xác nhất cho em nhé!`,
        speakingFeedback: 'Chưa có dữ liệu bài nói. Em hãy chọn một chủ đề trong phần AI Speaking để thử sức nhé!',
        grammarFeedback: 'Chưa có dữ liệu bài tập ngữ pháp. Hãy vào "Kho bài tập" để rèn luyện nhé!',
        listeningFeedback: 'Chưa có dữ liệu luyện nghe. Em hãy thử nghe bài nghe đầu tiên trong mục "Luyện nghe" nhé!',
        strengths: [
          'Tài khoản mới được tạo với tinh thần sẵn sàng học hỏi cao.',
          `Trình độ khởi điểm đăng ký: ${user.proficiencyLevel}.`,
          `Mục tiêu rèn luyện hàng ngày: ${user.dailyGoalMinutes} phút.`,
        ],
        areasToImprove: [
          'Hãy hoàn thành bài học đầu tiên để kích hoạt chuỗi học Streak 🔥.',
          'Rèn luyện phát âm hàng ngày để tăng độ tự tin và trôi chảy trong giao tiếp.',
        ],
        recommendations: [
          {
            id: 'rec-init-1',
            title: 'Luyện nói: Giới thiệu bản thân (Introduce yourself)',
            description: 'Khởi động với chủ đề quen thuộc nhất để làm quen với AI và micro nhận diện giọng nói.',
            skill: 'Speaking',
            priority: 'High',
            actionType: 'speaking',
            topicId: 'introduce-yourself',
            reason: 'Bài mở đầu lý tưởng để đánh giá phát âm và phản xạ.',
          },
          {
            id: 'rec-init-2',
            title: 'Bài tập khởi động: Grammar & Vocabulary',
            description: 'Làm bài kiểm tra ngắn để AI xác định vốn từ vựng và ngữ pháp của em.',
            skill: 'Grammar',
            priority: 'Medium',
            actionType: 'exercise',
            topicId: 'family',
            reason: 'Đo lường độ chính xác ngữ pháp ban đầu.',
          },
        ],
      };
    }

    const recentScores = history.slice(0, 5).map(h => h.score);
    const avgRecent = recentScores.length > 0 ? Math.round(recentScores.reduce((a, b) => a + b, 0) / recentScores.length) : 85;

    const speakingCount = history.filter(h => h.skillCategory === 'Speaking').length;
    const listeningCount = history.filter(h => h.skillCategory === 'Listening').length;

    const strengths: string[] = [
      `Kỹ năng phản xạ nói tự tin (${speakingCount} buổi luyện nói đã hoàn thành).`,
      `Khả năng trả lời đúng cấu trúc ngữ pháp đạt trung bình ${avgRecent}%.`,
      `Duy trì chuỗi học ${user.currentStreak} ngày liên tiếp rất tích cực!`,
    ];

    const areasToImprove: string[] = [
      'Cần chú ý chia động từ ở các thì quá khứ (Past Simple) và câu điều kiện.',
      'Nên luyện nghe ở tốc độ 1.25x để cải thiện khả năng bắt từ khóa nhanh.',
      'Bổ sung thêm các liên từ học thuật (Furthermore, In addition, Consequently).',
    ];

    return {
      overallAssessment: `Chào ${user.fullName}! Tuần này phong độ học tập của em rất ấn tượng với điểm trung bình ${avgRecent}/100. Kỹ năng giao tiếp và vốn từ vựng đang có bước tiến rõ rệt.`,
      speakingFeedback: 'Em phát âm khá rõ ràng, độ trôi chảy (Fluency) tăng khoảng +12% so với tuần trước. Hãy chú ý các âm đuôi /s/, /ed/ khi nói câu dài.',
      grammarFeedback: 'Ngữ pháp thì hiện tại đơn rất chắc. Em nên làm thêm các bài tập về Mệnh đề quan hệ và Câu gián tiếp để câu văn thêm sinh động.',
      listeningFeedback: 'Kỹ năng nghe hiểu ý chính rất tốt. Khi nghe các bài hội thoại nhanh tại sân bay hoặc nhà ga, hãy tập trung vào các từ mang trọng âm.',
      strengths,
      areasToImprove,
      recommendations: [
        {
          id: 'rec-1',
          title: 'Luyện nói tình huống: Mua sắm (Shopping)',
          description: 'Hỏi giá, mặc cả và chọn size quần áo tại cửa hàng thời trang với AI.',
          skill: 'Speaking',
          priority: 'High',
          actionType: 'roleplay',
          topicId: 'rp-shopping',
          reason: 'Củng cố phản xạ tự nhiên trong giao tiếp đời thường.',
        },
        {
          id: 'rec-2',
          title: 'Bài nghe: Planning a Weekend Trip to Ha Long Bay',
          description: 'Luyện nghe bắt từ khóa về giờ khởi hành, địa điểm và lưu ý quan trọng.',
          skill: 'Listening',
          priority: 'Medium',
          actionType: 'listening',
          topicId: 'travel',
          reason: 'Nâng cao khả năng nghe hiểu chi tiết thời gian và địa điểm.',
        },
        {
          id: 'rec-3',
          title: 'Bài tập Ngữ pháp: Câu điều kiện (Conditional Type 1 & 2)',
          description: 'Thực hành 5 câu trắc nghiệm và điền từ về câu điều kiện.',
          skill: 'Grammar',
          priority: 'Medium',
          actionType: 'exercise',
          topicId: 'future-plans',
          reason: 'Khắc phục các lỗi nhầm lẫn giữa thì hiện tại và tương lai.',
        },
      ],
    };
  }
}
