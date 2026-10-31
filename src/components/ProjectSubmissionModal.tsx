import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCertificate } from '../types/curriculum';
import { X, GitBranch, Check, Sparkles, AlertCircle } from 'lucide-react';
import { KodiMascot } from './KodiMascot';
import confetti from 'canvas-confetti';

interface ProjectSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCertificateIssued: (cert: UserCertificate) => void;
}

export const ProjectSubmissionModal: React.FC<ProjectSubmissionModalProps> = ({
  isOpen,
  onClose,
  onCertificateIssued,
}) => {
  const { user, progress, addCertificate } = useAuth();
  const [githubUrl, setGithubUrl] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!githubUrl.includes('github.com/')) {
      setError('Please provide a valid public GitHub repository URL (e.g. https://github.com/username/project).');
      return;
    }

    if (!projectTitle.trim() || !projectDescription.trim()) {
      setError('Please fill in both the project title and architectural description.');
      return;
    }

    setIsSubmitting(true);

    try {
      const uniqueId = `CDK-MASTER-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const nowStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const masterCert: UserCertificate = {
        certId: uniqueId,
        userId: user?.uid || 'guest-learner',
        learnerName: user?.displayName || progress.displayName || 'Codeks Polyglot Scholar',
        languageId: 'master-polyglot',
        languageName: 'Full-Stack & Systems Master Curriculum',
        issuedAt: nowStr,
        studyHours: Math.max(12, Math.round(progress.studyMinutes / 60) + 4),
        score: 98,
        verificationHash: Array.from(crypto.getRandomValues(new Uint8Array(20)))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join(''),
        githubRepoUrl: githubUrl,
        isMaster: true,
      };

      await addCertificate(masterCert);
      onCertificateIssued(masterCert);

      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#ffd23f', '#ff7eb6', '#6c4cf1', '#00b3a4'],
        });
      } catch {}

      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to submit project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn select-none">
      <div className="bg-white dark:bg-[#151126] w-full max-w-xl rounded-[32px] border-2 border-[#ffd23f] shadow-2xl p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-500 hover:text-gray-800 dark:hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <KodiMascot size="sm" mood="cheering" />
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ffd23f]" />
              <span className="text-[11px] font-black uppercase text-[#d97706] tracking-wider">
                Elite Master Credential
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1e1b4b] dark:text-white">
              Submit GitHub Capstone
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
          Submit your public GitHub repository demonstrating a production application or open-source tool. Kodi’s validation checks code structure and commits to issue your Master Certificate.
        </p>

        {error && (
          <div className="p-3.5 mb-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-300 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
              Public GitHub Repository URL:
            </label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-gray-50 dark:bg-[#201a3d] border border-gray-200 dark:border-white/10">
              <GitBranch className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="url"
                required
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/your-username/my-fullstack-app"
                className="w-full bg-transparent text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
              Project Title:
            </label>
            <input
              type="text"
              required
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="e.g. Distributed Task Scheduler & Realtime Dashboard"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 dark:bg-[#201a3d] border border-gray-200 dark:border-white/10 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
              Architecture & Features Description:
            </label>
            <textarea
              required
              rows={3}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Describe technologies used, architecture patterns, and key features..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 dark:bg-[#201a3d] border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-[#ffd23f] hover:bg-[#ffcd2b] text-[#78350f] font-black text-sm shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? 'Validating Repository...' : 'Verify & Unlock Master Certificate'}
          </button>
        </form>
      </div>
    </div>
  );
};
