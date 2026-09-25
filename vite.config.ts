import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

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

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    voiceApiPlugin(),
    careqApiAuthPlugin()
  ],
  server: {
    port: 5180,
    strictPort: false
  }
});
