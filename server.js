import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const RAW_API_KEY = (process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || '').trim();
const isPlaceholder = !RAW_API_KEY || RAW_API_KEY.startsWith('sk-your');
const isGemini = !isPlaceholder && (RAW_API_KEY.startsWith('AQ.') || RAW_API_KEY.startsWith('AIza') || !!process.env.GEMINI_API_KEY);

function getAIConfig() {
  if (isPlaceholder) {
    return { provider: 'None', url: '', model: '', isAvailable: false };
  }
  if (isGemini) {
    const geminiModel = process.env.GEMINI_MODEL || 
      (process.env.OPENAI_MODEL && !process.env.OPENAI_MODEL.startsWith('gpt-') ? process.env.OPENAI_MODEL : 'gemini-3.5-flash');
    return {
      provider: 'Google Gemini',
      url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
      model: geminiModel,
      isAvailable: true,
    };
  }
  return {
    provider: 'OpenAI',
    url: 'https://api.openai.com/v1/chat/completions',
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    isAvailable: true,
  };
}

app.use(cors());
app.use(express.json());

// Helper để gọi AI (Hỗ trợ cả Google Gemini API và OpenAI API)
async function callOpenAI(messages, responseFormat = null) {
  const { provider, url, model, isAvailable } = getAIConfig();
  if (!isAvailable) {
    return null;
  }

  try {
    const payload = {
      model,
      messages,
      temperature: 0.7,
    };
    if (responseFormat === 'json') {
      payload.response_format = { type: 'json_object' };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RAW_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`${provider} API Error (${response.status}):`, errText);
      return null;
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || null;
    if (content && typeof content === 'string') {
      // Làm sạch khối code markdown như ```json ... ```
      content = content.trim();
      if (content.startsWith('```json')) {
        content = content.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
      } else if (content.startsWith('```')) {
        content = content.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
      }
    }
    return content;
  } catch (err) {
    console.error(`Network error calling ${provider}:`, err);
    return null;
  }
}

// 1. Health check
app.get('/api/health', (req, res) => {
  const { provider, model, isAvailable } = getAIConfig();
  res.json({
    status: 'ok',
    mode: isAvailable ? `${provider.toUpperCase().replace(/\s+/g, '_')}_ACTIVE` : 'MOCK_AI_READY',
    provider: isAvailable ? `${provider} (${model})` : 'Smart Mock Engine',
    timestamp: new Date().toISOString(),
  });
});

// 2. Luyện nói với AI (AI Speaking & Roleplay Turn)
app.post('/api/chat-speaking', async (req, res) => {
  const { topic, level, history, studentSpeech, rolePlayScenario } = req.body;

  const systemPrompt = `You are an English conversation partner and language coach for a Vietnamese student learning English at level ${level}.
Topic: ${topic}.
${rolePlayScenario ? `Scenario: ${rolePlayScenario}. Play your character realistically and naturally.` : 'Act as a friendly interlocutor.'}
Respond with a JSON object containing:
- "aiReply": A natural, engaging conversational response in English (1-2 sentences) and a follow-up question to keep the student talking.
- "feedback": {
    "pronunciationScore": number 0-100,
    "grammarScore": number 0-100,
    "vocabularyScore": number 0-100,
    "fluencyScore": number 0-100,
    "relevanceScore": number 0-100,
    "overallScore": number 0-100,
    "studentSentence": "${studentSpeech || ''}",
    "errors": [string explanation of mistakes, if any],
    "correctedSentence": string (correct grammar),
    "betterExpression": string (more natural native phrasing),
    "recommendedVocab": [array of 2-3 useful words/phrases],
    "pronunciationTips": string (phonetic tip or intonation guide)
}`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...(history || []).map(h => ({ role: h.sender === 'ai' ? 'assistant' : 'user', content: h.text })),
    { role: 'user', content: studentSpeech || 'Hello!' }
  ];

  const aiResult = await callOpenAI(messages, 'json');

  if (aiResult) {
    try {
      const parsed = JSON.parse(aiResult);
      return res.json(parsed);
    } catch {
      // Fallback
    }
  }

  // MOCK AI FALLBACK KHI CHƯA CÓ API KEY HOẶC LỖI MẠNG
  const mockResponses = [
    {
      aiReply: `That's great! Talking about ${topic} is always exciting. Could you tell me more about what you enjoy most about it?`,
      feedback: {
        pronunciationScore: 88,
        grammarScore: 85,
        vocabularyScore: 82,
        fluencyScore: 86,
        relevanceScore: 92,
        overallScore: 87,
        studentSentence: studentSpeech || "I like studying English every day.",
        errors: studentSpeech ? [] : ["Remember to use full complete sentences."],
        correctedSentence: studentSpeech ? studentSpeech : "I enjoy studying English every day because it helps me communicate.",
        betterExpression: "I'm really keen on practicing English on a daily basis.",
        recommendedVocab: ["enthusiastic", "daily routine", "enrich"],
        pronunciationTips: "Focus on the ending sound /s/ in words like 'practices' and 'always'."
      }
    },
    {
      aiReply: `I see! That makes a lot of sense. How does this compare with your typical experience at school or with friends?`,
      feedback: {
        pronunciationScore: 91,
        grammarScore: 89,
        vocabularyScore: 88,
        fluencyScore: 90,
        relevanceScore: 95,
        overallScore: 91,
        studentSentence: studentSpeech || "My family usually visits our grandparents on Sunday.",
        errors: [],
        correctedSentence: studentSpeech || "My family usually visits our grandparents on Sundays.",
        betterExpression: "We make it a point to gather with our grandparents every Sunday.",
        recommendedVocab: ["quality time", "cherish", "reunion"],
        pronunciationTips: "Link the sound between 'visits' and 'our' smoothly: /vɪzɪts aʊər/."
      }
    }
  ];

  const randomFallback = mockResponses[Math.floor(Math.random() * mockResponses.length)];
  res.json(randomFallback);
});

// 3. AI Sinh bài tập mới (Exercise Generator)
app.post('/api/generate-exercise', async (req, res) => {
  const { topic, level, type, count = 5 } = req.body;

  const systemPrompt = `Create a high quality English exercise for students.
Topic: ${topic}
Level: ${level}
Exercise Type: ${type}
Number of questions: ${count}
Format as JSON:
{
  "title": string,
  "passage": string (if reading/listening/fill blanks),
  "questions": [
    {
      "id": "q1",
      "questionOrder": 1,
      "questionText": string,
      "type": "${type}",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": string,
      "explanation": string (explain why in Vietnamese/English for students),
      "hint": string
    }
  ]
}`;

  const aiResult = await callOpenAI([{ role: 'system', content: systemPrompt }], 'json');

  if (aiResult) {
    try {
      const parsed = JSON.parse(aiResult);
      return res.json(parsed);
    } catch {}
  }

  // MOCK FALLBACK CHO BÀI TẬP
  res.json({
    title: `AI Generated Practice: ${topic} (${level})`,
    passage: `Learning about ${topic} helps students expand their communicative competence and build practical confidence.`,
    questions: [
      {
        id: `gen-${Date.now()}-1`,
        questionOrder: 1,
        questionText: `Which sentence is the most appropriate way to express opinion about ${topic}?`,
        type: type,
        options: [
          `In my perspective, ${topic} plays a vital role.`,
          `Me think ${topic} is good.`,
          `I am agree with this topic.`,
          `Because ${topic} so I like.`
        ],
        correctAnswer: `In my perspective, ${topic} plays a vital role.`,
        explanation: "'In my perspective' là cụm từ học thuật tự nhiên để diễn đạt quan điểm cá nhân.",
        hint: "Chú ý cấu trúc ngữ pháp chuẩn và từ vựng trang trọng."
      },
      {
        id: `gen-${Date.now()}-2`,
        questionOrder: 2,
        questionText: `Choose the correct word to complete: "She was very ______ about the upcoming trip."`,
        type: type,
        options: ["enthusiastic", "enthusiasm", "enthusiastically", "enthuse"],
        correctAnswer: "enthusiastic",
        explanation: "Sau động từ to be 'was' và trạng từ 'very', ta cần một tính từ (enthusiastic).",
        hint: "Xác định từ loại đứng sau to be."
      }
    ]
  });
});

// Phục vụ frontend build tĩnh trong thư mục dist
app.use(express.static(path.join(__dirname, 'dist')));

// SPA Fallback: Mọi request GET không phải /api đều trả về index.html
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
  next();
});

app.listen(PORT, () => {
  const { provider, model, isAvailable } = getAIConfig();
  console.log(`EduSpeak AI Server running on port ${PORT}`);
  console.log(`AI Engine: ${isAvailable ? `Connected to ${provider} (${model})` : 'Mock AI Mode enabled'}`);
});
