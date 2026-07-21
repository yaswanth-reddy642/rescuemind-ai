-- PostgreSQL / Supabase Schema for RescueMind AI

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    blood_group VARCHAR(10),
    allergies TEXT,
    chronic_conditions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    relationship VARCHAR(100),
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS triage_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    symptoms JSONB DEFAULT '[]',
    injury_type VARCHAR(255),
    pulse INT NOT NULL,
    breathing_rate INT NOT NULL,
    consciousness VARCHAR(50) NOT NULL,
    bleeding_level VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    survival_risk_percent NUMERIC(5, 2) NOT NULL,
    confidence_score NUMERIC(5, 2) NOT NULL,
    ambulance_required BOOLEAN DEFAULT FALSE,
    reasoning_factors JSONB DEFAULT '[]',
    first_aid_steps JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS injury_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES triage_assessments(id) ON DELETE SET NULL,
    primary_injury VARCHAR(255) NOT NULL,
    severity_level VARCHAR(100) NOT NULL,
    confidence_percent NUMERIC(5, 2) NOT NULL,
    image_url TEXT,
    annotated_image_url TEXT,
    all_detections JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sos_dispatches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    lat NUMERIC(10, 6) NOT NULL,
    lng NUMERIC(10, 6) NOT NULL,
    address TEXT,
    priority VARCHAR(20) NOT NULL,
    medical_summary TEXT,
    recipients_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for fast query speeds
CREATE INDEX IF NOT EXISTS idx_triage_priority ON triage_assessments(priority);
CREATE INDEX IF NOT EXISTS idx_triage_created_at ON triage_assessments(created_at);
CREATE INDEX IF NOT EXISTS idx_sos_created_at ON sos_dispatches(created_at);
