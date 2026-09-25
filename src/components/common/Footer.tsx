import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Shield, Lock, FileCheck, PhoneCall, Sparkles, AlertCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, setPrivacyModalOpen, setDemoGuideOpen } = useApp();
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0A1E3F] text-slate-300 border-t border-[#163B66] mt-auto pt-8 pb-8 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Disclaimer Box - Section 50 */}
        <div className="bg-[#0F294A] rounded-careq-lg p-4 sm:p-5 border border-[#1E4575] mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="w-8 h-8 rounded-careq-sm bg-amber-400/20 border border-amber-400/30 flex items-center justify-center flex-shrink-0 text-amber-400">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="text-amber-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
                <span>{t('common.educationalDisclaimer')}</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                {t('common.educationalDisclaimer')} {t('common.syntheticDataNotice')}
              </p>
            </div>
          </div>
        </div>

        {/* Links & Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-6 border-b border-[#163B66]">
          
          {/* Col 1: Platform Overview */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base tracking-tight">{t('common.brandName')}</span>
              <span className="text-[10px] text-teal-300 uppercase tracking-widest bg-white/10 px-1.5 py-0.5 rounded">{t('common.descriptor')}</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {t('auth.brandSummary')}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-teal-300 font-semibold pt-1">
              <Shield className="w-3.5 h-3.5" />
              <span>{t('auth.trustVerified')} &amp; {t('auth.trustConsent')}</span>
            </div>
          </div>

          {/* Col 2: Core Experiences */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-2.5">{t('common.footerPlatformExperiences')}</h4>
            <ul className="space-y-1.5 text-slate-300 text-xs">
              <li>
                <button onClick={() => navigate('/login')} className="hover:text-white transition-colors">
                  {t('nav.signIn')} / {t('auth.welcomeTitle')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/patient/dashboard')} className="hover:text-white transition-colors">
                  {t('nav.dashboard')} ({t('auth.patientRoleTitle')})
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/doctor/dashboard')} className="hover:text-white transition-colors">
                  {t('clinical.workspaceTitle')} ({t('auth.clinicalRoleTitle')})
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/verify')} className="hover:text-white transition-colors">
                  {t('auth.professionalVerifyTitle')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Privacy & Responsible AI */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-2.5">{t('common.footerGovernanceAudit')}</h4>
            <ul className="space-y-1.5 text-slate-300 text-xs">
              <li>
                <button onClick={() => setPrivacyModalOpen(true)} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-teal-400" />
                  {t('consent.pageTitle')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/doctor/audit-log')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <FileCheck className="w-3 h-3 text-teal-400" />
                  {t('audit.pageTitle')}
                </button>
              </li>
              <li>
                <button onClick={() => setDemoGuideOpen(true)} className="hover:text-white transition-colors flex items-center gap-1.5 text-amber-300 font-medium">
                  <Sparkles className="w-3 h-3" />
                  {t('nav.evaluationGuide')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Emergency Contact */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-2.5">{t('common.footerEmergencyNotice')}</h4>
            <div className="bg-red-950/40 border border-red-800/60 rounded-careq-md p-3 text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-red-300 font-bold">
                <PhoneCall className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <span>{t('common.emergencyTitle')}</span>
              </div>
              <p className="text-[11px] text-red-200 leading-tight">
                {t('common.emergencyDesc')}
              </p>
              <div className="flex gap-2 pt-1 font-mono font-bold text-xs text-white">
                <span className="bg-red-800 px-2 py-0.5 rounded">{t('common.emergencyAmbulance')}</span>
                <span className="bg-red-800 px-2 py-0.5 rounded">{t('common.emergencyNational')}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400 text-[11px]">
          <div>
            {t('common.footerCopyright')}
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer" onClick={() => setPrivacyModalOpen(true)}>{t('common.footerConsentPolicy')}</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer" onClick={() => setPrivacyModalOpen(true)}>{t('common.footerDataGovernance')}</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer" onClick={() => navigate('/verify')}>{t('common.footerDemoCredentials')}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
