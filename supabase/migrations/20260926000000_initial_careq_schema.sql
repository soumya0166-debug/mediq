-- ==============================================================================
-- CAREQ / MEDIQ - Supabase PostgreSQL Schema Migration
-- Project: slqfsqfsrrjnczrfxskc.supabase.co
-- Features: Assessments, OCR Reports, Biomarkers, Posology, RLS, Audit Logging
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Patients Table
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id VARCHAR(64) UNIQUE NOT NULL, -- e.g. PAT-2026-00124
    name VARCHAR(255) NOT NULL,
    dob DATE,
    age INT,
    gender VARCHAR(32),
    phone VARCHAR(32),
    email VARCHAR(255),
    preferred_language VARCHAR(32) DEFAULT 'English',
    demo_aadhaar_last4 VARCHAR(4),
    abha_number VARCHAR(64),
    address TEXT,
    emergency_contact TEXT,
    assigned_facility VARCHAR(255),
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Healthcare Professionals Table
CREATE TABLE IF NOT EXISTS public.professionals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id VARCHAR(64) UNIQUE NOT NULL, -- e.g. PROF-DEMO-00451
    name VARCHAR(255) NOT NULL,
    title VARCHAR(128) DEFAULT 'Medical Officer',
    facility_id VARCHAR(64),
    facility_name VARCHAR(255),
    medical_registration_id VARCHAR(64),
    state VARCHAR(64),
    email VARCHAR(255),
    phone VARCHAR(32),
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Clinical Assessments & Triage Cases
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id VARCHAR(64) UNIQUE NOT NULL, -- e.g. ASM-2026-0001
    patient_id VARCHAR(64) REFERENCES public.patients(patient_id) ON DELETE CASCADE,
    patient_name VARCHAR(255) NOT NULL,
    chief_complaint TEXT NOT NULL,
    symptoms JSONB DEFAULT '[]'::jsonb,
    vitals JSONB DEFAULT '{}'::jsonb,
    triage_priority VARCHAR(32) NOT NULL DEFAULT 'ROUTINE', -- CRITICAL, HIGH, MODERATE, ROUTINE
    triage_score INT DEFAULT 1,
    ai_summary TEXT,
    red_flag_warnings JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(64) DEFAULT 'PENDING_REVIEW', -- PENDING_REVIEW, IN_REVIEW, COMPLETED, REFERRED
    assigned_doctor_id VARCHAR(64),
    assigned_facility_id VARCHAR(64),
    voice_transcript TEXT,
    language_used VARCHAR(32) DEFAULT 'English',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Uploaded Medical Documents & Diagnostic Reports
CREATE TABLE IF NOT EXISTS public.medical_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id VARCHAR(64) UNIQUE NOT NULL,
    patient_id VARCHAR(64) REFERENCES public.patients(patient_id) ON DELETE CASCADE,
    assessment_id VARCHAR(64) REFERENCES public.assessments(assessment_id) ON DELETE SET NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT,
    mime_type VARCHAR(128),
    file_url TEXT,
    document_category VARCHAR(64) DEFAULT 'LAB_REPORT', -- LAB_REPORT, PRESCRIPTION, DISCHARGE_SUMMARY, IMAGING
    ocr_raw_text TEXT,
    extracted_parameters JSONB DEFAULT '[]'::jsonb,
    extracted_medications JSONB DEFAULT '[]'::jsonb,
    processing_status VARCHAR(64) DEFAULT 'COMPLETED', -- PENDING, PROCESSING, COMPLETED, FAILED
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Structured Lab Biomarkers (Extracted via OCR Engine)
CREATE TABLE IF NOT EXISTS public.extracted_biomarkers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id VARCHAR(64) REFERENCES public.medical_reports(report_id) ON DELETE CASCADE,
    patient_id VARCHAR(64) REFERENCES public.patients(patient_id) ON DELETE CASCADE,
    parameter_name VARCHAR(128) NOT NULL, -- e.g. Hemoglobin, Fasting Blood Glucose, Creatinine
    measured_value VARCHAR(64) NOT NULL,
    unit VARCHAR(64),
    reference_range VARCHAR(128),
    status VARCHAR(32) DEFAULT 'Normal', -- 'Normal' or 'Outside Limits'
    confidence_score NUMERIC(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Structured Prescription Posology & Medications
CREATE TABLE IF NOT EXISTS public.extracted_medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id VARCHAR(64) REFERENCES public.medical_reports(report_id) ON DELETE CASCADE,
    patient_id VARCHAR(64) REFERENCES public.patients(patient_id) ON DELETE CASCADE,
    medicine_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(128),
    frequency VARCHAR(128), -- e.g. 1-0-1, OD, BD, TDS
    duration VARCHAR(128),  -- e.g. 5 days, 1 month
    instructions TEXT,      -- e.g. After meals
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Clinical Audit Trail & Event Logging
CREATE TABLE IF NOT EXISTS public.audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(64) NOT NULL,
    actor_id VARCHAR(64) NOT NULL,
    actor_role VARCHAR(64) NOT NULL,
    target_resource VARCHAR(128),
    resource_id VARCHAR(64),
    action VARCHAR(64) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(64),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Patient Consent Records (ABDM / CAREQ compliant)
CREATE TABLE IF NOT EXISTS public.patient_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id VARCHAR(64) REFERENCES public.patients(patient_id) ON DELETE CASCADE,
    consent_symptoms BOOLEAN DEFAULT TRUE,
    consent_reports BOOLEAN DEFAULT TRUE,
    consent_voice_transcript BOOLEAN DEFAULT TRUE,
    consent_translation BOOLEAN DEFAULT TRUE,
    consent_previous_assessments BOOLEAN DEFAULT FALSE,
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    revoked BOOLEAN DEFAULT FALSE
);

-- 10. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_patients_patient_id ON public.patients(patient_id);
CREATE INDEX IF NOT EXISTS idx_assessments_patient_id ON public.assessments(patient_id);
CREATE INDEX IF NOT EXISTS idx_assessments_priority ON public.assessments(triage_priority);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON public.assessments(status);
CREATE INDEX IF NOT EXISTS idx_reports_patient ON public.medical_reports(patient_id);
CREATE INDEX IF NOT EXISTS idx_reports_assessment ON public.medical_reports(assessment_id);
CREATE INDEX IF NOT EXISTS idx_biomarkers_report ON public.extracted_biomarkers(report_id);
CREATE INDEX IF NOT EXISTS idx_medications_report ON public.extracted_medications(report_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON public.audit_events(timestamp DESC);

-- 11. Row-Level Security (RLS) Configuration
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extracted_biomarkers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extracted_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_consents ENABLE ROW LEVEL SECURITY;

-- Development / Demo policies: Allow authenticated & anon access for app operations
CREATE POLICY "Allow public read access for patients" ON public.patients FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update for patients" ON public.patients FOR ALL USING (true);

CREATE POLICY "Allow public read access for professionals" ON public.professionals FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update for professionals" ON public.professionals FOR ALL USING (true);

CREATE POLICY "Allow public read access for assessments" ON public.assessments FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update for assessments" ON public.assessments FOR ALL USING (true);

CREATE POLICY "Allow public read access for reports" ON public.medical_reports FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update for reports" ON public.medical_reports FOR ALL USING (true);

CREATE POLICY "Allow public read access for biomarkers" ON public.extracted_biomarkers FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update for biomarkers" ON public.extracted_biomarkers FOR ALL USING (true);

CREATE POLICY "Allow public read access for medications" ON public.extracted_medications FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update for medications" ON public.extracted_medications FOR ALL USING (true);

CREATE POLICY "Allow public read/insert for audit_events" ON public.audit_events FOR ALL USING (true);
CREATE POLICY "Allow public read/insert for consents" ON public.patient_consents FOR ALL USING (true);
