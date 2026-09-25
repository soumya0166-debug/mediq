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

        if (!sessionId || !patientIdHeader) {
          res.statusCode = 401;
          res.end(JSON.stringify({
            error: 'Unauthorized',
            code: 'SESSION_INVALID',
            message: 'Valid patient session and patient identity required.'
          }));
          return;
        }

        // Resource ownership check: cannot query another patient's profile
        const urlObj = new URL(req.url, 'http://localhost');
        const queryPatientId = urlObj.searchParams.get('patientId');
        if (queryPatientId && queryPatientId !== patientIdHeader) {
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
          patientId: patientIdHeader,
          records: [
            { id: 'rec-001', type: 'assessment', date: '2026-09-24', status: 'reviewed' }
          ]
        }));
      });

      // /api/auth/step-up-challenge endpoint (High-Assurance Re-Authentication)
      server.middlewares.use('/api/auth/step-up-challenge', (req: any, res: any, _next: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk: any) => { body += chunk; });
        req.on('end', () => {
          res.setHeader('Content-Type', 'application/json');
          try {
            const data = JSON.parse(body || '{}');
            const { targetRole, challengeType, code } = data;

            // Doctor high-assurance codes: PIN 482910 or OTP 719402
            // Patient high-assurance codes: PIN 123456 or OTP 654321
            let valid = false;
            if (targetRole === 'HEALTHCARE_PROFESSIONAL') {
              if (challengeType === 'PIN' && code === '482910') valid = true;
              if (challengeType === 'OTP' && code === '719402') valid = true;
            } else if (targetRole === 'PATIENT') {
              if (challengeType === 'PIN' && code === '123456') valid = true;
              if (challengeType === 'OTP' && code === '654321') valid = true;
            }

            if (!valid) {
              res.statusCode = 401;
              res.end(JSON.stringify({
                success: false,
                code: 'STEP_UP_CHALLENGE_FAILED',
                message: 'Invalid step-up challenge verification code. High-assurance check rejected.',
                attemptsRemaining: 2
              }));
              return;
            }

            const stepUpToken = `STU-SEC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              status: 'verified',
              stepUpToken,
              targetRole,
              assuranceLevel: 'HIGH_ASSURANCE',
              issuedAt: new Date().toISOString(),
              message: 'High-assurance identity verification succeeded. Session transition authorized.'
            }));
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
          }
        });
      });
    }
  };
}

// In-memory secure OTP storage for server lifecycle
interface EmailOtpRecord {
  email: string;
  otpHash: string;
  salt: string;
  attempts: number;
  maxAttempts: number;
  expiresAt: number;
  resendAvailableAt: number;
  purpose: 'login' | 'signup';
  role?: string;
  createdAt: number;
}

interface MobileOtpRecord {
  sessionId: string;
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

interface DevDispatchLog {
  id: string;
  type: 'EMAIL' | 'SMS';
  recipient: string;
  timestamp: string;
  provider: string;
  status: 'DELIVERED_DEV_INBOX' | 'SENT_EXTERNAL_API' | 'FAILED_CONFIG_MISSING';
  details: string;
  devOtpRef?: string;
}
const devDispatchLogs: DevDispatchLog[] = [];

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

async function dispatchEmailOtp(email: string, otp: string, purpose: string): Promise<{ success: boolean; provider: string; error?: string; missingConfig?: string[] }> {
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
          subject: `CAREQ - Your 6-Digit ${purpose === 'signup' ? 'Registration' : 'Login'} Verification Code`,
          html: `<p>Your CAREQ verification code is: <strong>${otp}</strong>. Valid for 5 minutes.</p>`
        })
      });
      if (!res.ok) {
        return { success: false, provider: 'resend', error: `Resend dispatch failed with status: ${res.status}` };
      }
      return { success: true, provider: 'resend' };
    } catch (err: any) {
      return { success: false, provider: 'resend', error: `Resend network error: ${err.message}` };
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
          subject: `CAREQ Verification Code`,
          content: [{ type: 'text/plain', value: `Your CAREQ code is: ${otp}` }]
        })
      });
      if (!res.ok) {
        return { success: false, provider: 'sendgrid', error: `SendGrid error: ${res.status}` };
      }
      return { success: true, provider: 'sendgrid' };
    } catch (err: any) {
      return { success: false, provider: 'sendgrid', error: `SendGrid error: ${err.message}` };
    }
  }

  // Development Mode (or configured dev mailbox)
  const logItem: DevDispatchLog = {
    id: `DEV-EML-${Date.now().toString(36)}`,
    type: 'EMAIL',
    recipient: email,
    timestamp: new Date().toISOString(),
    provider: 'Development Local Dispatcher',
    status: 'DELIVERED_DEV_INBOX',
    details: `Transactional Email OTP generated for ${purpose}. Expiration: 5 minutes.`,
    devOtpRef: otp
  };
  devDispatchLogs.unshift(logItem);
  if (devDispatchLogs.length > 50) devDispatchLogs.pop();

  return { success: true, provider: 'dev' };
}

async function dispatchMobileOtp(mobile: string, otp: string, roleTransition: string): Promise<{ success: boolean; provider: string; error?: string; missingConfig?: string[] }> {
  const provider = (process.env.SMS_PROVIDER || 'dev').toLowerCase();

  if (provider === 'twilio') {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_FROM_NUMBER;

    if (!sid || !token || !from) {
      return {
        success: false,
        provider: 'twilio',
        error: 'Mobile verification service is not configured.',
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
        return { success: false, provider: 'twilio', error: `Twilio dispatch failed: ${res.status}` };
      }
      return { success: true, provider: 'twilio' };
    } catch (err: any) {
      return { success: false, provider: 'twilio', error: `Twilio error: ${err.message}` };
    }
  }

  if (provider === 'msg91') {
    const authKey = process.env.MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;
    if (!authKey || !templateId) {
      return {
        success: false,
        provider: 'msg91',
        error: 'Mobile verification service is not configured.',
        missingConfig: [
          !authKey ? 'MSG91_AUTH_KEY' : '',
          !templateId ? 'MSG91_TEMPLATE_ID' : ''
        ].filter(Boolean)
      };
    }
    return { success: true, provider: 'msg91' };
  }

  // Development Dispatcher
  const logItem: DevDispatchLog = {
    id: `DEV-SMS-${Date.now().toString(36)}`,
    type: 'SMS',
    recipient: mobile,
    timestamp: new Date().toISOString(),
    provider: 'Development Local SMS Dispatcher',
    status: 'DELIVERED_DEV_INBOX',
    details: `Transactional Mobile OTP generated for workspace transition (${roleTransition}). Expiration: 5 minutes.`,
    devOtpRef: otp
  };
  devDispatchLogs.unshift(logItem);
  if (devDispatchLogs.length > 50) devDispatchLogs.pop();

  return { success: true, provider: 'dev' };
}

function careqOtpAuthPlugin() {
  return {
    name: 'careq-otp-auth',
    configureServer(server: any) {
      // 1. GET /api/auth/config-status
      server.middlewares.use('/api/auth/config-status', (req: any, res: any, next: any) => {
        if (req.method !== 'GET') return next();
        res.setHeader('Content-Type', 'application/json');

        const emailProvider = (process.env.EMAIL_PROVIDER || 'dev').toLowerCase();
        const smsProvider = (process.env.SMS_PROVIDER || 'dev').toLowerCase();

        let emailConfigured = false;
        let missingEmailConfig: string[] = [];
        if (emailProvider === 'resend') {
          emailConfigured = Boolean(process.env.RESEND_API_KEY);
          if (!emailConfigured) missingEmailConfig.push('RESEND_API_KEY');
        } else if (emailProvider === 'sendgrid') {
          emailConfigured = Boolean(process.env.SENDGRID_API_KEY);
          if (!emailConfigured) missingEmailConfig.push('SENDGRID_API_KEY');
        } else {
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
        } else {
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
          isDevMode: emailProvider === 'dev' || smsProvider === 'dev'
        }));
      });

      // 2. GET /api/dev/inbox
      server.middlewares.use('/api/dev/inbox', (req: any, res: any, next: any) => {
        if (req.method !== 'GET') return next();
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify({
          success: true,
          dispatches: devDispatchLogs,
          messages: devDispatchLogs.map(d => ({
            id: d.id,
            type: d.type,
            to: d.recipient,
            code: d.devOtpRef,
            timestamp: d.timestamp,
            details: d.details
          }))
        }));
      });

      // 3. POST /api/auth/email/send-otp
      server.middlewares.use('/api/auth/email/send-otp', (req: any, res: any, next: any) => {
        if (req.method !== 'POST') return next();

        let body = '';
        req.on('data', (chunk: any) => { body += chunk; });
        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json');
          try {
            const data = JSON.parse(body || '{}');
            const email = (data.email || '').trim().toLowerCase();
            const purpose: 'login' | 'signup' = data.purpose === 'signup' ? 'signup' : 'login';
            const role = data.role || 'PATIENT';

            if (!email || !email.includes('@')) {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: 'Valid email address is required.' }));
              return;
            }

            const existing = emailOtpStore.get(email);
            const now = Date.now();
            if (existing && now < existing.resendAvailableAt) {
              const remainingSec = Math.ceil((existing.resendAvailableAt - now) / 1000);
              res.statusCode = 429;
              res.end(JSON.stringify({
                success: false,
                error: `Please wait ${remainingSec} seconds before requesting another verification code.`,
                cooldownSeconds: remainingSec
              }));
              return;
            }

            const rawOtp = generateSecureOtp();
            const salt = crypto.randomBytes(16).toString('hex');
            const otpHash = hashOtp(rawOtp, salt);

            const dispatchResult = await dispatchEmailOtp(email, rawOtp, purpose);

            if (!dispatchResult.success) {
              res.statusCode = 503;
              res.end(JSON.stringify({
                success: false,
                error: dispatchResult.error || 'Email verification service is not configured.',
                missingConfig: dispatchResult.missingConfig || []
              }));
              return;
            }

            emailOtpStore.set(email, {
              email,
              otpHash,
              salt,
              attempts: 0,
              maxAttempts: 5,
              expiresAt: now + 5 * 60 * 1000,
              resendAvailableAt: now + 60 * 1000,
              purpose,
              role,
              createdAt: now
            });

            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              message: `A 6-digit verification code has been dispatched to ${maskEmail(email)}.`,
              maskedEmail: maskEmail(email),
              cooldownSeconds: 60,
              expiresInSeconds: 300,
              provider: dispatchResult.provider,
              devPreviewToken: dispatchResult.provider === 'dev' ? rawOtp : undefined
            }));
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ success: false, error: 'Invalid request payload.' }));
          }
        });
      });

      // 4. POST /api/auth/email/verify-otp
      server.middlewares.use('/api/auth/email/verify-otp', (req: any, res: any, next: any) => {
        if (req.method !== 'POST') return next();

        let body = '';
        req.on('data', (chunk: any) => { body += chunk; });
        req.on('end', () => {
          res.setHeader('Content-Type', 'application/json');
          try {
            const data = JSON.parse(body || '{}');
            const email = (data.email || '').trim().toLowerCase();
            const inputOtp = (data.otp || '').trim();

            if (!email || !inputOtp) {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: 'Email and 6-digit OTP code are required.' }));
              return;
            }

            const record = emailOtpStore.get(email);
            const now = Date.now();

            if (!record) {
              res.statusCode = 404;
              res.end(JSON.stringify({
                success: false,
                error: 'No active verification code found for this email. Please request a new code.'
              }));
              return;
            }

            if (now > record.expiresAt) {
              emailOtpStore.delete(email);
              res.statusCode = 410;
              res.end(JSON.stringify({
                success: false,
                error: 'This verification code has expired. Please request a new code.'
              }));
              return;
            }

            if (record.attempts >= record.maxAttempts) {
              emailOtpStore.delete(email);
              res.statusCode = 429;
              res.end(JSON.stringify({
                success: false,
                error: 'Too many failed verification attempts. Please request a new code.'
              }));
              return;
            }

            const computedHash = hashOtp(inputOtp, record.salt);
            if (computedHash !== record.otpHash) {
              record.attempts += 1;
              const remaining = record.maxAttempts - record.attempts;
              res.statusCode = 401;
              res.end(JSON.stringify({
                success: false,
                error: 'The verification code is incorrect. Please try again.',
                attemptsRemaining: remaining
              }));
              return;
            }

            emailOtpStore.delete(email);

            const sessionToken = `SES-EML-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
            const isDoctor = email.includes('dr.') || email.includes('doctor') || record.role === 'HEALTHCARE_PROFESSIONAL';
            const role = isDoctor ? 'HEALTHCARE_PROFESSIONAL' : 'PATIENT';

            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              verified: true,
              sessionToken,
              role,
              email,
              patientId: role === 'PATIENT' ? 'PAT-2026-00124' : undefined,
              professionalId: role === 'HEALTHCARE_PROFESSIONAL' ? 'PROF-DEMO-00451' : undefined,
              userName: isDoctor ? 'Dr. Ananya Sharma' : 'Riya Das',
              message: 'Email successfully verified. Authorized session created.'
            }));
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ success: false, error: 'Invalid request payload.' }));
          }
        });
      });

      // 5. POST /api/auth/mobile/send-otp
      server.middlewares.use('/api/auth/mobile/send-otp', (req: any, res: any, next: any) => {
        if (req.method !== 'POST') return next();

        let body = '';
        req.on('data', (chunk: any) => { body += chunk; });
        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json');
          try {
            const data = JSON.parse(body || '{}');
            const sessionId = (data.sessionId || '').trim();
            const currentRole = data.currentRole;
            const targetRole = data.targetRole;
            const mobileNumber = (data.mobileNumber || '+91 98765 43210').trim();
            const clinicalJustification = data.clinicalJustification;

            if (!sessionId || !targetRole) {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: 'Active session ID and target role are required.' }));
              return;
            }

            if (currentRole === targetRole) {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: 'Target workspace must be different from current workspace.' }));
              return;
            }

            const now = Date.now();
            const existing = mobileOtpStore.get(sessionId);
            if (existing && now < existing.resendAvailableAt) {
              const remainingSec = Math.ceil((existing.resendAvailableAt - now) / 1000);
              res.statusCode = 429;
              res.end(JSON.stringify({
                success: false,
                error: `Please wait ${remainingSec} seconds before requesting another SMS code.`,
                cooldownSeconds: remainingSec
              }));
              return;
            }

            const rawOtp = generateSecureOtp();
            const salt = crypto.randomBytes(16).toString('hex');
            const otpHash = hashOtp(rawOtp, salt);

            const dispatchResult = await dispatchMobileOtp(mobileNumber, rawOtp, `${currentRole} -> ${targetRole}`);

            if (!dispatchResult.success) {
              res.statusCode = 503;
              res.end(JSON.stringify({
                success: false,
                error: dispatchResult.error || 'Mobile verification service is not configured.',
                missingConfig: dispatchResult.missingConfig || []
              }));
              return;
            }

            mobileOtpStore.set(sessionId, {
              sessionId,
              mobileNumber,
              otpHash,
              salt,
              attempts: 0,
              maxAttempts: 5,
              expiresAt: now + 5 * 60 * 1000,
              resendAvailableAt: now + 60 * 1000,
              currentRole,
              targetRole,
              clinicalJustification,
              createdAt: now
            });

            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              message: `Verification code dispatched to your registered mobile number: ${maskMobile(mobileNumber)}.`,
              maskedMobile: maskMobile(mobileNumber),
              cooldownSeconds: 60,
              expiresInSeconds: 300,
              provider: dispatchResult.provider,
              devPreviewToken: dispatchResult.provider === 'dev' ? rawOtp : undefined
            }));
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ success: false, error: 'Invalid request payload.' }));
          }
        });
      });

      // 6. POST /api/auth/mobile/verify-otp
      server.middlewares.use('/api/auth/mobile/verify-otp', (req: any, res: any, next: any) => {
        if (req.method !== 'POST') return next();

        let body = '';
        req.on('data', (chunk: any) => { body += chunk; });
        req.on('end', () => {
          res.setHeader('Content-Type', 'application/json');
          try {
            const data = JSON.parse(body || '{}');
            const sessionId = (data.sessionId || '').trim();
            const inputOtp = (data.otp || '').trim();
            const targetRole = data.targetRole;

            if (!sessionId || !inputOtp) {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: 'Session ID and 6-digit Mobile OTP are required.' }));
              return;
            }

            const record = mobileOtpStore.get(sessionId);
            const now = Date.now();

            if (!record) {
              res.statusCode = 404;
              res.end(JSON.stringify({
                success: false,
                error: 'No active mobile verification session found. Please request a new verification code.'
              }));
              return;
            }

            if (now > record.expiresAt) {
              mobileOtpStore.delete(sessionId);
              res.statusCode = 410;
              res.end(JSON.stringify({
                success: false,
                error: 'This verification code has expired. Request a new code.'
              }));
              return;
            }

            if (record.attempts >= record.maxAttempts) {
              mobileOtpStore.delete(sessionId);
              res.statusCode = 429;
              res.end(JSON.stringify({
                success: false,
                error: 'Too many verification attempts. Please request a new code.'
              }));
              return;
            }

            const computedHash = hashOtp(inputOtp, record.salt);
            if (computedHash !== record.otpHash) {
              record.attempts += 1;
              const remaining = record.maxAttempts - record.attempts;
              res.statusCode = 401;
              res.end(JSON.stringify({
                success: false,
                error: 'The verification code is incorrect. Please try again.',
                attemptsRemaining: remaining
              }));
              return;
            }

            mobileOtpStore.delete(sessionId);

            const newSessionId = `SES-MOB-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;

            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              verified: true,
              targetRole: record.targetRole || targetRole,
              newSessionId,
              sessionToken: newSessionId,
              clinicalJustification: record.clinicalJustification,
              message: 'Mobile number verified. Previous workspace terminated and new workspace session authorized.'
            }));
          } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({ success: false, error: 'Invalid request payload.' }));
          }
        });
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
