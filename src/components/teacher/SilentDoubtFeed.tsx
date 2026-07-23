import React, { useState } from 'react';
import { Doubt } from '../../types';
import {
  MessageSquareWarning,
  Sparkles,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  User,
  Zap,
} from 'lucide-react';

interface SilentDoubtFeedProps {
  doubts: Doubt[];
  onGenerateRemedialPlan: (doubt: Doubt) => void;
  onUpdateStatus: (id: string, status: 'unresolved' | 'in_review' | 'remediated') => void;
}

export const SilentDoubtFeed: React.FC<SilentDoubtFeedProps> = ({
  doubts,
  onGenerateRemedialPlan,
  onUpdateStatus,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredDoubts = doubts.filter((d) => {
    const matchesSeverity = filterSeverity === 'all' || d.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || d.status === filterStatus;
    const matchesSearch =
      searchQuery === '' ||
      d.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.conceptTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.doubtSnippet.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-rose-900/30 text-rose-400 border-rose-800/40';
      case 'medium':
        return 'bg-amber-900/30 text-amber-400 border-amber-800/40';
      default:
        return 'bg-[#27272A] text-[#EDEDED] border-[#3F3F46]';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unresolved':
        return 'bg-rose-900/30 text-rose-400 border border-rose-800/40';
      case 'in_review':
        return 'bg-[#4285F4]/20 text-[#4285F4] border border-[#4285F4]/30';
      case 'remediated':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[#161618] border border-[#27272A] text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1C1E] text-[#8E75FF] border border-[#27272A] text-xs font-semibold uppercase tracking-widest mb-2">
            <Zap className="w-3.5 h-3.5 text-[#8E75FF]" />
            Live Silent Doubt Stream
          </div>
          <h1 className="text-2xl font-serif italic text-white">Student Confusion Radar</h1>
          <p className="text-xs text-[#A1A1AA] mt-1 max-w-2xl">
            Doubts are silently captured in real-time as students converse with the Socratic AI Tutor. The student never sees this feed, protecting psychological safety.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-[#1C1C1E] p-3 rounded-xl border border-[#27272A]">
          <MessageSquareWarning className="w-6 h-6 text-rose-400 shrink-0" />
          <div>
            <span className="text-xl font-light text-white">
              {doubts.filter((d) => d.status === 'unresolved').length}
            </span>
            <span className="block text-[10px] text-[#A1A1AA] uppercase font-semibold">Active Unresolved</span>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-[#161618] p-4 rounded-xl border border-[#27272A] flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search student, concept, snippet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#1C1C1E] border border-[#27272A] rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#8E75FF] text-white placeholder-[#A1A1AA]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-4 h-4 text-[#A1A1AA] shrink-0" />
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-[#1C1C1E] border border-[#27272A] rounded-lg text-xs px-2.5 py-1.5 text-[#EDEDED]"
          >
            <option value="all">All Severities</option>
            <option value="high">High Severity</option>
            <option value="medium">Medium Severity</option>
            <option value="low">Low Severity</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#1C1C1E] border border-[#27272A] rounded-lg text-xs px-2.5 py-1.5 text-[#EDEDED]"
          >
            <option value="all">All Statuses</option>
            <option value="unresolved">Unresolved</option>
            <option value="in_review">In Review</option>
            <option value="remediated">Remediated</option>
          </select>
        </div>
      </div>

      {/* Doubt Cards List */}
      <div className="space-y-4">
        {filteredDoubts.length === 0 ? (
          <div className="text-center p-12 bg-[#161618] rounded-2xl border border-[#27272A]">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white">No doubts match your search filter</p>
            <p className="text-xs text-[#A1A1AA] mt-1">Students are progressing smoothly or filters are restrictive.</p>
          </div>
        ) : (
          filteredDoubts.map((doubt) => (
            <div
              key={doubt.id}
              className="bg-[#161618] p-5 rounded-2xl border border-[#27272A] space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-[#27272A]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1C1C1E] border border-[#27272A] flex items-center justify-center font-bold text-white text-xs">
                    {doubt.studentName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      {doubt.studentName}
                      <span className="text-xs font-normal text-[#A1A1AA]">• {doubt.topic}</span>
                    </h3>
                    <p className="text-[11px] text-[#A1A1AA] flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      Logged {new Date(doubt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getSeverityBadge(doubt.severity)}`}>
                    {doubt.severity} Urgency
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${getStatusBadge(doubt.status)}`}>
                    {doubt.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Concept Tag & Snippet */}
              <div>
                <span className="inline-block text-[11px] font-semibold text-[#8E75FF] bg-[#1C1C1E] border border-[#27272A] px-2.5 py-0.5 rounded-md mb-2">
                  Tag: {doubt.conceptTag}
                </span>
                <p className="text-xs text-[#EDEDED] bg-[#1C1C1E] p-3 rounded-xl border border-[#27272A] leading-relaxed italic">
                  "{doubt.doubtSnippet}"
                </p>
              </div>

              {/* AI Reasoning */}
              {doubt.aiReasoning && (
                <div className="text-[11px] text-[#A1A1AA] flex items-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#8E75FF] shrink-0 mt-0.5" />
                  <span><strong className="text-white">AI Diagnostic:</strong> {doubt.aiReasoning}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-[#A1A1AA] uppercase">Status:</span>
                  <button
                    onClick={() => onUpdateStatus(doubt.id, 'unresolved')}
                    className={`px-2 py-1 rounded text-[10px] font-semibold transition cursor-pointer ${doubt.status === 'unresolved' ? 'bg-rose-600 text-white' : 'bg-[#1C1C1E] text-[#A1A1AA] hover:bg-[#27272A]'}`}
                  >
                    Unresolved
                  </button>
                  <button
                    onClick={() => onUpdateStatus(doubt.id, 'in_review')}
                    className={`px-2 py-1 rounded text-[10px] font-semibold transition cursor-pointer ${doubt.status === 'in_review' ? 'bg-[#4285F4] text-white' : 'bg-[#1C1C1E] text-[#A1A1AA] hover:bg-[#27272A]'}`}
                  >
                    In Review
                  </button>
                  <button
                    onClick={() => onUpdateStatus(doubt.id, 'remediated')}
                    className={`px-2 py-1 rounded text-[10px] font-semibold transition cursor-pointer ${doubt.status === 'remediated' ? 'bg-emerald-600 text-white' : 'bg-[#1C1C1E] text-[#A1A1AA] hover:bg-[#27272A]'}`}
                  >
                    Resolved
                  </button>
                </div>

                <button
                  onClick={() => onGenerateRemedialPlan(doubt)}
                  className="px-4 py-2 rounded-xl bg-[#8E75FF] hover:bg-[#8E75FF]/90 text-white text-xs font-semibold shadow flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate Remedial Plan
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
