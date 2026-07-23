import React from 'react';
import { PeerPod, Classroom } from '../../types';
import { Users, Sparkles, RefreshCw, Award, BookOpen, Target, ArrowRight } from 'lucide-react';

interface PeerPodClustererProps {
  pods: PeerPod[];
  activeClassroom: Classroom;
  onReclusterPods: () => void;
  isLoading: boolean;
}

export const PeerPodClusterer: React.FC<PeerPodClustererProps> = ({
  pods,
  activeClassroom,
  onReclusterPods,
  isLoading,
}) => {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Explainer':
        return 'bg-[#8E75FF]/20 text-[#8E75FF] border-[#8E75FF]/30';
      case 'Facilitator':
        return 'bg-[#4285F4]/20 text-[#4285F4] border-[#4285F4]/30';
      case 'Synthesizer':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-[#161618] border border-[#27272A] text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1C1E] text-[#8E75FF] border border-[#27272A] text-xs font-semibold uppercase tracking-widest mb-2">
            <Users className="w-3.5 h-3.5 text-[#8E75FF]" />
            AI Peer Pod Clusterer
          </div>
          <h1 className="text-2xl font-serif italic text-white">Collaborative Study Clusters</h1>
          <p className="text-xs text-[#A1A1AA] mt-1 max-w-2xl">
            Gemini clusters students into complementary 3-4 person peer pods using mastery telemetry, learning styles (Kinesthetic/Visual/Logical), and growth goals.
          </p>
        </div>

        <button
          onClick={onReclusterPods}
          disabled={isLoading}
          className="px-5 py-2.5 rounded-xl bg-[#8E75FF] hover:bg-[#8E75FF]/90 text-white text-xs font-bold shadow flex items-center gap-2 transition disabled:opacity-50 shrink-0 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Clustering Pods...' : 'Re-Cluster Pods'}
        </button>
      </div>

      {isLoading ? (
        <div className="bg-[#161618] p-12 rounded-2xl border border-[#27272A] text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#8E75FF] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-white">
            Evaluating student concept profiles, learning styles, and social dynamics to form optimal pods...
          </p>
        </div>
      ) : pods.length === 0 ? (
        <div className="bg-[#161618] p-12 rounded-2xl border border-[#27272A] text-center space-y-3">
          <Users className="w-12 h-12 text-[#A1A1AA] mx-auto" />
          <p className="text-sm font-semibold text-white">No active peer pods generated yet</p>
          <button
            onClick={onReclusterPods}
            className="px-4 py-2 bg-[#8E75FF] text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Generate Initial Pods
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pods.map((pod) => (
            <div
              key={pod.id}
              className="bg-[#161618] rounded-2xl border border-[#27272A] shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className="p-5 bg-[#1C1C1E] border-b border-[#27272A] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#8E75FF] uppercase tracking-wider">
                    {pod.podName}
                  </span>
                  <span className="text-[10px] bg-[#27272A] text-white px-2.5 py-0.5 rounded-full font-semibold border border-[#3F3F46]">
                    {pod.members.length} Members
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-[#4285F4]" />
                  Focus: {pod.focusConcept}
                </h3>
              </div>

              {/* Members List */}
              <div className="p-5 space-y-4 flex-1">
                <h4 className="text-xs font-semibold text-[#8E75FF] uppercase tracking-wider">Assigned Members & Roles</h4>
                <div className="space-y-3">
                  {pod.members.map((member, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#1C1C1E] border border-[#27272A] flex items-start gap-3"
                    >
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-[#8E75FF]/30 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-white truncate">
                            {member.name}
                          </span>
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getRoleBadge(
                              member.assignedRole
                            )}`}
                          >
                            {member.assignedRole}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#A1A1AA] mt-1">
                          <strong className="text-white">Strengths:</strong> {member.strengths.join(', ')}
                        </p>
                        <p className="text-[10px] text-[#8E75FF] font-medium">
                          <strong>Growth Focus:</strong> {member.growthArea}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Prompt & Activity */}
                <div className="p-3 rounded-xl bg-[#1C1C1E] border border-[#27272A] space-y-2 mt-4">
                  <p className="text-xs text-[#EDEDED] font-medium leading-relaxed">
                    <strong className="text-[#8E75FF] block mb-0.5">Study Discussion Prompt:</strong>
                    "{pod.studyPrompt}"
                  </p>
                  <p className="text-[11px] text-[#A1A1AA]">
                    <strong className="text-white">Recommended Group Exercise:</strong> {pod.recommendedActivity}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
