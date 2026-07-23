import React, { useState } from 'react';
import { X, CheckCircle2, GraduationCap, BarChart2, ExternalLink, RefreshCw, Zap } from 'lucide-react';

interface IntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IntegrationsModal: React.FC<IntegrationsModalProps> = ({ isOpen, onClose }) => {
  const [googleClassroomConnected, setGoogleClassroomConnected] = useState(true);
  const [lookerConnected, setLookerConnected] = useState(false);
  const [moodleConnected, setMoodleConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isOpen) return null;

  const handleSyncNow = (systemName: string) => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert(`${systemName} data successfully synchronized!`);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#161618] border border-[#27272A] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#27272A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4285F4] to-[#8E75FF] flex items-center justify-center text-white shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif italic text-white">LMS & Analytics Integrations</h2>
              <p className="text-xs text-[#A1A1AA]">Connect Google Classroom, Looker Studio, and Moodle LMS</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#A1A1AA] hover:text-white hover:bg-[#1C1C1E] rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Google Classroom */}
          <div className="p-5 rounded-2xl bg-[#1C1C1E] border border-[#27272A] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#4285F4]/20 border border-[#4285F4]/30 flex items-center justify-center text-[#4285F4] font-bold text-sm">
                  GC
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Google Classroom
                    {googleClassroomConnected && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                        Connected
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-[#A1A1AA]">Auto-sync rosters, coursework, and grades directly with Google Classroom.</p>
                </div>
              </div>

              <button
                onClick={() => setGoogleClassroomConnected(!googleClassroomConnected)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  googleClassroomConnected
                    ? 'bg-rose-900/30 border border-rose-800/40 text-rose-400 hover:bg-rose-900/50'
                    : 'bg-[#4285F4] hover:bg-[#4285F4]/90 text-white shadow'
                }`}
              >
                {googleClassroomConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>

            {googleClassroomConnected && (
              <div className="pt-3 border-t border-[#27272A] flex items-center justify-between text-xs text-[#EDEDED]">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Synced: AP Physics 101 (28 Students)
                </span>
                <button
                  onClick={() => handleSyncNow('Google Classroom')}
                  disabled={isSyncing}
                  className="text-xs text-[#8E75FF] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                  Sync Rosters & Grades
                </button>
              </div>
            )}
          </div>

          {/* Looker Studio */}
          <div className="p-5 rounded-2xl bg-[#1C1C1E] border border-[#27272A] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
                  LS
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Google Looker Studio
                    {lookerConnected && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                        Active Connector
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-[#A1A1AA]">Export live student doubt volumes and mastery indexes for institutional reporting.</p>
                </div>
              </div>

              <button
                onClick={() => setLookerConnected(!lookerConnected)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  lookerConnected
                    ? 'bg-rose-900/30 border border-rose-800/40 text-rose-400 hover:bg-rose-900/50'
                    : 'bg-amber-500 hover:bg-amber-600 text-black font-extrabold shadow'
                }`}
              >
                {lookerConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>

            {lookerConnected && (
              <div className="pt-3 border-t border-[#27272A] flex items-center justify-between text-xs text-[#EDEDED]">
                <span className="text-amber-400 font-semibold">Live BigQuery Data Stream Enabled</span>
                <a
                  href="https://lookerstudio.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#8E75FF] font-bold hover:underline flex items-center gap-1"
                >
                  Open Looker Studio <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Moodle LMS */}
          <div className="p-5 rounded-2xl bg-[#1C1C1E] border border-[#27272A] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-sm">
                  M
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Moodle LMS (LTI 1.3)
                    {moodleConnected && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                        LTI Advantage
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-[#A1A1AA]">Sync course modules, quizzes, and gradebook assignments via LTI 1.3 standard.</p>
                </div>
              </div>

              <button
                onClick={() => setMoodleConnected(!moodleConnected)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  moodleConnected
                    ? 'bg-rose-900/30 border border-rose-800/40 text-rose-400 hover:bg-rose-900/50'
                    : 'bg-orange-500 hover:bg-orange-600 text-black font-extrabold shadow'
                }`}
              >
                {moodleConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>

            {moodleConnected && (
              <div className="pt-3 border-t border-[#27272A] flex items-center justify-between text-xs text-[#EDEDED]">
                <span className="text-orange-400 font-semibold">Moodle Course LTI 1.3 Active</span>
                <button
                  onClick={() => handleSyncNow('Moodle LMS')}
                  disabled={isSyncing}
                  className="text-xs text-[#8E75FF] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                  Sync Course Items
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#27272A] bg-[#111113] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1C1C1E] border border-[#27272A] hover:bg-[#27272A] text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
