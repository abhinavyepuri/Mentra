import React from 'react';
import { ClassroomInsight, Classroom } from '../../types';
import {
  Lightbulb,
  Sparkles,
  RefreshCw,
  TrendingDown,
  Clock,
  ListOrdered,
  AlertCircle,
  BarChart,
} from 'lucide-react';

interface InsightsCompilerProps {
  insight: ClassroomInsight | null;
  activeClassroom: Classroom;
  onRecompile: () => void;
  isLoading: boolean;
}

export const InsightsCompiler: React.FC<InsightsCompilerProps> = ({
  insight,
  activeClassroom,
  onRecompile,
  isLoading,
}) => {
  const getSentimentColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
    if (score >= 60) return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/20 border-rose-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#161618] border border-[#27272A] text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1C1E] text-[#8E75FF] border border-[#27272A] text-xs font-semibold uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#8E75FF]" />
            Classroom Insights Compiler
          </div>
          <h1 className="text-2xl font-serif italic text-white">{activeClassroom.name} Analytics</h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Aggregates silent student doubts, Socratic chat logs, and quiz trends to compute class sentiment and lecture recommendations.
          </p>
        </div>

        <button
          onClick={onRecompile}
          disabled={isLoading}
          className="px-5 py-2.5 rounded-xl bg-[#8E75FF] text-white hover:bg-[#8E75FF]/90 text-xs font-bold shadow flex items-center gap-2 transition disabled:opacity-50 shrink-0 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Compiling Insights...' : 'Re-Compile Insights'}
        </button>
      </div>

      {isLoading ? (
        <div className="bg-[#161618] p-12 rounded-2xl border border-[#27272A] text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#8E75FF] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-white">
            Gemini is compiling student doubt streams into structured class sentiment and micro-revisions...
          </p>
        </div>
      ) : insight ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Class Sentiment & Summary Card */}
            <div className="bg-[#161618] p-6 rounded-2xl border border-[#27272A] space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#27272A]">
                <div>
                  <h2 className="text-xs font-semibold text-[#8E75FF] uppercase tracking-wider">Classroom Sentiment & Confidence</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-3xl font-light text-white">
                      {insight.sentimentScore}
                      <span className="text-sm font-normal text-[#A1A1AA]">/100</span>
                    </span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getSentimentColor(insight.sentimentScore)}`}>
                      {insight.sentimentLabel}
                    </span>
                  </div>
                </div>
                <div className="text-right text-xs text-[#A1A1AA]">
                  Last compiled: {new Date(insight.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-[#8E75FF] uppercase tracking-wider mb-2">Executive Summary</h3>
                <p className="text-xs text-[#EDEDED] leading-relaxed bg-[#1C1C1E] p-4 rounded-xl border border-[#27272A]">
                  {insight.summary}
                </p>
              </div>
            </div>

            {/* Top Weak Concepts Breakdown */}
            <div className="bg-[#161618] p-6 rounded-2xl border border-[#27272A] space-y-4">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                Class-Wide Conceptual Friction Points
              </h2>

              <div className="space-y-4">
                {insight.topWeakConcepts.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#1C1C1E] border border-[#27272A] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{item.concept}</span>
                      <span className="text-xs font-bold text-rose-400 bg-rose-900/30 border border-rose-800/40 px-2 py-0.5 rounded">
                        {item.confusionPercentage}% Confusion
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#27272A] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.confusionPercentage}%` }}
                      ></div>
                    </div>

                    <p className="text-[11px] text-[#A1A1AA]">
                      <strong className="text-white">Key Barrier:</strong> {item.keyBarrier}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (1 col) - Micro-Revisions & Lecture Agenda */}
          <div className="space-y-6">
            {/* Micro Revisions */}
            <div className="bg-[#161618] p-6 rounded-2xl border border-[#27272A] space-y-4">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Recommended Micro-Revisions
              </h2>
              <ul className="space-y-2.5">
                {insight.microRevisions.map((rev, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-[#1C1C1E] border border-[#27272A] text-xs text-[#EDEDED] flex items-start gap-2 leading-relaxed">
                    <span className="w-4 h-4 rounded-full bg-[#8E75FF] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{rev}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggested Lecture Agenda */}
            <div className="bg-[#161618] p-6 rounded-2xl border border-[#27272A] space-y-4">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#4285F4]" />
                Suggested Next Lecture Plan
              </h2>
              <div className="space-y-2">
                {insight.nextLectureAgenda.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[#1C1C1E] text-xs text-[#EDEDED] border border-[#27272A] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8E75FF] shrink-0"></span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
