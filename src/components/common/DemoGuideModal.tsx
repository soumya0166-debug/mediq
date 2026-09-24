import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  UserPlus, 
  Mic, 
  FileSearch, 
  Layers, 
  Send, 
  Stethoscope, 
  Eye, 
  HelpCircle, 
  Share2, 
  History,
  Play
} from 'lucide-react';

export const DemoGuideModal: React.FC = () => {
  const { 
    isDemoGuideOpen, 
    setDemoGuideOpen, 
    demoGuideStep, 
    setDemoGuideStep, 
    navigate, 
    switchRole,
    loginAsPatient,
    loginAsDoctor,
    setSelectedAssessmentId
  } = useApp();

  if (!isDemoGuideOpen) return null;

  const DEMO_STEPS = [
    {
      step: 1,
      title: 'Digital Health Gateway (Authentication)',
      desc: 'Dual-card authentication for Patient and Healthcare Professional with trust pillars.',
      actionLabel: 'Go to Gateway',
      icon: UserPlus,
      execute: () => navigate('/login')
    },
    {
      step: 2,
      title: 'Patient Digital Identity & Consent Onboarding',
      desc: 'Simulate 4-step onboarding: Identity (Demo Aadhaar OTP), Profile, and Granular Consent.',
      actionLabel: 'Open Patient Onboarding',
      icon: UserPlus,
      execute: () => navigate('/register/patient')
    },
    {
      step: 3,
      title: 'Multimodal Symptom Intake (Odia / Hindi / English)',
      desc: 'Voice or text entry with regional dialect recognition and clinician English translation.',
      actionLabel: 'Open Assessment Workspace',
      icon: Mic,
      execute: () => {
        loginAsPatient('PAT-2026-00124');
        navigate('/patient/new-assessment');
      }
    },
    {
      step: 4,
      title: 'Medical Document Upload (CBC Blood Report)',
      desc: 'Attach lab reports or radiology summaries to test automated OCR extraction.',
      actionLabel: 'Jump to Document Upload',
      icon: FileSearch,
      execute: () => {
        loginAsPatient('PAT-2026-00124');
        navigate('/patient/new-assessment');
      }
    },
    {
      step: 5,
      title: 'Automated OCR Parameter Extraction',
      desc: 'Inspect parsed parameters (WBC 14,200 /µL, Neutrophils 82%) and out-of-range flags.',
      actionLabel: 'View Lab OCR Vault',
      icon: FileSearch,
      execute: () => {
        loginAsDoctor('DOC-NMC-84920');
        navigate('/doctor/reports');
      }
    },
    {
      step: 6,
      title: 'AI Pre-Triage Synthesis (Timeline & Gaps)',
      desc: 'Review structured synthesis: chronological timeline, missing vitals checklist, and urgency flags.',
      actionLabel: 'Inspect Synthesized Review',
      icon: Layers,
      execute: () => {
        loginAsDoctor('DOC-NMC-84920');
        setSelectedAssessmentId('ASM-2026-00124');
        navigate('/doctor/review/ASM-2026-00124');
      }
    },
    {
      step: 7,
      title: 'Patient Submission & Real-Time Tracking',
      desc: 'Patient overview tracking 5-stage progression and queue position.',
      actionLabel: 'View Patient History & Status',
      icon: Send,
      execute: () => {
        loginAsPatient('PAT-2026-00124');
        navigate('/patient/history');
      }
    },
    {
      step: 8,
      title: 'Role Switch to Clinician (Dr. Ananya Sharma)',
      desc: 'Switch to Dr. Ananya Sharma (Medical Officer at CAREQ Demo PHC Jatni).',
      actionLabel: 'Switch to Clinician Mode',
      icon: Stethoscope,
      execute: () => {
        switchRole('doctor');
      }
    },
    {
      step: 9,
      title: 'Clinical Review Workspace & Priority Queue',
      desc: 'High-density command center with restrained risk signal tags (🔴 HIGH PRIORITY).',
      actionLabel: 'Open Patient Queue',
      icon: Eye,
      execute: () => {
        loginAsDoctor('DOC-NMC-84920');
        navigate('/doctor/queue');
      }
    },
    {
      step: 10,
      title: '3-Panel Clinical Review Workspace',
      desc: 'Left: Patient context; Center: Information intelligence; Right: Review actions.',
      actionLabel: 'Open Case ASM-2026-00124',
      icon: Layers,
      execute: () => {
        loginAsDoctor('DOC-NMC-84920');
        setSelectedAssessmentId('ASM-2026-00124');
        navigate('/doctor/review/ASM-2026-00124');
      }
    },
    {
      step: 11,
      title: 'Source Traceability & Urgency Signals',
      desc: 'Inspect source attribution ([View Source]) for every AI-extracted finding.',
      actionLabel: 'Inspect Traceability',
      icon: Eye,
      execute: () => {
        loginAsDoctor('DOC-NMC-84920');
        setSelectedAssessmentId('ASM-2026-00124');
        navigate('/doctor/review/ASM-2026-00124');
      }
    },
    {
      step: 12,
      title: 'Clinician ↔ Patient Follow-Up Loop',
      desc: 'Doctor requests missing vitals (e.g. SpO2); patient receives and responds in real-time.',
      actionLabel: 'Test Follow-Up Questions',
      icon: HelpCircle,
      execute: () => {
        loginAsDoctor('DOC-NMC-84920');
        setSelectedAssessmentId('ASM-2026-00124');
        navigate('/doctor/review/ASM-2026-00124');
      }
    },
    {
      step: 13,
      title: 'Institutional Referral Note Draft',
      desc: 'Structured referral draft for tertiary care handover (SCB Medical College) with copy/print.',
      actionLabel: 'Open Referral Generator',
      icon: Share2,
      execute: () => {
        loginAsDoctor('DOC-NMC-84920');
        setSelectedAssessmentId('ASM-2026-00124');
        navigate('/doctor/referral/ASM-2026-00124');
      }
    },
    {
      step: 14,
      title: 'Activity & Audit Trail Verification',
      desc: 'Cryptographic event ledger logging all intake, OCR, and doctor actions with SHA-256 hashes.',
      actionLabel: 'Open Audit Log',
      icon: History,
      execute: () => {
        loginAsDoctor('DOC-NMC-84920');
        navigate('/doctor/audit-log');
      }
    }
  ];

  const currentStepData = DEMO_STEPS[demoGuideStep - 1] || DEMO_STEPS[0];

  const handleExecuteStep = (stepNumber: number) => {
    setDemoGuideStep(stepNumber);
    const item = DEMO_STEPS[stepNumber - 1];
    if (item) {
      item.execute();
    }
  };

  const handleNextStep = () => {
    if (demoGuideStep < DEMO_STEPS.length) {
      handleExecuteStep(demoGuideStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (demoGuideStep > 1) {
      handleExecuteStep(demoGuideStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-careq-xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-careq-md border border-slate-200 flex flex-col"
        role="dialog"
      >
        {/* Header */}
        <div className="bg-[#0A1E3F] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-careq-sm bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base">CAREQ Evaluator Walkthrough</h3>
                <span className="bg-teal-500/20 text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-500/30">
                  Step {demoGuideStep} of 14
                </span>
              </div>
              <p className="text-xs text-slate-300">
                14-Stage Human-in-the-Loop Digital Health Triage Evaluation
              </p>
            </div>
          </div>
          <button 
            onClick={() => setDemoGuideOpen(false)}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Step Banner */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">
              Active Demonstration Step
            </span>
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Step {currentStepData.step}: {currentStepData.title}
            </h4>
            <p className="text-xs text-slate-600">
              {currentStepData.desc}
            </p>
          </div>
          <button
            onClick={() => {
              currentStepData.execute();
              setDemoGuideOpen(false);
            }}
            className="px-4 py-2 bg-[#0A1E3F] hover:bg-[#163B66] text-white rounded-careq-sm text-xs font-bold shadow-careq-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto flex-shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current text-teal-300" />
            <span>Launch Step {currentStepData.step}</span>
          </button>
        </div>

        {/* Steps Grid */}
        <div className="p-6 overflow-y-auto max-h-[48vh] space-y-2 bg-[#F8FAFC]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DEMO_STEPS.map((item) => {
              const isActive = item.step === demoGuideStep;
              const isPassed = item.step < demoGuideStep;

              return (
                <div
                  key={item.step}
                  onClick={() => handleExecuteStep(item.step)}
                  className={`p-3 rounded-careq-md border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                    isActive 
                      ? 'bg-blue-50 border-[#0A1E3F] shadow-careq-xs ring-1 ring-[#0A1E3F]' 
                      : isPassed
                      ? 'bg-white border-emerald-200 hover:border-slate-300'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                    isActive 
                      ? 'bg-[#0A1E3F] text-white' 
                      : isPassed
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {isPassed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : item.step}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className={`text-xs font-bold truncate ${isActive ? 'text-[#0A1E3F]' : 'text-slate-800'}`}>
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Navigation Controls */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handlePrevStep}
            disabled={demoGuideStep <= 1}
            className="px-4 py-2 rounded-careq-sm text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous Step
          </button>
          <div className="text-xs font-medium text-slate-500 hidden sm:block">
            Click any step to jump directly
          </div>
          <button
            onClick={handleNextStep}
            disabled={demoGuideStep >= DEMO_STEPS.length}
            className="px-5 py-2 rounded-careq-sm text-xs font-bold bg-[#0A1E3F] hover:bg-[#163B66] text-white flex items-center gap-1.5 shadow-careq-xs disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
