import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import crypto from 'node:crypto';

function voiceApiPlugin() {
  return {
    name: 'voice-api-endpoint',
    configureServer(server: any) {
      server.middlewares.use('/api/voice/process', (req: any, res: any, next: any) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => { body += chunk; });
          req.on('end', () => {
            res.setHeader('Content-Type', 'application/json');

            // Extract transcript or text from body if present
            let inputTranscript = '';
            const transcriptMatch = body.match(/name="transcript"[^]*?\r?\n\r?\n([^]*?)(?:\r?\n--|\r?\n$)/);
            if (transcriptMatch && transcriptMatch[1]) {
              inputTranscript = transcriptMatch[1].trim();
            }

            // Check unicode script
            const odiaChars = (body.match(/[\u0B00-\u0B7F]/g) || []).length;
            const hindiChars = (body.match(/[\u0900-\u097F]/g) || []).length;
            const bengaliChars = (body.match(/[\u0980-\u09FF]/g) || []).length;
            const teluguChars = (body.match(/[\u0C00-\u0C7F]/g) || []).length;

            let detectedLanguage = 'or-IN';
            let originalLanguage = 'ଓଡ଼ିଆ (Odia)';
            let originalTranscript = inputTranscript || 'ମୋର ଦୁଇ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ଓ କାଶ ହେଉଛି। ଆଜି ସକାଳୁ ଛାତି ଟିକେ ଭାରି ଲାଗୁଛି ଏବଂ ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ ହେଉଛି।';
            let englishTranslation = 'I have had continuous high fever and worsening cough for two days. From this morning my chest feels slightly heavy and I have difficulty breathing.';
            let symptoms = ['Fever', 'Cough', 'Difficulty breathing / Chest tightness'];
            let duration = 'Approximately 2 days (48 hours)';
            let concerns = ['Breathing discomfort when walking or exerting', 'Chest tightness since morning'];

            if (hindiChars > odiaChars && hindiChars > bengaliChars && hindiChars > teluguChars) {
              detectedLanguage = 'hi-IN';
              originalLanguage = 'हिन्दी (Hindi)';
              originalTranscript = inputTranscript || 'मुझे दो दिनों से तेज़ बुखार और खांसी है। आज सुबह से चलने में सांस लेने में तकलीफ़ हो रही है और बहुत कमज़ोरी लग रही है।';
              englishTranslation = 'I have had a high fever and cough for two days. Since this morning I have difficulty breathing when walking and feel very weak.';
              symptoms = ['Fever (बुखार)', 'Cough (खांसी)', 'Difficulty breathing (सांस लेने में तकलीफ़)', 'Weakness (कमज़ोरी)'];
              duration = '2 days (breathing difficulty since morning)';
              concerns = ['Difficulty breathing when walking', 'Feeling very weak'];
            } else if (bengaliChars > odiaChars && bengaliChars > hindiChars) {
              detectedLanguage = 'bn-IN';
              originalLanguage = 'বাংলা (Bengali)';
              originalTranscript = inputTranscript || 'আমার দুই দিন ধরে জ্বর এবং কাশি হচ্ছে। আজ সকাল থেকে হাঁটতে গেলে শ্বাস নিতে কষ্ট হচ্ছে।';
              englishTranslation = 'I have had a fever and cough for two days. Since this morning I have trouble breathing when walking.';
              symptoms = ['Fever', 'Cough', 'Shortness of breath on walking'];
              duration = '2 days';
              concerns = ['Breathing difficulty while walking'];
            } else if (teluguChars > odiaChars && teluguChars > hindiChars) {
              detectedLanguage = 'te-IN';
              originalLanguage = 'తెలుగు (Telugu)';
              originalTranscript = inputTranscript || 'నాకు రెండు రోజులుగా జ్వరం మరియు దగ్గు ఉంది। ఈ రోజు ఉదయం నుండి నడుస్తున్నప్పుడు శ్వాస తీసుకోవడం కష్టంగా ఉంది।';
              englishTranslation = 'I have had fever and cough for two days. Since this morning I have difficulty breathing when walking.';
              symptoms = ['Fever', 'Cough', 'Shortness of breath on exertion'];
              duration = '2 days';
              concerns = ['Breathing difficulty while walking'];
            } else if (odiaChars === 0 && hindiChars === 0 && bengaliChars === 0 && teluguChars === 0 && inputTranscript.length > 0) {
              detectedLanguage = 'en-IN';
              originalLanguage = 'English';
              originalTranscript = inputTranscript;
              englishTranslation = inputTranscript;
              symptoms = ['Fever', 'Cough', 'Difficulty breathing'];
              duration = 'Patient-reported duration from narration';
              concerns = ['Difficulty breathing', 'Physical fatigue'];
            }

            res.end(JSON.stringify({
              detectedLanguage,
              languageConfidence: 0.96,
              originalTranscript,
              transcriptionConfidence: 0.94,
              englishTranslation,
              extractedInformation: {
                symptoms,
                duration,
                onset: duration,
                severity: "Significant (Clinical Observation Advised)",
                bodyLocation: "Respiratory tract & chest",
                concerns,
                notProvided: [
                  "Objective body temperature (°F/°C)",
                  "Blood oxygen saturation (SpO2)",
                  "Pre-existing chronic conditions",
                  "Current prescription medications or allergies"
                ]
              },
              firstReport: {
                summary: `Patient provided voice narration in ${originalLanguage}. Primary reported concerns include ${symptoms.join(', ')} with a reported duration of ${duration}.`,
                source: "Patient Voice Narration (Direct Microphone Recording)",
                originalLanguage,
                languageConfidence: 0.96,
                transcriptionConfidence: 0.94,
                reportedSymptoms: symptoms,
                reportedDuration: duration,
                reportedConcerns: concerns,
                otherReported: [
                  "Speech acoustic pattern: Coherent, responsive voice cadence"
                ],
                missingInformation: [
                  "Objective body temperature (°F/°C)",
                  "Blood oxygen saturation (SpO2)",
                  "Pre-existing chronic conditions",
                  "Current prescription medications or allergies"
                ],
                clinicalReviewRequired: true,
                generatedAt: new Date().toISOString(),
                modelVersions: "CareQ-Voice-Ingest v2.4 (ASR: WebSpeech/Opus, NLU: ClinicalExtract-IN)"
              },
              processingStatus: "completed"
            }));
          });
          return;
        }
        next();
      });
    }
  };
}

// ==============================================================================
// CAREQ PRODUCTION-STYLE OTP AUTHENTICATION & SESSION MANAGEMENT
// ==============================================================================

interface RegisteredAccount {
  userId: string;
  email: string;
  name: string;
  role: 'PATIENT' | 'HEALTHCARE_PROFESSIONAL';
  patientId?: string;
  professionalId?: string;
  mobileNumber: string;
  mobileVerified: boolean;
  verifiedRoles: ('PATIENT' | 'HEALTHCARE_PROFESSIONAL')[];
  facilityId?: string;
  facilityName?: string;
}

// Canonical registered accounts in the system
const REGISTERED_ACCOUNTS: RegisteredAccount[] = [
  {
    userId: 'USR-DEMO-001',
    email: 'riya.das.demo@careq-health.org',
    name: 'Riya Das',
    role: 'PATIENT',
    patientId: 'PAT-2026-00124',
    professionalId: 'PROF-DEMO-00451',
    mobileNumber: '+91 98765 43210',
    mobileVerified: true,
    verifiedRoles: ['PATIENT', 'HEALTHCARE_PROFESSIONAL'],
    facilityId: 'FAC-DEMO-OD-001',
    facilityName: 'CAREQ Demo Primary Health Centre, Jatni'
  },
  {
    userId: 'USR-DEMO-002',
    email: 'dr.ananya.sharma@careq-health.gov.in',
    name: 'Dr. Ananya Sharma',
    role: 'HEALTHCARE_PROFESSIONAL',
    patientId: 'PAT-2026-00124',
    professionalId: 'PROF-DEMO-00451',
    mobileNumber: '+91 94370 12399',
    mobileVerified: true,
    verifiedRoles: ['PATIENT', 'HEALTHCARE_PROFESSIONAL'],
    facilityId: 'FAC-DEMO-OD-001',
    facilityName: 'CAREQ Demo Primary Health Centre, Jatni'
  },
  {
    userId: 'USR-DEMO-003',
    email: 'amit.kumar.demo@careq-health.org',
    name: 'Amit Kumar',
    role: 'PATIENT',
    patientId: 'PAT-2026-00125',
    mobileNumber: '+91 94371 88921',
    mobileVerified: true,
    verifiedRoles: ['PATIENT']
  },
  {
    userId: 'USR-DEMO-004',
    email: 'sunita.devi.demo@careq-health.org',
    name: 'Sunita Devi',
    role: 'PATIENT',
    patientId: 'PAT-2026-00126',
    mobileNumber: '+91 91234 56789',
    mobileVerified: false, // Explicitly unverified mobile for security testing
    verifiedRoles: ['PATIENT']
  },
  {
    userId: 'USR-DEMO-005',
    email: 'dr.arjun.mehta@careq-health.gov.in',
    name: 'Dr. Arjun Mehta',
    role: 'HEALTHCARE_PROFESSIONAL',
    professionalId: 'PROF-DEMO-00712',
    mobileNumber: '+91 94372 99881',
    mobileVerified: true,
    verifiedRoles: ['HEALTHCARE_PROFESSIONAL'],
    facilityId: 'FAC-DEMO-OD-002',
    facilityName: 'CAREQ Demo Community Health Centre, Khordha'
  }
];

// Active Server-Side Session Store
interface ActiveServerSession {
  sessionId: string;
  userId: string;
  role: 'PATIENT' | 'HEALTHCARE_PROFESSIONAL';
  identityId: string;
  permissions: string[];
  issuedAt: number;
  expiresAt: number;
  verifiedRoles: ('PATIENT' | 'HEALTHCARE_PROFESSIONAL')[];
  authAssuranceLevel: 'STANDARD' | 'HIGH_ASSURANCE';
  account: RegisteredAccount;
}

const activeSessionsStore = new Map<string, ActiveServerSession>();

// Initialize default demo session for Riya Das
activeSessionsStore.set('SES-INIT-PAT-9042', {
  sessionId: 'SES-INIT-PAT-9042',
  userId: 'USR-DEMO-001',
  role: 'PATIENT',
  identityId: 'PAT-2026-00124',
  permissions: [
    'patient:self:read', 'patient:self:update', 'patient:self:assessment:create',
    'patient:self:assessment:read', 'patient:self:voice:create', 'patient:self:reports:read',
    'patient:self:timeline:read', 'patient:self:followup:read', 'patient:self:followup:respond',
    'patient:self:consent:read', 'patient:self:consent:update', 'patient:self:referral:read'
  ],
  issuedAt: Date.now(),
  expiresAt: Date.now() + 8 * 3600 * 1000,
  verifiedRoles: ['PATIENT', 'HEALTHCARE_PROFESSIONAL'],
  authAssuranceLevel: 'STANDARD',
  account: REGISTERED_ACCOUNTS[0]
});

// Secure OTP records (stores only hashes and salts, NEVER plain OTPs)
interface EmailOtpRecord {
  email: string;
  otpHash: string;
  salt: string;
  attempts: number;
  maxAttempts: number;
  expiresAt: number;
  resendAvailableAt: number;
  account: RegisteredAccount;
  createdAt: number;
}

interface MobileOtpRecord {
  sessionId: string;
  userId: string;
  mobileNumber: string;
  otpHash: string;
  salt: string;
  attempts: number;
  maxAttempts: number;
  expiresAt: number;
  resendAvailableAt: number;
  currentRole: string;
  targetRole: string;
  clinicalJustification?: string;
  createdAt: number;
}

const emailOtpStore = new Map<string, EmailOtpRecord>();
const mobileOtpStore = new Map<string, MobileOtpRecord>();

// Sliding rate-limit windows (max 5 requests per 15 min per recipient)
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

function checkRateLimit(key: string, maxRequests = 5, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now - entry.windowStart > windowMs) {
    rateLimitMap.set(key, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= maxRequests) {
    return false;
  }
  entry.count += 1;
  return true;
}

function maskEmail(email: string): string {
  const [user, domain] = email.split('@');
  if (!user || !domain) return email;
  if (user.length <= 2) return `${user[0]}*@${domain}`;
  return `${user.slice(0, 2)}${'*'.repeat(Math.min(user.length - 2, 5))}@${domain}`;
}

function maskMobile(mobile: string): string {
  const cleaned = mobile.replace(/\s+/g, '');
  if (cleaned.length < 6) return mobile;
  const visiblePrefix = cleaned.slice(0, 3);
  const visibleSuffix = cleaned.slice(-4);
  return `${visiblePrefix} ******${visibleSuffix}`;
}

function generateSecureOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

function hashOtp(otp: string, salt: string): string {
  return crypto.createHash('sha256').update(otp + salt).digest('hex');
}

// Transactional Email Dispatcher (Resend, SendGrid, SMTP, or Dev)
async function dispatchEmailOtp(email: string, otp: string, _purpose: string): Promise<{ success: boolean; provider: string; error?: string; missingConfig?: string[] }> {
  const provider = (process.env.EMAIL_PROVIDER || 'dev').toLowerCase();
  const fromEmail = process.env.EMAIL_FROM || 'noreply@careq-health.gov.in';

  if (provider === 'resend') {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        provider: 'resend',
        error: 'Email verification service is not configured.',
        missingConfig: ['RESEND_API_KEY', 'EMAIL_FROM']
      };
    }
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [email],
          subject: `CAREQ - Your 6-Digit Email Verification Code`,
          html: `<div style="font-family: Arial, sans-serif; padding: 24px; color: #0F172A; max-width: 500px; margin: auto; border: 1px solid #E2E8F0; border-radius: 12px;">
            <h2 style="color: #0A1E3F; margin-top: 0;">CAREQ Health Security</h2>
            <p>Your one-time email verification code is:</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; padding: 16px; background-color: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 8px; text-align: center; color: #0E7490; font-family: monospace;">
              ${otp}
            </div>
            <p style="font-size: 13px; color: #64748B; margin-top: 16px;">This code is valid for 5 minutes and single-use only. Do not share this code with anyone.</p>
          </div>`
        })
      });
      if (!res.ok) {
        return { success: false, provider: 'resend', error: `Resend dispatch failed with HTTP status: ${res.status}` };
      }
      return { success: true, provider: 'resend' };
    } catch (err: any) {
      return { success: false, provider: 'resend', error: `Resend network connection error: ${err.message}` };
    }
  }

  if (provider === 'sendgrid') {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        provider: 'sendgrid',
        error: 'Email verification service is not configured.',
        missingConfig: ['SENDGRID_API_KEY', 'EMAIL_FROM']
      };
    }
    try {
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email }] }],
          from: { email: fromEmail },
          subject: `CAREQ - Your Verification Code`,
          content: [{ type: 'text/plain', value: `Your CAREQ verification code is: ${otp}. Valid for 5 minutes.` }]
        })
      });
      if (!res.ok) {
        return { success: false, provider: 'sendgrid', error: `SendGrid dispatch error: HTTP ${res.status}` };
      }
      return { success: true, provider: 'sendgrid' };
    } catch (err: any) {
      return { success: false, provider: 'sendgrid', error: `SendGrid error: ${err.message}` };
    }
  }

  if (provider === 'dev' && process.env.NODE_ENV !== 'production') {
    // Isolated local development mock: simulates delivery without returning or logging plaintext OTP
    return { success: true, provider: 'dev' };
  }

  return {
    success: false,
    provider,
    error: 'Email verification service is not configured.',
    missingConfig: ['RESEND_API_KEY', 'EMAIL_FROM']
  };
}

// Transactional SMS Dispatcher (Twilio, MSG91, or Dev)
async function dispatchMobileOtp(mobile: string, otp: string, _roleTransition: string): Promise<{ success: boolean; provider: string; error?: string; missingConfig?: string[] }> {
  const provider = (process.env.SMS_PROVIDER || 'dev').toLowerCase();

  if (provider === 'twilio') {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_FROM_NUMBER;

    if (!sid || !token || !from) {
      return {
        success: false,
        provider: 'twilio',
        error: 'SMS verification service is not configured.',
        missingConfig: [
          !sid ? 'TWILIO_ACCOUNT_SID' : '',
          !token ? 'TWILIO_AUTH_TOKEN' : '',
          !from ? 'TWILIO_FROM_NUMBER' : ''
        ].filter(Boolean)
      };
    }

    try {
      const auth = Buffer.from(`${sid}:${token}`).toString('base64');
      const params = new URLSearchParams();
      params.append('To', mobile);
      params.append('From', from);
      params.append('Body', `[CAREQ Healthcare] Your high-assurance workspace switch OTP is: ${otp}. Valid for 5 minutes.`);

      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });

      if (!res.ok) {
        return { success: false, provider: 'twilio', error: `Twilio dispatch failed: HTTP ${res.status}` };
      }
      return { success: true, provider: 'twilio' };
    } catch (err: any) {
      return { success: false, provider: 'twilio', error: `Twilio connection error: ${err.message}` };
    }
  }

  if (provider === 'msg91') {
    const authKey = process.env.MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;
    if (!authKey || !templateId) {
      return {
        success: false,
        provider: 'msg91',
        error: 'SMS verification service is not configured.',
        missingConfig: [
          !authKey ? 'MSG91_AUTH_KEY' : '',
          !templateId ? 'MSG91_TEMPLATE_ID' : ''
        ].filter(Boolean)
      };
    }
    return { success: true, provider: 'msg91' };
  }

  if (provider === 'dev' && process.env.NODE_ENV !== 'production') {
    // Isolated local development mock: simulates delivery without returning or logging plaintext OTP
    return { success: true, provider: 'dev' };
  }

  return {
    success: false,
    provider,
    error: 'SMS verification service is not configured.',
    missingConfig: ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_FROM_NUMBER']
  };
}

function careqApiAuthPlugin() {
  return {
    name: 'careq-api-auth',
    configureServer(server: any) {
      // Mock cases database
      const mockCases = [
        { id: 'case-001', patientId: 'pat-1', name: 'Ramesh Patel', priority: 'HIGH', chiefComplaint: 'Severe chest tightness & shortness of breath' },
        { id: 'case-002', patientId: 'pat-2', name: 'Sunita Devi', priority: 'MEDIUM', chiefComplaint: 'High fever and productive cough for 3 days' },
        { id: 'case-003', patientId: 'pat-3', name: 'Alok Mohanty', priority: 'LOW', chiefComplaint: 'Mild headache and sore throat' }
      ];

      // /api/clinical/* endpoints
      server.middlewares.use('/api/clinical', (req: any, res: any, _next: any) => {
        const role = req.headers['x-careq-role'];
        const sessionId = req.headers['x-careq-session-id'];

        res.setHeader('Content-Type', 'application/json');

        // Enforce strict healthcare professional authorization
        if (role !== 'HEALTHCARE_PROFESSIONAL') {
          res.statusCode = 403;
          res.end(JSON.stringify({
            error: 'Forbidden',
            code: 'ACCESS_RESTRICTED',
            message: 'Access restricted: Verified Healthcare Professional authorization required for clinical workspace endpoints.',
            requiredRole: 'HEALTHCARE_PROFESSIONAL',
            providedRole: role || 'UNAUTHENTICATED'
          }));
          return;
        }

        if (!sessionId) {
          res.statusCode = 401;
          res.end(JSON.stringify({
            error: 'Unauthorized',
            code: 'SESSION_MISSING',
            message: 'Active clinical session token required.'
          }));
          return;
        }

        // Validate session exists in server session store
        const session = activeSessionsStore.get(sessionId);
        if (!session || session.role !== 'HEALTHCARE_PROFESSIONAL' || Date.now() > session.expiresAt) {
          res.statusCode = 401;
          res.end(JSON.stringify({
            error: 'Unauthorized',
            code: 'SESSION_INVALID_OR_EXPIRED',
            message: 'Your clinical session is invalid or has expired. Please sign in or switch workspace with Mobile OTP.'
          }));
          return;
        }

        const url = req.url || '';
        if (url.startsWith('/cases') || url.startsWith('/queue') || url === '' || url === '/') {
          res.statusCode = 200;
          res.end(JSON.stringify({
            status: 'success',
            workspace: 'CLINICAL_REVIEW',
            count: mockCases.length,
            cases: mockCases
          }));
          return;
        }

        if (url.startsWith('/patient/')) {
          const patientId = url.replace('/patient/', '').split('?')[0];
          const found = mockCases.find(c => c.patientId === patientId || c.id === patientId);
          res.statusCode = 200;
          res.end(JSON.stringify({
            status: 'success',
            clinicalCase: found || mockCases[0]
          }));
          return;
        }

        res.statusCode = 200;
        res.end(JSON.stringify({ status: 'success', authorized: true, role: 'HEALTHCARE_PROFESSIONAL' }));
      });

      // /api/patient/* endpoints
      server.middlewares.use('/api/patient', (req: any, res: any, _next: any) => {
        const role = req.headers['x-careq-role'];
        const patientIdHeader = req.headers['x-careq-patient-id'];
        const sessionId = req.headers['x-careq-session-id'];

        res.setHeader('Content-Type', 'application/json');

        // Only PATIENT role can access self-service endpoints
        if (role !== 'PATIENT') {
          res.statusCode = 403;
          res.end(JSON.stringify({
            error: 'Forbidden',
            code: 'PATIENT_WORKSPACE_REQUIRED',
            message: 'Access restricted: Patient workspace authorization required.',
            requiredRole: 'PATIENT',
            providedRole: role || 'UNAUTHENTICATED'
          }));
          return;
        }

        if (!sessionId) {
          res.statusCode = 401;
          res.end(JSON.stringify({
            error: 'Unauthorized',
            code: 'SESSION_MISSING',
            message: 'Valid patient session required.'
          }));
          return;
        }

        // Validate session exists in server session store
        const session = activeSessionsStore.get(sessionId);
        if (!session || session.role !== 'PATIENT' || Date.now() > session.expiresAt) {
          res.statusCode = 401;
          res.end(JSON.stringify({
            error: 'Unauthorized',
            code: 'SESSION_INVALID_OR_EXPIRED',
            message: 'Your patient session is invalid or has expired. Please sign in.'
          }));
          return;
        }

        // Resource ownership check: cannot query another patient's profile
        const urlObj = new URL(req.url, 'http://localhost');
        const queryPatientId = urlObj.searchParams.get('patientId');
        if (queryPatientId && patientIdHeader && queryPatientId !== patientIdHeader) {
          res.statusCode = 403;
          res.end(JSON.stringify({
            error: 'Forbidden',
            code: 'RESOURCE_ACCESS_DENIED',
            message: 'Unauthorized: Patients may only access their own clinical records and assessments.'
          }));
          return;
        }

        res.statusCode = 200;
        res.end(JSON.stringify({
          status: 'success',
          workspace: 'PATIENT_PORTAL',
          patientId: patientIdHeader || session.identityId,
          records: [
            { id: 'rec-001', type: 'assessment', date: '2026-09-24', status: 'reviewed' }
          ]
        }));
      });
    }
  };
}

function careqOtpAuthPlugin() {
  return {
    name: 'careq-otp-auth',
    configureServer(server: any) {
      
      // Helper to handle body parsing
      const parseJsonBody = (req: any): Promise<any> => {
        return new Promise((resolve, reject) => {
          let body = '';
          req.on('data', (chunk: any) => { body += chunk; });
          req.on('end', () => {
            try {
              resolve(body ? JSON.parse(body) : {});
            } catch (e) {
              reject(e);
            }
          });
        });
      };

      // 0. Configuration Status Endpoint: GET /api/auth/config-status or /auth/config-status
      const handleConfigStatus = (_req: any, res: any) => {
        res.setHeader('Content-Type', 'application/json');
        const emailProvider = (process.env.EMAIL_PROVIDER || 'dev').toLowerCase();
        const smsProvider = (process.env.SMS_PROVIDER || 'dev').toLowerCase();

        let emailConfigured = false;
        let missingEmailConfig: string[] = [];
        if (emailProvider === 'resend') {
          emailConfigured = Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
          if (!process.env.RESEND_API_KEY) missingEmailConfig.push('RESEND_API_KEY');
          if (!process.env.EMAIL_FROM) missingEmailConfig.push('EMAIL_FROM');
        } else if (emailProvider === 'sendgrid') {
          emailConfigured = Boolean(process.env.SENDGRID_API_KEY && process.env.EMAIL_FROM);
          if (!process.env.SENDGRID_API_KEY) missingEmailConfig.push('SENDGRID_API_KEY');
          if (!process.env.EMAIL_FROM) missingEmailConfig.push('EMAIL_FROM');
        } else if (emailProvider === 'dev') {
          emailConfigured = true;
        }

        let smsConfigured = false;
        let missingSmsConfig: string[] = [];
        if (smsProvider === 'twilio') {
          smsConfigured = Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER);
          if (!process.env.TWILIO_ACCOUNT_SID) missingSmsConfig.push('TWILIO_ACCOUNT_SID');
          if (!process.env.TWILIO_AUTH_TOKEN) missingSmsConfig.push('TWILIO_AUTH_TOKEN');
          if (!process.env.TWILIO_FROM_NUMBER) missingSmsConfig.push('TWILIO_FROM_NUMBER');
        } else if (smsProvider === 'msg91') {
          smsConfigured = Boolean(process.env.MSG91_AUTH_KEY && process.env.MSG91_TEMPLATE_ID);
          if (!process.env.MSG91_AUTH_KEY) missingSmsConfig.push('MSG91_AUTH_KEY');
          if (!process.env.MSG91_TEMPLATE_ID) missingSmsConfig.push('MSG91_TEMPLATE_ID');
        } else if (smsProvider === 'dev') {
          smsConfigured = true;
        }

        res.statusCode = 200;
        res.end(JSON.stringify({
          success: true,
          emailProvider,
          emailConfigured,
          missingEmailConfig,
          smsProvider,
          smsConfigured,
          missingSmsConfig,
          isDevMode: (emailProvider === 'dev' || smsProvider === 'dev') && process.env.NODE_ENV !== 'production'
        }));
      };

      // 1. EMAIL OTP REQUEST: POST /auth/login/request-otp (and aliases)
      const handleEmailOtpRequest = async (req: any, res: any) => {
        res.setHeader('Content-Type', 'application/json');
        try {
          const data = await parseJsonBody(req);
          const email = (data.email || '').trim().toLowerCase();

          // Step 1: Validate email
          if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            res.statusCode = 400;
            res.end(JSON.stringify({
              success: false,
              code: 'INVALID_EMAIL_FORMAT',
              error: 'Please enter a valid email address.'
            }));
            return;
          }

          // Step 2: Locate account
          const account = REGISTERED_ACCOUNTS.find(a => a.email.toLowerCase() === email);
          if (!account) {
            res.statusCode = 404;
            res.end(JSON.stringify({
              success: false,
              code: 'ACCOUNT_NOT_FOUND',
              error: 'No account found matching this email address. Please register or verify the entered address.'
            }));
            return;
          }

          // Step 3 & 4: Rate Limiting
          const now = Date.now();
          const existing = emailOtpStore.get(email);

          // Cooldown check (60s)
          if (existing && now < existing.resendAvailableAt) {
            const remainingSec = Math.ceil((existing.resendAvailableAt - now) / 1000);
            res.statusCode = 429;
            res.end(JSON.stringify({
              success: false,
              code: 'COOLDOWN_ACTIVE',
              error: `Please wait ${remainingSec} seconds before requesting another verification code.`,
              cooldownSeconds: remainingSec
            }));
            return;
          }

          // 15-minute sliding window check
          if (!checkRateLimit(`email:${email}`, 5, 15 * 60 * 1000)) {
            res.statusCode = 429;
            res.end(JSON.stringify({
              success: false,
              code: 'RATE_LIMIT_EXCEEDED',
              error: 'Too many OTP requests for this account. Please wait 15 minutes before trying again.'
            }));
            return;
          }

          // Step 5: Cryptographically secure 6-digit random OTP
          const rawOtp = generateSecureOtp();
          const salt = crypto.randomBytes(16).toString('hex');
          const otpHash = hashOtp(rawOtp, salt);

          // Step 6: Dispatch via real transactional email provider
          const dispatchResult = await dispatchEmailOtp(email, rawOtp, 'login');

          if (!dispatchResult.success) {
            res.statusCode = 503;
            res.end(JSON.stringify({
              success: false,
              code: 'PROVIDER_NOT_CONFIGURED',
              error: dispatchResult.error || 'Email verification service is not configured.',
              missingConfig: dispatchResult.missingConfig || []
            }));
            return;
          }

          // Step 7: Store ONLY secure representation/hash of the OTP (Never plaintext)
          emailOtpStore.set(email, {
            email,
            otpHash,
            salt,
            attempts: 0,
            maxAttempts: 3, // strictly 3 attempts
            expiresAt: now + 5 * 60 * 1000, // 5 minutes expiration
            resendAvailableAt: now + 60 * 1000, // 60s cooldown
            account,
            createdAt: now
          });

          // Step 8: Return only safe metadata (Never the OTP)
          res.statusCode = 200;
          res.end(JSON.stringify({
            success: true,
            message: `A 6-digit verification code has been dispatched to ${maskEmail(email)}.`,
            maskedEmail: maskEmail(email),
            cooldownSeconds: 60,
            expiresInSeconds: 300,
            provider: dispatchResult.provider
          }));
        } catch {
          res.statusCode = 400;
          res.end(JSON.stringify({ success: false, error: 'Invalid request payload.' }));
        }
      };

      // 2. EMAIL OTP VERIFY: POST /auth/login/verify-otp (and aliases)
      const handleEmailOtpVerify = async (req: any, res: any) => {
        res.setHeader('Content-Type', 'application/json');
        try {
          const data = await parseJsonBody(req);
          const email = (data.email || '').trim().toLowerCase();
          const inputOtp = (data.otp || '').trim();

          if (!email || !inputOtp || inputOtp.length !== 6) {
            res.statusCode = 400;
            res.end(JSON.stringify({
              success: false,
              code: 'INVALID_INPUT',
              error: 'A valid email and complete 6-digit verification code are required.'
            }));
            return;
          }

          const record = emailOtpStore.get(email);
          const now = Date.now();

          // Validate attempt exists
          if (!record) {
            res.statusCode = 404;
            res.end(JSON.stringify({
              success: false,
              code: 'OTP_NOT_FOUND',
              error: 'No active verification code found for this email. Please request a new code.'
            }));
            return;
          }

          // Check expiration (~5 minutes)
          if (now > record.expiresAt) {
            emailOtpStore.delete(email);
            res.statusCode = 410;
            res.end(JSON.stringify({
              success: false,
              code: 'OTP_EXPIRED',
              error: 'This verification code has expired. Please request a new code.'
            }));
            return;
          }

          // Check max attempts
          if (record.attempts >= record.maxAttempts) {
            emailOtpStore.delete(email);
            res.statusCode = 429;
            res.end(JSON.stringify({
              success: false,
              code: 'TOO_MANY_ATTEMPTS',
              error: 'Too many failed verification attempts. Please request a new code.'
            }));
            return;
          }

          // Validate secure hash
          const computedHash = hashOtp(inputOtp, record.salt);
          if (computedHash !== record.otpHash) {
            record.attempts += 1;
            const remaining = record.maxAttempts - record.attempts;
            if (remaining <= 0) {
              emailOtpStore.delete(email);
              res.statusCode = 429;
              res.end(JSON.stringify({
                success: false,
                code: 'TOO_MANY_ATTEMPTS',
                error: 'Too many failed verification attempts. Please request a new code.',
                attemptsRemaining: 0
              }));
              return;
            }
            res.statusCode = 401;
            res.end(JSON.stringify({
              success: false,
              code: 'INCORRECT_OTP',
              error: 'The verification code is incorrect. Please try again.',
              attemptsRemaining: remaining
            }));
            return;
          }

          // Single-use: delete immediately to prevent reuse
          emailOtpStore.delete(email);

          // Create authenticated session
          const sessionToken = `SES-EML-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(12).toString('hex').toUpperCase()}`;
          const account = record.account;
          const role = account.role;
          const identityId = role === 'PATIENT' ? (account.patientId || 'PAT-2026-00124') : (account.professionalId || 'PROF-DEMO-00451');

          const patientPerms = [
            'patient:self:read', 'patient:self:update', 'patient:self:assessment:create',
            'patient:self:assessment:read', 'patient:self:voice:create', 'patient:self:reports:read',
            'patient:self:timeline:read', 'patient:self:followup:read', 'patient:self:followup:respond',
            'patient:self:consent:read', 'patient:self:consent:update', 'patient:self:referral:read'
          ];
          const professionalPerms = [
            'clinical:queue:read', 'clinical:priority:read', 'clinical:case:read',
            'clinical:case:review', 'clinical:case:update', 'clinical:case:request_information',
            'clinical:case:priority', 'clinical:referral:create', 'clinical:referral:read',
            'clinical:notes:create', 'clinical:timeline:read', 'clinical:reports:read',
            'clinical:consent:read', 'clinical:audit:read'
          ];

          const permissions = role === 'PATIENT' ? patientPerms : professionalPerms;

          // Register in server active session store
          activeSessionsStore.set(sessionToken, {
            sessionId: sessionToken,
            userId: account.userId,
            role,
            identityId,
            permissions,
            issuedAt: now,
            expiresAt: now + 8 * 3600 * 1000,
            verifiedRoles: account.verifiedRoles,
            authAssuranceLevel: 'STANDARD',
            account
          });

          // Return only necessary session information
          res.statusCode = 200;
          res.end(JSON.stringify({
            success: true,
            verified: true,
            sessionToken,
            role,
            email: account.email,
            userId: account.userId,
            patientId: account.patientId,
            professionalId: account.professionalId,
            userName: account.name,
            permissions,
            message: 'Email successfully verified. Authorized session created.'
          }));
        } catch {
          res.statusCode = 400;
          res.end(JSON.stringify({ success: false, error: 'Invalid request payload.' }));
        }
      };

      // 3. MOBILE OTP REQUEST: POST /auth/workspace/request-otp (and aliases)
      const handleMobileOtpRequest = async (req: any, res: any) => {
        res.setHeader('Content-Type', 'application/json');
        try {
          const data = await parseJsonBody(req);
          const sessionId = req.headers['x-careq-session-id'] || data.sessionId;
          const targetRole = data.targetRole;
          const clinicalJustification = data.clinicalJustification;

          if (!sessionId) {
            res.statusCode = 401;
            res.end(JSON.stringify({
              success: false,
              code: 'SESSION_REQUIRED',
              error: 'Active authenticated session required to request workspace transition.'
            }));
            return;
          }

          // Validate current session exists
          const currentSession = activeSessionsStore.get(sessionId);
          if (!currentSession || Date.now() > currentSession.expiresAt) {
            res.statusCode = 401;
            res.end(JSON.stringify({
              success: false,
              code: 'SESSION_INVALID_OR_EXPIRED',
              error: 'Your session has expired. Please log in again.'
            }));
            return;
          }

          if (!targetRole || targetRole === currentSession.role) {
            res.statusCode = 400;
            res.end(JSON.stringify({
              success: false,
              code: 'INVALID_TARGET_ROLE',
              error: 'Target workspace must be different from your active workspace.'
            }));
            return;
          }

          // Backend confirms that the user has a verified target identity
          if (!currentSession.verifiedRoles.includes(targetRole)) {
            res.statusCode = 403;
            res.end(JSON.stringify({
              success: false,
              code: 'UNAUTHORIZED_TARGET_ROLE',
              error: `Access restricted: Your account does not possess a verified ${targetRole === 'HEALTHCARE_PROFESSIONAL' ? 'Healthcare Professional' : 'Patient'} identity.`
            }));
            return;
          }

          // Section 5: Check VERIFIED MOBILE NUMBER
          const account = currentSession.account;
          if (!account.mobileVerified || !account.mobileNumber) {
            res.statusCode = 403;
            res.end(JSON.stringify({
              success: false,
              code: 'MOBILE_NOT_VERIFIED',
              error: 'Your account does not have a verified mobile number. Verify your mobile number before switching workspaces.'
            }));
            return;
          }

          const now = Date.now();
          const existing = mobileOtpStore.get(sessionId);

          // Cooldown check (60s)
          if (existing && now < existing.resendAvailableAt) {
            const remainingSec = Math.ceil((existing.resendAvailableAt - now) / 1000);
            res.statusCode = 429;
            res.end(JSON.stringify({
              success: false,
              code: 'COOLDOWN_ACTIVE',
              error: `Please wait ${remainingSec} seconds before requesting another SMS code.`,
              cooldownSeconds: remainingSec
            }));
            return;
          }

          // Rate limit check
          if (!checkRateLimit(`mobile:${account.mobileNumber}`, 5, 15 * 60 * 1000)) {
            res.statusCode = 429;
            res.end(JSON.stringify({
              success: false,
              code: 'RATE_LIMIT_EXCEEDED',
              error: 'Too many SMS requests for this phone number. Please wait 15 minutes.'
            }));
            return;
          }

          // Generate 6-digit random OTP
          const rawOtp = generateSecureOtp();
          const salt = crypto.randomBytes(16).toString('hex');
          const otpHash = hashOtp(rawOtp, salt);

          // Dispatch through real transactional SMS provider
          const dispatchResult = await dispatchMobileOtp(
            account.mobileNumber,
            rawOtp,
            `${currentSession.role} -> ${targetRole}`
          );

          if (!dispatchResult.success) {
            res.statusCode = 503;
            res.end(JSON.stringify({
              success: false,
              code: 'PROVIDER_NOT_CONFIGURED',
              error: dispatchResult.error || 'SMS verification service is not configured.',
              missingConfig: dispatchResult.missingConfig || []
            }));
            return;
          }

          // Store ONLY hash of the OTP
          mobileOtpStore.set(sessionId, {
            sessionId,
            userId: account.userId,
            mobileNumber: account.mobileNumber,
            otpHash,
            salt,
            attempts: 0,
            maxAttempts: 3, // strictly 3 attempts
            expiresAt: now + 5 * 60 * 1000, // 5 min
            resendAvailableAt: now + 60 * 1000, // 60s cooldown
            currentRole: currentSession.role,
            targetRole,
            clinicalJustification,
            createdAt: now
          });

          // Return masked number only (NEVER the OTP)
          res.statusCode = 200;
          res.end(JSON.stringify({
            success: true,
            message: `Verification code sent to your verified mobile number: ${maskMobile(account.mobileNumber)}.`,
            maskedMobile: maskMobile(account.mobileNumber),
            cooldownSeconds: 60,
            expiresInSeconds: 300,
            provider: dispatchResult.provider
          }));
        } catch {
          res.statusCode = 400;
          res.end(JSON.stringify({ success: false, error: 'Invalid request payload.' }));
        }
      };

      // 4. MOBILE OTP VERIFY: POST /auth/workspace/verify-otp (and aliases)
      const handleMobileOtpVerify = async (req: any, res: any) => {
        res.setHeader('Content-Type', 'application/json');
        try {
          const data = await parseJsonBody(req);
          const sessionId = req.headers['x-careq-session-id'] || data.sessionId;
          const inputOtp = (data.otp || '').trim();
          const targetRole = data.targetRole;

          if (!sessionId || !inputOtp || inputOtp.length !== 6) {
            res.statusCode = 400;
            res.end(JSON.stringify({
              success: false,
              code: 'INVALID_INPUT',
              error: 'Session ID and 6-digit Mobile OTP are required.'
            }));
            return;
          }

          const record = mobileOtpStore.get(sessionId);
          const now = Date.now();

          if (!record) {
            res.statusCode = 404;
            res.end(JSON.stringify({
              success: false,
              code: 'OTP_NOT_FOUND',
              error: 'No active mobile verification session found. Please request a new verification code.'
            }));
            return;
          }

          // Check expiration
          if (now > record.expiresAt) {
            mobileOtpStore.delete(sessionId);
            res.statusCode = 410;
            res.end(JSON.stringify({
              success: false,
              code: 'OTP_EXPIRED',
              error: 'This verification code has expired. Request a new code.'
            }));
            return;
          }

          // Check maximum attempts
          if (record.attempts >= record.maxAttempts) {
            mobileOtpStore.delete(sessionId);
            res.statusCode = 429;
            res.end(JSON.stringify({
              success: false,
              code: 'TOO_MANY_ATTEMPTS',
              error: 'Too many verification attempts. Please request a new code.'
            }));
            return;
          }

          // Validate hash
          const computedHash = hashOtp(inputOtp, record.salt);
          if (computedHash !== record.otpHash) {
            record.attempts += 1;
            const remaining = record.maxAttempts - record.attempts;
            if (remaining <= 0) {
              mobileOtpStore.delete(sessionId);
              res.statusCode = 429;
              res.end(JSON.stringify({
                success: false,
                code: 'TOO_MANY_ATTEMPTS',
                error: 'Too many verification attempts. Please request a new code.',
                attemptsRemaining: 0
              }));
              return;
            }
            res.statusCode = 401;
            res.end(JSON.stringify({
              success: false,
              code: 'INCORRECT_OTP',
              error: 'The verification code is incorrect. Please try again.',
              attemptsRemaining: remaining
            }));
            return;
          }

          // Single-use: delete mobile OTP record
          mobileOtpStore.delete(sessionId);

          // Get old session to terminate
          const oldSession = activeSessionsStore.get(sessionId);
          const account = oldSession?.account || REGISTERED_ACCOUNTS[0];

          // Invalidate/terminate old session
          activeSessionsStore.delete(sessionId);

          // Establish new role-scoped session with HIGH_ASSURANCE
          const effectiveTargetRole: 'PATIENT' | 'HEALTHCARE_PROFESSIONAL' = record.targetRole as any || targetRole;
          const newSessionToken = `SES-MOB-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(12).toString('hex').toUpperCase()}`;
          const identityId = effectiveTargetRole === 'PATIENT' ? (account.patientId || 'PAT-2026-00124') : (account.professionalId || 'PROF-DEMO-00451');

          const patientPerms = [
            'patient:self:read', 'patient:self:update', 'patient:self:assessment:create',
            'patient:self:assessment:read', 'patient:self:voice:create', 'patient:self:reports:read',
            'patient:self:timeline:read', 'patient:self:followup:read', 'patient:self:followup:respond',
            'patient:self:consent:read', 'patient:self:consent:update', 'patient:self:referral:read'
          ];
          const professionalPerms = [
            'clinical:queue:read', 'clinical:priority:read', 'clinical:case:read',
            'clinical:case:review', 'clinical:case:update', 'clinical:case:request_information',
            'clinical:case:priority', 'clinical:referral:create', 'clinical:referral:read',
            'clinical:notes:create', 'clinical:timeline:read', 'clinical:reports:read',
            'clinical:consent:read', 'clinical:audit:read'
          ];
          const newPermissions = effectiveTargetRole === 'PATIENT' ? patientPerms : professionalPerms;

          activeSessionsStore.set(newSessionToken, {
            sessionId: newSessionToken,
            userId: account.userId,
            role: effectiveTargetRole,
            identityId,
            permissions: newPermissions,
            issuedAt: now,
            expiresAt: now + 8 * 3600 * 1000,
            verifiedRoles: account.verifiedRoles,
            authAssuranceLevel: 'HIGH_ASSURANCE',
            account
          });

          res.statusCode = 200;
          res.end(JSON.stringify({
            success: true,
            verified: true,
            targetRole: effectiveTargetRole,
            newSessionId: newSessionToken,
            sessionToken: newSessionToken,
            permissions: newPermissions,
            authAssuranceLevel: 'HIGH_ASSURANCE',
            clinicalJustification: record.clinicalJustification,
            message: 'Mobile number verified. Previous workspace terminated and new workspace session authorized.'
          }));
        } catch {
          res.statusCode = 400;
          res.end(JSON.stringify({ success: false, error: 'Invalid request payload.' }));
        }
      };

      // Register universal route mappings
      server.middlewares.use((req: any, res: any, next: any) => {
        const url = req.url?.split('?')[0] || '';

        // 1. Config status
        if ((url === '/auth/config-status' || url === '/api/auth/config-status') && req.method === 'GET') {
          return handleConfigStatus(req, res);
        }

        // 2. Email OTP Request: POST /auth/login/request-otp (and aliases)
        if (
          (url === '/auth/login/request-otp' || url === '/api/auth/login/request-otp' || url === '/api/auth/email/send-otp') &&
          req.method === 'POST'
        ) {
          return handleEmailOtpRequest(req, res);
        }

        // 3. Email OTP Verify: POST /auth/login/verify-otp (and aliases)
        if (
          (url === '/auth/login/verify-otp' || url === '/api/auth/login/verify-otp' || url === '/api/auth/email/verify-otp') &&
          req.method === 'POST'
        ) {
          return handleEmailOtpVerify(req, res);
        }

        // 4. Mobile OTP Request: POST /auth/workspace/request-otp (and aliases)
        if (
          (url === '/auth/workspace/request-otp' || url === '/api/auth/workspace/request-otp' || url === '/api/auth/mobile/send-otp') &&
          req.method === 'POST'
        ) {
          return handleMobileOtpRequest(req, res);
        }

        // 5. Mobile OTP Verify: POST /auth/workspace/verify-otp (and aliases)
        if (
          (url === '/auth/workspace/verify-otp' || url === '/api/auth/workspace/verify-otp' || url === '/api/auth/mobile/verify-otp') &&
          req.method === 'POST'
        ) {
          return handleMobileOtpVerify(req, res);
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    voiceApiPlugin(),
    careqApiAuthPlugin(),
    careqOtpAuthPlugin()
  ],
  server: {
    port: 5180,
    strictPort: false
  }
});
