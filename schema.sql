-- ====================================================================
-- CƠ SỞ DỮ LIỆU CÁNH BUỒM TRI THỨC - NỀN TẢNG HỌC TIẾNG ANH CHO HỌC SINH
-- PostgreSQL / Supabase Compatible Schema
-- ====================================================================

-- 1. BẢNG USERS (Học sinh & Người dùng)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    grade_level VARCHAR(50) DEFAULT 'Grade 9',
    proficiency_level VARCHAR(20) DEFAULT 'Intermediate', -- Beginner, Intermediate, Advanced
    daily_goal_minutes INT DEFAULT 30,
    daily_goal_score INT DEFAULT 85,
    current_streak INT DEFAULT 1,
    longest_streak INT DEFAULT 1,
    total_xp INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. BẢNG TOPICS (Chủ đề học tập)
CREATE TABLE IF NOT EXISTS topics (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    title_vi VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'BookOpen',
    category VARCHAR(50) DEFAULT 'General', -- Daily Life, Travel, Academic, Work
    difficulty_levels JSONB DEFAULT '["Beginner", "Intermediate", "Advanced"]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. BẢNG EXERCISES (Bộ bài tập)
CREATE TABLE IF NOT EXISTS exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id VARCHAR(50) REFERENCES topics(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    level VARCHAR(20) NOT NULL, -- Beginner, Intermediate, Advanced
    type VARCHAR(50) NOT NULL,  -- Multiple Choice, True/False, Fill in the Blank, Matching, Sentence Reordering, Vocabulary, Grammar, Reading, Listening, Speaking
    passage TEXT,               -- Cho bài Reading hoặc Cloze
    audio_url TEXT,             -- Cho bài Listening
    transcript TEXT,            -- Transcript bài nghe
    total_questions INT DEFAULT 5,
    is_ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. BẢNG QUESTIONS (Chi tiết từng câu hỏi trong bài tập)
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
    question_order INT NOT NULL,
    question_text TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    options JSONB,              -- Danh sách lựa chọn ["A", "B", "C", "D"] hoặc cặp matching
    correct_answer TEXT NOT NULL,
    explanation TEXT,           -- Lời giải thích chi tiết
    hint TEXT,
    word_bank JSONB,            -- Danh sách từ gợi ý cho điền từ
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. BẢNG EXERCISE_RESULTS (Kết quả từng lần làm bài tập)
CREATE TABLE IF NOT EXISTS exercise_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES exercises(id) ON DELETE SET NULL,
    topic_id VARCHAR(50) REFERENCES topics(id) ON DELETE SET NULL,
    exercise_type VARCHAR(50) NOT NULL,
    level VARCHAR(20) NOT NULL,
    score NUMERIC(5, 2) NOT NULL, -- Điểm thang 0-100
    correct_count INT NOT NULL,
    incorrect_count INT NOT NULL,
    total_questions INT NOT NULL,
    duration_seconds INT NOT NULL,
    detailed_answers JSONB,       -- Chi tiết: câu hỏi, câu trả lời của học sinh, đáp án đúng, giải thích
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. BẢNG SPEAKING_SESSIONS (Phiên luyện nói với AI)
CREATE TABLE IF NOT EXISTS speaking_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    topic_id VARCHAR(50) REFERENCES topics(id) ON DELETE SET NULL,
    mode VARCHAR(30) DEFAULT 'free_talk', -- free_talk, role_play
    role_play_scenario VARCHAR(100),      -- restaurant, airport, shopping, directions, etc.
    level VARCHAR(20) NOT NULL,
    duration_seconds INT DEFAULT 0,
    turns_count INT DEFAULT 0,
    overall_score NUMERIC(5, 2) DEFAULT 0,
    pronunciation_score NUMERIC(5, 2) DEFAULT 0,
    grammar_score NUMERIC(5, 2) DEFAULT 0,
    vocabulary_score NUMERIC(5, 2) DEFAULT 0,
    fluency_score NUMERIC(5, 2) DEFAULT 0,
    relevance_score NUMERIC(5, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. BẢNG SPEAKING_FEEDBACK (Đánh giá chi tiết từng lượt nói)
CREATE TABLE IF NOT EXISTS speaking_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES speaking_sessions(id) ON DELETE CASCADE,
    turn_number INT NOT NULL,
    ai_prompt TEXT NOT NULL,
    student_speech TEXT NOT NULL,
    pronunciation_score NUMERIC(5, 2),
    grammar_score NUMERIC(5, 2),
    vocabulary_score NUMERIC(5, 2),
    fluency_score NUMERIC(5, 2),
    relevance_score NUMERIC(5, 2),
    errors_detected JSONB,         -- Danh sách lỗi phát hiện
    corrected_sentence TEXT,       -- Câu sửa đúng ngữ pháp
    better_expression TEXT,        -- Cách diễn đạt tự nhiên hơn
    recommended_vocab JSONB,       -- Từ vựng nâng cao nên dùng
    pronunciation_tips TEXT,       -- Mẹo phát âm
    overall_score NUMERIC(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. BẢNG LEARNING_HISTORY (Lịch sử học tập tổng hợp của học sinh)
CREATE TABLE IF NOT EXISTS learning_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- Speaking, RolePlay, Exercise, Listening, Reading, FillBlank
    topic_id VARCHAR(50) REFERENCES topics(id) ON DELETE SET NULL,
    topic_title VARCHAR(100) NOT NULL,
    score NUMERIC(5, 2) NOT NULL,
    duration_seconds INT NOT NULL,
    skill_category VARCHAR(30) NOT NULL, -- Speaking, Listening, Reading, Grammar, Vocabulary
    details_summary TEXT,
    reference_id UUID,                  -- ID bài tập hoặc session luyện nói
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. BẢNG DAILY_STATISTICS (Thống kê kết quả học theo ngày)
CREATE TABLE IF NOT EXISTS daily_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    study_date DATE NOT NULL,
    total_minutes INT DEFAULT 0,
    completed_lessons INT DEFAULT 0,
    average_score NUMERIC(5, 2) DEFAULT 0,
    speaking_score NUMERIC(5, 2) DEFAULT 0,
    listening_score NUMERIC(5, 2) DEFAULT 0,
    reading_score NUMERIC(5, 2) DEFAULT 0,
    grammar_score NUMERIC(5, 2) DEFAULT 0,
    vocabulary_score NUMERIC(5, 2) DEFAULT 0,
    correct_answers INT DEFAULT 0,
    incorrect_answers INT DEFAULT 0,
    speaking_sessions_count INT DEFAULT 0,
    listening_lessons_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_daily_stat UNIQUE (user_id, study_date)
);

-- INDEXES CHO TRUY VẤN TỐC ĐỘ CAO
CREATE INDEX IF NOT EXISTS idx_history_user_date ON learning_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_history_skill ON learning_history(skill_category);
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_statistics(user_id, study_date DESC);
CREATE INDEX IF NOT EXISTS idx_exercise_results_user ON exercise_results(user_id, created_at DESC);
