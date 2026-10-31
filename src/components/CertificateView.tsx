import React, { useState } from 'react';
import { UserCertificate } from '../types/curriculum';
import { Award, Printer, Copy, Check, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';

interface CertificateViewProps {
  certificate: UserCertificate;
  onClose?: () => void;
  isStandaloneVerification?: boolean;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  certificate,
  onClose,
  isStandaloneVerification = false,
}) => {
  const [copied, setCopied] = useState(false);

  const verificationUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/#verify-${certificate.certId}`
    : `https://codeks.academy/verify/${certificate.certId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Action Controls (Hidden on Print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#1a162b] p-4 rounded-3xl border-2 border-[#6c4cf1]/15 shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <div>
            <p className="text-xs font-black uppercase text-gray-500">Official Credential</p>
            <p className="text-sm font-extrabold text-[#1e1b4b] dark:text-white">
              Verified Certificate #{certificate.certId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#f3efff] dark:bg-[#201a3d] text-[#6c4cf1] dark:text-[#c4b5fd] text-xs font-bold hover:bg-[#6c4cf1]/15 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Copy Verification Link'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6c4cf1] text-white text-xs font-bold hover:bg-[#5839e6] transition-all shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-200 transition-all"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* The Printable Certificate Sheet */}
      <div className="certificate-print-sheet bg-white text-[#1e1b4b] p-8 sm:p-14 rounded-[36px] border-8 border-[#6c4cf1] shadow-2xl relative overflow-hidden select-none">
        
        {/* Memphis Geometric Corner Accents */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#ffd23f] rounded-full opacity-60" />
        <div className="absolute -top-8 -right-8 w-28 h-28 bg-[#ff7eb6] rounded-full opacity-60" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#00b3a4] rounded-full opacity-50" />
        <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-[#3a86ff] rounded-full opacity-60" />

        {/* Squiggle decorations */}
        <svg className="absolute top-10 left-12 w-14 h-8 opacity-40" viewBox="0 0 100 40">
          <path d="M 0 20 Q 25 0 50 20 T 100 20" fill="none" stroke="#6c4cf1" strokeWidth="6" strokeLinecap="round" />
        </svg>
        <svg className="absolute bottom-12 right-14 w-14 h-8 opacity-40" viewBox="0 0 100 40">
          <path d="M 0 20 Q 25 40 50 20 T 100 20" fill="none" stroke="#ff7eb6" strokeWidth="6" strokeLinecap="round" />
        </svg>

        {/* Certificate Core Content */}
        <div className="relative z-10 text-center space-y-6 max-w-2xl mx-auto">
          
          {/* Top Logo & Title */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-3xl bg-[#f3efff] border-2 border-[#6c4cf1] flex items-center justify-center shadow-md">
              <Award className="w-9 h-9 text-[#6c4cf1]" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[#1e1b4b]">
              CODE<span className="text-[#6c4cf1]">KS</span> ACADEMY
            </span>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ffd23f]/30 border border-[#ffd23f] text-[#78350f] text-[11px] font-black uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-[#d97706]" />
              <span>Certificate of Achievement</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs uppercase font-extrabold tracking-wider text-gray-500">
              This is to certify that
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-[#1e1b4b] tracking-tight border-b-2 border-gray-200 pb-2 inline-block px-8">
              {certificate.learnerName}
            </h1>
          </div>

          <div className="space-y-2">
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-lg mx-auto">
              has successfully completed all 11 curriculum chapters, passed the comprehensive final evaluation with an exam score of{' '}
              <span className="font-black text-[#6c4cf1]">{certificate.score}%</span>, and completed interactive hands-on coding tasks in:
            </p>
            <div className="inline-block py-2 px-6 rounded-2xl bg-[#6c4cf1] text-white font-black text-xl sm:text-2xl tracking-wide shadow-md">
              {certificate.languageName}
            </div>
          </div>

          {/* GitHub Repo tag for Master Cert */}
          {certificate.githubRepoUrl && (
            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs font-mono max-w-md mx-auto text-gray-700">
              <span className="font-bold block text-gray-500 uppercase text-[10px]">Verified GitHub Capstone:</span>
              <a href={certificate.githubRepoUrl} target="_blank" rel="noopener noreferrer" className="text-[#3a86ff] underline truncate block">
                {certificate.githubRepoUrl}
              </a>
            </div>
          )}

          {/* Certificate Metadata Grid */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t-2 border-dashed border-gray-200 text-left">
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Date Issued</p>
              <p className="text-xs font-black text-gray-800">{certificate.issuedAt}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Study Hours</p>
              <p className="text-xs font-black text-gray-800">{certificate.studyHours} Hours</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Certificate ID</p>
              <p className="text-xs font-mono font-bold text-[#6c4cf1] truncate">{certificate.certId}</p>
            </div>
          </div>

          {/* Bottom Security Seals */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
            <div className="text-left space-y-0.5">
              <div className="flex items-center gap-1.5 text-emerald-600 font-black text-xs uppercase tracking-wide">
                <ShieldCheck className="w-4 h-4" />
                <span>Digitally Verified & Tamper-Proof</span>
              </div>
              <p className="text-[10px] font-mono text-gray-400 break-all">
                Hash: {certificate.verificationHash.slice(0, 32)}...
              </p>
            </div>

            {/* Kodi's Seal of Approval */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[11px] font-black text-[#1e1b4b]">Kodi</p>
                <p className="text-[9px] text-gray-500 uppercase font-bold">Academic Dean</p>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#ffd23f] bg-[#ffd23f]/20 flex items-center justify-center font-black text-[10px] text-[#b45309]">
                SEAL
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
